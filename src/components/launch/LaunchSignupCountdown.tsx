import { useEffect, useState } from "react";
import { Loader2, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";

// 14. Mai 2026, 00:00 Uhr Schweizer Zeit (Europe/Zurich = UTC+2 CEST in May)
const LAUNCH_TARGET = new Date("2026-05-13T22:00:00Z").getTime();

const pad = (n: number) => n.toString().padStart(2, "0");

const useCountdown = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, LAUNCH_TARGET - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
};

interface Props {
  className?: string;
}

const LaunchSignupCountdown = ({ className = "" }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      const submitted = email.trim();
      trackMetaEvent("Lead", { email: submitted });
      setDone(true);
      setEmail("");
    } catch (err) {
      console.error("Launch signup failed:", err);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const items: Array<[number, string]> = [
    [days, "Tage"],
    [hours, "Stunden"],
    [minutes, "Minuten"],
    [seconds, "Sekunden"],
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Email signup */}
      {done ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Du wirst als Erster informiert.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <p className="text-sm font-medium text-foreground/90 text-center">
            Beim Launch sofort benachrichtigt werden
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email-Adresse"
                required
                disabled={loading}
                className="pl-10 bg-white border-border focus:border-[#9b6b3f] focus:ring-[#9b6b3f]/20"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#9b6b3f] hover:bg-[#8a5e37] text-white font-medium min-w-[140px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vormerken"}
            </Button>
          </form>
        </div>
      )}

      {/* Countdown */}
      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
        <p className="text-[11px] tracking-[0.3em] uppercase text-primary text-center font-medium mb-3">
          Launch in
        </p>
        <div className="grid grid-cols-4 gap-2">
          {items.map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-light tracking-tight text-foreground tabular-nums">
                {pad(val)}
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaunchSignupCountdown;

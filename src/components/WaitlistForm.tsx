import { useState } from "react";
import { Bell, Loader2, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-waitlist", {
        body: { email: email.trim() },
      });

      if (error) throw error;

      if (data?.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Waitlist signup failed:", error);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 md:p-8 bg-card rounded-2xl border border-border text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/15 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">
          Du bist dabei! Wir melden uns.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-card rounded-2xl border border-border space-y-5">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Ausverkauft — Sei bei Runde 2 dabei
        </h3>
        <p className="text-sm text-muted-foreground">
          Trag dich ein und wir benachrichtigen dich als Erstes wenn neue Einheiten verfügbar sind.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            type="email"
            placeholder="Deine Email-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 bg-white border-gray-200 focus:border-[#9b6b3f] focus:ring-[#9b6b3f]/20"
          />
        </div>
        <Button
          type="submit"
          variant="glow"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Bell className="w-5 h-5 mr-2" />
              Benachrichtige mich
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default WaitlistForm;

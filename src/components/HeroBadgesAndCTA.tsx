import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Check, Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";
import SwissFlag from "./SwissFlag";

const ICON_COLOR = "#9b6b3f";
const GOLD = "#9b6b3f";
const GREEN = "#4a8c5c";

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const TOTAL_SPOTS = 100;

const badges: { icon: React.ReactNode; label: string }[] = [
  { icon: <SwissFlag size={18} />, label: "Swiss Brand" },
  { icon: <Zap size={18} color={ICON_COLOR} strokeWidth={2} />, label: "Qi2.2 Zertifiziert" },
  { icon: <ShieldCheck size={18} color={ICON_COLOR} strokeWidth={2} />, label: "3 Jahre Garantie" },
  { icon: <Truck size={18} color={ICON_COLOR} strokeWidth={2} />, label: "Gratis Versand" },
  { icon: <RotateCcw size={18} color={ICON_COLOR} strokeWidth={2} />, label: "14 Tage Rückgabe" },
];

interface Props {
  spotsTaken?: number;
  onSignupSuccess?: () => void;
}

const useCountdown = () => {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

const HeroBadgesAndCTA = ({ spotsTaken = 81, onSignupSuccess }: Props) => {
  const taken = Math.min(TOTAL_SPOTS, Math.max(0, spotsTaken));
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown();
  const progress = (taken / TOTAL_SPOTS) * 100;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setSubmitted(true);
        trackMetaEvent("Lead", { email: email.trim() });
        onSignupSuccess?.();
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (err) {
      console.error("CTA signup failed:", err);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  const countdownUnits = [
    { value: countdown.days, label: "Tage" },
    { value: countdown.hours, label: "Stunden" },
    { value: countdown.minutes, label: "Minuten" },
    { value: countdown.seconds, label: "Sekunden" },
  ];

  return (
    <>
      {/* Badge-Leiste */}
      <div className="w-full bg-[#f0ede6] border-b border-[#9b6b3f]/15">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10 text-xs md:text-sm overflow-x-auto">
            {badges.map((b) => (
              <span key={b.label} className="whitespace-nowrap inline-flex items-center gap-1.5" style={{ color: "#888" }}>
                <span className="inline-flex items-center">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Block */}
      <section id="signup-form" className="w-full" style={{ backgroundColor: "#faf6f0", fontFamily: "'Outfit', 'Neue Haas Grotesk Display Pro', sans-serif" }}>
        <div className="container mx-auto px-4 pt-12 pb-10 md:pt-16 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            {/* 1. Founder Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(155, 107, 63, 0.08)",
                borderColor: GOLD,
                color: GOLD,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: GOLD }} />
              <span className="text-[11px] md:text-xs font-bold tracking-[0.12em] uppercase">
                Founder Edition · Nur 100 Stück
              </span>
            </div>

            {/* 2. Headline */}
            <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-[#1a1a1a] mb-6 tracking-tight leading-[1.1] whitespace-nowrap">
              Sichere dir den Launch-Preis.
            </h2>

            {/* 3. Preis-Zeile */}
            <div className="flex items-baseline justify-center gap-3 mb-1">
              <span className="text-5xl md:text-6xl font-extrabold leading-none" style={{ color: GOLD }}>
                CHF 99
              </span>
              <span className="text-lg md:text-xl text-[#999] line-through">CHF 129</span>
            </div>
            <p className="text-sm font-semibold mb-8" style={{ color: GREEN }}>
              Du sparst CHF 30
            </p>

            {/* 4. Benefits */}
            <ul className="w-full max-w-[480px] mx-auto mb-10 text-left space-y-3">
              {[
                { icon: "⚡", text: "Lebenslanger Early Access zu neuen RAJ Produkten." },
                { icon: "🏆", text: "Founder Edition mit persönlicher Seriennummer." },
                { icon: "💰", text: "CHF 30 sparen — CHF 99 statt CHF 129." },
              ].map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span className="text-lg leading-6 flex-shrink-0" aria-hidden>{b.icon}</span>
                  <span className="text-[15px] leading-6 text-[#444]">{b.text}</span>
                </li>
              ))}
            </ul>

            {/* 5. Countdown */}
            <div className="w-full max-w-[400px] mx-auto mb-3">
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {countdownUnits.map((u) => (
                  <div
                    key={u.label}
                    className="flex flex-col items-center justify-center rounded-lg p-3 sm:p-4"
                    style={{ backgroundColor: "#f5f0e8" }}
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {String(u.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#888] mt-1.5 font-medium">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#888] mt-3">
                Danach steigt der Preis auf CHF 129.
              </p>
            </div>

            {/* 6. E-Mail Form */}
            <div className="w-full max-w-[480px] mx-auto mt-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl border"
                  style={{ borderColor: GOLD, backgroundColor: "rgba(155,107,63,0.06)" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    Danke — du bist auf der Liste.
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:basis-[70%]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none" aria-hidden>✉️</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("launch.emailPlaceholder")}
                      required
                      disabled={submitting}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-[#e0d8c8] text-[#1a1a1a] placeholder:text-[#999] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#9b6b3f]/30 focus:border-[#9b6b3f] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="sm:basis-[30%] px-6 py-3.5 rounded-xl text-white font-bold text-[15px] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: GOLD }}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Jetzt sichern <span aria-hidden>→</span></>
                    )}
                  </button>
                </form>
              )}

              {/* 7. Trust-Text */}
              <p className="text-[13px] text-[#888] mt-4 text-center">
                Kostenlose Reservierung · Keine Zahlungsdaten · Kein Spam
              </p>

              {/* 8. Fortschrittsbalken */}
              <div className="mt-8">
                <p className="text-[13px] text-[#666] mb-2 text-center">
                  <span className="font-semibold text-[#1a1a1a]">{taken}</span> von {TOTAL_SPOTS} Founder Plätzen vergeben
                </p>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#e8e0d4" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: GOLD }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

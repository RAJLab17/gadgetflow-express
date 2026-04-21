import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Check, Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";
import SwissFlag from "./SwissFlag";
import { useLanguage } from "@/contexts/LanguageContext";
import productImage from "@/assets/hero-carousel/slide-0-specs.webp";

const ICON_COLOR = "#9b6b3f";
const GOLD = "#9b6b3f";
const GREEN = "#4a8c5c";

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const TOTAL_SPOTS = 100;

const getBadges = (t: (k: string) => string): { icon: React.ReactNode; label: string }[] => [
  { icon: <SwissFlag size={18} />, label: t("badge.swissBrand") },
  { icon: <ShieldCheck size={18} color={ICON_COLOR} strokeWidth={2} />, label: t("badge.warranty") },
  { icon: <Truck size={18} color={ICON_COLOR} strokeWidth={2} />, label: t("badge.shipping") },
  { icon: <RotateCcw size={18} color={ICON_COLOR} strokeWidth={2} />, label: t("badge.returns") },
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

const BASE_OFFSET = 58;

const HeroBadgesAndCTA = ({ spotsTaken, onSignupSuccess }: Props) => {
  const { t } = useLanguage();
  const [liveCount, setLiveCount] = useState<number>(spotsTaken ?? 81);

  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      const { count } = await supabase
        .from("launch_signups")
        .select("*", { count: "exact", head: true });
      if (mounted && typeof count === "number") {
        setLiveCount(BASE_OFFSET + count);
      }
    };
    fetchCount();

    const channel = supabase
      .channel("launch_signups_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "launch_signups" },
        () => setLiveCount((prev) => prev + 1)
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const taken = liveCount;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown();
  

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
    { value: countdown.days, label: t("countdown.daysLong") },
    { value: countdown.hours, label: t("countdown.hoursLong") },
    { value: countdown.minutes, label: t("countdown.minutesLong") },
    { value: countdown.seconds, label: t("countdown.secondsLong") },
  ];

  const badges = getBadges(t);

  return (
    <>
      {/* Badge-Leiste */}
      <div className="w-full bg-[#f0ede6] border-b border-[#9b6b3f]/15">
        <div className="container mx-auto px-2 md:px-4 py-4">
          <div className="flex flex-nowrap items-center justify-between md:justify-center gap-x-2 sm:gap-x-4 md:gap-x-10 text-[10px] sm:text-xs md:text-sm">
            {badges.map((b) => (
              <span key={b.label} className="whitespace-nowrap inline-flex items-center gap-1 sm:gap-1.5 shrink-0" style={{ color: "#888" }}>
                <span className="inline-flex items-center [&_svg]:w-3 [&_svg]:h-3 sm:[&_svg]:w-4 sm:[&_svg]:h-4 md:[&_svg]:w-[18px] md:[&_svg]:h-[18px]">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Block — two columns: image left, content right */}
      <section id="signup-form" className="w-full" style={{ backgroundColor: "#faf6f0", fontFamily: "'Outfit', 'Neue Haas Grotesk Display Pro', sans-serif" }}>
        <div className="container mx-auto px-4 pt-12 pb-10 md:pt-16 md:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto items-center">
            {/* LEFT — Product image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full rounded-3xl overflow-hidden"
              style={{ backgroundColor: "#f0ede6" }}
            >
              {/* -23% Founder badge */}
              <div
                className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-white text-xs font-bold tracking-wide"
                style={{ backgroundColor: GOLD }}
              >
                -23% Founder
              </div>
              <img
                src={productImage}
                alt="RAJ NEXUS – Qi2.2 · 25W · 3-in-1"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              {/* Price chip bottom-left */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-sm">
                <span className="text-xl font-extrabold" style={{ color: GOLD }}>CHF 99</span>
                <span className="ml-2 text-sm text-[#999] line-through">CHF 129</span>
              </div>
            </motion.div>

            {/* RIGHT — Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start text-left"
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
                {t("cta.founderBadge")}
              </span>
            </div>

            {/* 2. Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-6 tracking-tight leading-[1.1]">
              {t("cta.headline")}
            </h2>

            {/* 4. Benefits */}
            <ul className="w-full mb-8 text-left space-y-3">
              {[
                { icon: "⚡", text: t("cta.benefit1") },
                { icon: "🏆", text: t("cta.benefit2") },
                { icon: "💰", text: t("cta.benefit3") },
              ].map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span className="text-lg leading-6 flex-shrink-0" aria-hidden>{b.icon}</span>
                  <span className="text-[15px] leading-6 text-[#444]">{b.text}</span>
                </li>
              ))}
            </ul>

            {/* 5. Countdown */}
            <div className="w-full mb-3">
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
                {t("cta.priceWarning")}
              </p>
            </div>

            {/* 6. E-Mail Form */}
            <div className="w-full mt-8">
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
                    {t("cta.thanks")}
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
                      <>{t("cta.button")} <span aria-hidden>→</span></>
                    )}
                  </button>
                </form>
              )}

              {/* 7. Trust-Text */}
              <p className="text-[13px] text-[#888] mt-4 text-center md:text-left">
                {t("cta.trust")}
              </p>

              {/* 8. Reservierungs-Hinweis */}
              <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: GOLD }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: GOLD }} />
                </span>
                <p className="text-[13px] text-[#444]">
                  {t("cta.registeredPrefix")} <span className="font-bold" style={{ color: GOLD }}>{taken} {t("cta.registeredPeople")}</span> {t("cta.registeredSuffix")}
                </p>
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

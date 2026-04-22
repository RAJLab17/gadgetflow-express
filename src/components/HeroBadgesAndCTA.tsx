import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";
import SwissFlag from "./SwissFlag";
import { useLanguage } from "@/contexts/LanguageContext";
import productImage from "@/assets/hero-carousel/slide-0-specs.webp";

const ICON_COLOR = "#9b6b3f";
const GOLD = "#9b6b3f";

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const TOTAL_SPOTS = 100;
const BASE_TAKEN = 7;

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

const SocialProofPopup = ({ trigger }: { trigger: number }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setShow(true);
    const id = setTimeout(() => setShow(false), 4500);
    return () => clearTimeout(id);
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 z-50 max-w-[300px]"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-md border shadow-lg"
            style={{ borderColor: "rgba(155,107,63,0.18)" }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ backgroundColor: GOLD }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: GOLD }}
              />
            </span>
            <p className="text-[13px] leading-snug text-[#2c2c2c]">
              Jemand hat sich gerade einen Founder-Platz gesichert
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeroBadgesAndCTA = ({ spotsTaken, onSignupSuccess }: Props) => {
  const { t } = useLanguage();
  const [liveCount, setLiveCount] = useState<number>(spotsTaken ?? BASE_TAKEN);
  const [popupTrigger, setPopupTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      const { count } = await supabase
        .from("launch_signups")
        .select("*", { count: "exact", head: true });
      if (mounted && typeof count === "number") {
        setLiveCount(Math.min(TOTAL_SPOTS, BASE_TAKEN + count));
      }
    };
    fetchCount();

    const channel = supabase
      .channel("launch_signups_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "launch_signups" },
        () => {
          setLiveCount((prev) => Math.min(TOTAL_SPOTS, prev + 1));
          setPopupTrigger((p) => p + 1);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const taken = liveCount;
  const remaining = Math.max(0, TOTAL_SPOTS - taken);
  const progress = Math.min(100, (taken / TOTAL_SPOTS) * 100);

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
    { value: countdown.days, label: "Tage" },
    { value: countdown.hours, label: "Std" },
    { value: countdown.minutes, label: "Min" },
    { value: countdown.seconds, label: "Sek" },
  ];

  const badges = getBadges(t);

  return (
    <>
      <SocialProofPopup trigger={popupTrigger} />

      {/* Trust Badges */}
      <div className="w-full bg-[#f0ede6] border-b border-[#9b6b3f]/15">
        <div className="container mx-auto px-3 sm:px-4 pt-1 pb-4">
          <div className="flex flex-nowrap items-center justify-around md:justify-center gap-x-2 sm:gap-x-4 md:gap-x-10 lg:gap-x-14 text-[10px] sm:text-xs md:text-sm">
            {badges.map((b) => (
              <span
                key={b.label}
                className="whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2 shrink-0"
                style={{ color: "#888" }}
              >
                <span className="inline-flex items-center [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-4 sm:[&_svg]:h-4 md:[&_svg]:w-[18px] md:[&_svg]:h-[18px]">
                  {b.icon}
                </span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero CTA */}
      <section
        id="signup-form"
        className="w-full"
        style={{
          backgroundColor: "#faf6f0",
          fontFamily: "'Outfit', 'Neue Haas Grotesk Display Pro', sans-serif",
        }}
      >
        <div className="container mx-auto px-4 pt-10 pb-12 md:pt-14 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-xl mx-auto"
          >
            {/* 1. Founder Edition Badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6"
              style={{
                borderColor: "rgba(155,107,63,0.3)",
                backgroundColor: "rgba(155,107,63,0.05)",
              }}
            >
              <span
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: GOLD }}
              >
                Founder Edition · Nur 100 Stück
              </span>
            </div>

            {/* 2. Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-4 tracking-tight leading-[1.05]">
              Sei dabei. Von Anfang an.
            </h2>

            {/* 3. Subheadline */}
            <p className="text-[14px] sm:text-[15px] text-[#555] leading-relaxed mb-5 max-w-md">
              <span className="font-semibold tabular-nums text-[#1a1a1a]">{taken}</span>{" "}
              von <span className="tabular-nums">100</span> Founder-Plätzen sind bereits vergeben.
              <br />
              Du kannst noch zu den ersten gehören.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-10">
              <div
                className="relative h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(155,107,63,0.12)" }}
                role="progressbar"
                aria-valuenow={taken}
                aria-valuemin={0}
                aria-valuemax={TOTAL_SPOTS}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: GOLD }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-[#888] tabular-nums">
                <span>{taken} vergeben</span>
                <span>{remaining} verfügbar</span>
              </div>
            </div>

            {/* 4. Countdown */}
            <div className="w-full mb-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#888] font-medium mb-3">
                Founder-Preis endet in
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
                {countdownUnits.map((u) => (
                  <div
                    key={u.label}
                    className="flex flex-col items-center justify-center rounded-xl py-3 sm:py-4"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(155,107,63,0.12)",
                    }}
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {String(u.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#888] mt-1.5 font-medium tracking-wide">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-[#888] mt-3">
                Danach regulär <span className="font-semibold text-[#1a1a1a]">CHF 129</span>
              </p>
            </div>

            {/* Benefits */}
            <ul className="w-full max-w-sm mx-auto mb-8 text-left space-y-2.5">
              {[
                { icon: "⚡", text: t("cta.benefit1") },
                { icon: "🏆", text: t("cta.benefit2") },
              ].map((b) => (
                <li key={b.text} className="flex items-start gap-2.5">
                  <span className="text-base leading-6 flex-shrink-0" aria-hidden>{b.icon}</span>
                  <span className="text-[13px] sm:text-[14px] leading-6 text-[#444]">{b.text}</span>
                </li>
              ))}
            </ul>

            {/* 5. CTA Form */}
            <div className="w-full max-w-md">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl border"
                  style={{
                    borderColor: GOLD,
                    backgroundColor: "rgba(155,107,63,0.06)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: GOLD }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    Dein Founder-Platz ist reserviert.
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail Adresse"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-[#9b6b3f]/25 text-[#1a1a1a] placeholder:text-[#999] text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b6b3f]/20 focus:border-[#9b6b3f] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3.5 rounded-xl text-white font-bold text-[15px] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: GOLD }}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Meinen Founder-Platz sichern <span aria-hidden>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[12px] text-[#888] mt-3 text-center">
                Kostenlose Reservierung · Keine Zahlungsdaten · Kein Spam
              </p>
            </div>

          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

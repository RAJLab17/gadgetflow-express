import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, ShieldCheck, Truck, RotateCcw, Mail } from "lucide-react";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";
import SwissFlag from "./SwissFlag";
import { useLanguage } from "@/contexts/LanguageContext";

// Lazily load Supabase only when actually needed (post-LCP).
// This keeps the 44KB gzipped supabase-vendor chunk out of the critical path.
const getSupabase = () =>
  import("@/integrations/supabase/client").then((m) => m.supabase);

const ICON_COLOR = "#9b6b3f";
const GOLD = "#9b6b3f";

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const TOTAL_SPOTS = 100;
const BASE_TAKEN = 9;

const getBadges = (t: (k: string) => string): { icon: React.ReactNode; label: string }[] => [
  { icon: <SwissFlag size={20} />, label: t("badge.swissBrand") },
  { icon: <ShieldCheck size={20} color={ICON_COLOR} strokeWidth={2} />, label: "3 Jahre Garantie" },
  { icon: <Check size={20} color={ICON_COLOR} strokeWidth={2.4} />, label: "Qi2.2 zertifiziert" },
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

const SocialProofPopup = ({ trigger, message }: { trigger: number; message: string }) => {
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
              {message}
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

  // Keep local counter in sync when parent updates spotsTaken (e.g. after own signup)
  useEffect(() => {
    if (typeof spotsTaken === "number") {
      setLiveCount((prev) => Math.max(prev, spotsTaken));
    }
  }, [spotsTaken]);

  // Realtime live-counter removed: the WebSocket + Realtime client adds
  // ~30KB and a noticeable Main Thread cost during LCP. The counter still
  // updates locally on the user's own signup (via spotsTaken prop refresh).
  // Other users' signups will be picked up on the next page load — fine for
  // a launch / waitlist context.

  // Social proof popup is only triggered by real signups (not simulated).

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
      toast.error(t("error.invalidEmail"));
      return;
    }
    setSubmitting(true);
    try {
      const supabase = await getSupabase();
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
    { value: countdown.days, label: t("countdown.daysShort") },
    { value: countdown.hours, label: t("countdown.hoursShort") },
    { value: countdown.minutes, label: t("countdown.minutesShort") },
    { value: countdown.seconds, label: t("countdown.secondsShort") },
  ];

  const badges = getBadges(t);

  return (
    <>
      <SocialProofPopup trigger={popupTrigger} message={t("cta.socialProof")} />

      {/* Trust Badges */}
      <div className="w-full bg-[#f0ede6] border-b border-[#9b6b3f]/15">
        <div className="container mx-auto px-3 sm:px-4 pt-3 pb-4 sm:pt-4 sm:pb-5">
          <div className="flex flex-nowrap items-center justify-around md:justify-center gap-x-3 sm:gap-x-8 md:gap-x-14 lg:gap-x-20 text-[12px] sm:text-sm md:text-base">
            {badges.map((b) => (
              <span
                key={b.label}
                className="whitespace-nowrap inline-flex items-center gap-2 sm:gap-2.5 shrink-0 font-semibold tracking-tight"
                style={{ color: "#2b2725" }}
              >
                <span className="inline-flex items-center [&_svg]:w-[18px] [&_svg]:h-[18px] sm:[&_svg]:w-5 sm:[&_svg]:h-5 md:[&_svg]:w-[22px] md:[&_svg]:h-[22px]">
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
        style={{ backgroundColor: "#faf6f0" }}
      >
        <div className="container mx-auto px-4 pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-16 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-xl mx-auto"
          >
            {/* 1. Founder Edition Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border mb-3 sm:mb-5"
              style={{
                borderColor: "rgba(155,107,63,0.3)",
                backgroundColor: "rgba(155,107,63,0.05)",
              }}
            >
              <span
                className="text-[9px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: GOLD }}
              >
                {t("cta.founderBadge")}
              </span>
            </div>

            {/* 2. Headline */}
            <h2 className="text-[28px] leading-[1.1] sm:text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-5 sm:mb-6 tracking-tight">
              {t("cta.headlineLine1")}
              <br />
              {t("cta.headlineLine2")}
            </h2>

            {/* 3. Subheadline */}
            <p className="text-[14px] sm:text-[15px] text-[#555] leading-relaxed mb-6 sm:mb-7 max-w-md">
              <span className="font-semibold tabular-nums text-[#1a1a1a]">{taken}</span>{" "}
              {t("cta.spotsTakenPrefix")} <span className="tabular-nums">100</span> {t("cta.spotsTakenSuffix")}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-5 sm:mb-8">
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
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Produktbild RAJ NEXUS — kompakt */}
            <div className="w-full flex justify-center mb-3 sm:mb-4">
              <img
                src="/hero/slide-0-specs.webp"
                srcSet="/hero/slide-0-specs-480.webp 480w, /hero/slide-0-specs.webp 960w"
                sizes="(max-width: 640px) 80vw, 360px"
                alt="RAJ NEXUS 3-in-1 Wireless Charger"
                width={480}
                height={480}
                fetchPriority="high"
                decoding="async"
                className="w-auto max-h-[200px] sm:max-h-[240px] md:max-h-[280px] object-contain"
              />
            </div>

            {/* Subline */}
            <p className="text-[13px] sm:text-[14px] text-[#666] mb-5 sm:mb-7 italic">
              Ein Ladegerät. Ein Kabel. Drei Geräte.
            </p>

            {/* 4. Countdown */}
            <div className="w-full mb-5 sm:mb-8">
              <p className="text-[10px] sm:text-[12px] uppercase tracking-[0.2em] text-[#888] font-medium mb-2 sm:mb-3">
                {t("cta.priceEndsIn")}
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-md mx-auto">
                {countdownUnits.map((u) => (
                  <div
                    key={u.label}
                    className="flex flex-col items-center justify-center rounded-lg sm:rounded-xl py-2 sm:py-4"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(155,107,63,0.12)",
                    }}
                  >
                    <span className="text-xl sm:text-3xl font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {String(u.value).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-[#888] mt-1 sm:mt-1.5 font-medium tracking-wide">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 sm:mt-3 text-center text-[11px] sm:text-[12px] text-[#888]">
                {t("cta.priceNow")} <span className="text-[#1a1a1a] font-semibold tabular-nums">CHF 99.–</span>
                <span className="mx-1.5">·</span>
                {t("cta.priceAfter")} <span className="line-through">CHF 129</span>
              </p>
            </div>

            {/* Benefits — sequentially highlighted to guide the eye toward the CTA */}
            <ul className="w-full max-w-sm mx-auto mb-5 sm:mb-7 text-left space-y-1.5 sm:space-y-2.5">
              {[
                { icon: "⚡", text: t("cta.benefit1") },
                { icon: "🏆", text: t("cta.benefit2") },
              ].map((b, i) => (
                <motion.li
                  key={b.text}
                  className="flex items-start gap-2 sm:gap-2.5 rounded-lg px-2 py-1.5 -mx-2"
                  initial={{ backgroundColor: "rgba(155,107,63,0)", boxShadow: "0 0 0 rgba(155,107,63,0)" }}
                  animate={{
                    backgroundColor: [
                      "rgba(155,107,63,0)",
                      "rgba(155,107,63,0.10)",
                      "rgba(155,107,63,0)",
                    ],
                    boxShadow: [
                      "0 0 0 0 rgba(155,107,63,0)",
                      "0 0 18px 2px rgba(155,107,63,0.25)",
                      "0 0 0 0 rgba(155,107,63,0)",
                    ],
                  }}
                  transition={{
                    duration: 2.6,
                    delay: 1.2 + i * 2.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 5.5 + i * 0.5,
                  }}
                >
                  <motion.span
                    className="text-sm sm:text-base leading-5 sm:leading-6 flex-shrink-0"
                    aria-hidden
                    animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 0] }}
                    transition={{
                      duration: 0.9,
                      delay: 1.4 + i * 1.4,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 6.7 + i * 0.5,
                    }}
                  >
                    {b.icon}
                  </motion.span>
                  <span className="text-[12px] sm:text-[14px] leading-5 sm:leading-6 text-[#444]">{b.text}</span>
                </motion.li>
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
                    {t("cta.reserved")}
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <label htmlFor="founder-email" className="text-center text-[13px] sm:text-[14px] font-semibold text-[#9b6b3f]">
                    {t("cta.formLabel")}
                  </label>
                  <motion.div
                    className="relative rounded-xl overflow-hidden"
                    animate={{
                      boxShadow: [
                        "0 4px 20px -6px rgba(155,107,63,0.25)",
                        "0 8px 36px -2px rgba(155,107,63,0.7)",
                        "0 4px 20px -6px rgba(155,107,63,0.25)",
                      ],
                    }}
                    transition={{
                      duration: 2.4,
                      delay: 5.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b6b3f] pointer-events-none z-20" />
                    <input
                      id="founder-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("cta.emailPlaceholder")}
                      required
                      disabled={submitting}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border-2 border-[#9b6b3f] text-[#1a1a1a] placeholder:text-[#aaa] text-[16px] font-medium focus:outline-none focus:ring-4 focus:ring-[#9b6b3f]/20 transition-all relative z-10"
                    />
                    {/* Wandernder Shine-Effekt — zieht das Auge ins Email-Feld */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-[15] rounded-xl"
                      style={{
                        background:
                          "linear-gradient(110deg, transparent 30%, rgba(155,107,63,0.18) 45%, rgba(255,235,200,0.55) 50%, rgba(155,107,63,0.18) 55%, transparent 70%)",
                        mixBlendMode: "screen",
                      }}
                      initial={{ x: "-120%" }}
                      animate={{ x: ["-120%", "120%"] }}
                      transition={{
                        duration: 1.6,
                        delay: 5.8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 3.6,
                      }}
                    />
                  </motion.div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-4 rounded-xl text-white font-bold text-[15px] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: GOLD, boxShadow: "0 6px 20px -6px rgba(155,107,63,0.45)" }}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {t("cta.submitButton")} <span aria-hidden>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[12px] text-[#888] mt-3 text-center">
                {t("cta.trust")}
              </p>
            </div>

          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

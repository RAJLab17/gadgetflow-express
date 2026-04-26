import { useEffect, useState, FormEvent } from "react";
// framer-motion removed from critical hero bundle — replaced with CSS animations.
import { Loader2, Check, ShieldCheck, Truck, RotateCcw, Mail } from "lucide-react";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";
import SwissFlag from "./SwissFlag";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusHero from "@/assets/nexus-hero-optimized.webp";

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

  if (!show) return null;
  return (
    <div
      className="fixed bottom-5 left-5 z-50 max-w-[300px] animate-fade-in"
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
    </div>
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

      {/* Trust Badges — kompakt */}
      <div className="w-full bg-[#f0ede6] border-b border-[#9b6b3f]/15">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-nowrap items-center justify-around md:justify-center gap-x-2 sm:gap-x-8 md:gap-x-14 lg:gap-x-20 text-[11px] sm:text-sm md:text-base">
            {badges.map((b) => (
              <span
                key={b.label}
                className="whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2.5 shrink-0 font-semibold tracking-tight"
                style={{ color: "#2b2725" }}
              >
                <span className="inline-flex items-center [&_svg]:w-4 [&_svg]:h-4 sm:[&_svg]:w-5 sm:[&_svg]:h-5 md:[&_svg]:w-[22px] md:[&_svg]:h-[22px]">
                  {b.icon}
                </span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero CTA — alles im First View */}
      <section
        id="signup-form"
        className="w-full"
        style={{ backgroundColor: "#faf6f0" }}
      >
        <div className="container mx-auto px-4 pt-2 pb-3 sm:pt-10 sm:pb-10 md:pt-14 md:pb-14">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto animate-fade-in">
            {/* Founder Badge entfernt — bereits in Top-Announcement-Bar */}

            {/* 2. Headline */}
            <h2 className="whitespace-nowrap text-[22px] leading-[1.1] sm:text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-2 sm:mb-6 tracking-tight">
              {t("cta.headlineLine1")} {t("cta.headlineLine2")}
            </h2>

            {/* 3. Subheadline */}
            <p className="text-[12px] sm:text-[15px] text-[#555] leading-snug mb-2 sm:mb-7 max-w-md">
              <span className="font-semibold tabular-nums text-[#1a1a1a]">{taken}</span>{" "}
              {t("cta.spotsTakenPrefix")} <span className="tabular-nums">100</span> {t("cta.spotsTakenSuffix")}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-2 sm:mb-6">
              <div
                className="relative h-px rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(155,107,63,0.15)" }}
                role="progressbar"
                aria-valuenow={taken}
                aria-valuemin={0}
                aria-valuemax={TOTAL_SPOTS}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1600ms] ease-out"
                  style={{ backgroundColor: GOLD, width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Produktbild RAJ NEXUS */}
            <div className="w-full flex justify-center mb-2 sm:mb-5 relative">
              <img
                src={nexusHero}
                alt="RAJ NEXUS 3-in-1 Wireless Charger mit iPhone, AirPods und Apple Watch"
                width={480}
                height={480}
                fetchPriority="high"
                decoding="async"
                className="w-auto max-h-[180px] sm:max-h-[320px] md:max-h-[420px] object-contain relative z-10"
                style={{ filter: "none" }}
              />
              {/* Soft elliptical ground shadow */}
              <div
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[55%] h-3 sm:h-4 rounded-[50%] blur-md pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(43,39,37,0.22) 0%, rgba(43,39,37,0) 70%)" }}
              />
            </div>

            {/* Tagline above countdown */}
            <p className="text-[11px] sm:text-[13px] italic text-[#777] mb-2 sm:mb-4 -mt-1">
              Schluss mit 3 Kabeln auf dem Nachttisch.
            </p>

            {/* 4. Countdown */}
            <div className="w-full mb-2 sm:mb-6">
              <p className="text-[9px] sm:text-[12px] uppercase tracking-[0.18em] text-[#888] font-medium mb-1.5 sm:mb-3">
                {t("cta.priceEndsIn")}
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-md mx-auto">
                {countdownUnits.map((u) => (
                  <div
                    key={u.label}
                    className="flex flex-col items-center justify-center rounded-lg sm:rounded-xl py-1.5 sm:py-4"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(155,107,63,0.12)",
                    }}
                  >
                    <span className="text-base sm:text-3xl font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {String(u.value).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] sm:text-[11px] text-[#888] mt-0.5 sm:mt-1.5 font-medium tracking-wide">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 sm:mt-3 text-center text-[10px] sm:text-[12px] text-[#888]">
                {t("cta.priceNow")} <span className="text-[#1a1a1a] font-semibold tabular-nums">CHF 99.–</span>
                <span className="mx-1.5">·</span>
                {t("cta.priceAfter")} <span className="line-through">CHF 129</span>
              </p>
            </div>

            {/* Founder Membership — Sealed Pass */}
            <div className="w-full max-w-md mx-auto my-3 sm:my-5">
              <div
                className="relative rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-left"
                style={{
                  background: "linear-gradient(180deg, #2b2725 0%, #1a1715 100%)",
                  border: `1px solid ${GOLD}`,
                  boxShadow: `0 0 0 1px rgba(155,107,63,0.25), 0 8px 24px -10px rgba(155,107,63,0.4)`,
                }}
              >
                {/* Inner double-border frame (certificate look) */}
                <div
                  className="absolute inset-1.5 rounded-lg pointer-events-none"
                  style={{ border: "1px solid rgba(155,107,63,0.3)" }}
                  aria-hidden
                />

                <div className="relative">
                  {/* Eyebrow */}
                  <p
                    className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-center mb-1.5 sm:mb-2"
                    style={{ color: GOLD }}
                  >
                    ✦ Exklusiv für die ersten 100 ✦
                  </p>

                  {/* Title */}
                  <h3 className="text-[15px] sm:text-[17px] font-extrabold text-white text-center tracking-tight mb-2.5 sm:mb-3">
                    Founder Membership
                  </h3>

                  {/* Divider */}
                  <div
                    className="h-px w-12 mx-auto mb-2.5 sm:mb-3"
                    style={{ backgroundColor: "rgba(155,107,63,0.5)" }}
                    aria-hidden
                  />

                  {/* Benefits */}
                  <ul className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-2.5">
                    <li className="flex items-start gap-2.5">
                      <span className="text-[14px] sm:text-[15px] leading-none flex-shrink-0 mt-0.5" aria-hidden>⚡</span>
                      <div>
                        <span className="block text-[11px] sm:text-[12.5px] font-bold text-white leading-tight">
                          Lebenslanger Early Access
                        </span>
                        <span className="block text-[10px] sm:text-[11px] text-white/60 leading-snug mt-0.5">
                          Auf alle künftigen RAJ Produkte — vor allen anderen.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[14px] sm:text-[15px] leading-none flex-shrink-0 mt-0.5" aria-hidden>🏆</span>
                      <div>
                        <span className="block text-[11px] sm:text-[12.5px] font-bold text-white leading-tight">
                          Persönliche Seriennummer
                        </span>
                        <span className="block text-[10px] sm:text-[11px] text-white/60 leading-snug mt-0.5">
                          Eingraviert von #001 bis #100. Dein Stück RAJ Geschichte.
                        </span>
                      </div>
                    </li>
                  </ul>

                </div>
              </div>
            </div>


            {/* 5. CTA Form */}
            <div className="w-full max-w-md">
              {submitted ? (
                <div
                  className="flex items-center justify-center gap-3 p-3 sm:p-4 rounded-xl border animate-scale-in"
                  style={{
                    borderColor: GOLD,
                    backgroundColor: "rgba(155,107,63,0.06)",
                  }}
                >
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: GOLD }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    {t("cta.reserved")}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-3">
                  <div className="relative rounded-xl">
                    <Mail className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#9b6b3f] pointer-events-none z-20" />
                    <input
                      id="founder-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("cta.emailPlaceholder")}
                      required
                      disabled={submitting}
                      className="w-full pl-11 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-4 rounded-xl bg-white border-2 border-[#9b6b3f] text-[#1a1a1a] placeholder:text-[#aaa] text-[15px] sm:text-[16px] font-medium focus:outline-none focus:ring-4 focus:ring-[#9b6b3f]/20 transition-all relative z-10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-4 rounded-xl text-white font-bold text-[14px] sm:text-[15px] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
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

              <p className="text-[10px] sm:text-[12px] text-[#888] mt-1.5 sm:mt-3 text-center">
                {t("cta.trust")}
              </p>
              <p className="text-[10px] sm:text-[12px] italic text-[#999] mt-1 sm:mt-2 text-center">
                Du bekommst eine kurze Bestätigung. Am Launch-Tag erhältst du den exklusiven Kauflink — vor allen anderen.
              </p>

              {/* Risk Reversal — Trust Badges */}
              <div
                className="mt-4 sm:mt-6 rounded-xl p-3 sm:p-4"
                style={{
                  backgroundColor: "rgba(155,107,63,0.05)",
                  border: "1px solid rgba(155,107,63,0.18)",
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                  <RotateCcw size={16} color={GOLD} strokeWidth={2.4} />
                  <span className="text-[12px] sm:text-[13px] font-bold tracking-tight text-[#1a1a1a]">
                    30 Tage Geld-zurück.
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#666] text-center leading-snug mb-2 sm:mb-3">
                  Gefällt dir nicht? Schick es zurück — wir erstatten den vollen Preis.
                </p>
                <div className="flex items-center justify-around gap-2 pt-2 sm:pt-3 border-t border-[#9b6b3f]/15">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} color={GOLD} strokeWidth={2.2} />
                    <span className="text-[10px] sm:text-[11px] text-[#444] font-medium">3 J. Garantie</span>
                  </div>
                  <div className="w-px h-3 bg-[#9b6b3f]/20" />
                  <div className="flex items-center gap-1.5">
                    <Truck size={14} color={GOLD} strokeWidth={2.2} />
                    <span className="text-[10px] sm:text-[11px] text-[#444] font-medium">Gratis Versand CH</span>
                  </div>
                  <div className="w-px h-3 bg-[#9b6b3f]/20" />
                  <div className="flex items-center gap-1.5">
                    <Check size={14} color={GOLD} strokeWidth={2.4} />
                    <span className="text-[10px] sm:text-[11px] text-[#444] font-medium">Sicher zahlen</span>
                  </div>
                </div>
              </div>

              {/* Contact line */}
              <p className="text-[10px] sm:text-[11px] text-[#888] text-center mt-3 sm:mt-4">
                Fragen? Schreib uns:{" "}
                <a
                  href="mailto:founder@raj.ch"
                  className="font-semibold text-[#9b6b3f] hover:underline underline-offset-2"
                >
                  founder@raj.ch
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

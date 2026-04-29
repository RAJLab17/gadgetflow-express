import { useEffect, useState, FormEvent } from "react";
import { Loader2, Check, ShieldCheck, Truck, RotateCcw, Mail, ArrowDown, Gift, Tag, Hash } from "lucide-react";
import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/meta-pixel";
import SwissFlag from "./SwissFlag";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusHero from "@/assets/nexus-hero-480.webp";
import nexusHero280 from "@/assets/nexus-hero-280.webp";
import nexusHero720 from "@/assets/nexus-hero-720.webp";

// Lazily load Supabase only when actually needed (post-LCP).
const getSupabase = () =>
  import("@/integrations/supabase/client").then((m) => m.supabase);

const GOLD = "#9b6b3f";


const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const TOTAL_SPOTS = 100;
const DEFAULT_TAKEN = 0;

interface Props {
  spotsTaken?: number;
  signupsToday?: number;
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

// Schweizer Städte für Aktivitäts-Toasts.
// Wir zeigen NUR Stadt + Aktion (keine erfundenen Personennamen),
// da wir nur die Email kennen und nicht lügen wollen.
const SWISS_CITIES = [
  "Zürich", "Genf", "Lugano", "Bern", "Basel",
  "Luzern", "Lausanne", "St. Gallen", "Winterthur", "Zug",
  "Biel", "Thun", "Schaffhausen", "Chur", "Sion",
];

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
    <div className="fixed bottom-20 sm:bottom-5 left-3 sm:left-5 z-40 max-w-[280px] sm:max-w-[300px] animate-fade-in">
      <div
        className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/95 backdrop-blur-md border shadow-lg"
        style={{ borderColor: "rgba(155,107,63,0.18)" }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: GOLD }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: GOLD }} />
        </span>
        <p className="text-[12px] sm:text-[13px] leading-snug text-[#2c2c2c]">{message}</p>
      </div>
    </div>
  );
};

const HeroBadgesAndCTA = ({ spotsTaken, signupsToday, onSignupSuccess }: Props) => {
  const { t } = useLanguage();
  const [liveCount, setLiveCount] = useState<number>(spotsTaken ?? DEFAULT_TAKEN);
  const [todayCount, setTodayCount] = useState<number>(signupsToday ?? 0);
  const [popupTrigger, setPopupTrigger] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");

  // Sync external counter
  useEffect(() => {
    if (typeof spotsTaken === "number") {
      setLiveCount((prev) => Math.max(prev, spotsTaken));
    }
  }, [spotsTaken]);

  useEffect(() => {
    if (typeof signupsToday === "number") {
      setTodayCount((prev) => Math.max(prev, signupsToday));
    }
  }, [signupsToday]);

  // Realtime — alle Besucher sehen live, wenn jemand neu signed up
  useEffect(() => {
    let channel: any;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const supabase = await getSupabase();
      if (cancelled) return;
      channel = supabase
        .channel("launch_signups_live")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "launch_signups" },
          () => {
            setLiveCount((prev) => Math.min(TOTAL_SPOTS, prev + 1));
            setTodayCount((prev) => prev + 1);
            const city = SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)];
            setPopupMessage(`✦ ${t("hero.live.newFromCity")} ${city}`);
            setPopupTrigger((p) => p + 1);
          }
        )
        .subscribe();
    }, 2500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (channel) {
        getSupabase().then((s) => s.removeChannel(channel));
      }
    };
  }, [t]);

  // Dezenter "Aktivitäts-Toast" alle 35-65s — nur Stadt, klar als Aktivitäts-Hinweis.
  // Kein erfundener Personenname.
  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      const delay = 35000 + Math.random() * 30000;
      setTimeout(() => {
        if (cancelled) return;
        const city = SWISS_CITIES[Math.floor(Math.random() * SWISS_CITIES.length)];
        setPopupMessage(`${t("hero.live.viewingFromCity")} ${city}`);
        setPopupTrigger((p) => p + 1);
        schedule();
      }, delay);
    };
    const initial = setTimeout(schedule, 18000);
    return () => {
      cancelled = true;
      clearTimeout(initial);
    };
  }, [t]);

  const taken = liveCount;
  // remaining wurde durch positive "X Founder dabei" Formulierung ersetzt
  const progress = Math.min(100, (taken / TOTAL_SPOTS) * 100);
  const nextFounderNumber = Math.min(TOTAL_SPOTS, taken + 1);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const countdown = useCountdown();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || email.length > 255) {
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
        setPopupTrigger((prev) => prev + 1);
        setSubmitted(true);
        trackMetaEvent("Lead", { email: email.trim() });
        onSignupSuccess?.();
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (err) {
      console.error("CTA signup failed:", err);
      toast.error(t("error.failed"));
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

  const scrollToStory = () => {
    const el = document.querySelector("section.container");
    if (el) {
      window.scrollTo({ top: (el as HTMLElement).offsetTop - 40, behavior: "smooth" });
    }
  };

  return (
    <>
      <SocialProofPopup trigger={popupTrigger} message={popupMessage || t("cta.socialProof")} />

      {/* ===== STICKY MOBILE BOTTOM BAR — nur sichtbar wenn nicht submitted ===== */}
      {!submitted && (
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-[#9b6b3f]/25 backdrop-blur-md"
             style={{ background: "rgba(255,255,255,0.96)" }}>
          <div className="px-3 py-2.5 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9b6b3f] leading-tight">
                {t("hero.sticky.label")}
              </p>
              <p className="text-[11px] text-[#666] leading-tight">
                CHF 99 statt CHF 129 · Du wärst Founder #{nextFounderNumber}
              </p>
            </div>
            <a
              href="#signup-form"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("founder-email")?.focus();
                document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="shrink-0 px-4 py-2.5 rounded-lg text-white font-bold text-[13px] active:scale-[0.98] transition-all"
              style={{ backgroundColor: GOLD, boxShadow: "0 4px 14px -4px rgba(155,107,63,0.5)" }}
            >
              {t("hero.sticky.cta")} →
            </a>
          </div>
        </div>
      )}

      {/* ===== HERO — komplett neu auf Conversion ===== */}
      <section
        id="signup-form"
        className="w-full"
        style={{ backgroundColor: "#faf6f0" }}
      >
        <div className="container mx-auto px-4 pt-3 pb-6 sm:pt-8 sm:pb-12 md:pt-10 md:pb-16">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center max-w-6xl mx-auto">

            {/* ===== LEFT — Image + Trust (auf Mobile zuerst kleines Bild, dann Form) ===== */}
            <div className="flex flex-col items-center md:items-start order-1 md:order-1 animate-fade-in">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 rounded-full"
                   style={{ background: "rgba(155,107,63,0.08)", border: "1px solid rgba(155,107,63,0.25)" }}>
                <SwissFlag size={14} />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#2b2725]">
                  {t("hero.eyebrow")}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[26px] leading-[1.05] sm:text-4xl md:text-[44px] md:leading-[1.05] font-extrabold text-[#1a1a1a] tracking-tight text-center md:text-left mb-2 sm:mb-3">
                {t("hero.h1.line1")}<br />
                <span className="text-[#9b6b3f]">{t("hero.h1.line2")}</span>
              </h1>

              {/* Sub — der Anreiz, klar */}
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#777] leading-relaxed text-center mx-auto md:mx-0 md:text-left mb-3 sm:mb-5 max-w-md">
                {t("hero.sub")}
              </p>

              {/* Produktbild */}
              <div className="w-full flex justify-center md:justify-start relative mb-1 sm:mb-0">
                <img
                  src={nexusHero}
                  srcSet={`${nexusHero280} 280w, ${nexusHero} 480w, ${nexusHero720} 720w`}
                  sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, 400px"
                  alt="RAJ NEXUS 3-in-1 Wireless Charger mit iPhone, AirPods und Apple Watch"
                  width={480}
                  height={480}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full max-w-[260px] sm:max-w-none sm:w-auto max-h-[180px] sm:max-h-[320px] md:max-h-[400px] object-contain relative z-10"
                />
                <div
                  aria-hidden
                  className="absolute left-1/2 md:left-[40%] -translate-x-1/2 bottom-0 w-[55%] md:w-[45%] h-3 sm:h-4 rounded-[50%] blur-md pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, rgba(43,39,37,0.22) 0%, rgba(43,39,37,0) 70%)" }}
                />
              </div>
            </div>

            {/* ===== RIGHT — DAS FORMULAR (alles entscheidende über dem Knick) ===== */}
            <div className="order-2 md:order-2 w-full animate-fade-in">
              <div
                className="rounded-2xl p-4 sm:p-6 md:p-7 relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #ffffff 0%, #fdfaf5 100%)",
                  border: `1.5px solid ${GOLD}`,
                  boxShadow: "0 20px 50px -20px rgba(155,107,63,0.35), 0 0 0 1px rgba(155,107,63,0.15)",
                }}
              >
                {/* Founder-Number Banner — DER psychologische Hook */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-[#9b6b3f]/15">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                         style={{ background: `linear-gradient(135deg, ${GOLD}, #c08a5a)` }}>
                      <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#888] font-medium leading-none">
                        {t("hero.youAre")}
                      </p>
                      <p className="text-[18px] sm:text-[22px] font-extrabold text-[#1a1a1a] leading-tight tabular-nums">
                        Founder #{nextFounderNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[18px] sm:text-[22px] font-extrabold tabular-nums leading-tight" style={{ color: GOLD }}>
                      {taken}<span className="text-[12px] sm:text-[13px] text-[#888] font-medium"> / 100</span>
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#888] font-medium leading-tight">
                      {t("hero.foundersJoined")}
                      {todayCount > 0 && (
                        <> · <span className="font-semibold" style={{ color: GOLD }}>+{todayCount} {t("hero.today")}</span></>
                      )}
                    </p>
                  </div>
                </div>


                {/* Progress bar */}
                <div className="w-full mb-4 sm:mb-5">
                  <div
                    className="relative h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(155,107,63,0.12)" }}
                    role="progressbar"
                    aria-valuenow={taken}
                    aria-valuemin={0}
                    aria-valuemax={TOTAL_SPOTS}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1600ms] ease-out"
                      style={{ background: `linear-gradient(90deg, ${GOLD}, #c08a5a)`, width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Was du bekommst — 3 starke Bullets */}
                <ul className="space-y-2 mb-4 sm:mb-5">
                  <li className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(155,107,63,0.12)" }}>
                      <Tag className="w-3.5 h-3.5" color={GOLD} strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">{t("hero.benefit.save")}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(155,107,63,0.12)" }}>
                      <Gift className="w-3.5 h-3.5" color={GOLD} strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">{t("hero.benefit.cable")}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(155,107,63,0.12)" }}>
                      <Hash className="w-3.5 h-3.5" color={GOLD} strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">{t("hero.benefit.serial")}</span>
                  </li>
                </ul>

                {/* DAS FORMULAR */}
                {submitted ? (
                  <div className="text-center py-2 animate-scale-in">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#1a1a1a] mb-1">
                      {t("hero.success.title")}
                    </h3>
                    <p className="text-[14px] text-[#444] mb-1">
                      {t("hero.success.sub")} <span className="font-bold" style={{ color: GOLD }}>#{nextFounderNumber}</span>
                    </p>
                    <p className="text-[12px] text-[#888] leading-snug max-w-xs mx-auto mt-2">
                      {t("hero.success.next")}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b6b3f] pointer-events-none z-20" />
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
                        maxLength={255}
                        disabled={submitting}
                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl bg-white border-2 border-[#9b6b3f]/40 focus:border-[#9b6b3f] text-[#1a1a1a] placeholder:text-[#aaa] text-[15px] sm:text-[16px] font-medium focus:outline-none focus:ring-4 focus:ring-[#9b6b3f]/15 transition-all relative z-10"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-4 py-3 sm:py-4 rounded-xl text-white font-extrabold text-[14px] sm:text-[15.5px] hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(180deg, ${GOLD} 0%, #82592f 100%)`,
                        boxShadow: "0 10px 24px -8px rgba(155,107,63,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("hero.cta.submitting")}
                        </>
                      ) : (
                        <>
                          {t("hero.cta.primary")} #{nextFounderNumber} <span aria-hidden>→</span>
                        </>
                      )}
                    </button>

                    {/* Mini-Trust DIREKT unter dem Button */}
                    <div className="flex items-center justify-around gap-1 pt-1">
                      <div className="flex items-center gap-1">
                        <Truck size={12} color={GOLD} strokeWidth={2.4} />
                        <span className="text-[10px] sm:text-[11px] text-[#666] font-medium">{t("hero.miniFaq.shipping")}</span>
                      </div>
                      <div className="w-px h-3 bg-[#9b6b3f]/20" />
                      <div className="flex items-center gap-1">
                        <RotateCcw size={12} color={GOLD} strokeWidth={2.4} />
                        <span className="text-[10px] sm:text-[11px] text-[#666] font-medium">{t("hero.miniFaq.returns")}</span>
                      </div>
                      <div className="w-px h-3 bg-[#9b6b3f]/20" />
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={12} color={GOLD} strokeWidth={2.4} />
                        <span className="text-[10px] sm:text-[11px] text-[#666] font-medium">3 J. Garantie</span>
                      </div>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-center text-[#999] mt-1">
                      {t("hero.miniFaq.noCommit")}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-center text-[#888] mt-0.5">
                      {t("hero.questions")}{" "}
                      <a
                        href="mailto:founder@raj.ch"
                        className="font-semibold underline decoration-[#9b6b3f]/40 underline-offset-2 hover:text-[#9b6b3f] hover:decoration-[#9b6b3f] transition-colors"
                      >
                        founder@raj.ch
                      </a>
                    </p>
                  </form>
                )}
              </div>

              {/* Countdown UNTER der Box — sekundärer Druck */}
              <div className="mt-4 sm:mt-5">
                <p className="text-center text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#888] font-semibold mb-2">
                  {t("hero.priceLine")}
                </p>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-sm mx-auto">
                  {countdownUnits.map((u) => (
                    <div
                      key={u.label}
                      className="flex flex-col items-center justify-center rounded-lg py-2 sm:py-2.5"
                      style={{
                        background: "linear-gradient(180deg, #2b2725 0%, #1a1715 100%)",
                        border: "1px solid rgba(155,107,63,0.35)",
                      }}
                    >
                      <span className="text-[16px] sm:text-[20px] font-extrabold text-white tabular-nums leading-none">
                        {String(u.value).padStart(2, "0")}
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wide mt-1 font-medium" style={{ color: GOLD }}>
                        {u.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Scroll Hint — nach unten zur Story */}
          <button
            onClick={scrollToStory}
            className="hidden md:flex mx-auto mt-10 flex-col items-center gap-1.5 text-[#888] hover:text-[#9b6b3f] transition-colors group"
            aria-label="Mehr erfahren"
          >
            <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">{t("hero.scrollHint")}</span>
            <ArrowDown className="w-4 h-4 animate-bounce" strokeWidth={2.2} />
          </button>
        </div>
      </section>

      {/* Mobile spacer — damit Sticky-Bar nicht überlappt */}
      <div className="h-16 md:hidden" aria-hidden />
    </>
  );
};

export default HeroBadgesAndCTA;

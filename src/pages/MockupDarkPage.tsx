import { useEffect, useState, useCallback, FormEvent, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Smartphone, Headphones, Watch, Mail, Loader2, Check, ArrowRight,
  ShieldCheck, Truck, RotateCcw, Plus, Hash, Tag, Gift, Zap, Package, Infinity as InfinityIcon, ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackMetaEvent } from "@/lib/meta-pixel";

// Echte Shop-Bilder (1:1 mit raj.ch)
import nexusHero from "@/assets/products/nexus-real-3quarter-white.jpg";
import nexusHeroDark from "@/assets/products/nexus-real-night-city.webp";
import nexusFolds from "@/assets/products/nexus-real-folds-text.webp";
import nexusDesk from "@/assets/products/nexus-real-desk-office.webp";
import nexusTopview from "@/assets/products/nexus-real-topview-qi2.jpg";
import nexusFeatures from "@/assets/products/nexus-real-features.jpg";
import nexusWindow from "@/assets/products/nexus-real-window.jpg";
import nexusSofa from "@/assets/products/nexus-real-lifestyle-sofa.jpg";
import logo from "@/assets/logo-new.webp";
import logoTransparent from "@/assets/logo-transparent.png";

// Hero Carousel — premium product rotation (text-free images)
const heroDesire = new URL("../assets/hero-carousel/slide-5-desire.webp", import.meta.url).href;
const heroDesireSm = new URL("../assets/hero-carousel/slide-5-desire-480.webp", import.meta.url).href;
const heroIphoneWatchPods = new URL("../assets/hero-carousel/nexus-iphone-watch-airpods.png", import.meta.url).href;
const heroEmptyQi2 = new URL("../assets/hero-carousel/nexus-empty-qi2.png", import.meta.url).href;
const hero3in1Charging = new URL("../assets/hero-carousel/nexus-3in1-charging.png", import.meta.url).href;
const heroFlatIphone = new URL("../assets/hero-carousel/nexus-flat-iphone.png", import.meta.url).href;

const HERO_SLIDES = [
  { src: heroDesire, srcSm: heroDesireSm, eyebrow: "Form", caption: "Objekt, nicht Gerät." },
] as const;

/**
 * MOCKUP — Apple × Rolex Positioning
 * Dark Hero → Light Trust → Dark Story → Light Specs → Light FAQ → Dark CTA
 * Lives at /mockup-dark. Does NOT touch live LaunchPage.
 *
 * Positioning Doctrine:
 * - Kein Vergleich. Premium-Marken vergleichen sich nicht — sie definieren.
 * - Keine "vs. Anker / Belkin". Apple zeigt nicht Samsung. Rolex zeigt nicht Casio.
 * - Produkt als Objekt. Stille. Raum. Material.
 * - Eine Aussage pro Sektion. Atmen lassen.
 */

// Palette
const D = {
  bg: "#0A0A0A",
  surface: "#141312",
  surfaceHi: "#1C1A18",
  beige: "#E8DCC4",
  muted: "#A89B82",
  mutedDim: "#6E665A",
  gold: "#C9A876",
  border: "#26221E",
};
const L = {
  bg: "#FAF8F5",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#6B6358",
  textDim: "#9A9285",
  gold: "#9b6b3f",
  border: "#E8E2D6",
};

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const getSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

// ─────────────────────────────────────────────────────────────────
// COUNTDOWN (theme-aware)
// ─────────────────────────────────────────────────────────────────
const Countdown = ({ dark = true }: { dark?: boolean }) => {
  const { t } = useLanguage();
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { v: time.d, l: t("countdown.days") },
    { v: time.h, l: t("countdown.hours") },
    { v: time.m, l: t("countdown.minutes") },
    { v: time.s, l: t("countdown.seconds") },
  ];

  const numColor = dark ? D.beige : L.text;
  const labelColor = dark ? D.gold : L.gold;

  return (
    <div className="flex justify-center gap-5 sm:gap-7">
      {units.map((u, i) => (
        <div key={u.l} className="flex flex-col items-center min-w-[44px]">
          <span
            className="text-3xl sm:text-4xl md:text-5xl tabular-nums leading-none tracking-tight"
            style={{ color: numColor, fontWeight: 300, fontVariantNumeric: "tabular-nums" }}
          >
            {String(u.v).padStart(2, "0")}
          </span>
          <span
            className="text-[9px] sm:text-[10px] uppercase mt-2 font-medium"
            style={{ color: labelColor, letterSpacing: "0.28em" }}
          >
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// SIGNUP (used in hero + final CTA)
// ─────────────────────────────────────────────────────────────────
const SignupForm = ({ dark = true, onSuccess }: { dark?: boolean; onSuccess?: () => void }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [hp1, setHp1] = useState("");
  const [hp2, setHp2] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (hp1 || hp2) { setDone(true); return; }
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setDone(true);
        trackMetaEvent("Lead", { email: email.trim() });
        onSuccess?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div
        className="flex items-center justify-center gap-3 px-6 py-4 rounded-full"
        style={{
          background: dark ? "rgba(201,168,118,0.12)" : "rgba(155,107,63,0.08)",
          border: `1px solid ${dark ? D.gold : L.gold}`,
          color: dark ? D.beige : L.text,
        }}
      >
        <Check className="w-4 h-4" style={{ color: dark ? D.gold : L.gold }} />
        <span className="text-sm font-medium tracking-wide">Du bist auf der Liste.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md mx-auto">
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <input value={hp1} onChange={(e) => setHp1(e.target.value)} tabIndex={-1} autoComplete="off" />
        <input value={hp2} onChange={(e) => setHp2(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      {/* Price row — CHF 99 with 129 strikethrough */}
      <div className="flex items-baseline justify-center gap-3 mb-5">
        <span className="text-4xl sm:text-5xl tracking-tight" style={{ color: dark ? D.beige : L.text, fontWeight: 300 }}>
          CHF 99<span style={{ fontSize: "0.6em" }}>.–</span>
        </span>
        <span className="text-lg line-through" style={{ color: dark ? D.mutedDim : L.textDim, fontWeight: 300 }}>
          CHF 129.–
        </span>
        <span className="text-[10px] uppercase" style={{ color: dark ? D.mutedDim : L.textDim, letterSpacing: "0.2em" }}>
          inkl. MwSt
        </span>
      </div>

      <div className="space-y-3">
        <div
          className="flex items-center gap-2 px-4 rounded-full"
          style={{
            background: "#FFFFFF",
            border: `1px solid ${dark ? "rgba(0,0,0,0.1)" : L.border}`,
          }}
        >
          <Mail className="w-4 h-4 shrink-0" style={{ color: "#8a8278" }} />
          <input
            id="mockup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.ch"
            className="flex-1 bg-transparent outline-none px-1 py-3 text-sm"
            style={{ color: "#1a1714" }}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] transition-all hover:scale-[1.01] disabled:opacity-60"
          style={{
            background: `linear-gradient(180deg, ${D.gold}, #8a5a35)`,
            color: "#1a1410",
            boxShadow: `0 14px 34px -12px ${D.gold}80, inset 0 1px 0 rgba(255,255,255,0.28)`,
          }}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Jetzt Platz sichern <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </div>
      <p
        className="text-[10px] uppercase tracking-[0.22em] text-center mt-4"
        style={{ color: dark ? D.mutedDim : L.textDim }}
      >
        Unverbindlich · Jederzeit abmeldbar
      </p>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────────
// SOCIAL PROOF POPUP (dark theme)
// ─────────────────────────────────────────────────────────────────
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
    <div className="fixed bottom-24 sm:bottom-5 left-3 sm:left-5 z-40 max-w-[300px] animate-fade-in">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md"
        style={{ background: "rgba(20,19,18,0.92)", border: `1px solid ${D.gold}40`, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)" }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: D.gold }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: D.gold }} />
        </span>
        <p className="text-[12px] sm:text-[13px] leading-snug" style={{ color: D.beige }}>{message}</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
const TOTAL_SPOTS = 100;

// ─────────────────────────────────────────────────────────────────
// HERO PREMIUM CAROUSEL — auto-rotating editorial slideshow
// ─────────────────────────────────────────────────────────────────
// HERO STILL — single editorial image (no carousel)
// ─────────────────────────────────────────────────────────────────
const HeroStillImage = () => {
  return (
    <div className="relative mt-10 sm:mt-12">
      {/* Ambient gold halo */}
      <div
        className="absolute -inset-10 rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${D.gold}, transparent 65%)` }}
        aria-hidden
      />

      {/* Frame */}
      <div
        className="relative w-full aspect-[5/4] overflow-hidden rounded-sm"
        style={{
          boxShadow: "0 60px 140px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,118,0.15)",
        }}
      >
        <img
          src={heroDesire}
          srcSet={`${heroDesireSm} 480w, ${heroDesire} 1200w`}
          sizes="(max-width: 768px) 100vw, 700px"
          alt="RAJ NEXUS auf einem Schreibtisch im Premium-Setup."
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ background: D.surface, objectPosition: "center top" }}
        />
      </div>

      {/* Editorial caption UNDER image */}
      <div className="mt-6 px-1">
        <p
          className="text-[10px] uppercase font-medium leading-relaxed"
          style={{ color: D.gold, letterSpacing: "0.32em" }}
        >
          Engineered for <span style={{ color: D.beige }}>Performance.</span><br />
          Designed to <span style={{ color: D.beige }}>Inspire.</span>
        </p>
        <div className="w-10 h-px mt-3" style={{ background: D.gold }} />
      </div>
    </div>
  );
};

const MockupDarkPage = () => {
  const { t, lang, setLang } = useLanguage();

  // Live counts from DB
  const [spotsTaken, setSpotsTaken] = useState(0);
  const [signupsToday, setSignupsToday] = useState(0);
  const [popupTrigger, setPopupTrigger] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  const refreshCounts = useCallback(async () => {
    try {
      const supabase = await getSupabase();
      const { count: total } = await supabase
        .from("launch_signups")
        .select("id", { count: "exact", head: true });
      if (typeof total === "number") setSpotsTaken(Math.min(TOTAL_SPOTS, Math.max(0, total)));

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { count: today } = await supabase
        .from("launch_signups")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfDay.toISOString());
      if (typeof today === "number") setSignupsToday(Math.max(0, today) + 6);
    } catch (err) {
      console.error("Failed to load counts:", err);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const id = window.setTimeout(() => void refreshCounts(), 1500);
    return () => {
      document.documentElement.style.scrollBehavior = "";
      clearTimeout(id);
    };
  }, [refreshCounts]);

  const nextFounderNumber = Math.min(TOTAL_SPOTS, spotsTaken + 1);
  const progress = Math.min(100, (spotsTaken / TOTAL_SPOTS) * 100);

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — Mockup Editorial Dark</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <SocialProofPopup trigger={popupTrigger} message={popupMessage} />

      {/* ===== STICKY MOBILE BOTTOM BAR ===== */}
      {!heroSubmitted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden backdrop-blur-md"
          style={{ background: "rgba(10,10,10,0.95)", borderTop: `1px solid ${D.gold}40` }}
        >
          <div className="px-3 py-2.5 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider leading-tight" style={{ color: D.gold }}>
                Edition 01 · Limitiert
              </p>
              <p className="text-[11px] leading-tight" style={{ color: D.beige }}>
                CHF 99.– · Du wärst <span className="font-bold">Founder #{nextFounderNumber}</span>
              </p>
            </div>
            <a
              href="#mockup-signup"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("mockup-email")?.focus();
                document.getElementById("mockup-signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="shrink-0 px-4 py-2.5 rounded-full font-bold text-[12px] uppercase tracking-wider active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
              style={{ background: D.beige, color: D.bg }}
            >
              Sichern <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Sticky Comparison Bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-2.5 text-xs"
        style={{ background: D.bg, borderBottom: `1px solid ${D.border}`, color: D.muted }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: D.gold, letterSpacing: "0.28em" }} className="uppercase font-semibold">Mockup</span>
          <span className="hidden sm:inline" style={{ color: D.mutedDim }}>Editorial · Apple × Rolex</span>
        </div>
        <Link to="/" className="underline underline-offset-4 hover:opacity-80" style={{ color: D.beige }}>
          ← Live-Version vergleichen
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO — DARK · Editorial + Conversion Card                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        id="mockup-signup"
        className="relative overflow-hidden"
        style={{ background: D.bg, color: D.beige }}
      >
        {/* Header — Logo transparent on dark */}
        <header className="relative z-20 flex items-center justify-between px-5 sm:px-10 py-5">
          <a href="/" aria-label="RAJ" className="inline-flex items-center">
            <img
              src={logoTransparent}
              alt="RAJ"
              className="h-9 sm:h-10 w-auto select-none"
              style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.5))" }}
              draggable={false}
            />
          </a>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase" style={{ letterSpacing: "0.28em" }}>
            {[
              { label: "Produkte", href: "#produkte" },
              { label: "Über RAJ", href: "#ueber" },
              { label: "Technologie", href: "#tech" },
              { label: "Kontakt", href: "#kontakt" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:opacity-100"
                style={{ color: D.muted, fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = D.beige)}
                onMouseLeave={(e) => (e.currentTarget.style.color = D.muted)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right cluster: lang + cart */}
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-1 text-[10px]">
              {(["de", "fr", "it"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="px-1.5 py-1 uppercase tracking-widest transition-colors"
                  style={{
                    color: lang === l ? D.beige : D.mutedDim,
                    fontWeight: lang === l ? 600 : 400,
                  }}
                >
                  {l}
                </button>
              ))}
            </nav>
            <button
              aria-label="Warenkorb"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, ${D.surface}, ${D.surfaceHi})`,
                border: `1px solid ${D.gold}33`,
              }}
            >
              <ShoppingBag className="w-4 h-4" style={{ color: D.gold }} strokeWidth={1.6} />
            </button>
          </div>
        </header>

        {/* Subtle ambient gold haze (Apple keynote feel) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] pointer-events-none opacity-[0.18]"
          style={{ background: `radial-gradient(ellipse at center, ${D.gold} 0%, transparent 60%)` }}
          aria-hidden
        />
        {/* Vignette bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${D.bg})` }}
          aria-hidden
        />

        {/* Hero content */}
        <div className="relative px-5 sm:px-10 pt-4 sm:pt-10 pb-20 sm:pb-32 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-14 items-start">
            {/* LEFT: editorial copy + premium carousel */}
            <div className="md:col-span-7 relative">
              {/* ─── Title Block ABOVE hero image ─── */}
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-px" style={{ background: D.gold }} />
                  <span className="text-[10px] uppercase font-semibold" style={{ color: D.gold, letterSpacing: "0.32em" }}>
                    Founder Edition — Nur 100 Stück
                  </span>
                </div>

                <h2
                  className="text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-[-0.02em] mb-3"
                  style={{ color: D.beige, fontWeight: 200 }}
                >
                  RAJ <span style={{ fontWeight: 300 }}>NEXUS</span>
                </h2>
                <p className="text-base sm:text-lg" style={{ color: D.muted, fontWeight: 300 }}>
                  3-in-1 Qi 2.2 Wireless Charger
                </p>
              </div>

              {/* PREMIUM HERO IMAGE — single still */}
              <HeroStillImage />

            </div>

            {/* RIGHT: Premium Founder Card (boxed, matching reference) */}
            <div className="md:col-span-5 md:sticky md:top-20">
              <div
                className="relative rounded-2xl p-7 sm:p-8"
                style={{
                  background: `linear-gradient(180deg, ${D.surface}, ${D.surfaceHi})`,
                  border: `1px solid ${D.gold}33`,
                  boxShadow: "0 40px 100px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,118,0.08) inset",
                }}
              >
                {/* Header row: Founder badge + counter */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: `${D.gold}1a`,
                        border: `1px solid ${D.gold}55`,
                      }}
                    >
                      <Hash className="w-4 h-4" style={{ color: D.gold }} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-semibold leading-none mb-1.5" style={{ color: D.mutedDim, letterSpacing: "0.28em" }}>
                        Du wärst
                      </p>
                      <p className="text-lg leading-none" style={{ color: D.beige, fontWeight: 400 }}>
                        Founder <span style={{ color: D.gold }}>#{nextFounderNumber}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base tabular-nums leading-none" style={{ color: D.beige, fontWeight: 300 }}>
                      <span style={{ fontWeight: 500 }}>{spotsTaken}</span>
                      <span style={{ color: D.mutedDim }}> / {TOTAL_SPOTS}</span>
                    </p>
                    <p className="text-[9px] uppercase mt-1.5" style={{ color: D.mutedDim, letterSpacing: "0.18em" }}>
                      Founders dabei
                      {signupsToday > 0 && <span style={{ color: D.gold }}> · +{signupsToday} heute</span>}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="relative h-px overflow-hidden mb-7"
                  style={{ backgroundColor: `${D.gold}22` }}
                  role="progressbar"
                  aria-valuenow={spotsTaken}
                  aria-valuemin={0}
                  aria-valuemax={TOTAL_SPOTS}
                >
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-[1600ms] ease-out"
                    style={{ background: `linear-gradient(90deg, ${D.gold}, ${D.beige})`, width: `${progress}%` }}
                  />
                </div>

                {/* Founder benefits */}
                <ul className="space-y-3.5 mb-7">
                  {[
                    { icon: InfinityIcon, label: "Lebenslanger Early Access zu neuen RAJ Produkten" },
                    { icon: Hash, label: "Founder Edition mit persönlicher Seriennummer" },
                    { icon: Tag, label: "CHF 30 günstiger als regulär" },
                  ].map((b) => (
                    <li key={b.label} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${D.gold}14`, border: `1px solid ${D.gold}33` }}
                      >
                        <b.icon className="w-3.5 h-3.5" style={{ color: D.gold }} strokeWidth={1.8} />
                      </div>
                      <span className="text-[13px]" style={{ color: D.beige, fontWeight: 300 }}>
                        {b.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Email signup */}
                <SignupForm
                  dark
                  onSuccess={() => {
                    setHeroSubmitted(true);
                    void refreshCounts();
                    setPopupMessage("✦ Du bist auf der Liste.");
                    setPopupTrigger((p) => p + 1);
                  }}
                />


                {/* Reassurance row */}
                <div
                  className="flex items-center justify-center gap-5 mt-5 pt-5"
                  style={{ borderTop: `1px solid ${D.border}` }}
                >
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3 h-3" style={{ color: D.gold }} strokeWidth={1.8} />
                    <span className="text-[10px]" style={{ color: D.muted, letterSpacing: "0.06em" }}>
                      Gratis CH
                    </span>
                  </div>
                  <span className="w-px h-3" style={{ background: D.border }} />
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3 h-3" style={{ color: D.gold }} strokeWidth={1.8} />
                    <span className="text-[10px]" style={{ color: D.muted, letterSpacing: "0.06em" }}>
                      30 Tage
                    </span>
                  </div>
                  <span className="w-px h-3" style={{ background: D.border }} />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" style={{ color: D.gold }} strokeWidth={1.8} />
                    <span className="text-[10px]" style={{ color: D.muted, letterSpacing: "0.06em" }}>
                      3 J. Garantie
                    </span>
                  </div>
                </div>
              </div>

              {/* Countdown OUTSIDE card */}
              <div className="mt-10">
                <p className="text-center text-[10px] uppercase tracking-[0.32em] font-medium mb-4" style={{ color: D.mutedDim }}>
                  Launch in
                </p>
                <Countdown dark />
              </div>
            </div>
          </div>
        </div>

        {/* Hairline gold divider */}
        <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${D.gold}, transparent)`, opacity: 0.4 }} />
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. TRUST — LIGHT · Drei Versprechen                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg, color: L.text }} className="py-20 md:py-32 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Drei Geräte · Ein Ort
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
              Alles was du am Bett brauchst.<br />
              <span style={{ fontStyle: "italic", color: L.textMuted }}>Nichts mehr.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              { icon: Smartphone, label: "iPhone", spec: "15W MagSafe" },
              { icon: Watch, label: "Apple Watch", spec: "Schnellladung" },
              { icon: Headphones, label: "AirPods", spec: "Qi2 Pad" },
            ].map((d) => (
              <div key={d.label} className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5"
                  style={{ background: "#FFFFFF", border: `1px solid ${L.border}` }}
                >
                  <d.icon className="w-6 h-6" style={{ color: L.gold }} strokeWidth={1.3} />
                </div>
                <div className="text-lg font-light tracking-tight">{d.label}</div>
                <div className="text-xs mt-1" style={{ color: L.textDim, letterSpacing: "0.16em" }}>
                  {d.spec.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-20 md:mt-28 grid grid-cols-3 gap-4 max-w-3xl mx-auto pt-10" style={{ borderTop: `1px solid ${L.border}` }}>
            {[
              { icon: ShieldCheck, label: "3 Jahre Garantie" },
              { icon: Truck, label: "Gratis Versand CH" },
              { icon: RotateCcw, label: "30 Tage Rückgabe" },
            ].map((it) => (
              <div key={it.label} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
                <it.icon className="w-4 h-4 shrink-0" style={{ color: L.gold }} strokeWidth={1.5} />
                <span className="text-[11px] sm:text-xs uppercase" style={{ color: L.textMuted, letterSpacing: "0.18em" }}>
                  {it.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. STORY — DARK · Editorial Zickzack mit echten Bildern    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: D.bg, color: D.beige }} className="py-24 md:py-36 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 md:mb-28">
            <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
              — Drei Momente
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
              Mehr als ein Ladegerät.
            </h2>
          </div>

          <div className="space-y-28 md:space-y-40">
            {[
              {
                img: nexusFolds,
                idx: "01",
                eyebrow: "Für Vielreisende",
                title: "Faltet sich. Lädt überall.",
                copy: "Hotelzimmer. Lounge. Airbnb. Eine Bewegung — aufgeklappt. iPhone, Watch, AirPods. Alle gleichzeitig.",
              },
              {
                img: nexusDesk,
                idx: "02",
                eyebrow: "Für die, die Ordnung lieben",
                title: "Drei Kabel weg. Ein Objekt da.",
                copy: "Kein Kabelsalat. Kein Suchen. Ein einziger Ort — alles geladen, alles bereit.",
              },
              {
                img: nexusWindow,
                idx: "03",
                eyebrow: "Für die späten Abende",
                title: "Hinlegen. Aufwachen mit 100 %.",
                copy: "Telefon drauf — magnetisch klick. Morgens: voll geladen, bereit für den Tag.",
              },
            ].map((s, i) => {
              const right = i % 2 === 1;
              return (
                <div key={s.idx} className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
                  <div className={`md:col-span-7 relative ${right ? "md:order-2" : ""}`}>
                    <div className="relative">
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover rounded-sm"
                        style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)" }}
                      />
                      {/* Gradient vignette */}
                      <div
                        className="absolute inset-0 rounded-sm pointer-events-none"
                        style={{ background: `linear-gradient(135deg, transparent 60%, rgba(10,10,10,0.4))` }}
                      />
                    </div>
                  </div>
                  <div className={`md:col-span-5 ${right ? "md:order-1 md:text-right" : ""}`}>
                    <div className="flex items-center gap-3 mb-5" style={{ justifyContent: right ? "flex-end" : "flex-start" }}>
                      <span className="text-5xl md:text-6xl font-extralight tabular-nums" style={{ color: D.gold }}>
                        {s.idx}
                      </span>
                      <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
                        {s.eyebrow}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl leading-tight tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
                      {s.title}
                    </h3>
                    <div className={`w-10 h-px my-5 ${right ? "ml-auto" : ""}`} style={{ background: D.gold }} />
                    <p className="text-base leading-relaxed max-w-md" style={{ color: D.muted, fontWeight: 300, marginLeft: right ? "auto" : 0 }}>
                      {s.copy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. SPECS — LIGHT · Material, Maß, Wahrheit                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-36 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Spezifikationen
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
              Präzision in Zahlen.
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Image */}
            <div className="md:col-span-6">
              <img
                src={nexusTopview}
                alt="RAJ NEXUS Top View"
                className="w-full aspect-square object-cover rounded-sm"
                style={{ boxShadow: "0 30px 80px -30px rgba(26,26,26,0.25)" }}
              />
            </div>
            {/* Specs */}
            <div className="md:col-span-6">
              <dl className="space-y-0">
                {[
                  ["Standard", "Qi2.2 · WPC zertifiziert"],
                  ["Leistung", "25 W Schnellladung"],
                  ["Geräte", "iPhone · Watch · AirPods"],
                  ["Material", "Aluminium · Premium-Gewebe"],
                  ["Garantie", "3 Jahre Schweizer Service"],
                  ["Sicherheit", "Überhitzungs- & Überladeschutz"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between items-baseline py-4"
                    style={{ borderBottom: `1px solid ${L.border}` }}
                  >
                    <dt className="text-[11px] uppercase" style={{ color: L.textDim, letterSpacing: "0.2em" }}>
                      {k}
                    </dt>
                    <dd className="text-sm md:text-base text-right" style={{ color: L.text, fontWeight: 400 }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Conviction line */}
          <div className="text-center mt-20 md:mt-28 max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl leading-relaxed tracking-tight" style={{ fontWeight: 300, color: L.text }}>
              {t("launch.conviction2.bold")}
            </p>
            <p className="text-sm md:text-base italic mt-4" style={{ color: L.textMuted }}>
              {t("launch.conviction2.sub")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. WHY RAJ — LIGHT · Markenphilosophie (statt Vergleich)   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#F2EDE3", color: L.text }} className="py-20 md:py-32 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
            — {t("why.title")} RAJ?
          </span>
          <h2 className="text-3xl md:text-5xl mt-6 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
            Wir vergleichen uns nicht.<br />
            <span style={{ fontStyle: "italic", color: L.textMuted }}>Wir definieren.</span>
          </h2>
          <div className="w-12 h-px mx-auto my-8" style={{ background: L.gold }} />
          <p className="text-base md:text-lg leading-relaxed" style={{ color: L.textMuted, fontWeight: 300 }}>
            {t("why.text")}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. FAQ — LIGHT · Klarheit                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg }} className="py-20 md:py-32 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Klarheit
            </span>
            <h2 className="text-3xl md:text-4xl mt-5 leading-tight tracking-tight" style={{ color: L.text, fontWeight: 300 }}>
              {t("faq.title")}
            </h2>
          </div>

          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <details key={n} className="group" style={{ borderBottom: `1px solid ${L.border}` }}>
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                  <span className="text-[15px] md:text-base pr-6" style={{ color: L.text, fontWeight: 400 }}>
                    {t(`faq.q${n}`)}
                  </span>
                  <Plus
                    className="w-4 h-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
                    style={{ color: L.gold }}
                    strokeWidth={1.5}
                  />
                </summary>
                <div className="pb-6 pr-10">
                  <p className="text-sm leading-relaxed" style={{ color: L.textMuted, fontWeight: 300 }}>
                    {t(`faq.a${n}`)}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-xs" style={{ color: L.textMuted }}>{t("faq.contact.lead")}</p>
            <a
              href="mailto:founder@raj.ch"
              className="inline-block mt-2 text-sm font-medium underline underline-offset-4"
              style={{ color: L.text, textDecorationColor: L.gold }}
            >
              founder@raj.ch
            </a>
            <p className="text-[10px] mt-2 uppercase" style={{ color: L.textDim, letterSpacing: "0.18em" }}>
              {t("faq.contact.sub")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. FINAL CTA — DARK · Begehren in Aktion                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-36 px-5"
        style={{ background: D.bg, color: D.beige }}
      >
        {/* Background image faded */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img src={nexusSofa} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${D.bg} 0%, rgba(10,10,10,0.7) 50%, ${D.bg} 100%)` }} />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
            — Edition 01 · Limitiert auf 100
          </span>
          <h2 className="text-4xl md:text-6xl mt-6 leading-[1.05] tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
            Sei unter den<br />
            <span style={{ fontStyle: "italic", color: D.gold }}>ersten Hundert.</span>
          </h2>
          <div className="w-12 h-px mx-auto my-8" style={{ background: D.gold }} />
          <p className="text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10" style={{ color: D.muted, fontWeight: 300 }}>
            Early Access Mai 2026. CHF 99.– statt regulärem Preis.
            Priorität bei der Auslieferung.
          </p>

          <div className="mb-10">
            <Countdown dark />
          </div>

          <SignupForm dark />

          <div className="mt-12 flex items-center justify-center gap-2 text-[10px] uppercase" style={{ color: D.mutedDim, letterSpacing: "0.22em" }}>
            <ShieldCheck className="w-3 h-3" style={{ color: D.gold }} />
            <span>Schweizer Brand · Weltweit zertifiziert</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: D.bg, borderTop: `1px solid ${D.border}` }} className="py-10 px-5 text-center">
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md" style={{ background: D.beige }}>
          <img src={logo} alt="RAJ" className="h-5 w-auto" />
        </div>
        <p className="text-[10px] uppercase mt-4" style={{ color: D.gold, letterSpacing: "0.28em" }}>
          Power. Always There.
        </p>
        <p className="text-[10px] mt-3" style={{ color: D.mutedDim }}>
          © {new Date().getFullYear()} RAJ GmbH (in Gründung)
        </p>
      </footer>

      {/* Mobile spacer — damit Sticky Bar Footer nicht überdeckt */}
      <div className="h-16 md:hidden" aria-hidden style={{ background: D.bg }} />
    </>
  );
};

export default MockupDarkPage;

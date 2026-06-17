import { useEffect, useState, useCallback, FormEvent, lazy, Suspense, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Smartphone, Headphones, Watch, Mail, Loader2, Check, ArrowRight,
  ShieldCheck, Truck, RotateCcw, Tag, Gift, Zap, Package, Infinity as InfinityIcon, ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { useQuickBuy } from "@/hooks/useQuickBuy";
import ProductDetailsAccordion from "@/components/ProductDetailsAccordion";
import { CartDrawer } from "@/components/CartDrawer";
import Header from "@/components/Header";
import { PRODUCT_NEXUS_JSON_LD, breadcrumbJsonLd, FAQ_NEXUS_JSON_LD } from "@/lib/schemas";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Echte Shop-Bilder (1:1 mit raj.ch)
import nexusHero from "@/assets/products/nexus-real-3quarter-white.jpg";
import nexusHeroDark from "@/assets/products/nexus-real-night-city.webp";
import nexusFolds from "@/assets/products/nexus-real-folds-text-800.webp";
import nexusDesk from "@/assets/products/nexus-office-skyline.webp";
import nexusDesk680 from "@/assets/products/nexus-office-skyline-680w.webp";
import nexusDesk1200 from "@/assets/products/nexus-office-skyline-1200w.webp";
import nexusTopview from "@/assets/products/nexus-real-topview-qi2.jpg";
import nexusFeatures from "@/assets/products/nexus-desk-writing.webp";
import nexusFeatures1000 from "@/assets/products/nexus-desk-writing-1000w.webp";
import nexusFeatures1200 from "@/assets/products/nexus-desk-writing-1200w.webp";
import nexusWindow from "@/assets/products/nexus-sidetable-enjoy.webp";
import nexusSofa from "@/assets/products/nexus-coffee-lifestyle.webp";
import nexusFinalCta from "@/assets/products/nexus-real-lifestyle-sofa-800.webp";
import nexusNight from "@/assets/products/nexus-bedside-night.webp";
import carousel1 from "@/assets/products/nexus-real-hero-floating-white.webp";
import carousel2 from "@/assets/products/nexus-real-topview-qi2-white.webp";
import carousel3 from "@/assets/products/nexus-real-folds-white.webp";
import carousel5Asset from "@/assets/products/nexus-carousel4-lifestyle.webp.asset.json";
import beforeCableImg from "@/assets/products/nexus-before-cable-chaos.jpg";
import nexusBedsideNight from "@/assets/products/nexus-bedside-night.webp";

const carousel5 = carousel5Asset.url;
// Hero served from /public so URL is stable and matches <link rel="preload"> in index.html
const nexusStoneHero600 = "/assets/hero/nexus-hero-600.webp";
const nexusStoneHero1200 = "/assets/hero/nexus-hero-1200.webp";
const nexusStoneHero = nexusStoneHero1200;
import logo from "@/assets/logo-new.webp";
import logoTransparent from "@/assets/logo-transparent.webp";
import payVisa from "@/assets/payments/visa.webp";
import payMastercard from "@/assets/payments/mastercard.png";
import payAmex from "@/assets/payments/amex.png";
import payApplePay from "@/assets/payments/apple-pay.png";
import payGooglePay from "@/assets/payments/google-pay.png";
import payKlarna from "@/assets/payments/klarna.png";
import payTwint from "@/assets/payments/twint.png";

// Hero Carousel — premium product rotation (text-free images)
const heroDesire = new URL("../assets/hero-carousel/slide-5-desire.webp", import.meta.url).href;
const heroDesireSm = new URL("../assets/hero-carousel/slide-5-desire-480.webp", import.meta.url).href;
const heroStone = new URL("../assets/products/nexus-stone-hero.webp", import.meta.url).href;
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

// ─────────────────────────────────────────────────────────────────
// PRODUCT CAROUSEL with dash-style slide indicators
// ─────────────────────────────────────────────────────────────────
function NexusCarousel() {
  const slides = [
    { src: carousel1, alt: "RAJ NEXUS – Studio Produktansicht" },
    { src: carousel2, alt: "RAJ NEXUS – Topview iPhone, Watch & AirPods" },
    { src: carousel3, alt: "RAJ NEXUS – Premium Detail & Hinge" },
    { type: "before-now" as const, alt: "RAJ NEXUS – Vorher vs. Jetzt" },
    { src: carousel5, alt: "RAJ NEXUS – Lifestyle Editorial" },
  ];
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);
  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        plugins={[Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((img, i) => {
            const isComponent = "type" in img && img.type === "before-now";
            const bg = isComponent ? D.bg : "#ffffff";
            return (
              <CarouselItem key={i} className="pl-0 basis-full">
                <div className="relative w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden" style={{ background: bg }}>
                  {isComponent ? (
                    <BeforeNowSlide />
                  ) : (
                    <>
                      <img
                        src={(img as { src: string }).src}
                        alt={img.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-contain ${i === 0 ? "scale-[2.05]" : i === 2 ? "scale-[1.42]" : ""} ${i === 4 ? "object-cover" : ""}`}
                      />
                      <div className="absolute inset-x-0 top-0 h-[4%] pointer-events-none" style={{ background: "linear-gradient(to bottom, #ffffff, transparent)" }} aria-hidden />
                      <div className="absolute inset-x-0 bottom-0 h-[5%] pointer-events-none" style={{ background: "linear-gradient(to top, #ffffff, transparent)" }} aria-hidden />
                      <div className="absolute inset-y-0 left-0 w-[3%] pointer-events-none" style={{ background: "linear-gradient(to right, #ffffff, transparent)" }} aria-hidden />
                      <div className="absolute inset-y-0 right-0 w-[3%] pointer-events-none" style={{ background: "linear-gradient(to left, #ffffff, transparent)" }} aria-hidden />
                    </>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      {/* Dash indicators */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6 px-4">
        {slides.map((_, i) => {
          const active = i === current;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Bild ${i + 1} von ${slides.length}`}
              onClick={() => api?.scrollTo(i)}
              className="group py-2"
            >
              <span
                className="block h-px transition-all duration-500"
                style={{
                  width: active ? "32px" : "16px",
                  background: active ? D.gold : D.muted,
                  opacity: active ? 1 : 0.35,
                }}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// BEFORE / NOW — editorial split panel using real product photo
// ─────────────────────────────────────────────────────────────────
function BeforeNowSlide() {
  return (
    <div
      className="absolute inset-0 flex overflow-hidden"
      style={{ background: D.bg }}
    >
      {/* BEFORE — left half */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <img
          src={beforeCableImg}
          alt="Vorher – Smartphone, AirPods und Smartwatch mit mehreren Kabeln auf dem Tisch"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "grayscale(1) brightness(0.55) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.75) 100%)`,
          }}
          aria-hidden
        />
        {/* Label */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
          <div
            className="text-[9px] sm:text-[10px] md:text-[11px] uppercase font-light"
            style={{ color: D.muted, letterSpacing: "0.32em" }}
          >
            Vorher
          </div>
          <div
            className="mt-1 h-px w-8 sm:w-10"
            style={{ background: D.muted, opacity: 0.5 }}
          />
        </div>
        {/* Caption */}
        <div className="absolute bottom-4 left-4 right-2 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-10">
          <p
            className="text-[10px] sm:text-xs md:text-sm font-light leading-snug"
            style={{ color: D.beige, opacity: 0.85, letterSpacing: "0.04em" }}
          >
            Drei Kabel.<br />Drei Stecker.<br />Ein Durcheinander.
          </p>
        </div>
      </div>

      {/* NOW — right half */}
      <div className="relative w-1/2 h-full overflow-hidden" style={{ background: D.bg }}>
        <img
          src={nexusBedsideNight}
          alt="Nachher – RAJ NEXUS am Nachttisch"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Warm vignette + bottom fade for caption legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, transparent 40%, ${D.bg}cc 100%), linear-gradient(to top, ${D.bg}ee 0%, transparent 35%)`,
          }}
          aria-hidden
        />
        {/* Label */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10 text-right">
          <div
            className="text-[9px] sm:text-[10px] md:text-[11px] uppercase font-medium"
            style={{ color: D.gold, letterSpacing: "0.32em" }}
          >
            Jetzt
          </div>
          <div
            className="mt-1 h-px w-8 sm:w-10 ml-auto"
            style={{ background: D.gold }}
          />
        </div>
        {/* Caption */}
        <div className="absolute bottom-4 right-4 left-2 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-10 text-right">
          <p
            className="text-[10px] sm:text-xs md:text-sm font-light leading-snug"
            style={{ color: D.beige, letterSpacing: "0.04em" }}
          >
            Ein Objekt.<br />Drei Geräte.<br />Null Kabel.
          </p>
        </div>
      </div>

      {/* Center divider — gold hairline + medallion */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-20">
        <div
          className="h-full w-px"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${D.gold} 18%, ${D.gold} 82%, transparent 100%)`,
            opacity: 0.85,
          }}
        />
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: "clamp(36px, 6vw, 56px)",
            height: "clamp(36px, 6vw, 56px)",
            background: D.bg,
            border: `1px solid ${D.gold}`,
            boxShadow: `0 0 0 4px ${D.bg}, 0 8px 24px -6px ${D.gold}66`,
          }}
        >
          <span
            className="text-[9px] sm:text-[10px] md:text-[11px] font-light uppercase"
            style={{ color: D.gold, letterSpacing: "0.18em" }}
          >
            vs
          </span>
        </div>
      </div>
    </div>
  );
}

const LAUNCH_DATE = new Date("2026-06-16T20:00:00+02:00").getTime();
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
// BUY MODAL — centered overlay with email capture
// ─────────────────────────────────────────────────────────────────
const BuyModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [hp1, setHp1] = useState("");
  const [hp2, setHp2] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(10,10,10,0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="relative w-full rounded-2xl"
            style={{
              maxWidth: 420,
              background: D.surface,
              border: `1px solid ${D.gold}55`,
              padding: 32,
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
            }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Schliessen"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-100"
              style={{ color: D.muted, opacity: 0.8 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <div className="flex justify-center">
              <img src={logoTransparent} alt="RAJ" style={{ maxWidth: 60, height: "auto" }} />
            </div>

            {done ? (
              <div className="mt-6 flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `${D.gold}20`, border: `1px solid ${D.gold}` }}
                >
                  <Check className="w-5 h-5" style={{ color: D.gold }} />
                </div>
                <p className="text-base" style={{ color: D.beige, fontWeight: 300 }}>
                  Du wirst als Erster informiert.
                </p>
              </div>
            ) : (
              <>
                <h3
                  className="text-xl text-center"
                  style={{ color: D.beige, fontWeight: 300, marginTop: 20 }}
                >
                  Bald verfügbar.
                </h3>
                <p
                  className="text-[12px] text-center"
                  style={{ color: D.muted, marginTop: 8 }}
                >
                  Ab 16. Juni. Founder Edition. Nur 100 Stück.
                </p>

                <form onSubmit={submit} className="mt-6">
                  <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
                    <input value={hp1} onChange={(e) => setHp1(e.target.value)} tabIndex={-1} autoComplete="off" />
                    <input value={hp2} onChange={(e) => setHp2(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 rounded-full"
                    style={{ background: "#FFFFFF", border: `1px solid rgba(0,0,0,0.1)` }}
                  >
                    <Mail className="w-4 h-4 shrink-0" style={{ color: "#8a8278" }} />
                    <input
                      type="email"
                      required
                      autoFocus
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
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] transition-all hover:scale-[1.01] disabled:opacity-60"
                    style={{
                      background: `linear-gradient(180deg, ${D.gold}, #8a5a35)`,
                      color: "#1a1410",
                      boxShadow: `0 14px 34px -12px ${D.gold}80, inset 0 1px 0 rgba(255,255,255,0.28)`,
                    }}
                  >
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Benachrichtige mich <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] text-center mt-4"
                    style={{ color: D.mutedDim }}
                  >
                    Unverbindlich · Jederzeit abmeldbar
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
// SPLASH INTRO — black curtain split with logo flash (first visit only)
// ─────────────────────────────────────────────────────────────────
const SplashIntro = () => {
  const [phase, setPhase] = useState<"hidden" | "logo" | "split" | "done">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("raj_intro_played") === "1") return;
      sessionStorage.setItem("raj_intro_played", "1");
    } catch {
      /* ignore */
    }
    setPhase("logo");
    const t1 = setTimeout(() => setPhase("split"), 1100);
    const t2 = setTimeout(() => setPhase("done"), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden" || phase === "done") return null;

  const splitting = phase === "split";

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      {/* Top half */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          background: D.bg,
          transform: splitting ? "translateY(-100%)" : "translateY(0)",
          transitionDuration: "1100ms",
          borderBottom: splitting ? `1px solid ${D.gold}33` : "none",
        }}
      />
      {/* Bottom half */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          background: D.bg,
          transform: splitting ? "translateY(100%)" : "translateY(0)",
          transitionDuration: "1100ms",
        }}
      />
      {/* Hairline gold seam at split */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px transition-opacity"
        style={{
          background: `linear-gradient(to right, transparent, ${D.gold}, transparent)`,
          opacity: splitting ? 0 : 0.6,
          transform: "translateY(-0.5px)",
        }}
      />
      {/* Logo */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity"
        style={{
          opacity: splitting ? 0 : 1,
          transitionDuration: splitting ? "500ms" : "700ms",
        }}
      >
        <img
          src={logoTransparent}
          alt=""
          className="w-28 sm:w-36 md:w-44 h-auto select-none"
          style={{
            filter: `drop-shadow(0 0 22px ${D.gold}55) drop-shadow(0 6px 18px rgba(0,0,0,0.45))`,
            animation: "raj-logo-pulse 1100ms ease-out both",
          }}
          draggable={false}
        />
      </div>
      <style>{`
        @keyframes raj-logo-pulse {
          0% { opacity: 0; transform: scale(0.92); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
          55% { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};




// ─────────────────────────────────────────────────────────────────
// HERO PREMIUM CAROUSEL — auto-rotating editorial slideshow
// ─────────────────────────────────────────────────────────────────
const heroSleep1200 = new URL("../assets/hero-nexus/sleep-1200.webp", import.meta.url).href;
const heroSleep600 = new URL("../assets/hero-nexus/sleep-600.webp", import.meta.url).href;
const heroWork1200 = new URL("../assets/hero-nexus/work-1200.webp", import.meta.url).href;
const heroWork600 = new URL("../assets/hero-nexus/work-600.webp", import.meta.url).href;

const HERO_STILL_SLIDES = [
  {
    src: heroSleep1200,
    srcSm: heroSleep600,
    alt: "RAJ NEXUS auf dem Nachttisch – ruhiges Laden über Nacht.",
  },
  {
    src: nexusStoneHero1200,
    srcSm: nexusStoneHero600,
    alt: "RAJ NEXUS auf Stein – Premium Editorial.",
  },
  {
    src: heroWork1200,
    srcSm: heroWork600,
    alt: "RAJ NEXUS am Arbeitsplatz – Homeoffice Setup.",
  },
];

const HeroStillImage = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_STILL_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative mt-2 sm:mt-12 mx-auto w-full max-w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient gold halo */}
      <div
        className="absolute inset-0 rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${D.gold}, transparent 65%)` }}
        aria-hidden
      />

      {/* Frame */}
      <div
        className="relative w-full aspect-[5/4] overflow-hidden rounded-sm mx-auto"
        style={{
          boxShadow: "0 60px 140px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,118,0.15)",
          background: D.surface,
        }}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={index}
            src={HERO_STILL_SLIDES[index].src}
            srcSet={`${HERO_STILL_SLIDES[index].srcSm} 600w, ${HERO_STILL_SLIDES[index].src} 1200w`}
            sizes="(max-width: 768px) 100vw, 680px"
            alt={HERO_STILL_SLIDES[index].alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
            width={1200}
            height={960}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {HERO_STILL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Bild ${i + 1}`}
            className="h-px transition-all duration-700 ease-out"
            style={{
              width: i === index ? "48px" : "18px",
              background: i === index ? D.gold : "rgba(255,255,255,0.22)",
            }}
          />
        ))}
      </div>

    </div>
  );
};

const NexusPage = () => {
  const { t, lang, setLang } = useLanguage();

  // Live counts from DB
  const [popupTrigger, setPopupTrigger] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const openBuyModal = useCallback(() => setBuyModalOpen(true), []);
  const { quickBuy, isProcessing: buyProcessing } = useQuickBuy();
  const pinnedBuyLock = useRef(false);

  const handlePinnedBuy = useCallback((event?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (buyProcessing || pinnedBuyLock.current) return;
    pinnedBuyLock.current = true;

    void quickBuy().finally(() => {
      window.setTimeout(() => {
        pinnedBuyLock.current = false;
      }, 250);
    });
  }, [buyProcessing, quickBuy]);

  // Auto-open modal when arriving with ?buy=1 (e.g. from raj.ch hero CTA)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("buy") === "1") {
      setBuyModalOpen(true);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz</title>
        <meta name="description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Bis zu 25W, faltbar, CHF 99." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://raj.ch/nexus" />
        <meta property="og:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz" />
        <meta property="og:description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Bis zu 25W, faltbar, CHF 99." />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="RAJ" />
        <meta property="og:url" content="https://raj.ch/nexus" />
        <meta property="og:image" content="https://raj.ch/og-image.webp" />
        <meta property="og:locale" content="de_CH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@raj_swiss_" />
        <meta name="twitter:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz" />
        <meta name="twitter:description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Bis zu 25W, faltbar, CHF 99." />
        <meta name="twitter:image" content="https://raj.ch/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify(PRODUCT_NEXUS_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd([
          { name: "Home", url: "https://raj.ch/" },
          { name: "RAJ NEXUS", url: "https://raj.ch/nexus" },
        ]))}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_NEXUS_JSON_LD)}</script>
      </Helmet>

      <SplashIntro />

      


      {/* ===== STICKY MOBILE BOTTOM BAR ===== */}
      {!heroSubmitted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[70] backdrop-blur-md"
          style={{ background: "rgba(10,10,10,0.95)", borderTop: `1px solid ${D.gold}40`, pointerEvents: "auto", transform: "translateZ(0)" }}
        >
          <div className="px-3 py-2.5 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider leading-tight" style={{ color: D.gold }}>
                Edition 01 · Limitiert
              </p>
              <p className="text-[11px] leading-tight" style={{ color: D.beige }}>
                CHF 99.–
              </p>
            </div>
            <button
              type="button"
              onClick={handlePinnedBuy}
              onTouchEnd={handlePinnedBuy}
              disabled={buyProcessing}
              className="shrink-0 px-4 py-2.5 rounded-full font-bold text-[12px] uppercase tracking-wider active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${D.gold}, #c8946b)`,
                color: D.bg,
                boxShadow: `0 8px 24px -8px ${D.gold}`,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Kaufen <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO — DARK · Editorial + Conversion Card                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Header />
      <section
        id="mockup-signup"
        className="relative overflow-hidden pt-10 sm:pt-12 md:pt-24 md:min-h-screen md:flex md:flex-col md:justify-center"
        style={{ background: D.bg, color: D.beige }}
      >
        {/* Vignette bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${D.bg})` }}
          aria-hidden
        />

        {/* Hero — Window Crop atmosphere band + product carousel */}
        <div className="relative">
          {/* Title */}
          <div className="relative z-10 flex flex-col items-center justify-center px-5 pt-4 sm:pt-6 pb-3 sm:pb-4 md:hidden">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
              <span className="w-6 h-px" style={{ background: D.gold }} />
              <span className="text-[10px] uppercase font-semibold" style={{ color: D.gold, letterSpacing: "0.32em" }}>
                Founder Edition — Nur 100 Stück
              </span>
              <span className="w-6 h-px" style={{ background: D.gold }} />
            </div>
            <div className="text-center">
              <div
                className="text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-[-0.02em] whitespace-nowrap"
                style={{ fontWeight: 100 }}
              >
                <span style={{ color: D.beige }}>RAJ</span>{" "}
                <span style={{ WebkitTextStroke: "1.5px #C9A876", color: "transparent" }}>NEXUS</span>
              </div>
            </div>
            <p className="mt-4 text-base sm:text-lg" style={{ color: D.muted, fontWeight: 300 }}>
              iPhone, Watch & AirPods. Geladen an einem Ort.
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs" style={{ color: D.mutedDim }}>
              <li><span style={{ color: D.gold }}>✦</span> Qi 2.2, 25 Watt</li>
              <li><span style={{ color: D.gold }}>✦</span> Kompakt faltbar</li>
              <li><span style={{ color: D.gold }}>✦</span> 3 Jahre Garantie</li>
            </ul>
          </div>

          {/* Lower content */}
          <div className="relative px-5 sm:px-10 md:px-12 lg:px-16 pb-8 sm:pb-12 md:pb-20 max-w-[1440px] mx-auto">
            <div className="md:grid md:grid-cols-[1.05fr_1.25fr] md:gap-12 lg:gap-20 md:items-center text-center md:text-left max-w-2xl md:max-w-none mx-auto">

              {/* LEFT — Text + CTA (desktop only split) */}
              <div className="hidden md:flex flex-col justify-center order-1">

                <div className="flex items-center gap-3 mb-7">
                  <span className="w-8 h-px" style={{ background: D.gold }} />
                  <span className="text-[10px] uppercase font-semibold" style={{ color: D.gold, letterSpacing: "0.32em" }}>
                    Founder Edition — Nur 100 Stück
                  </span>
                </div>

                <div
                  className="text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-[-0.02em] whitespace-nowrap"
                  style={{ fontWeight: 100 }}
                >
                  <span style={{ color: D.beige }}>RAJ</span>{" "}
                  <span style={{ WebkitTextStroke: "1.5px #C9A876", color: "transparent" }}>NEXUS</span>
                </div>

                <p className="mt-6 text-xl lg:text-2xl leading-snug" style={{ color: D.muted, fontWeight: 300 }}>
                  iPhone, Watch & AirPods.<br />Geladen an einem Ort.
                </p>

                {/* Premium specs row */}
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md border-y py-5" style={{ borderColor: `${D.gold}33` }}>
                  <div>
                    <div className="text-2xl lg:text-3xl" style={{ color: D.beige, fontWeight: 200 }}>25<span className="text-sm align-top ml-0.5" style={{ color: D.muted }}>W</span></div>
                    <div className="text-[10px] mt-1 uppercase" style={{ color: D.mutedDim, letterSpacing: "0.2em" }}>Qi 2.2</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl" style={{ color: D.beige, fontWeight: 200 }}>3<span className="text-sm align-top ml-0.5" style={{ color: D.muted }}>×</span></div>
                    <div className="text-[10px] mt-1 uppercase" style={{ color: D.mutedDim, letterSpacing: "0.2em" }}>Geräte</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl" style={{ color: D.beige, fontWeight: 200 }}>3<span className="text-sm align-top ml-0.5" style={{ color: D.muted }}>J</span></div>
                    <div className="text-[10px] mt-1 uppercase" style={{ color: D.mutedDim, letterSpacing: "0.2em" }}>Garantie</div>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mt-8 mb-6">
                  <span className="text-5xl lg:text-6xl" style={{ color: D.beige, fontWeight: 300 }}>CHF 99.–</span>
                  <span className="text-xl line-through" style={{ color: D.mutedDim, fontWeight: 300 }}>CHF 129.–</span>
                </div>

                <button
                  type="button"
                  onClick={quickBuy}
                  disabled={buyProcessing}
                  className="group w-fit inline-flex items-center justify-center gap-2 py-5 px-14 rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(160deg, #c8946b 0%, ${D.gold} 60%, #7a4e2a 100%)`,
                    color: "#0a0908",
                    letterSpacing: "0.2em",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    boxShadow: `0 20px 50px -10px rgba(201,168,118,0.6), 0 8px 20px -8px ${D.gold}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  }}
                >
                  Jetzt kaufen
                  <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ fontSize: "12px" }}>→</span>
                </button>
                <p className="mt-5 text-xs" style={{ color: D.muted, letterSpacing: "0.04em" }}>
                  Kostenloser Versand · 30 Tage Rückgabe · 3 Jahre Garantie
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-[11px]" style={{ color: D.muted }}>
                  <li><span style={{ color: D.gold }}>✦</span> Lebenslanger Early Access zu neuen RAJ Produkten</li>
                </ul>
              </div>

              {/* RIGHT — Carousel (always visible, full width on mobile) */}
              <div className="order-2">
                {/* Premium glow behind carousel on desktop */}
                <div className="relative">
                  <div
                    className="hidden md:block absolute -inset-8 lg:-inset-12 pointer-events-none rounded-[2rem]"
                    style={{
                      background: `radial-gradient(ellipse at center, ${D.gold}22 0%, transparent 65%)`,
                      filter: "blur(20px)",
                    }}
                    aria-hidden
                  />
                <div
                  className="relative -mx-5 sm:-mx-10 md:mx-0 mb-5 sm:mb-6 md:mb-0"
                  style={{
                    boxShadow: "var(--tw-shadow, none)",
                  }}
                >
                  <NexusCarousel />
                </div>
                </div>
              </div>{/* end RIGHT col */}


              {/* MOBILE ONLY — Price + CTA (hidden on desktop, desktop has it in left col) */}
              <div className="md:hidden order-3">
                {/* Price */}
                <div className="flex items-baseline justify-center gap-3 mb-4 sm:mb-5">
                  <span className="text-4xl sm:text-5xl" style={{ color: D.beige, fontWeight: 300 }}>
                    CHF 99.–
                  </span>
                  <span className="text-lg sm:text-xl line-through" style={{ color: D.mutedDim, fontWeight: 300 }}>
                    CHF 129.–
                  </span>
                </div>

                {/* CTA */}
                <div className="flex justify-center px-0">
                  <button
                    type="button"
                    onClick={quickBuy}
                    disabled={buyProcessing}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 py-5 px-12 sm:px-16 rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(160deg, #c8946b 0%, ${D.gold} 60%, #7a4e2a 100%)`,
                      color: "#0a0908",
                      letterSpacing: "0.2em",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      boxShadow: `0 20px 50px -10px rgba(201,168,118,0.6), 0 8px 20px -8px ${D.gold}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Jetzt kaufen
                    <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ fontSize: "12px" }}>→</span>
                  </button>
                </div>

                <p className="mt-4 text-[11px] sm:text-xs text-center" style={{ color: D.muted, letterSpacing: "0.04em" }}>
                  Kostenloser Versand · 30 Tage Rückgabe · 3 Jahre Garantie
                </p>

                <ul className="mt-6 flex flex-col items-center gap-2 text-[11px]" style={{ color: D.muted }}>
                  <li><span style={{ color: D.gold }}>✦</span> Lebenslanger Early Access zu neuen RAJ Produkten</li>
                </ul>
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
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-44 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Drei Geräte · Ein Ort
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
              Alles gleichzeitig laden.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-12 md:gap-16">
            {[
              { icon: Smartphone, label: "iPhone" },
              { icon: Watch, label: "Apple Watch" },
              { icon: Headphones, label: "AirPods" },
            ].map((d) => (
              <div key={d.label} className="text-center">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto rounded-full flex items-center justify-center mb-5"
                  style={{ background: "#FFFFFF", border: `1px solid ${L.border}` }}
                >
                  <d.icon className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" style={{ color: L.gold }} strokeWidth={1.2} />
                </div>
                <div className="text-sm sm:text-lg font-light tracking-tight">{d.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center mt-12 md:mt-16 text-3xl md:text-5xl leading-tight tracking-tight" style={{ color: L.text, fontWeight: 300 }}>
            Power. Always There.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. STORY — Premium Zickzack (gleich wie Shop)              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: D.bg, color: D.beige }} className="py-24 md:py-44 px-5">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-48">
          {[
            {
              img: nexusFeatures,
              srcSet: `${nexusFeatures1000} 1000w, ${nexusFeatures1200} 1200w, ${nexusFeatures} 1600w`,
              sizes: "(max-width: 768px) 100vw, 50vw",
              alt: "100% in 1.5 Stunden",
              eyebrow: "Für die, die keine Zeit haben",
              title: "Vollgeladen, bevor der Kaffee fertig ist.",
              copy: "90 Minuten  und dein iPhone ist bei 100 %. Während du duschst, frühstückst, deine Mails checkst. Nie wieder mit 23 % aus dem Haus rennen.",
            },
            {
              img: nexusFolds,
              alt: "Faltbar wie eine Brieftasche",
              eyebrow: "Für die Vielreisenden",
              title: "Faltet sich wie eine Brieftasche.",
              copy: "Hotelzimmer in Mailand. Lounge in Zürich. Airbnb in Lissabon. Eine Bewegung — aufgeklappt. Dein iPhone, deine Watch, deine AirPods. Alle gleichzeitig laden.",
            },
            {
              img: nexusDesk,
              srcSet: `${nexusDesk680} 680w, ${nexusDesk1200} 1200w, ${nexusDesk} 1600w`,
              sizes: "(max-width: 768px) 100vw, 50vw",
              alt: "Aufgeräumter Schreibtisch",
              eyebrow: "Für die, die Ordnung lieben",
              title: "Drei Kabel weg. Ein Objekt da.",
              copy: "Kein Kabelsalat mehr hinter dem Monitor. Kein Suchen nach dem Ladekabel um Mitternacht. Einfach hinlegen. Fertig.",
            },

            {
              img: nexusWindow,
              alt: "Material Detail im Licht",
              eyebrow: "Für die, die Qualität spüren",
              title: "Aluminium. Mattes Finish. Gewicht in der Hand.",
              copy: "CNC-gefräst aus einem Block. Mattes Finish, das Fingerabdrücke ignoriert. Manche Dinge erklären sich von selbst.",
            },
          ].map((s: any, i) => {
            if (s.imageOnly) {
              const imgRight = i % 2 === 1;
              return (
                <div key={i} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <motion.img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`rounded-2xl w-full aspect-square object-cover object-center ${
                      imgRight ? "md:order-2" : ""
                    }`}
                    style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)" }}
                  />
                  <div className={imgRight ? "md:order-1" : ""} aria-hidden />
                </div>
              );
            }
            const imageRight = i % 2 === 1;
            return (
              <div key={i} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <motion.img
                  src={s.img}
                  srcSet={s.srcSet}
                  sizes={s.sizes}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-2xl w-full aspect-square object-cover object-center ${
                    imageRight ? "md:order-2" : ""
                  }`}
                  style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)" }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={imageRight ? "md:order-1" : ""}
                >
                  <span className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: D.gold }}>
                    {s.eyebrow}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15] mt-5" style={{ color: D.beige }}>
                    {s.title}
                  </h2>
                  <div className="mt-6 h-px w-12" style={{ background: D.gold, opacity: 0.6 }} />
                  <p className="mt-6 font-light leading-relaxed text-lg max-w-md" style={{ color: D.muted }}>
                    {s.copy}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. SPECS — LIGHT · Material, Maß, Wahrheit                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-44 px-5">
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
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
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
                  ["Garantie", "3 Jahre Garantie"],
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
            <p className="text-xl md:text-2xl tracking-tight" style={{ fontWeight: 300, color: L.text }}>
              Präzise. Zuverlässig. Durchdacht.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. DETAILS / FAQ — LIGHT · Ganze Sektion                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg, color: L.text }}>
        <ProductDetailsAccordion />
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6b. FAQ — LIGHT · SEO-rich rich-result block                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        className="py-20 md:py-28 px-5"
        style={{ background: L.bg, color: L.text, borderTop: `1px solid ${L.border}` }}
        aria-labelledby="nexus-faq-heading"
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[10px] uppercase mb-4"
            style={{ color: L.gold, letterSpacing: "0.32em" }}
          >
            Häufige Fragen
          </p>
          <h2
            id="nexus-faq-heading"
            className="text-3xl md:text-4xl tracking-tight leading-tight mb-10"
            style={{ color: L.text, fontWeight: 300 }}
          >
            Alles zum RAJ NEXUS — auf einen Blick.
          </h2>

          <dl className="space-y-8">
            {FAQ_NEXUS_JSON_LD.mainEntity.map((item: any) => (
              <div
                key={item.name}
                className="pb-8"
                style={{ borderBottom: `1px solid ${L.border}` }}
              >
                <dt
                  className="text-base md:text-lg mb-3"
                  style={{ color: L.text, fontWeight: 500 }}
                >
                  {item.name}
                </dt>
                <dd
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: L.textMuted, fontWeight: 300 }}
                >
                  {item.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. FINAL CTA — DARK · Begehren in Aktion                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-36 px-5"
        style={{ background: D.bg, color: D.beige }}
      >
        <div className="relative max-w-2xl mx-auto text-center">
          <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
            — Founder Edition · Limitiert auf 100
          </span>
          <h2 className="text-4xl md:text-6xl mt-6 leading-[1.05] tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
            Bereit?
          </h2>
          <p className="text-base md:text-lg mt-6 mb-10" style={{ color: D.muted, fontWeight: 300 }}>
            CHF 99.– statt CHF 129.–
          </p>

          <button
            type="button"
            onClick={quickBuy} disabled={buyProcessing}
            className="inline-block px-10 py-4 rounded-full font-bold text-[13px] uppercase tracking-[0.22em] active:scale-[0.98] transition-all"
            style={{
              background: `linear-gradient(135deg, ${D.gold}, #c8946b)`,
              color: D.bg,
              boxShadow: `0 16px 40px -12px ${D.gold}`,
            }}
          >
            Jetzt kaufen
          </button>

          <p className="mt-6 text-[11px] sm:text-xs" style={{ color: D.muted, letterSpacing: "0.04em" }}>
            Kostenloser Versand · 30 Tage Rückgabe · 3 Jahre Garantie
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: D.bg, borderTop: `1px solid ${D.border}` }} className="py-10 px-5 text-center">
        <a href="https://raj.ch" aria-label="RAJ — Home" className="inline-flex items-center justify-center">
          <img src={logoTransparent} alt="RAJ" width={180} height={56} loading="lazy" decoding="async" className="h-12 w-auto" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.42))" }} />
        </a>
        <p className="text-[10px] uppercase mt-4" style={{ color: D.gold, letterSpacing: "0.28em" }}>
          Power. Always There.
        </p>
        <p className="text-[10px] mt-3" style={{ color: D.mutedDim }}>
          © {new Date().getFullYear()} RAJ GmbH
        </p>
      </footer>

      {/* Mobile spacer — damit Sticky Bar Footer nicht überdeckt */}
      <div className="h-16" aria-hidden style={{ background: D.bg }} />

      <BuyModal open={buyModalOpen} onClose={() => setBuyModalOpen(false)} />
    </>
  );
};

export default NexusPage;

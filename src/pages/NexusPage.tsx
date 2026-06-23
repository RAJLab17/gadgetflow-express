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
import { useViewContent } from "@/hooks/useViewContent";
import { useQuickBuy } from "@/hooks/useQuickBuy";
import ProductDetailsAccordion from "@/components/ProductDetailsAccordion";
import { CartDrawer } from "@/components/CartDrawer";
import Header from "@/components/Header";
import { PRODUCT_NEXUS_JSON_LD, breadcrumbJsonLd, FAQ_NEXUS_JSON_LD } from "@/lib/schemas";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import nexusFolds from "@/assets/products/nexus-real-folds-text-800.webp";
import nexusDesk from "@/assets/products/nexus-office-skyline.webp";
import nexusDesk680 from "@/assets/products/nexus-office-skyline-680w.webp";
import nexusDesk1200 from "@/assets/products/nexus-office-skyline-1200w.webp";
import nexusTopview from "@/assets/products/nexus-real-topview-qi2.jpg";
import nexusFeatures from "@/assets/products/nexus-desk-writing.webp";
import nexusFeatures1000 from "@/assets/products/nexus-desk-writing-1000w.webp";
import nexusFeatures1200 from "@/assets/products/nexus-desk-writing-1200w.webp";
import nexusWindow from "@/assets/products/nexus-sidetable-enjoy.webp";
const carousel1 = "/assets/products/nexus-real-hero-floating-white.webp";
import carousel2 from "@/assets/products/nexus-real-topview-qi2-white.webp";
import carousel3 from "@/assets/products/nexus-real-folds-white.webp";
import carousel5Asset from "@/assets/products/nexus-carousel4-lifestyle.webp.asset.json";
import beforeCableImg from "@/assets/products/nexus-before-cable-chaos.jpg";
import nexusBedsideNight from "@/assets/products/nexus-bedside-night.webp";
import nexusHero800 from "@/assets/products/nexus-hero-charging-800w.webp";
import nexusHero1200 from "@/assets/products/nexus-hero-charging-1200w.webp";

const carousel5 = carousel5Asset.url;
const nexusStoneHero600 = "/assets/hero/nexus-hero-600.webp";
const nexusStoneHero1200 = "/assets/hero/nexus-hero-1200.webp";
import logoTransparent from "@/assets/logo-transparent.webp";
import payVisa from "@/assets/payments/visa.webp";
import payMastercard from "@/assets/payments/mastercard.png";
import payAmex from "@/assets/payments/amex.png";
import payApplePay from "@/assets/payments/apple-pay.png";
import payGooglePay from "@/assets/payments/google-pay.png";
import payKlarna from "@/assets/payments/klarna.png";
import payTwint from "@/assets/payments/twint.png";

// ─── HERO FOTO ────────────────────────────────────────────────────
const nexusHeroImg = nexusHero1200;
const nexusHeroImgSm = nexusHero800;
// ─────────────────────────────────────────────────────────────────

const heroDesire = new URL("../assets/hero-carousel/slide-5-desire.webp", import.meta.url).href;
const heroDesireSm = new URL("../assets/hero-carousel/slide-5-desire-480.webp", import.meta.url).href;

const HERO_SLIDES = [
  { src: heroDesire, srcSm: heroDesireSm, eyebrow: "Form", caption: "Objekt, nicht Gerät." },
] as const;

const D = {
  bg: "#0A0A0A", surface: "#141312", surfaceHi: "#1C1A18",
  beige: "#E8DCC4", muted: "#A89B82", mutedDim: "#6E665A",
  gold: "#C9A876", border: "#26221E",
};
const L = {
  bg: "#FAF8F5", surface: "#FFFFFF", text: "#1A1A1A",
  textMuted: "#6B6358", textDim: "#9A9285", gold: "#9b6b3f", border: "#E8E2D6",
};

// ─── Hero Icons ───────────────────────────────────────────────────
const IconPhone = () => (
  <svg width="11" height="17" viewBox="0 0 12 18" fill="none">
    <rect x=".7" y=".7" width="10.6" height="16.6" rx="2.4" stroke={D.gold} strokeWidth="1.1" />
    <rect x="4" y="2.4" width="4" height="1" rx=".5" fill={D.gold} />
  </svg>
);
const IconWatch = () => (
  <svg width="13" height="15" viewBox="0 0 14 16" fill="none">
    <rect x="3" y="3.6" width="8" height="8.8" rx="2.4" stroke={D.gold} strokeWidth="1.1" />
    <path d="M5 3.6 5.4 1.4h3.2L9 3.6M5 12.4l.4 2.2h3.2l.4-2.2" stroke={D.gold} strokeWidth="1.1" />
  </svg>
);
const IconPods = () => (
  <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
    <rect x="1.2" y="3" width="5" height="6" rx="2.3" stroke={D.gold} strokeWidth="1.1" />
    <rect x="9.8" y="3" width="5" height="6" rx="2.3" stroke={D.gold} strokeWidth="1.1" />
  </svg>
);

interface ChargeChipProps {
  label: string;
  icon: React.ReactNode;
  startVal: number;
  phase: number;
  floatAnim: string;
  style: React.CSSProperties;
}

const ChargeChip = ({ label, icon, startVal, phase, floatAnim, style }: ChargeChipProps) => {
  const [val, setVal] = useState(startVal);
  useEffect(() => {
    const delay = phase * 3000;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setVal((v) => {
          if (v >= 100) { clearInterval(interval); return v; }
          return Math.min(100, v + Math.floor(Math.random() * 2 + 1));
        });
      }, 5000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [phase]);
  return (
    <div style={{ position: "absolute", padding: "12px 15px", borderRadius: 15, background: "rgba(18,17,16,.82)", backdropFilter: "blur(14px)", border: "1px solid rgba(201,168,118,.26)", boxShadow: "0 18px 44px rgba(0,0,0,.55)", minWidth: 148, animation: `${floatAnim} ease-in-out infinite`, zIndex: 5, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(201,168,118,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        <span style={{ fontSize: 11.5, color: D.beige, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: 25, fontWeight: 300, fontVariantNumeric: "tabular-nums", color: D.beige }}>{val}</span>
        <span style={{ fontSize: 13, color: D.mutedDim }}>%</span>
      </div>
      <div style={{ marginTop: 8, height: 2, borderRadius: 2, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${val}%`, borderRadius: 2, background: `linear-gradient(90deg, #7a4e2a, ${D.gold})`, transition: "width 1s ease" }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// PRODUCT CAROUSEL — unverändert
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
    return () => { api.off("select", onSelect); api.off("reInit", onSelect); };
  }, [api]);
  return (
    <>
      <Carousel setApi={setApi} opts={{ loop: true, align: "center" }} plugins={[Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]} className="w-full">
        <CarouselContent className="-ml-0">
          {slides.map((img, i) => {
            const isComponent = "type" in img && img.type === "before-now";
            const bg = isComponent ? D.bg : "#ffffff";
            return (
              <CarouselItem key={i} className="pl-0 basis-full">
                <div className="relative w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden" style={{ background: bg }}>
                  {isComponent ? <BeforeNowSlide /> : (
                    <>
                      <img src={(img as { src: string }).src} alt={img.alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" className={`absolute inset-0 w-full h-full object-contain ${i === 0 ? "scale-[2.05]" : i === 2 ? "scale-[1.42]" : ""} ${i === 4 ? "object-cover" : ""}`} />
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
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10 px-4">
        {slides.map((_, i) => {
          const active = i === current;
          return (
            <button key={i} type="button" aria-label={`Bild ${i + 1} von ${slides.length}`} onClick={() => api?.scrollTo(i)} className="group py-2">
              <span className="block h-px transition-all duration-500" style={{ width: active ? "32px" : "16px", background: active ? D.gold : D.muted, opacity: active ? 1 : 0.35 }} />
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// BEFORE / NOW — unverändert
// ─────────────────────────────────────────────────────────────────
function BeforeNowSlide() {
  return (
    <div className="absolute inset-0 flex overflow-hidden" style={{ background: D.bg }}>
      <div className="relative w-1/2 h-full overflow-hidden">
        <img src={beforeCableImg} alt="Vorher – Kabeldurcheinander" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(1) brightness(0.55) contrast(1.05)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.75) 100%)` }} aria-hidden />
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
          <div className="text-[9px] sm:text-[10px] md:text-[11px] uppercase font-light" style={{ color: D.muted, letterSpacing: "0.32em" }}>Vorher</div>
          <div className="mt-1 h-px w-8 sm:w-10" style={{ background: D.muted, opacity: 0.5 }} />
        </div>
        <div className="absolute bottom-4 left-4 right-2 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-10">
          <p className="text-[10px] sm:text-xs md:text-sm font-light leading-snug" style={{ color: D.beige, opacity: 0.85, letterSpacing: "0.04em" }}>Drei Kabel.<br />Drei Stecker.<br />Ein Durcheinander.</p>
        </div>
      </div>
      <div className="relative w-1/2 h-full overflow-hidden" style={{ background: D.bg }}>
        <img src={nexusBedsideNight} alt="Nachher – RAJ NEXUS am Nachttisch" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 70% 50%, transparent 40%, ${D.bg}cc 100%), linear-gradient(to top, ${D.bg}ee 0%, transparent 35%)` }} aria-hidden />
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10 text-right">
          <div className="text-[9px] sm:text-[10px] md:text-[11px] uppercase font-medium" style={{ color: D.gold, letterSpacing: "0.32em" }}>Jetzt</div>
          <div className="mt-1 h-px w-8 sm:w-10 ml-auto" style={{ background: D.gold }} />
        </div>
        <div className="absolute bottom-4 right-4 left-2 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-10 text-right">
          <p className="text-[10px] sm:text-xs md:text-sm font-light leading-snug" style={{ color: D.beige, letterSpacing: "0.04em" }}>Ein Objekt.<br />Drei Geräte.<br />Kein Chaos.</p>
        </div>
      </div>
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-20">
        <div className="h-full w-px" style={{ background: `linear-gradient(to bottom, transparent 0%, ${D.gold} 18%, ${D.gold} 82%, transparent 100%)`, opacity: 0.85 }} />
        <div className="absolute flex items-center justify-center rounded-full" style={{ width: "clamp(36px, 6vw, 56px)", height: "clamp(36px, 6vw, 56px)", background: D.bg, border: `1px solid ${D.gold}`, boxShadow: `0 0 0 4px ${D.bg}, 0 8px 24px -6px ${D.gold}66` }}>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-light uppercase" style={{ color: D.gold, letterSpacing: "0.18em" }}>vs</span>
        </div>
      </div>
    </div>
  );
}

const LAUNCH_DATE = new Date("2026-06-16T20:00:00+02:00").getTime();
const getSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

// ─────────────────────────────────────────────────────────────────
// COUNTDOWN — unverändert
// ─────────────────────────────────────────────────────────────────
const Countdown = ({ dark = true }: { dark?: boolean }) => {
  const { t } = useLanguage();
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [{ v: time.d, l: t("countdown.days") }, { v: time.h, l: t("countdown.hours") }, { v: time.m, l: t("countdown.minutes") }, { v: time.s, l: t("countdown.seconds") }];
  const numColor = dark ? D.beige : L.text;
  const labelColor = dark ? D.gold : L.gold;
  return (
    <div className="flex justify-center gap-5 sm:gap-7">
      {units.map((u) => (
        <div key={u.l} className="flex flex-col items-center min-w-[44px]">
          <span className="text-3xl sm:text-4xl md:text-5xl tabular-nums leading-none tracking-tight" style={{ color: numColor, fontWeight: 300, fontVariantNumeric: "tabular-nums" }}>{String(u.v).padStart(2, "0")}</span>
          <span className="text-[9px] sm:text-[10px] uppercase mt-2 font-medium" style={{ color: labelColor, letterSpacing: "0.28em" }}>{u.l}</span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// SIGNUP — unverändert
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
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", { body: { email: email.trim() } });
      if (error) throw error;
      if (data?.success) { setDone(true); trackMetaEvent("Lead", { email: email.trim() }); onSuccess?.(); }
    } catch (err) { console.error(err); } finally { setBusy(false); }
  };
  if (done) {
    return (
      <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-full" style={{ background: dark ? "rgba(201,168,118,0.12)" : "rgba(155,107,63,0.08)", border: `1px solid ${dark ? D.gold : L.gold}`, color: dark ? D.beige : L.text }}>
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
      <div className="flex items-baseline justify-center gap-3 mb-5">
        <span className="text-4xl sm:text-5xl tracking-tight" style={{ color: dark ? D.beige : L.text, fontWeight: 300 }}>CHF 99<span style={{ fontSize: "0.6em" }}>.-</span></span>
        <span className="text-lg line-through" style={{ color: dark ? D.mutedDim : L.textDim, fontWeight: 300 }}>CHF 129.-</span>
        <span className="text-[10px] uppercase" style={{ color: dark ? D.mutedDim : L.textDim, letterSpacing: "0.2em" }}>inkl. MwSt</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-4 rounded-full" style={{ background: "#FFFFFF", border: `1px solid ${dark ? "rgba(0,0,0,0.1)" : L.border}` }}>
          <Mail className="w-4 h-4 shrink-0" style={{ color: "#8a8278" }} />
          <input id="mockup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.ch" className="flex-1 bg-transparent outline-none px-1 py-3 text-sm" style={{ color: "#1a1714" }} />
        </div>
        <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] transition-all hover:scale-[1.01] disabled:opacity-60" style={{ background: `linear-gradient(180deg, ${D.gold}, #8a5a35)`, color: "#1a1410", boxShadow: `0 14px 34px -12px ${D.gold}80, inset 0 1px 0 rgba(255,255,255,0.28)` }}>
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Jetzt Platz sichern <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-center mt-4" style={{ color: dark ? D.mutedDim : L.textDim }}>Unverbindlich · Jederzeit abmeldbar</p>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────────
// BUY MODAL — unverändert
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
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (hp1 || hp2) { setDone(true); return; }
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", { body: { email: email.trim() } });
      if (error) throw error;
      if (data?.success) { setDone(true); trackMetaEvent("Lead", { email: email.trim() }); }
    } catch (err) { console.error(err); } finally { setBusy(false); }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(10,10,10,0.85)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} aria-modal="true" role="dialog">
          <motion.div className="relative w-full rounded-2xl" style={{ maxWidth: 420, background: D.surface, border: `1px solid ${D.gold}55`, padding: 32, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)" }} initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Schliessen" onClick={onClose} className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-100" style={{ color: D.muted, opacity: 0.8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1l12 12M13 1L1 13" /></svg>
            </button>
            <div className="flex justify-center"><img src={logoTransparent} alt="RAJ" style={{ maxWidth: 60, height: "auto" }} /></div>
            {done ? (
              <div className="mt-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: `${D.gold}20`, border: `1px solid ${D.gold}` }}><Check className="w-5 h-5" style={{ color: D.gold }} /></div>
                <p className="text-base" style={{ color: D.beige, fontWeight: 300 }}>Du wirst als Erster informiert.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl text-center" style={{ color: D.beige, fontWeight: 300, marginTop: 20 }}>Bald verfügbar.</h3>
                <p className="text-[12px] text-center" style={{ color: D.muted, marginTop: 8 }}>Ab 16. Juni. Founder Edition. Nur 100 Stück.</p>
                <form onSubmit={submit} className="mt-6">
                  <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
                    <input value={hp1} onChange={(e) => setHp1(e.target.value)} tabIndex={-1} autoComplete="off" />
                    <input value={hp2} onChange={(e) => setHp2(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="flex items-center gap-2 px-4 rounded-full" style={{ background: "#FFFFFF", border: `1px solid rgba(0,0,0,0.1)` }}>
                    <Mail className="w-4 h-4 shrink-0" style={{ color: "#8a8278" }} />
                    <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.ch" className="flex-1 bg-transparent outline-none px-1 py-3 text-sm" style={{ color: "#1a1714" }} />
                  </div>
                  <button type="submit" disabled={busy} className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] transition-all hover:scale-[1.01] disabled:opacity-60" style={{ background: `linear-gradient(180deg, ${D.gold}, #8a5a35)`, color: "#1a1410", boxShadow: `0 14px 34px -12px ${D.gold}80, inset 0 1px 0 rgba(255,255,255,0.28)` }}>
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Benachrichtige mich <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-center mt-4" style={{ color: D.mutedDim }}>Unverbindlich · Jederzeit abmeldbar</p>
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
// SOCIAL PROOF POPUP — unverändert
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
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md" style={{ background: "rgba(20,19,18,0.92)", border: `1px solid ${D.gold}40`, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)" }}>
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
// SPLASH INTRO — unverändert
// ─────────────────────────────────────────────────────────────────
const SplashIntro = () => {
  const [phase, setPhase] = useState<"hidden" | "logo" | "split" | "done">("hidden");
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("raj_intro_played") === "1") return;
      sessionStorage.setItem("raj_intro_played", "1");
    } catch { /* ignore */ }
    setPhase("logo");
    const t1 = setTimeout(() => setPhase("split"), 1100);
    const t2 = setTimeout(() => setPhase("done"), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (phase === "hidden" || phase === "done") return null;
  const splitting = phase === "split";
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-1/2 transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]" style={{ background: D.bg, transform: splitting ? "translateY(-100%)" : "translateY(0)", transitionDuration: "1100ms", borderBottom: splitting ? `1px solid ${D.gold}33` : "none" }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]" style={{ background: D.bg, transform: splitting ? "translateY(100%)" : "translateY(0)", transitionDuration: "1100ms" }} />
      <div className="absolute left-0 right-0 top-1/2 h-px transition-opacity" style={{ background: `linear-gradient(to right, transparent, ${D.gold}, transparent)`, opacity: splitting ? 0 : 0.6, transform: "translateY(-0.5px)" }} />
      <div className="absolute inset-0 flex items-center justify-center transition-opacity" style={{ opacity: splitting ? 0 : 1, transitionDuration: splitting ? "500ms" : "700ms" }}>
        <img src={logoTransparent} alt="" className="w-28 sm:w-36 md:w-44 h-auto select-none" style={{ filter: `drop-shadow(0 0 22px ${D.gold}55) drop-shadow(0 6px 18px rgba(0,0,0,0.45))`, animation: "raj-logo-pulse 1100ms ease-out both" }} draggable={false} />
      </div>
      <style>{`
        @keyframes raj-logo-pulse {
          0% { opacity: 0; transform: scale(0.92); }
          55% { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
const NexusPage = () => {
  const { t, lang, setLang } = useLanguage();
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
    quickBuy();
  }, [buyProcessing, quickBuy]);

  useViewContent({ content_name: "RAJ NEXUS", content_ids: ["RAJ-NEXUS-001"], content_type: "product", content_category: "Wireless Charger", value: 99, currency: "CHF" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("buy") === "1") setBuyModalOpen(true);
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd([{ name: "Home", url: "https://raj.ch/" }, { name: "RAJ NEXUS", url: "https://raj.ch/nexus" }]))}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_NEXUS_JSON_LD)}</script>
        <style>{`
          @keyframes raj-ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(2.6); opacity: 0; } }
          @keyframes raj-breathe { 0%, 100% { opacity: .35; transform: translate(-50%,-50%) scale(1); } 50% { opacity: .75; transform: translate(-50%,-50%) scale(1.1); } }
          @keyframes raj-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes raj-float2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(11px); } }
          @keyframes raj-glow { 0%, 100% { box-shadow: 0 16px 48px -12px rgba(201,168,118,.45), inset 0 1px 0 rgba(255,255,255,.28); } 50% { box-shadow: 0 20px 64px -8px rgba(201,168,118,.72), inset 0 1px 0 rgba(255,255,255,.28); } }
        `}</style>
      </Helmet>

      <SplashIntro />

      {/* STICKY MOBILE BOTTOM BAR — unverändert */}
      {!heroSubmitted && (
        <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md" style={{ background: "rgba(10,10,10,0.95)", borderTop: `1px solid ${D.gold}40`, pointerEvents: "auto", transform: "translateZ(0)" }}>
          <div className="px-3 py-2.5 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider leading-tight" style={{ color: D.gold }}>Edition 01 · Limitiert</p>
              <p className="text-[11px] leading-tight" style={{ color: D.beige }}>CHF 99.-</p>
            </div>
            <button type="button" onClick={handlePinnedBuy} onTouchEnd={handlePinnedBuy} disabled={buyProcessing} className="shrink-0 px-4 py-2.5 rounded-full font-bold text-[12px] uppercase tracking-wider active:scale-[0.98] transition-all inline-flex items-center gap-1.5" style={{ background: `linear-gradient(135deg, ${D.gold}, #c8946b)`, color: D.bg, boxShadow: `0 8px 24px -8px ${D.gold}`, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
              Kaufen <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══ 1. HERO — NEU ═══ */}
      <Header />
      <section
        id="mockup-signup"
        className="relative overflow-hidden md:min-h-screen md:flex md:flex-col md:justify-center"
        style={{ background: D.bg, color: D.beige, paddingTop: "clamp(84px, 10vw, 116px)" }}
      >
        <div style={{ position: "absolute", top: "-15vh", right: "-6vw", width: "62vw", height: "84vh", background: "radial-gradient(45% 45% at 60% 40%, rgba(201,168,118,.12), transparent 70%)", filter: "blur(32px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 140, background: `linear-gradient(to bottom, transparent, ${D.bg})`, pointerEvents: "none", zIndex: 3 }} />

        {/* DESKTOP */}
        <div className="hidden md:grid relative px-12 lg:px-16 pb-16 max-w-[1440px] mx-auto w-full" style={{ zIndex: 2, gridTemplateColumns: "1fr 1.18fr", gap: "clamp(32px,4.5vw,72px)", alignItems: "center" }}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 11, width: "fit-content", padding: "8px 16px 8px 13px", borderRadius: 100, border: "1px solid rgba(201,168,118,.28)", background: "rgba(201,168,118,.06)", marginBottom: 30 }}>
              <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: D.gold, animation: "raj-ping 2.2s ease-out infinite" }} />
                <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: D.gold }} />
              </span>
              <span style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: D.gold, letterSpacing: ".24em" }}>Founder Edition — noch 37 von 100</span>
            </div>
            <div style={{ fontSize: "clamp(44px,7vw,104px)", lineHeight: .95, letterSpacing: "-.02em", fontWeight: 100, whiteSpace: "nowrap" }}>
              <span style={{ color: D.beige }}>RAJ</span>{" "}
              <span style={{ WebkitTextStroke: `1.5px ${D.gold}`, color: "transparent" }}>NEXUS</span>
            </div>
            <p style={{ marginTop: 22, fontSize: "clamp(17px,1.8vw,24px)", lineHeight: 1.3, color: D.muted, fontWeight: 300 }}>iPhone, Watch &amp; AirPods.<br />Geladen an einem Ort.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 24 }}>
              {["Qi2.2 · 25 W", "Swiss Brand", "3 Jahre Garantie"].map((b) => (
                <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 100, border: "1px solid rgba(201,168,118,.18)", background: "rgba(255,255,255,.02)", fontSize: 12, color: D.beige }}>
                  <span style={{ color: D.gold }}>✓</span> {b}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 32, marginBottom: 20 }}>
              <span style={{ fontSize: "clamp(38px,4.8vw,58px)", color: D.beige, fontWeight: 300 }}>CHF 99.-</span>
              <span style={{ fontSize: "clamp(15px,1.5vw,19px)", textDecoration: "line-through", color: D.mutedDim, fontWeight: 300 }}>CHF 129.-</span>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", color: D.gold, fontWeight: 600, padding: "5px 11px", borderRadius: 100, background: "rgba(201,168,118,.1)" }}>-30.-</span>
            </div>
            <button type="button" onClick={quickBuy} disabled={buyProcessing} className="group w-fit inline-flex items-center justify-center gap-2 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60" style={{ padding: "19px 54px", borderRadius: 100, background: `linear-gradient(160deg, #c8946b 0%, ${D.gold} 60%, #7a4e2a 100%)`, color: "#0a0908", letterSpacing: ".2em", fontSize: 11, fontWeight: 700, textTransform: "uppercase", animation: "raj-glow 3.4s ease-in-out infinite" }}>
              Jetzt kaufen <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ fontSize: 13 }}>→</span>
            </button>
            <p style={{ marginTop: 16, fontSize: 11.5, color: D.muted, letterSpacing: ".04em" }}>Kostenloser Versand · 30 Tage Rückgabe · 3 Jahre Garantie</p>
            <p style={{ marginTop: 10, fontSize: 11, color: D.muted }}><span style={{ color: D.gold }}>✦</span> Lebenslanger Early Access zu neuen RAJ Produkten</p>
          </div>

          {/* RIGHT */}
          <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0 48px" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "82%", height: "82%", borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(201,168,118,.22), transparent 70%)", filter: "blur(30px)", transform: "translate(-50%,-50%)", animation: "raj-breathe 6s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2, width: "100%", aspectRatio: "3/2", borderRadius: 10, overflow: "hidden", boxShadow: "0 50px 120px -40px rgba(0,0,0,.9), 0 0 0 1px rgba(201,168,118,.18)", animation: "raj-float 9s ease-in-out infinite" }}>
              <img src={nexusHeroImg} alt="RAJ NEXUS – iPhone, Apple Watch und AirPods gleichzeitig geladen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} loading="eager" decoding="async" />
            </div>
            <ChargeChip label="iPhone" icon={<IconPhone />} startVal={58} phase={0} floatAnim="raj-float 6s" style={{ top: "4%", left: "-2%" }} />
            <ChargeChip label="Apple Watch" icon={<IconWatch />} startVal={79} phase={0.38} floatAnim="raj-float2 7s" style={{ top: "38%", right: "-4%" }} />
            <ChargeChip label="AirPods Pro" icon={<IconPods />} startVal={71} phase={0.72} floatAnim="raj-float 6.5s" style={{ bottom: "12%", left: "4%" }} />
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden relative px-5 pb-10" style={{ zIndex: 2 }}>
          <div className="flex justify-center mb-6">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 14px 7px 11px", borderRadius: 100, border: "1px solid rgba(201,168,118,.28)", background: "rgba(201,168,118,.06)" }}>
              <span style={{ position: "relative", display: "flex", width: 6, height: 6 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: D.gold, animation: "raj-ping 2.2s ease-out infinite" }} />
                <span style={{ position: "relative", width: 6, height: 6, borderRadius: "50%", background: D.gold }} />
              </span>
              <span style={{ fontSize: 9, textTransform: "uppercase", fontWeight: 600, color: D.gold, letterSpacing: ".2em" }}>Founder Edition — noch 37 von 100</span>
            </div>
          </div>
          <div className="text-center mb-4" style={{ fontSize: "clamp(42px,11vw,64px)", lineHeight: .95, letterSpacing: "-.02em", fontWeight: 100, whiteSpace: "nowrap" }}>
            <span style={{ color: D.beige }}>RAJ</span>{" "}
            <span style={{ WebkitTextStroke: `1.5px ${D.gold}`, color: "transparent" }}>NEXUS</span>
          </div>
          <p className="text-center mb-4" style={{ fontSize: 16, lineHeight: 1.3, color: D.muted, fontWeight: 300 }}>iPhone, Watch &amp; AirPods. Geladen an einem Ort.</p>
          <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 80px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(201,168,118,.18)", marginBottom: 28 }}>
            <img src={nexusHeroImg} alt="RAJ NEXUS" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="eager" />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["Qi2.2 · 25 W", "Swiss Brand", "3 Jahre Garantie"].map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 100, border: "1px solid rgba(201,168,118,.18)", background: "rgba(255,255,255,.02)", fontSize: 11, color: D.beige }}>
                <span style={{ color: D.gold }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div className="flex items-baseline justify-center gap-3 mb-5">
            <span style={{ fontSize: 40, color: D.beige, fontWeight: 300 }}>CHF 99.-</span>
            <span style={{ fontSize: 16, textDecoration: "line-through", color: D.mutedDim, fontWeight: 300 }}>CHF 129.-</span>
          </div>
          <button type="button" onClick={quickBuy} disabled={buyProcessing} className="w-full inline-flex items-center justify-center gap-2 transition-all duration-500 active:scale-[0.98] disabled:opacity-60" style={{ padding: "18px 24px", borderRadius: 100, background: `linear-gradient(160deg, #c8946b 0%, ${D.gold} 60%, #7a4e2a 100%)`, color: "#0a0908", letterSpacing: ".2em", fontSize: 11, fontWeight: 700, textTransform: "uppercase", animation: "raj-glow 3.4s ease-in-out infinite" }}>
            Jetzt kaufen →
          </button>
          <p className="text-center mt-4" style={{ fontSize: 11, color: D.muted, letterSpacing: ".04em" }}>Kostenloser Versand · 30 Tage Rückgabe · 3 Jahre Garantie</p>
          <p className="text-center mt-2" style={{ fontSize: 11, color: D.muted }}><span style={{ color: D.gold }}>✦</span> Lebenslanger Early Access zu neuen RAJ Produkten</p>
        </div>

        <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${D.gold}, transparent)`, opacity: 0.4 }} />
      </section>

      {/* ═══ 2. TRUST — unverändert ═══ */}
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-44 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>— Drei Geräte · Ein Ort</span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>Alles gleichzeitig laden.</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-12 md:gap-16">
            {[{ icon: Smartphone, label: "iPhone" }, { icon: Watch, label: "Apple Watch" }, { icon: Headphones, label: "AirPods" }].map((d) => (
              <div key={d.label} className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto rounded-full flex items-center justify-center mb-5" style={{ background: "#FFFFFF", border: `1px solid ${L.border}` }}>
                  <d.icon className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" style={{ color: L.gold }} strokeWidth={1.2} />
                </div>
                <div className="text-sm sm:text-lg font-light tracking-tight">{d.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-12 md:mt-16 text-3xl md:text-5xl leading-tight tracking-tight" style={{ color: L.text, fontWeight: 300 }}>Power. Always There.</p>
        </div>
      </section>

      {/* ═══ 3. STORY — unverändert ═══ */}
      <section style={{ background: D.bg, color: D.beige }} className="py-24 md:py-44 px-5">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-48">
          {[
            { img: nexusFeatures, srcSet: `${nexusFeatures1000} 1000w, ${nexusFeatures1200} 1200w, ${nexusFeatures} 1600w`, sizes: "(max-width: 768px) 100vw, 50vw", alt: "100% in 1.5 Stunden", eyebrow: "Für die, die keine Zeit haben", title: "Vollgeladen, bevor der Kaffee fertig ist.", copy: "90 Minuten und dein iPhone ist bei 100 %. Während du duschst, frühstückst, deine Mails checkst. Nie wieder mit 23 % aus dem Haus rennen." },
            { img: nexusFolds, alt: "Faltbar wie eine Brieftasche", eyebrow: "Für die Vielreisenden", title: "Faltet sich wie eine Brieftasche.", copy: "Hotelzimmer in Mailand. Lounge in Zürich. Airbnb in Lissabon. Eine Bewegung — aufgeklappt. Dein iPhone, deine Watch, deine AirPods. Alle gleichzeitig laden." },
            { img: nexusDesk, srcSet: `${nexusDesk680} 680w, ${nexusDesk1200} 1200w, ${nexusDesk} 1600w`, sizes: "(max-width: 768px) 100vw, 50vw", alt: "Aufgeräumter Schreibtisch", eyebrow: "Für die, die Ordnung lieben", title: "Drei Kabel weg. Ein Objekt da.", copy: "Kein Kabelsalat mehr hinter dem Monitor. Kein Suchen nach dem Ladekabel um Mitternacht. Einfach hinlegen. Fertig." },
            { img: nexusWindow, alt: "Material Detail im Licht", eyebrow: "Für die, die Qualität spüren", title: "Aluminium. Mattes Finish. Gewicht in der Hand.", copy: "CNC-gefräst aus einem Block. Mattes Finish, das Fingerabdrücke ignoriert. Manche Dinge erklären sich von selbst." },
          ].map((s: any, i) => {
            const imageRight = i % 2 === 1;
            return (
              <div key={i} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <motion.img src={s.img} srcSet={s.srcSet} sizes={s.sizes} alt={s.alt} loading="lazy" decoding="async" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={`rounded-2xl w-full aspect-square object-cover object-center ${imageRight ? "md:order-2" : ""}`} style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className={imageRight ? "md:order-1" : ""}>
                  <span className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: D.gold }}>{s.eyebrow}</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15] mt-5" style={{ color: D.beige }}>{s.title}</h2>
                  <div className="mt-6 h-px w-12" style={{ background: D.gold, opacity: 0.6 }} />
                  <p className="mt-6 font-light leading-relaxed text-lg max-w-md" style={{ color: D.muted }}>{s.copy}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 4. SPECS — unverändert ═══ */}
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-44 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>— Spezifikationen</span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>Präzision in Zahlen.</h2>
          </div>
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-6">
              <img src={nexusTopview} alt="RAJ NEXUS Top View" width={1200} height={1200} loading="lazy" decoding="async" className="w-full aspect-square object-cover rounded-sm" style={{ boxShadow: "0 30px 80px -30px rgba(26,26,26,0.25)" }} />
            </div>
            <div className="md:col-span-6">
              <dl className="space-y-0">
                {[["Standard", "Qi2.2 · WPC zertifiziert"], ["Leistung", "25 W Schnellladung"], ["Geräte", "iPhone · Watch · AirPods"], ["Material", "Aluminium · Premium-Gewebe"], ["Garantie", "3 Jahre Garantie"], ["Sicherheit", "Überhitzungs- & Überladeschutz"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline py-4" style={{ borderBottom: `1px solid ${L.border}` }}>
                    <dt className="text-[11px] uppercase" style={{ color: L.textDim, letterSpacing: "0.2em" }}>{k}</dt>
                    <dd className="text-sm md:text-base text-right" style={{ color: L.text, fontWeight: 400 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="text-center mt-20 md:mt-28 max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl tracking-tight" style={{ fontWeight: 300, color: L.text }}>Präzise. Zuverlässig. Durchdacht.</p>
          </div>
        </div>
      </section>

      {/* ═══ 5. DETAILS / FAQ — unverändert ═══ */}
      <section style={{ background: L.bg, color: L.text }}>
        <ProductDetailsAccordion />
      </section>
      <section id="faq" className="py-20 md:py-28 px-5" style={{ background: L.bg, color: L.text, borderTop: `1px solid ${L.border}` }} aria-labelledby="nexus-faq-heading">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] uppercase mb-4" style={{ color: L.gold, letterSpacing: "0.32em" }}>Häufige Fragen</p>
          <h2 id="nexus-faq-heading" className="text-3xl md:text-4xl tracking-tight leading-tight mb-10" style={{ color: L.text, fontWeight: 300 }}>Alles zum RAJ NEXUS — auf einen Blick.</h2>
          <dl className="space-y-8">
            {FAQ_NEXUS_JSON_LD.mainEntity.map((item: any) => (
              <div key={item.name} className="pb-8" style={{ borderBottom: `1px solid ${L.border}` }}>
                <dt className="text-base md:text-lg mb-3" style={{ color: L.text, fontWeight: 500 }}>{item.name}</dt>
                <dd className="text-sm md:text-base leading-relaxed" style={{ color: L.textMuted, fontWeight: 300 }}>{item.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ 6. CTA — unverändert ═══ */}
      <section className="relative py-24 md:py-36 px-5" style={{ background: D.bg, color: D.beige }}>
        <div className="relative max-w-2xl mx-auto text-center">
          <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>— Founder Edition · Limitiert auf 100</span>
          <h2 className="text-4xl md:text-6xl mt-6 leading-[1.05] tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>Bereit?</h2>
          <p className="text-base md:text-lg mt-6 mb-10" style={{ color: D.muted, fontWeight: 300 }}>CHF 99.- statt CHF 129.-</p>
          <button type="button" onClick={quickBuy} disabled={buyProcessing} className="inline-block px-10 py-4 rounded-full font-bold text-[13px] uppercase tracking-[0.22em] active:scale-[0.98] transition-all" style={{ background: `linear-gradient(135deg, ${D.gold}, #c8946b)`, color: D.bg, boxShadow: `0 16px 40px -12px ${D.gold}` }}>
            Jetzt kaufen
          </button>
          <p className="mt-6 text-[11px] sm:text-xs" style={{ color: D.muted, letterSpacing: "0.04em" }}>Kostenloser Versand · 30 Tage Rückgabe · 3 Jahre Garantie</p>
        </div>
      </section>

      {/* Footer — unverändert */}
      <footer style={{ background: D.bg, borderTop: `1px solid ${D.border}` }} className="py-10 px-5 text-center">
        <a href="https://raj.ch" aria-label="RAJ — Home" className="inline-flex items-center justify-center">
          <img src={logoTransparent} alt="RAJ" width={180} height={56} loading="lazy" decoding="async" className="h-12 w-auto" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.42))" }} />
        </a>
        <p className="text-[10px] uppercase mt-4" style={{ color: D.gold, letterSpacing: "0.28em" }}>Power. Always There.</p>
        <p className="text-[10px] mt-3" style={{ color: D.mutedDim }}>© {new Date().getFullYear()} RAJ GmbH</p>
      </footer>

      <div className="h-16" aria-hidden style={{ background: D.bg }} />
      <BuyModal open={buyModalOpen} onClose={() => setBuyModalOpen(false)} />
    </>
  );
};

export default NexusPage;

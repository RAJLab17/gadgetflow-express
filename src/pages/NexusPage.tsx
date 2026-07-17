import { useEffect, useState, useCallback, FormEvent, lazy, Suspense } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Smartphone, Headphones, Watch, Mail, Loader2, Check, ArrowRight,
  ShieldCheck, Truck, RotateCcw, Tag, Gift, Zap, Package, Infinity as InfinityIcon, ShoppingBag, X, ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { useViewContent } from "@/hooks/useViewContent";
import { useQuickBuy, CHECKOUT_URL } from "@/hooks/useQuickBuy";
const ProductDetailsAccordion = lazy(() => import("@/components/ProductDetailsAccordion"));

import Header from "@/components/Header";
import { PRODUCT_NEXUS_JSON_LD, breadcrumbJsonLd, FAQ_NEXUS_JSON_LD } from "@/lib/schemas";
import { fetchProductVariantInfo } from "@/lib/shopify";

// Drop 01: 19 Einheiten allokiert. Baseline = Shopify-Bestand bei Drop-Start.
// Anzeige = max(0, min(DROP_CAP, DROP_CAP - (BASELINE - currentQty))).
const DROP_01_BASELINE_INVENTORY = 95;
const DROP_01_CAP = 19;

import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import nexusFolds from "@/assets/products/nexus-real-folds-text-800.webp";
import nexusDesk from "@/assets/products/nexus-office-skyline.webp";
import nexusDesk680 from "@/assets/products/nexus-office-skyline-680w.webp";
import nexusDesk1200 from "@/assets/products/nexus-office-skyline-1200w.webp";
import nexusTopview from "@/assets/products/nexus-real-topview-qi2.jpg";
import nexusTopview680 from "@/assets/products/nexus-real-topview-qi2-680w.webp";
import nexusTopview1200 from "@/assets/products/nexus-real-topview-qi2-1200w.webp";
import nexusFeatures from "@/assets/products/nexus-desk-writing.webp";
import nexusFeatures1000 from "@/assets/products/nexus-desk-writing-1000w.webp";
import nexusFeatures1200 from "@/assets/products/nexus-desk-writing-1200w.webp";
import nexusWindow from "@/assets/products/nexus-sidetable-enjoy.webp";
import nexusWindow680 from "@/assets/products/nexus-sidetable-enjoy-680w.webp";
import nexusWindow1200 from "@/assets/products/nexus-sidetable-enjoy-1200w.webp";
const carousel1 = "/assets/products/nexus-real-hero-floating-white.webp";
import carousel2 from "@/assets/products/nexus-real-topview-qi2-white.webp";
import carousel3 from "@/assets/products/nexus-real-folds-white.webp";
import carousel5Asset from "@/assets/products/nexus-carousel4-lifestyle.webp.asset.json";
import beforeCableImg from "@/assets/products/nexus-before-cable-chaos.jpg";
import nexusBedsideNight from "@/assets/products/nexus-bedside-night.webp";
import nexusHeroFallbackAsset from "@/assets/products/nexus-hero-chatgpt.png.asset.json";
import nexusHeroWebp400 from "@/assets/products/nexus-hero-chatgpt-400w.webp.asset.json";
import nexusHeroWebp800 from "@/assets/products/nexus-hero-chatgpt-800w.webp.asset.json";
import nexusHeroWebp1200 from "@/assets/products/nexus-hero-chatgpt-1200w.webp.asset.json";

const carousel5 = carousel5Asset.url;
const nexusStoneHero600 = "/assets/hero/nexus-hero-600.webp";
const nexusStoneHero1200 = "/assets/hero/nexus-hero-1200.webp";
import logoTransparent from "@/assets/logo-transparent.webp";
import payVisa from "@/assets/payments/visa.svg";
import payMastercard from "@/assets/payments/mastercard.svg";
import payAmex from "@/assets/payments/amex.svg";
import payApplePay from "@/assets/payments/apple-pay.svg";
import payGooglePay from "@/assets/payments/google-pay.svg";
import payTwint from "@/assets/payments/twint.png";
import payKlarna from "@/assets/payments/klarna.svg";
import NexusRatingBadge from "@/components/NexusRatingBadge";
import NexusHeroChipsMobile from "@/components/nexus/NexusChargeCardsMobile";
import Qi2CertifiedBadge from "@/components/nexus/Qi2CertifiedBadge";
import NexusTrustBar from "@/components/nexus/NexusTrustBar";
import { HERO_CAROUSEL_SLIDES, HeroSwipeImage, HeroThumbs } from "@/components/nexus/NexusHeroCarousel";

// ─── HERO FOTO ────────────────────────────────────────────────────
const nexusHeroImg = nexusHeroFallbackAsset.url;
const heroWebpSrcSet = `${nexusHeroWebp400.url} 400w, ${nexusHeroWebp800.url} 800w, ${nexusHeroWebp1200.url} 1200w`;
const heroSizes = "(max-width: 767px) 100vw, 50vw";
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
// Light hero theme — white background, premium dark-gold accents
const H = {
  bg: "#FFFFFF",
  surface: "#FAF9F7",
  text: "#1A1A1A",
  textMuted: "#6B6358",
  textDim: "#9A9285",
  gold: "#9b6b3f",
  goldLight: "#C9A876",
  border: "#E8E2D6",
  chipBg: "#121110",
};

// ─── Hero Icons ───────────────────────────────────────────────────
const IconPhone = () => (
  <svg width="11" height="17" viewBox="0 0 12 18" fill="none">
    <rect x=".7" y=".7" width="10.6" height="16.6" rx="2.4" stroke={H.gold} strokeWidth="1.1" />
    <rect x="4" y="2.4" width="4" height="1" rx=".5" fill={H.gold} />
  </svg>
);
const IconWatch = () => (
  <svg width="13" height="15" viewBox="0 0 14 16" fill="none">
    <rect x="3" y="3.6" width="8" height="8.8" rx="2.4" stroke={H.gold} strokeWidth="1.1" />
    <path d="M5 3.6 5.4 1.4h3.2L9 3.6M5 12.4l.4 2.2h3.2l.4-2.2" stroke={H.gold} strokeWidth="1.1" />
  </svg>
);
const IconPods = () => (
  <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
    <rect x="1.2" y="3" width="5" height="6" rx="2.3" stroke={H.gold} strokeWidth="1.1" />
    <rect x="9.8" y="3" width="5" height="6" rx="2.3" stroke={H.gold} strokeWidth="1.1" />
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
    <div style={{ position: "absolute", padding: "12px 15px", borderRadius: 15, background: H.surface, border: "1px solid rgba(26,26,26,.12)", boxShadow: "0 18px 44px rgba(26,26,26,.12)", minWidth: 148, animation: `${floatAnim} ease-in-out infinite`, zIndex: 5, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(155,107,63,.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        <span style={{ fontSize: 11.5, color: H.text, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: 25, fontWeight: 300, fontVariantNumeric: "tabular-nums", color: H.text }}>{val}</span>
        <span style={{ fontSize: 13, color: H.textDim }}>%</span>
      </div>
      <div style={{ marginTop: 8, height: 2, borderRadius: 2, background: "rgba(26,26,26,.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${val}%`, borderRadius: 2, background: `linear-gradient(90deg, #7a4e2a, ${H.gold})`, transition: "width 1s ease" }} />
      </div>
    </div>
  );
};

// ─── Latest Marcel Review Snippet (Hero) ───────────────────────────
type HeroReview = {
  customer_name: string;
  rating: number;
  title: string;
  comment: string;
  photo_url: string | null;
  verified_purchase: boolean;
};

/**
 * Transforms a Supabase signed object URL into a signed image-render URL
 * with width/quality params so we don't ship 3+ MB originals to the client.
 * Falls back to the original URL if it isn't a Supabase storage URL.
 */
const supaThumb = (url: string | null | undefined, width: number, quality = 72): string => {
  if (!url) return "";
  if (!url.includes("/storage/v1/object/")) return url;
  const rendered = url.replace("/storage/v1/object/", "/storage/v1/render/image/");
  const sep = rendered.includes("?") ? "&" : "?";
  return `${rendered}${sep}width=${width}&quality=${quality}&resize=cover`;
};


const LatestMarcelReview = ({
  review,
  className = "",
  onPhotoClick,
  theme = "dark",
}: {
  review: HeroReview;
  className?: string;
  onPhotoClick?: () => void;
  theme?: "light" | "dark";
}) => {
  const [expanded, setExpanded] = useState(false);
  const excerpt = review.comment.length > 90 ? review.comment.slice(0, 90) + "…" : review.comment;
  const toggle = () => setExpanded((v) => !v);
  const isLight = theme === "light";
  const c = isLight
    ? { border: H.border, surface: H.surface, text: H.text, muted: H.textMuted, gold: H.gold, bg: "#FFFFFF" }
    : { border: "rgba(201,168,118,.2)", surface: "rgba(255,255,255,.03)", text: D.beige, muted: D.muted, gold: D.gold, bg: "rgba(20,19,18,.55)" };
  return (
    <div className={`${className}`} style={{ position: "relative", zIndex: expanded ? 80 : 1 }}>
      <div
        className="group cursor-pointer rounded-t-xl border px-3 py-2.5 sm:px-3.5 sm:py-3 transition-all hover:opacity-95"
        style={{ borderColor: c.border, background: c.surface, boxShadow: isLight ? "0 2px 16px rgba(26,26,26,.04)" : undefined, borderBottomLeftRadius: expanded ? 0 : undefined, borderBottomRightRadius: expanded ? 0 : undefined }}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
        aria-expanded={expanded}
        aria-label={`Bewertung von ${review.customer_name} ${expanded ? "einklappen" : "ausklappen"}`}
      >
        <div className="flex items-center gap-3">
          {review.photo_url && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPhotoClick?.();
              }}
              className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-[#1a1a1a] hover:ring-2 hover:ring-[#C9A876]/50 transition"
              aria-label="Foto vergrössern"
            >
              <img src={supaThumb(review.photo_url, 96)} alt={`Foto von ${review.customer_name}`} loading="lazy" decoding="async" width={48} height={48} className="w-full h-full object-cover" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] sm:text-xs font-medium" style={{ color: c.text }}>{review.customer_name}</span>
              {review.verified_purchase && (
                <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] text-emerald-600 uppercase tracking-wider font-semibold">
                  <ShieldCheck size={10} /> Verifizierter Kauf
                </span>
              )}
            </div>
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="text-[10px] leading-none" style={{ color: c.gold }}>★</span>
              ))}
            </div>
            <p className="text-[10px] sm:text-[11px] leading-snug line-clamp-2" style={{ color: c.muted }}>
              «{excerpt}»
            </p>
          </div>
          <div
            className="shrink-0 pl-1"
            style={{ color: c.gold, opacity: 0.7, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
          >
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      {expanded && (
        <>
          {/* Backdrop for outside-click dismiss — doesn't shift layout */}
          <div
            aria-hidden
            onClick={() => setExpanded(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "transparent" }}
          />
          <div
            className="rounded-b-xl border border-t-0"
            style={{
              borderColor: c.border,
              background: c.bg,
              position: "fixed",
              top: "50%",
              left: "50%",
              width: "min(520px, calc(100vw - 32px))",
              zIndex: 60,
              maxHeight: "min(78vh, 680px)",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              transform: "translate(-50%, -50%)",
              boxShadow: isLight ? "0 24px 60px -20px rgba(26,26,26,.28)" : "0 24px 60px -20px rgba(0,0,0,.6)",
            }}
          >
            <div className="px-3 py-3 sm:px-3.5 sm:py-4 relative">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Bewertung schliessen"
                className="absolute top-2 right-2 rounded-full p-1 transition-opacity hover:opacity-70"
                style={{ color: c.muted, background: "transparent", border: "none" }}
              >
                <X size={14} />
              </button>
              <p className="text-sm leading-relaxed italic pr-6" style={{ color: c.text }}>
                «{review.comment}»
              </p>
              {review.photo_url && (
                <button
                  type="button"
                  onClick={() => onPhotoClick?.()}
                  className="mt-3 w-full rounded-lg overflow-hidden border transition-opacity hover:opacity-90"
                  style={{ borderColor: c.border }}
                  aria-label="Foto vergrössern"
                >
                  <img src={supaThumb(review.photo_url, 720)} alt={`Foto zur Bewertung von ${review.customer_name}`} loading="lazy" decoding="async" className="w-full h-36 sm:h-44 object-cover" />
                </button>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold" style={{ color: c.gold }}>
                  <ShieldCheck size={11} /> Verifizierter Kauf
                </span>
                <Link
                  to="/reviews"
                  className="text-[9px] sm:text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
                  style={{ color: c.muted }}
                >
                  Alle Bewertungen →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
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
                      <img src={(img as { src: string }).src} alt={img.alt} width={1200} height={900} loading={i === 0 ? "eager" : "lazy"} decoding={i === 0 ? "sync" : "async"} className={`absolute inset-0 w-full h-full object-contain ${i === 0 ? "scale-[2.05]" : i === 2 ? "scale-[1.42]" : ""} ${i === 4 ? "object-cover" : ""}`} />
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
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "#141312", border: `1px solid ${D.gold}40`, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)" }}>
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: D.gold }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: D.gold }} />
        </span>
        <p className="text-[12px] sm:text-[13px] leading-snug" style={{ color: D.beige }}>{message}</p>
      </div>
    </div>
  );
};


const NexusPage = () => {
  const { t, lang, setLang } = useLanguage();
  const [popupTrigger, setPopupTrigger] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const openBuyModal = useCallback(() => setBuyModalOpen(true), []);
  const { quickBuy: quickBuyRaw, isProcessing: buyProcessing } = useQuickBuy();


  const trackAddToCart = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      (window as any).gtag?.("event", "add_to_cart", {
        currency: "CHF",
        value: 99.0,
        items: [{ item_id: "RAJ-NEX-T3-Q2-BLK", item_name: "RAJ NEXUS 3-in-1 Qi2.2 Wireless Charger", price: 99.0, quantity: 1 }],
      });
      (window as any).fbq?.("track", "AddToCart", {
        value: 99.0,
        currency: "CHF",
        content_ids: ["RAJ-NEX-T3-Q2-BLK"],
        content_type: "product",
      });
    } catch {}
  }, []);

  const quickBuy = useCallback(() => {
    trackAddToCart();
    quickBuyRaw();
  }, [trackAddToCart, quickBuyRaw]);

  useViewContent({ content_name: "RAJ NEXUS", content_ids: ["RAJ-NEXUS-001"], content_type: "product", content_category: "Wireless Charger", value: 99, currency: "CHF" });


  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      (window as any).gtag?.("event", "view_item", {
        currency: "CHF",
        value: 99.0,
        items: [{ item_id: "RAJ-NEX-T3-Q2-BLK", item_name: "RAJ NEXUS 3-in-1 Qi2.2 Wireless Charger", price: 99.0, quantity: 1 }],
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("buy") === "1") setBuyModalOpen(true);
  }, []);

  // Dynamic AggregateRating + Review for Product JSON-LD (from approved Supabase reviews)
  const [reviewStats, setReviewStats] = useState<{ total: number; average: number } | null>(null);
  const [topReviews, setTopReviews] = useState<Array<{ customer_name: string; created_at: string; comment: string | null; title: string | null; rating: number }>>([]);
  const [latestMarcelReview, setLatestMarcelReview] = useState<HeroReview | null>(null);
  const [detailsAccordionValue, setDetailsAccordionValue] = useState<string>("");
  const [marcelLightboxOpen, setMarcelLightboxOpen] = useState(false);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  useEffect(() => {
    if (!marcelLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMarcelLightboxOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [marcelLightboxOpen]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sb = await getSupabase();
      const [{ data: s }, { data: r }, { data: marcel }] = await Promise.all([
        sb.rpc("get_review_stats", { _product_id: "nexus" }),
        sb
          .from("reviews_public")
          .select("customer_name,created_at,comment,title,rating")
          .eq("product_id", "nexus")
          .order("created_at", { ascending: false })
          .limit(10),
        sb
          .from("reviews_public")
          .select("customer_name,rating,title,comment,photo_url,verified_purchase,created_at")
          .eq("product_id", "nexus")
          .ilike("customer_name", "%Marcel%")
          .order("created_at", { ascending: false })
          .limit(1),
      ]);
      if (cancelled) return;
      if (s && Array.isArray(s) && s.length > 0) {
        const row = s[0] as { total: number; average: number };
        setReviewStats({ total: Number(row.total) || 0, average: Number(row.average) || 0 });
      }
      setTopReviews((r ?? []) as typeof topReviews);
      if (marcel && marcel.length > 0) {
        setLatestMarcelReview(marcel[0] as HeroReview);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Live Drop 01 Restbestand aus Shopify (Storefront API)
  const [dropRemaining, setDropRemaining] = useState<number>(DROP_01_CAP);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const info = await fetchProductVariantInfo("raj-3-in-1-wireless-charger");
      if (cancelled || !info) return;
      const sold = Math.max(0, DROP_01_BASELINE_INVENTORY - info.quantityAvailable);
      const remaining = Math.max(0, Math.min(DROP_01_CAP, DROP_01_CAP - sold));
      setDropRemaining(remaining);
    })();
    return () => { cancelled = true; };
  }, []);

  const productJsonLd = (reviewStats && reviewStats.total > 0)
    ? {
        ...PRODUCT_NEXUS_JSON_LD,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: reviewStats.average,
          reviewCount: reviewStats.total,
          bestRating: 5,
          worstRating: 1,
        },
        review: topReviews.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.customer_name },
          datePublished: r.created_at,
          reviewBody: r.comment,
          name: r.title,
          reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        })),
      }
    : PRODUCT_NEXUS_JSON_LD;

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
        <meta property="product:price:amount" content="99.00" />
        <meta property="product:price:currency" content="CHF" />
        <meta property="og:site_name" content="RAJ" />
        <meta property="og:url" content="https://raj.ch/nexus" />
        <meta property="og:image" content="https://raj.ch/og-image.webp" />
        <meta property="og:locale" content="de_CH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@raj_swiss_" />
        <meta name="twitter:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz" />
        <meta name="twitter:description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Bis zu 25W, faltbar, CHF 99." />
        <meta name="twitter:image" content="https://raj.ch/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
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

      

      {/* Trust ticker integrated INSIDE the fixed Header chrome (bottom slot). */}

      <Header topSlot={<NexusTrustBar />} />
      <section
        id="mockup-signup"
        className="relative overflow-x-hidden"
        style={{ background: H.bg, color: H.text, paddingTop: "clamp(76px, 8vw, 112px)" }}
      >
        <div style={{ position: "absolute", top: "-15vh", right: "-6vw", width: "62vw", height: "84vh", background: "radial-gradient(45% 45% at 60% 40%, rgba(155,107,63,.08), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div className="hidden md:block" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 140, background: `linear-gradient(to bottom, transparent, ${H.bg})`, pointerEvents: "none", zIndex: 1 }} />

        {/* DESKTOP */}
        <div className="hidden md:grid relative pl-10 lg:pl-14 xl:pl-20 pr-6 lg:pr-8 xl:pr-10 pb-16 max-w-[1520px] mx-auto w-full" style={{ zIndex: 4, gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.38fr)", columnGap: "clamp(40px,4.5vw,80px)", rowGap: 0, alignItems: "start" }}>
          {/* LEFT — product info */}
          <div style={{ display: "flex", flexDirection: "column", paddingTop: "clamp(4px,1vw,16px)" }}>

            {/* Founder eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 11, width: "fit-content", padding: "9px 18px 9px 14px", borderRadius: 100, border: `1px solid ${H.gold}44`, background: H.surface, marginBottom: 22, boxShadow: "0 4px 24px rgba(26,26,26,.05)" }}>
              <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: H.gold, animation: "raj-ping 2.2s ease-out infinite" }} />
                <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: H.gold }} />
              </span>
              <span style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: H.gold, letterSpacing: ".24em" }}>Founder Edition — limitiert</span>
            </div>

            <h1 style={{ fontSize: "clamp(48px,6.2vw,92px)", lineHeight: 1, letterSpacing: "-.03em", fontWeight: 200, margin: 0, whiteSpace: "nowrap" }}>
              <span style={{ display: "inline", color: H.text, fontWeight: 200 }}>RAJ</span>
              <span style={{ display: "inline", marginLeft: "0.12em" }} />
              <span style={{ display: "inline", background: `linear-gradient(135deg, #c8946b 0%, ${H.goldLight} 50%, #7a4e2a 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 500, letterSpacing: "-.02em", textShadow: "0 2px 24px rgba(155,107,63,.18)" }}>NEXUS</span>
            </h1>
            <p style={{ marginTop: 24, fontSize: "clamp(18px,1.6vw,24px)", lineHeight: 1.35, color: H.textMuted, fontWeight: 300, maxWidth: 480 }}>
              iPhone, Watch &amp; AirPods.<br />Geladen an einem Ort.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
              {["Qi2.2 · 25 W", "3 Jahre Garantie", "MagSafe"].map((b) => (
                <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 100, border: "1px solid rgba(26,26,26,.1)", background: "#FFFFFF", fontSize: 11.5, color: H.text, boxShadow: "0 1px 6px rgba(26,26,26,.03)" }}>
                  <span style={{ color: H.gold }}>✓</span> {b}
                </span>
              ))}
            </div>

            <p className="hidden md:block" style={{ marginTop: 24, maxWidth: 460, fontSize: "clamp(15px,1.15vw,18px)", lineHeight: 1.55, color: H.textMuted, fontWeight: 300 }}>
              Abends hinlegen, morgens voll. NEXUS 3-in-1 wireless charger macht das Laden zum Handgriff statt zur Kabelsuche. Leise, schnell und schön genug für den Nachttisch oder deinen Bürotisch.
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 30 }}>
              <span style={{ fontSize: "clamp(20px,1.8vw,24px)", color: H.textMuted, fontWeight: 400, letterSpacing: "-.01em" }}>CHF 99.-</span>
              <span style={{ fontSize: 14, textDecoration: "line-through", color: H.textDim, fontWeight: 300 }}>CHF 129.-</span>
              <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: ".14em", color: H.gold, fontWeight: 600, padding: "4px 9px", borderRadius: 100, background: "rgba(155,107,63,.1)" }}>-30.-</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <NexusRatingBadge gold={H.gold} textColor={H.textMuted} size={14} />
            </div>

            <a href={CHECKOUT_URL} onClick={(e) => { if (buyProcessing) { e.preventDefault(); return; } quickBuy(); }} className="group w-fit inline-flex items-center justify-center gap-2 transition-all duration-500 hover:scale-[1.015] active:scale-[0.98]" style={{ marginTop: 26, padding: "18px 52px", borderRadius: 100, background: `linear-gradient(160deg, #c8946b 0%, ${H.goldLight} 60%, #7a4e2a 100%)`, color: "#0a0908", letterSpacing: ".2em", fontSize: 11, fontWeight: 700, textTransform: "uppercase", textDecoration: "none", animation: "raj-glow 3.4s ease-in-out infinite" }}>
              Jetzt kaufen <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ fontSize: 13 }}>→</span>
            </a>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {[
                { i: <span style={{ fontSize: 13, lineHeight: 1 }}>🔄</span>, t: "30 Tage Rückgabe" },
                { i: <svg width="14" height="14" viewBox="0 0 32 32" style={{ display: "block", borderRadius: 2 }} aria-hidden><rect width="32" height="32" fill="#D52B1E"/><rect x="13" y="6" width="6" height="20" fill="#fff"/><rect x="6" y="13" width="20" height="6" fill="#fff"/></svg>, t: "Swiss Brand" },
                { i: <span style={{ fontSize: 13, lineHeight: 1 }}>🚚</span>, t: "Lieferung in 2–3 Werktagen" },
              ].map((b) => (
                <span key={b.t} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 100, border: `1px solid ${H.border}`, background: H.surface, fontSize: 11.5, color: H.text, boxShadow: "0 2px 12px rgba(26,26,26,.04)" }}>
                  {b.i} {b.t}
                </span>
              ))}
            </div>

            {latestMarcelReview && (
              <LatestMarcelReview
                review={latestMarcelReview}
                className="mt-6"
                onPhotoClick={() => setMarcelLightboxOpen(true)}
                theme="light"
              />
            )}


          </div>

          {/* RIGHT — hero image */}
          <div style={{ alignSelf: "start", width: "100%" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "92%", height: "92%", borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(155,107,63,.14), transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 2, width: "100%", paddingBottom: "100%", borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 50px 120px -40px rgba(26,26,26,.32), 0 0 0 1px rgba(155,107,63,.16)" }}>
                <div style={{ position: "absolute", inset: 0 }}>
                <HeroSwipeImage
                  slides={HERO_CAROUSEL_SLIDES}
                  index={heroSlideIdx}
                  onChange={setHeroSlideIdx}
                  sizes="(max-width: 767px) 100vw, 52vw"
                  priority
                  objectFit="cover"
                />

                {/* Overlays inside the frame */}
                {HERO_CAROUSEL_SLIDES[heroSlideIdx].showChips !== false && (
                  <>
                    <ChargeChip label="iPhone" icon={<IconPhone />} startVal={58} phase={0} floatAnim="raj-float 6s" style={{ top: "5%", left: "4%" }} />
                    <ChargeChip label="Apple Watch" icon={<IconWatch />} startVal={79} phase={0.38} floatAnim="raj-float2 7s" style={{ top: "46%", right: "4%" }} />
                    <ChargeChip label="AirPods Pro" icon={<IconPods />} startVal={71} phase={0.72} floatAnim="raj-float 6.5s" style={{ bottom: "5%", left: "4%" }} />
                  </>
                )}

                {/* Prev/next arrows — desktop hero */}
                <button
                  type="button"
                  aria-label="Vorheriges Bild"
                  onClick={() => setHeroSlideIdx((heroSlideIdx - 1 + HERO_CAROUSEL_SLIDES.length) % HERO_CAROUSEL_SLIDES.length)}
                  style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", zIndex: 5, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.92)", border: "1px solid rgba(26,26,26,.12)", boxShadow: "0 6px 20px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#111", transition: "transform .18s ease, background .18s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.92)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button
                  type="button"
                  aria-label="Nächstes Bild"
                  onClick={() => setHeroSlideIdx((heroSlideIdx + 1) % HERO_CAROUSEL_SLIDES.length)}
                  style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", zIndex: 5, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.92)", border: "1px solid rgba(26,26,26,.12)", boxShadow: "0 6px 20px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#111", transition: "transform .18s ease, background .18s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.92)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>

                <div style={{ position: "absolute", bottom: 20, right: 22, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <Qi2CertifiedBadge size={50} compact variant={heroSlideIdx === 1 || heroSlideIdx === 3 ? "light" : "dark"} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: heroSlideIdx === 1 || heroSlideIdx === 3 ? "#ffffff" : "#000000" }}>Zertifiziert</span>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP: ONE continuous dark bar spanning both columns — payments left, thumbnails right */}
          <div
            style={{
              gridColumn: "1 / -1",
              marginTop: 18,
              borderRadius: 18,
              background: "#0a0908",
              border: "1px solid rgba(155,107,63,.20)",
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              boxShadow: "0 24px 70px -34px rgba(0,0,0,.42)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".22em", color: H.gold }}>Sichere Zahlungsmethoden</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {[payVisa, payMastercard, payAmex, payApplePay, payGooglePay, payTwint, payKlarna].map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" decoding="async" style={{ height: 22, width: "auto", objectFit: "contain", background: "white", borderRadius: 4, padding: "2px 5px", border: "1px solid rgba(255,255,255,.12)" }} />
                ))}
              </div>
            </div>
            <HeroThumbs slides={HERO_CAROUSEL_SLIDES} index={heroSlideIdx} onChange={setHeroSlideIdx} size={64} dark style={{ justifyContent: "flex-end", margin: 0, flexWrap: "wrap" }} />
          </div>
        </div>


        {/* MOBILE */}
        <div className="md:hidden relative px-5 pt-0 pb-0" style={{ zIndex: 2 }}>
          <div className="text-center mb-0.5" style={{ fontSize: "clamp(26px,6.8vw,38px)", lineHeight: 1, letterSpacing: "-.02em", fontWeight: 200, whiteSpace: "nowrap" }}>
            <span style={{ color: H.text, fontWeight: 200 }}>RAJ</span>{" "}
            <span style={{ background: `linear-gradient(135deg, #c8946b 0%, ${H.goldLight} 50%, #7a4e2a 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 500, letterSpacing: "-.01em" }}>NEXUS</span>
          </div>
          <p className="text-center mb-1.5" style={{ fontSize: 13, lineHeight: 1.3, color: H.textMuted, fontWeight: 300 }}>iPhone, Watch &amp; AirPods. Geladen an einem Ort.</p>
          <div style={{ position: "relative", width: "calc(100% + 40px)", marginLeft: -20, marginRight: -20, marginBottom: 6, paddingBottom: "100%", maxHeight: 300, borderRadius: 0, overflow: "hidden", boxShadow: "0 30px 80px -30px rgba(0,0,0,.16)" }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <HeroSwipeImage
                slides={HERO_CAROUSEL_SLIDES}
                index={heroSlideIdx}
                onChange={setHeroSlideIdx}
                sizes="100vw"
                priority
                objectFit="cover"
                objectPosition={heroSlideIdx === 0 ? "center 30%" : "center"}
              />
              <div style={{ position: "absolute", bottom: 14, right: 14, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pointerEvents: "none" }}>
                <Qi2CertifiedBadge size={34} compact variant={heroSlideIdx === 1 || heroSlideIdx === 3 ? "light" : "dark"} />
                <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: heroSlideIdx === 1 || heroSlideIdx === 3 ? "#ffffff" : "#000000" }}>Zertifiziert</span>
              </div>

              {HERO_CAROUSEL_SLIDES[heroSlideIdx].showChips !== false && <NexusHeroChipsMobile />}
            </div>
          </div>
          <HeroThumbs slides={HERO_CAROUSEL_SLIDES} index={heroSlideIdx} onChange={setHeroSlideIdx} size={48} />
          <div className="flex flex-wrap justify-center gap-2 mt-3 mb-2.5">
            {["Qi2.2 · 25 W", "3 Jahre Garantie", "MagSafe"].map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 100, border: "1px solid rgba(26,26,26,.12)", background: "#FFFFFF", fontSize: 10, color: H.text, boxShadow: "0 1px 8px rgba(26,26,26,.04)" }}>
                <span style={{ color: H.gold }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center text-center mb-2" style={{ borderTop: `1px solid ${H.border}`, borderBottom: `1px solid ${H.border}`, padding: "6px 0", gap: 4 }}>


            {/* Scarcity */}
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#22c55e", opacity: 0.75, animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span style={{ position: "relative", display: "inline-flex", borderRadius: 999, width: 8, height: 8, background: "#22c55e" }} />
              </span>
              <span style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 500, color: H.gold }}>
                {dropRemaining > 0 ? `Noch ${dropRemaining} verfügbar` : "Drop 01 ausverkauft"}
              </span>
            </div>
            {/* Price */}
            <div className="flex items-baseline justify-center" style={{ gap: 10 }}>
              <span style={{ fontSize: 20, color: H.textMuted, fontWeight: 400, letterSpacing: "0", lineHeight: 1 }}>CHF 99.–</span>
              <span style={{ fontSize: 12, textDecoration: "line-through", color: H.textDim, fontWeight: 300 }}>CHF 129.–</span>
            </div>
            {/* Rating */}
            {reviewStats && reviewStats.total > 0 && (
              <Link to="/reviews" aria-label={`${reviewStats.average.toFixed(1)} von 5 Sternen, ${reviewStats.total} Bewertungen lesen`} className="flex items-center justify-center transition-opacity hover:opacity-80" style={{ gap: 8, paddingTop: 2 }}>
                <div className="flex" style={{ gap: 2 }}>
                  {[0,1,2,3,4].map((i) => (
                    <span key={i} style={{ color: H.gold, fontSize: 11, lineHeight: 1 }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 11, letterSpacing: "0.02em", color: H.text }}>
                  {reviewStats.average.toFixed(1)} <span style={{ color: H.textMuted, margin: "0 4px" }}>|</span> {reviewStats.total} {reviewStats.total === 1 ? "Bewertung" : "Bewertungen"}
                </span>
              </Link>
            )}

          </div>



          <button type="button" onClick={quickBuy} disabled={buyProcessing} className="w-full inline-flex items-center justify-center gap-2 transition-all duration-500 active:scale-[0.98] disabled:opacity-60" style={{ padding: "12px 20px", borderRadius: 100, background: `linear-gradient(160deg, #c8946b 0%, ${H.goldLight} 60%, #7a4e2a 100%)`, color: "#0a0908", letterSpacing: ".2em", fontSize: 11, fontWeight: 700, textTransform: "uppercase", animation: "raj-glow 3.4s ease-in-out infinite" }}>
            Jetzt kaufen →

          </button>
          <div className="flex flex-nowrap justify-center gap-1.5 mt-2 px-1">
            {[
              { i: <span style={{ fontSize: 10, lineHeight: 1 }}>🔄</span>, t: "30 Tage Rückgabe" },
              { i: <svg width="11" height="11" viewBox="0 0 32 32" style={{ display: "block", borderRadius: 1.5, flexShrink: 0 }} aria-hidden><rect width="32" height="32" fill="#D52B1E"/><rect x="13" y="6" width="6" height="20" fill="#fff"/><rect x="6" y="13" width="20" height="6" fill="#fff"/></svg>, t: "Swiss Brand" },
              { i: <span style={{ fontSize: 10, lineHeight: 1 }}>🚚</span>, t: "2–3 Werktage" },
            ].map((b) => (
              <span key={b.t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 7px", borderRadius: 100, border: `1px solid ${H.border}`, background: H.surface, fontSize: 9.5, color: H.text, whiteSpace: "nowrap", boxShadow: "0 2px 12px rgba(26,26,26,.04)" }}>
                {b.i} {b.t}
              </span>
            ))}
          </div>
          <div className="mt-4 -mx-5 px-5 py-6 rounded-t-2xl" style={{ background: D.bg, color: D.beige }}>
            {latestMarcelReview && (
              <LatestMarcelReview
                review={latestMarcelReview}
                className="mb-5"
                onPhotoClick={() => setMarcelLightboxOpen(true)}
                theme="dark"
              />
            )}
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".2em", color: D.beige, textAlign: "center" }}>Sichere Zahlungsmethoden</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {[payVisa, payMastercard, payAmex, payApplePay, payGooglePay, payTwint, payKlarna].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" decoding="async" style={{ height: 18, width: "auto", objectFit: "contain", background: "white", borderRadius: 4, padding: "2px 5px", border: "1px solid rgba(255,255,255,.2)" }} />
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full hidden md:block" style={{ background: `linear-gradient(to right, transparent, ${D.gold}, transparent)`, opacity: 0.4 }} />
      </section>

      {/* ═══ 2. TRUST ═══ */}
      <section style={{ background: L.bg, color: L.text }} className="pt-10 pb-24 md:py-44 px-5">
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

      {/* ═══ 3. STORY ═══ */}
      <section style={{ background: D.bg, color: D.beige }} className="py-24 md:py-44 px-5">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-48">
          {[
            { img: nexusFeatures, srcSet: `${nexusFeatures1000} 1000w, ${nexusFeatures1200} 1200w, ${nexusFeatures} 1600w`, sizes: "(max-width: 768px) 100vw, 650px", alt: "100% in 1.5 Stunden", eyebrow: "Für die, die keine Zeit haben", title: "Vollgeladen, bevor der Kaffee fertig ist.", copy: "90 Minuten und dein iPhone ist bei 100 %. Während du duschst, frühstückst, deine Mails checkst. Nie wieder mit 23 % aus dem Haus rennen." },
            { img: nexusFolds, alt: "Faltbar wie eine Brieftasche", eyebrow: "Für die Vielreisenden", title: "Faltet sich wie eine Brieftasche.", copy: "Hotelzimmer in Mailand. Lounge in Zürich. Airbnb in Lissabon. Eine Bewegung — aufgeklappt. Dein iPhone, deine Watch, deine AirPods. Alle gleichzeitig laden." },
            { img: nexusDesk, srcSet: `${nexusDesk680} 680w, ${nexusDesk1200} 1200w, ${nexusDesk} 1600w`, sizes: "(max-width: 768px) 100vw, 650px", alt: "Aufgeräumter Schreibtisch", eyebrow: "Für die, die Ordnung lieben", title: "Drei Kabel weg. Ein Objekt da.", copy: "Kein Kabelsalat mehr hinter dem Monitor. Kein Suchen nach dem Ladekabel um Mitternacht. Einfach hinlegen. Fertig." },
            { img: nexusWindow, srcSet: `${nexusWindow680} 680w, ${nexusWindow1200} 1200w, ${nexusWindow} 1600w`, sizes: "(max-width: 768px) 100vw, 650px", alt: "Material Detail im Licht", eyebrow: "Für die, die Qualität spüren", title: "Aluminium. Mattes Finish. Gewicht in der Hand.", copy: "CNC-gefräst aus einem Block. Mattes Finish, das Fingerabdrücke ignoriert. Manche Dinge erklären sich von selbst." },
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

      {/* ═══ 4. SPECS ═══ */}
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-44 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>— Spezifikationen</span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>Präzision in Zahlen.</h2>
          </div>
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-6">
              <img src={nexusTopview} srcSet={`${nexusTopview680} 680w, ${nexusTopview1200} 1200w`} sizes="(max-width: 768px) 100vw, 650px" alt="RAJ NEXUS Top View" width={1200} height={1200} loading="lazy" decoding="async" className="w-full aspect-square object-cover rounded-sm" style={{ boxShadow: "0 30px 80px -30px rgba(26,26,26,0.25)" }} />
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

      {/* ═══ 5. DETAILS / FAQ ═══ */}
      <section style={{ background: L.bg, color: L.text }}>
        <Suspense fallback={<div style={{ minHeight: 400 }} />}>
          <ProductDetailsAccordion
            value={detailsAccordionValue}
            onValueChange={setDetailsAccordionValue}
            reviewStats={reviewStats}
            topReviews={topReviews}
          />
        </Suspense>
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

      {/* ═══ 6. CTA ═══ */}
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

      <footer style={{ background: D.bg, borderTop: `1px solid ${D.border}` }} className="py-10 px-5 text-center">
        <a href="https://raj.ch" aria-label="RAJ — Home" className="inline-flex items-center justify-center">
          <img src={logoTransparent} alt="RAJ" width={180} height={56} loading="lazy" decoding="async" className="h-12 w-auto" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.42))" }} />
        </a>
        <p className="text-[10px] uppercase mt-4" style={{ color: D.gold, letterSpacing: "0.28em" }}>Power. Always There.</p>
        <p className="text-[10px] mt-3" style={{ color: D.mutedDim }}>© {new Date().getFullYear()} RAJ GmbH</p>
      </footer>

      <div className="h-16" aria-hidden style={{ background: D.bg }} />
      <BuyModal open={buyModalOpen} onClose={() => setBuyModalOpen(false)} />

      <AnimatePresence>
        {marcelLightboxOpen && latestMarcelReview?.photo_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(0,0,0,.92)" }}
            onClick={() => setMarcelLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Foto vergrössert"
          >
            <button
              type="button"
              onClick={() => setMarcelLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Schliessen"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={supaThumb(latestMarcelReview.photo_url, 1400, 82)}
              alt={`Foto zur Bewertung von ${latestMarcelReview.customer_name}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NexusPage;

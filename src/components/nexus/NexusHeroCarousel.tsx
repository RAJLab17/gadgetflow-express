import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// LCP hero (slide 0): use the CDN pointer URLs so the src matches the
// <link rel="preload"> injected by the raj-hero-preload Vite plugin 1:1.
// If this ever falls back to bundled Vite hashes, the preload no-ops and
// LCP jumps by 2-3 seconds on mobile.
import s0_400_asset from "@/assets/products/nexus-hero-v2-400w.webp.asset.json";
import s0_800_asset from "@/assets/products/nexus-hero-v2-800w.webp.asset.json";
import s0_1200_asset from "@/assets/products/nexus-hero-v2-1200w.webp.asset.json";
const s0_400 = s0_400_asset.url;
const s0_800 = s0_800_asset.url;
const s0_1200 = s0_1200_asset.url;

// Non-LCP slides stay bundled (lazy-loaded, so no preload benefit).
import s1_480 from "@/assets/nexus-carousel/slide-1-480.webp";
import s1_900 from "@/assets/nexus-carousel/slide-1-900.webp";
import s1_1400 from "@/assets/nexus-carousel/slide-1-1400.webp";
import s2_480 from "@/assets/nexus-carousel/slide-2-480.webp";
import s2_900 from "@/assets/nexus-carousel/slide-2-900.webp";
import s2_1400 from "@/assets/nexus-carousel/slide-2-1400.webp";
import s3_480 from "@/assets/nexus-carousel/slide-3-480.webp";
import s3_900 from "@/assets/nexus-carousel/slide-3-900.webp";
import s3_1400 from "@/assets/nexus-carousel/slide-3-1400.webp";
import s4_480 from "@/assets/nexus-carousel/slide-4-480.webp";
import s4_900 from "@/assets/nexus-carousel/slide-4-900.webp";
import s4_1400 from "@/assets/nexus-carousel/slide-4-1400.webp";
import t1 from "@/assets/nexus-carousel/thumb-1.webp";
import t2 from "@/assets/nexus-carousel/thumb-2.webp";
import t3 from "@/assets/nexus-carousel/thumb-3.webp";
import t4 from "@/assets/nexus-carousel/thumb-4.webp";

export type HeroSlide = {
  src: string;
  srcSet: string;
  thumb: string;
  alt: string;
  fit?: "cover" | "contain";
  bg?: string;
  position?: string;
  mobileFit?: "cover" | "contain";
  mobilePosition?: string;
  mobileBg?: string;
  /** 0.95 = 5% herauszoomen, bei cover → mehr vom Bild sichtbar, Container bleibt gefüllt. */
  mobileZoom?: number;
};

export const HERO_CAROUSEL_SLIDES: HeroSlide[] = [
  {
    src: s0_800,
    srcSet: `${s0_400} 400w, ${s0_800} 800w, ${s0_1200} 1200w`,
    thumb: s0_400,
    alt: "RAJ NEXUS 3-in-1 Wireless Charger – Studio-Aufnahme",
  },
  {
    src: s1_1400,
    srcSet: `${s1_480} 480w, ${s1_900} 900w, ${s1_1400} 1400w`,
    thumb: t1,
    alt: "RAJ NEXUS auf Schreibtisch neben MacBook, iPhone im StandBy-Modus",
    position: "center 62%",
    mobileFit: "cover",
    mobilePosition: "center 72%",
    mobileZoom: 0.95,
  },
  {
    src: s2_1400,
    srcSet: `${s2_480} 480w, ${s2_900} 900w, ${s2_1400} 1400w`,
    thumb: t2,
    alt: "Explosionsdarstellung – Qi2 25W, magnetische Ausrichtung, Coil-System",
  },
  {
    src: s3_1400,
    srcSet: `${s3_480} 480w, ${s3_900} 900w, ${s3_1400} 1400w`,
    thumb: t3,
    alt: "RAJ NEXUS am Nachttisch im StandBy-Modus über Nacht",
  },
  {
    src: s4_1400,
    srcSet: `${s4_480} 480w, ${s4_900} 900w, ${s4_1400} 1400w`,
    thumb: t4,
    alt: "RAJ NEXUS 3-in-1 und Solo-Pad nebeneinander auf Schreibtisch",
    fit: "cover",
    bg: "#f7f4ef",
  },
];

const GOLD = "#9b6b3f";

/**
 * Renders the swap image layer for the hero. Positioned absolutely so it
 * sits UNDER the existing overlay children (Qi2 badge + ChargeChips).
 * The overlays are siblings in the parent container and are therefore NOT
 * remounted when the slide changes – their charging state persists.
 */
export const HeroSwipeImage = ({
  slides,
  index,
  onChange,
  sizes,
  priority = false,
  objectFit = "cover",
  objectPosition = "center",
}: {
  slides: HeroSlide[];
  index: number;
  onChange: (i: number) => void;
  sizes: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}) => {
  const go = useCallback(
    (n: number) => onChange(((n % slides.length) + slides.length) % slides.length),
    [slides.length, onChange]
  );

  const onDragEnd = (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const dx = info.offset.x;
    if (dx < -50 || info.velocity.x < -400) go(index + 1);
    else if (dx > 50 || info.velocity.x > 400) go(index - 1);
  };

  const current = slides[index];
  const isMobile = useIsMobile();
  const fit = (isMobile ? current.mobileFit : current.fit) ?? objectFit;
  const position = (isMobile ? current.mobilePosition : current.position) ?? objectPosition;
  const bg = (isMobile ? current.mobileBg : current.bg) ?? current.bg ?? "transparent";

  const zoom = isMobile ? current.mobileZoom : undefined;
  const zoomSize = zoom ? `${100 / zoom}%` : "100%";
  const zoomOffset = zoom ? `${(100 - 100 / zoom) / 2}%` : "0%";

  return (
    <motion.div
      className="absolute inset-0 select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y", zIndex: 1, background: bg }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={onDragEnd}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={index}
          src={current.src}
          srcSet={current.srcSet}
          sizes={sizes}
          alt={current.alt}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          loading={priority && index === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority && index === 0 ? "high" : "auto"}
          style={{
            width: zoomSize,
            height: zoomSize,
            position: "absolute",
            top: zoomOffset,
            left: zoomOffset,
            objectFit: fit,
            objectPosition: position,
            display: "block",
            pointerEvents: "none",
          }}
        />
      </AnimatePresence>
    </motion.div>
  );
};

/** Small square thumbnails shown below the hero image. */
export const HeroThumbs = ({
  slides,
  index,
  onChange,
  size = 56,
  dark = false,
  style,
}: {
  slides: HeroSlide[];
  index: number;
  onChange: (i: number) => void;
  size?: number;
  dark?: boolean;
  style?: React.CSSProperties;
}) => {
  const bg = dark ? "#141312" : "#fff";
  const baseBorder = dark ? "rgba(255,255,255,.16)" : "rgba(26,26,26,.12)";
  const shadow = dark ? "0 1px 4px rgba(0,0,0,.35)" : "0 1px 4px rgba(0,0,0,.05)";
  return (
    <div
      className="flex items-center justify-center gap-3"
      role="tablist"
      aria-label="Produktbilder"
      style={{ marginTop: 20, ...style }}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Bild ${i + 1} anzeigen`}
            onClick={() => onChange(i)}
            style={{
              width: size,
              height: size,
              borderRadius: 8,
              overflow: "hidden",
              padding: 0,
              background: bg,
              border: `1.5px solid ${active ? GOLD : baseBorder}`,
              boxShadow: active ? `0 4px 14px ${GOLD}33` : shadow,
              transition: "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
              transform: active ? "translateY(-1px)" : "none",
              cursor: "pointer",
            }}
          >
            <img
              src={s.thumb}
              alt=""
              loading="lazy"
              decoding="async"
              width={size}
              height={size}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </button>
        );
      })}
    </div>
  );
};

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Only the first (LCP) slide is statically imported and eagerly loaded.
// All other slides are lazy-loaded via dynamic URLs to keep them off the
// initial critical request chain.
// Slide 0 is the LCP image — served from /public via stable URLs and
// preloaded in index.html. Do NOT bundle it through Vite (avoids hashed
// filename mismatch with the <link rel="preload">).
const slide0 = "/hero/slide-0-specs.webp";
const slide0Sm = "/hero/slide-0-specs-480.webp";
// All other slides are lazy-loaded via dynamic URLs to keep them off the
// initial critical request chain.
const slide3 = new URL("../assets/hero-carousel/slide-3-fast.webp", import.meta.url).href;
const slide3Sm = new URL("../assets/hero-carousel/slide-3-fast-480.webp", import.meta.url).href;
const slide4 = new URL("../assets/hero-carousel/slide-4-clean.webp", import.meta.url).href;
const slide4Sm = new URL("../assets/hero-carousel/slide-4-clean-480.webp", import.meta.url).href;
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const BASE_OFFSET = 58;

type Slide = {
  image: string;
  imageSm: string;
  alt: string;
  headline: string;
  sub: string;
  subColor?: string;
};

const SLIDE_DURATION = 4000;
const BEIGE = "#f0ede6";
const GOLD = "#9b6b3f";

const buildSlides = (t: (k: string) => string): Slide[] => [
  {
    image: slide0,
    imageSm: slide0Sm,
    alt: "RAJ NEXUS Specs - Qi2.2, 25W, 3-in-1, 100% in 1.5h",
    headline: t("carousel.s0.headline"),
    sub: t("carousel.s0.sub"),
  },
  {
    image: slide3,
    imageSm: slide3Sm,
    alt: "100% in 1.5 Stunden - 3.3x schneller",
    headline: t("carousel.s3.headline"),
    sub: t("carousel.s3.sub"),
  },
  {
    image: slide4,
    imageSm: slide4Sm,
    alt: "Faltbar und 250g leicht - überall dabei",
    headline: t("carousel.s4.headline"),
    sub: t("carousel.s4.sub"),
  },
];

const HeroCarousel = () => {
  const { t } = useLanguage();
  const slides = buildSlides(t);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liveCount, setLiveCount] = useState<number>(81);
  const [pulse, setPulse] = useState(false);
  const touchStartX = useRef<number | null>(null);

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
      .channel("hero_carousel_signups_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "launch_signups" },
        () => {
          setLiveCount((prev) => prev + 1);
          setPulse(true);
          setTimeout(() => setPulse(false), 1800);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);
  const goTo = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 1500);
  };

  const slide = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: BEIGE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Premium Hero Headline */}
      <div className="w-full" style={{ backgroundColor: BEIGE }}>
        <div className="container mx-auto px-4 pt-3 md:pt-10 pb-2 md:pb-6 text-center">
          <div>
            <h1
              className="font-semibold tracking-tight leading-[1.15] text-[#2b2725] text-2xl sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", letterSpacing: "-0.015em" }}
            >
              {t("carousel.heroLine1")}
              <br />
              <span style={{ color: GOLD }} className="font-semibold">{t("carousel.heroLine2")}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Image area — full image, no cropping */}
      <div
        className="relative w-full h-[54vh] md:h-[60vh]"
        style={{ backgroundColor: BEIGE }}
      >
        {index === 0 ? (
          // LCP image: plain <img>, no animation, no AnimatePresence — paints
          // the moment the preloaded asset is decoded.
          <img
            src={slide0}
            srcSet={`${slide0Sm} 480w, ${slide0} 800w`}
            sizes="(max-width: 640px) 480px, 800px"
            alt={slides[0].alt}
            width={800}
            height={800}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain", backgroundColor: BEIGE }}
          />
        ) : (
          <AnimatePresence mode="sync">
            <motion.img
              key={`img-${index}`}
              src={slide.image}
              srcSet={`${slide.imageSm} 480w, ${slide.image} 800w`}
              sizes="(max-width: 640px) 480px, 800px"
              alt={slide.alt}
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain", backgroundColor: BEIGE }}
            />
          </AnimatePresence>
        )}
      </div>

      {/* Text area below — synced fade */}
      <div
        className="relative w-full flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "12vh", backgroundColor: BEIGE, paddingTop: "0.75rem", paddingBottom: "0.5rem" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`txt-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="max-w-3xl"
          >
            <h2 className="font-extrabold tracking-tight leading-tight text-xl sm:text-2xl md:text-4xl text-[#2b2725]">
              {slide.headline}
            </h2>
            <p
              className="mt-2 md:mt-3 text-sm sm:text-base md:text-lg font-light whitespace-pre-line"
              style={{ color: slide.subColor || "#5a5550" }}
            >
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots — active dot becomes a longer pill */}
        <div className="mt-3 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: i === index ? "28px" : "8px",
                backgroundColor: i === index ? GOLD : "#d4c5b0",
              }}
            />
          ))}
        </div>

        {/* Live registration counter */}
        <motion.div
          className="mt-3 flex items-center justify-center gap-2"
          animate={pulse ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: GOLD }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: GOLD }}
            />
          </span>
          <p className="text-[13px] sm:text-sm text-[#3a3530]">
            {t("cta.registeredPrefix")}{" "}
            <motion.span
              key={liveCount}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-bold inline-block tabular-nums"
              style={{ color: GOLD }}
            >
              {liveCount} {t("cta.registeredPeople")}
            </motion.span>{" "}
            {t("cta.registeredSuffix")}
          </p>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroCarousel;

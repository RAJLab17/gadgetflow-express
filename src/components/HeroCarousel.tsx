import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Slide 0 is the LCP image — served from /public via stable URLs and
// preloaded in index.html. Do NOT bundle it through Vite (avoids hashed
// filename mismatch with the <link rel="preload">).
const slide0 = "/hero/slide-nacht.webp";
const slide0Sm = "/hero/slide-nacht-480.webp";

// All other slides are lazy-loaded — only fetched once the carousel rotates.
const slideSpecs = "/hero/slide-0-specs.webp";
const slideSpecsSm = "/hero/slide-0-specs-480.webp";
const slide3 = new URL("../assets/hero-carousel/slide-3-fast.webp", import.meta.url).href;
const slide3Sm = new URL("../assets/hero-carousel/slide-3-fast-480.webp", import.meta.url).href;
const slide4 = new URL("../assets/hero-carousel/slide-4-clean.webp", import.meta.url).href;
const slide4Sm = new URL("../assets/hero-carousel/slide-4-clean-480.webp", import.meta.url).href;

// Framer Motion is heavy (~30KB gz) — load it ONLY after the user has seen
// slide 0. Until then the hero uses pure CSS transitions.
const MotionRotator = lazy(() => import("./HeroCarouselRotator"));

const SLIDE_DURATION = 4000;
const BEIGE = "#f0ede6";
const GOLD = "#9b6b3f";

// Static fallback content for the LCP frame — avoids waiting on the
// LanguageContext (which itself adds a render cycle).
const STATIC_HEADLINE_LINE_1 = "Premium Wireless Charging.";
const STATIC_HEADLINE_LINE_2 = "Made in Switzerland.";
const STATIC_SLIDE_0_HEADLINE = "Qi2.2 · 25W · 3-in-1";
const STATIC_SLIDE_0_SUB = "100% in 1.5 Stunden";

export type Slide = {
  image: string;
  imageSm: string;
  alt: string;
  headline: string;
  sub: string;
};

const HeroCarousel = () => {
  const { t } = useLanguage();
  const [hydrated, setHydrated] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Defer carousel logic + framer-motion until after LCP paints.
  useEffect(() => {
    const ric = (window as any).requestIdleCallback;
    const handle = ric ? ric(() => setHydrated(true), { timeout: 2500 }) : window.setTimeout(() => setHydrated(true), 1500);
    return () => {
      if (ric && (window as any).cancelIdleCallback) (window as any).cancelIdleCallback(handle);
      else clearTimeout(handle as number);
    };
  }, []);

  const slides: Slide[] = [
    {
      image: slide0,
      imageSm: slide0Sm,
      alt: "RAJ NEXUS Specs - Qi2.2, 25W, 3-in-1, 100% in 1.5h",
      headline: hydrated ? t("carousel.s0.headline") : STATIC_SLIDE_0_HEADLINE,
      sub: hydrated ? t("carousel.s0.sub") : STATIC_SLIDE_0_SUB,
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

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);
  const goTo = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    if (!hydrated || paused) return;
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [hydrated, paused, next]);

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
      {/* Premium Hero Headline — static text avoids LanguageContext blocking */}
      <div className="w-full" style={{ backgroundColor: BEIGE }}>
        <div className="container mx-auto px-4 pt-3 md:pt-10 pb-2 md:pb-6 text-center">
          <h1
            className="font-semibold tracking-tight leading-[1.15] text-[#2b2725] text-xl sm:text-2xl md:text-3xl"
            style={{ letterSpacing: "-0.015em" }}
          >
            {hydrated ? t("carousel.heroLine1") : STATIC_HEADLINE_LINE_1}
            <br />
            <span style={{ color: GOLD }} className="font-semibold">
              {hydrated ? t("carousel.heroLine2") : STATIC_HEADLINE_LINE_2}
            </span>
          </h1>
        </div>
      </div>

      {/* Image area */}
      <div className="relative w-full h-[54vh] md:h-[60vh]" style={{ backgroundColor: BEIGE }}>
        {index === 0 ? (
          // LCP image — plain <img>, no JS animation, paints immediately.
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
          // Subsequent slides — framer-motion only loads here.
          <Suspense
            fallback={
              <img
                src={slide.image}
                srcSet={`${slide.imageSm} 480w, ${slide.image} 800w`}
                sizes="(max-width: 640px) 480px, 800px"
                alt={slide.alt}
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: "contain", backgroundColor: BEIGE }}
              />
            }
          >
            <MotionRotator slide={slide} index={index} />
          </Suspense>
        )}
      </div>

      {/* Text area — CSS transition only, no framer-motion */}
      <div
        className="relative w-full flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "12vh", backgroundColor: BEIGE, paddingTop: "0.75rem", paddingBottom: "0.5rem" }}
      >
        <div
          key={`txt-${index}`}
          className="max-w-3xl animate-fade-in"
        >
          <h2 className="font-extrabold tracking-tight leading-tight text-lg sm:text-xl md:text-3xl text-[#2b2725]">
            {slide.headline}
          </h2>
          <p
            className="mt-2 md:mt-3 text-xs sm:text-sm md:text-base font-light whitespace-pre-line"
            style={{ color: "#5a5550" }}
          >
            {slide.sub}
          </p>
        </div>

        {/* Dots */}
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
      </div>
    </section>
  );
};

export default HeroCarousel;

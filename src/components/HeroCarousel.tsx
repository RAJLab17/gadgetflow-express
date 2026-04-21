import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slide0 from "@/assets/hero-carousel/slide-0-specs.webp";
import slide0Sm from "@/assets/hero-carousel/slide-0-specs-480.webp";
import slide1 from "@/assets/hero-carousel/slide-1-vorher-nachher.webp";
import slide1Sm from "@/assets/hero-carousel/slide-1-vorher-nachher-480.webp";
import slide2 from "@/assets/hero-carousel/slide-2-clean.webp";
import slide2Sm from "@/assets/hero-carousel/slide-2-clean-480.webp";
import slide3 from "@/assets/hero-carousel/slide-3-fast.webp";
import slide3Sm from "@/assets/hero-carousel/slide-3-fast-480.webp";
import slide4 from "@/assets/hero-carousel/slide-4-clean.webp";
import slide4Sm from "@/assets/hero-carousel/slide-4-clean-480.webp";
import slide5 from "@/assets/hero-carousel/slide-5-desire.webp";
import slide5Sm from "@/assets/hero-carousel/slide-5-desire-480.webp";
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
    image: slide1,
    imageSm: slide1Sm,
    alt: "Vorher Nachher Kabelchaos vs RAJ NEXUS",
    headline: t("carousel.s1.headline"),
    sub: t("carousel.s1.sub"),
  },
  {
    image: slide2,
    imageSm: slide2Sm,
    alt: "ONE PLACE ALL YOUR POWER - 3-in-1 Wireless Charger",
    headline: t("carousel.s2.headline"),
    sub: t("carousel.s2.sub"),
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
  {
    image: slide5,
    imageSm: slide5Sm,
    alt: "RAJ NEXUS - Designed to be desired",
    headline: t("carousel.s5.headline"),
    sub: t("carousel.s5.sub"),
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
        <div className="container mx-auto px-4 pt-7 md:pt-14 pb-5 md:pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1
              className="font-semibold tracking-tight leading-[1.15] text-[#2b2725] text-2xl sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", letterSpacing: "-0.015em" }}
            >
              {t("carousel.heroLine1")}
              <br />
              <span style={{ color: GOLD }} className="font-normal">{t("carousel.heroLine2")}</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Image area — full image, no cropping */}
      <div
        className="relative w-full h-[54vh] md:h-[60vh]"
        style={{ backgroundColor: BEIGE }}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={`img-${index}`}
            src={slide.image}
            srcSet={`${slide.imageSm} 480w, ${slide.image} 800w`}
            sizes="(max-width: 640px) 480px, 800px"
            alt={slide.alt}
            width={800}
            height={800}
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            fetchPriority={index === 0 ? "high" : "auto"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain", backgroundColor: BEIGE }}
          />
        </AnimatePresence>
      </div>

      {/* Text area below — synced fade */}
      <div
        className="relative w-full flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "15vh", backgroundColor: BEIGE, paddingTop: "1.5rem", paddingBottom: "2.5rem" }}
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
        <div className="mt-5 flex items-center gap-2">
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

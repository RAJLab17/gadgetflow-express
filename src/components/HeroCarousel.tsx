import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slide1 from "@/assets/hero-carousel/slide-1-vorher-nachher.png";
import slide2 from "@/assets/hero-carousel/slide-2-one-place.jpeg";
import slide3 from "@/assets/hero-carousel/slide-3-fast.jpg";
import slide4 from "@/assets/hero-carousel/slide-4-foldable.jpeg";
import slide5 from "@/assets/hero-carousel/slide-5-desire.jpeg";

type Slide = {
  image: string;
  alt: string;
  headline: string;
  sub: string;
  subColor?: string;
};

const SLIDE_DURATION = 4500;
const BEIGE = "#f0ede6";
const GOLD = "#9b6b3f";

const slides: Slide[] = [
  {
    image: slide1,
    alt: "Vorher Nachher Kabelchaos vs RAJ NEXUS",
    headline: "Kennst du das?",
    sub: "Es gibt eine bessere Lösung.",
  },
  {
    image: slide2,
    alt: "ONE PLACE ALL YOUR POWER - 3-in-1 Wireless Charger",
    headline: "3 Geräte. 1 Ladegerät.",
    sub: "iPhone · Apple Watch · AirPods — gleichzeitig geladen.",
  },
  {
    image: slide3,
    alt: "100% in 1.5 Stunden - 3.3x schneller",
    headline: "100% in 1.5 Stunden.",
    sub: "Qi2.2 zertifiziert. 3.3x schneller.",
  },
  {
    image: slide4,
    alt: "Faltbar und 200g leicht - überall dabei",
    headline: "Faltbar. 200g leicht.",
    sub: "Vom Nachttisch ins Büro. Vom Hotel in den Flieger.",
  },
  {
    image: slide5,
    alt: "RAJ NEXUS - Designed to be desired",
    headline: "Designed to be desired.",
    sub: "RAJ NEXUS · From Switzerland",
    subColor: GOLD,
  },
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), []);
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
      {/* Image area — full image, no cropping */}
      <div
        className="relative w-full"
        style={{ height: "70vh", backgroundColor: BEIGE }}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={`img-${index}`}
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
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
            <h2 className="font-extrabold tracking-tight leading-tight text-2xl sm:text-3xl md:text-5xl text-[#2b2725]">
              {slide.headline}
            </h2>
            <p
              className="mt-2 md:mt-3 text-base sm:text-lg md:text-xl font-light"
              style={{ color: slide.subColor || "#5a5550" }}
            >
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>

      </div>

    </section>
  );
};

export default HeroCarousel;

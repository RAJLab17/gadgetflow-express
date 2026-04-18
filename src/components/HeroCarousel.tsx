import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import slide1 from "@/assets/hero-carousel/slide-1-vorher-nachher.png";
import slide2 from "@/assets/hero-carousel/slide-2-one-place.jpeg";
import slide3 from "@/assets/hero-carousel/slide-3-fast.jpg";
import slide4 from "@/assets/hero-carousel/slide-4-foldable.jpeg";
import slide5 from "@/assets/hero-carousel/slide-5-desire.jpeg";

type Slide = {
  image: string;
  alt: string;
  render: () => JSX.Element;
};

const SLIDE_DURATION = 4500;

const slides: Slide[] = [
  {
    image: slide1,
    alt: "Vorher Nachher Kabelchaos vs RAJ NEXUS",
    render: () => (
      <>
        <div className="absolute top-[8%] left-[6%] md:top-[10%] md:left-[8%] max-w-[85%]">
          <h2 className="text-white font-extrabold tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl">
            Kennst du das?
          </h2>
        </div>
        <div className="absolute bottom-[14%] left-[6%] md:left-[8%] max-w-[85%]">
          <p className="text-white text-lg sm:text-xl md:text-2xl font-light drop-shadow-lg">
            Es gibt eine bessere Lösung.
          </p>
        </div>
        <motion.div
          className="absolute bottom-[14%] right-[6%] md:right-[8%] flex items-center gap-2 text-white"
          animate={{ x: [0, 8, 0], y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="hidden sm:inline text-sm uppercase tracking-widest">Entdecken</span>
          <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
      </>
    ),
  },
  {
    image: slide2,
    alt: "ONE PLACE ALL YOUR POWER - 3-in-1 Wireless Charger",
    render: () => (
      <div className="absolute inset-x-0 top-[10%] md:top-[12%] flex flex-col items-center text-center px-6">
        <h2 className="text-white font-extrabold tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl max-w-5xl">
          3 Geräte. 1 Ladegerät.
        </h2>
        <p className="mt-4 md:mt-6 text-white text-lg sm:text-xl md:text-2xl font-light drop-shadow-lg max-w-3xl">
          iPhone · Apple Watch · AirPods — gleichzeitig geladen.
        </p>
      </div>
    ),
  },
  {
    image: slide3,
    alt: "100% in 1.5 Stunden - 3.3x schneller",
    render: () => (
      <div className="absolute top-[10%] left-[6%] md:top-[12%] md:left-[8%] max-w-[88%]">
        <h2 className="text-white font-extrabold tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl">
          100% in 1.5 Stunden.
        </h2>
        <p className="mt-4 md:mt-6 text-white text-lg sm:text-xl md:text-2xl font-light drop-shadow-lg max-w-2xl">
          Qi2.2 zertifiziert. 3.3x schneller als herkömmliche Charger.
        </p>
      </div>
    ),
  },
  {
    image: slide4,
    alt: "Faltbar und 200g leicht - überall dabei",
    render: () => (
      <div className="absolute inset-x-0 bottom-[14%] md:bottom-[16%] flex flex-col items-center text-center px-6">
        <h2 className="text-white font-extrabold tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl max-w-5xl">
          Faltbar. 200g leicht.
        </h2>
        <p className="mt-4 md:mt-6 text-white text-lg sm:text-xl md:text-2xl font-light drop-shadow-lg max-w-3xl">
          Vom Nachttisch ins Büro. Vom Hotel in den Flieger.
        </p>
      </div>
    ),
  },
  {
    image: slide5,
    alt: "RAJ NEXUS - Designed to be desired",
    render: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-white font-extrabold tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl max-w-5xl">
          Designed to be desired.
        </h2>
        <p
          className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl font-light tracking-[0.2em] uppercase drop-shadow-lg"
          style={{ color: "#9b6b3f" }}
        >
          RAJ NEXUS · From Switzerland
        </p>
      </div>
    ),
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
      className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/25" />
          {slide.render()}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === index ? "#9b6b3f" : "#d4c5b0",
              transform: i === index ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-5 right-5 hidden md:flex items-center gap-2 text-white/70 z-10"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};

export default HeroCarousel;

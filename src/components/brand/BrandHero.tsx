import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusLaptop from "@/assets/lifestyle-laptop-clean.webp";
import nexusBedroom from "@/assets/lifestyle-nexus-bedside.jpg";
import nexusSuite from "@/assets/lifestyle-nexus-suite.jpg";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const SLIDES = [nexusBedroom, nexusLaptop, nexusSuite];
const SLIDE_DURATION = 6000;

const BrandHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
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
      setIndex((i) => (dx < 0 ? (i + 1) % SLIDES.length : (i - 1 + SLIDES.length) % SLIDES.length));
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 2000);
  };

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden flex items-end"
      style={{ background: "#0a0908" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Rotating lifestyle images with parallax + Ken Burns */}
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[index]})` }}
          />
        </AnimatePresence>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.25) 35%, rgba(10,9,8,0.85) 80%, rgba(10,9,8,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(200,148,107,0.25), transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-24 left-0 right-0 z-10 text-center px-4"
      >
        <span
          className="text-[10px] font-light uppercase"
          style={{ color: GOLD, letterSpacing: "0.6em" }}
        >
          {t("brand.hero.eyebrow")}
        </span>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 sm:px-10 pb-20 sm:pb-28"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[7rem] xl:text-[8.5rem] font-extralight text-white leading-[0.9] tracking-[-0.03em] max-w-6xl"
        >
          {t("brand.hero.h1.line1")}
          <br />
          <span className="italic font-thin" style={{ color: GOLD_SOFT }}>
            {t("brand.hero.h1.line2")}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 max-w-5xl"
        >
          <p
            className="text-base sm:text-lg text-white/70 font-light max-w-md leading-relaxed whitespace-pre-line"
            style={{ letterSpacing: "0.01em" }}
          >
            {t("brand.hero.sub")}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/nexus"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 hover:gap-5"
              style={{
                background: GOLD,
                color: "#0a0908",
                letterSpacing: "0.25em",
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                boxShadow: `0 14px 40px -12px ${GOLD}`,
              }}
            >
              {t("brand.hero.cta.primary")}
            </Link>
            <Link
              to="/ueber-raj"
              className="text-[11px] font-light uppercase text-white/60 hover:text-white transition-colors"
              style={{ letterSpacing: "0.3em" }}
            >
              {t("brand.hero.cta.secondary")}
            </Link>
          </div>
        </motion.div>

        {/* Slide indicators */}
        <div className="mt-10 flex items-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-px transition-all duration-700 ease-out"
              style={{
                width: i === index ? "56px" : "20px",
                background: i === index ? GOLD_SOFT : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ background: `linear-gradient(180deg, transparent, ${GOLD_SOFT})` }}
        />
      </motion.div>
    </section>
  );
};

export default BrandHero;

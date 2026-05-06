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
      className="relative h-[100svh] min-h-[640px] overflow-hidden flex items-center sm:items-center"
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
            "linear-gradient(180deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.25) 25%, rgba(10,9,8,0.70) 65%, rgba(10,9,8,0.98) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.50) 40%, rgba(10,9,8,0.05) 70%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 75% 35%, rgba(200,148,107,0.18), transparent 65%)",
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 sm:px-10 pt-24 sm:pt-28 pb-20 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
          {/* Left: Headline + CTAs */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[12vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[5rem] xl:text-[5.75rem] font-extralight text-white leading-[0.98] tracking-[-0.035em]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75), 0 2px 12px rgba(0,0,0,0.6)" }}
            >
              {t("brand.hero.h1.line1")}
              <br />
              <span className="italic font-thin" style={{ color: GOLD_SOFT, textShadow: "0 4px 40px rgba(0,0,0,0.75)" }}>
                {t("brand.hero.h1.line2")}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
            >
              <Link
                to="/nexus"
                className="group inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full transition-all duration-500 hover:gap-5 self-start"
                style={{
                  background: GOLD,
                  color: "#0a0908",
                  letterSpacing: "0.28em",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  boxShadow: `0 14px 40px -12px ${GOLD}`,
                }}
              >
                {t("brand.hero.cta.primary")}
              </Link>

              <div className="flex items-center gap-5 text-[10px] font-light uppercase">
                <Link
                  to="/ueber-raj"
                  className="text-white/85 hover:text-white transition-colors"
                  style={{ letterSpacing: "0.32em", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                >
                  {t("brand.hero.cta.secondary")}
                </Link>
                <span className="w-px h-3" style={{ background: `${GOLD_SOFT}88` }} />
                <a
                  href="#ecosystem"
                  className="text-white/85 hover:text-white transition-colors"
                  style={{ letterSpacing: "0.32em", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                >
                  {t("brand.story.link.eco.eyebrow")}
                </a>
              </div>
            </motion.div>

            {/* Slide indicators */}
            <div className="mt-12 flex items-center gap-3">
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
          </div>

          {/* Right: Brand manifesto as editorial pull-quote */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:pl-8 lg:border-l lg:max-w-md lg:ml-auto"
            style={{ borderColor: `${GOLD_SOFT}40` }}
          >
            <p
              className="text-[10px] uppercase mb-5 font-light"
              style={{ letterSpacing: "0.4em", color: GOLD_SOFT, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              — Manifest
            </p>
            <p
              className="text-lg sm:text-xl text-white font-extralight leading-[1.6] whitespace-pre-line italic"
              style={{ letterSpacing: "0.005em", textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)" }}
            >
              {t("brand.hero.sub")}
            </p>
          </motion.aside>
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

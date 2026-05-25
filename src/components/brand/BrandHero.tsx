import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusLaptop from "@/assets/lifestyle-laptop-clean.webp";
import nexusSuite from "@/assets/lifestyle-nexus-suite.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const nexusBedroom = "/assets/hero/lifestyle-nexus-bedside.webp";

const SLIDES = [
  { src: nexusBedroom, position: "center 30%" },
  { src: nexusLaptop, position: "65% center" },
  { src: nexusSuite, position: "40% center" },
];
const SLIDE_DURATION = 6000;

const BrandHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const goTo = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        const px = parallaxRef.current;
        const fd = fadeRef.current;
        if (!el || !px || !fd) return;
        const rect = el.getBoundingClientRect();
        const h = rect.height || 1;
        const p = Math.min(1, Math.max(0, -rect.top / h));
        const y = p * 200;
        const scale = 1 + p * 0.15;
        px.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        fd.style.opacity = String(Math.max(0, 1 - p / 0.8));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
      className="relative h-[100svh] min-h-[640px] overflow-hidden flex items-start"
      style={{ background: "#0a0908" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background slides */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            aria-hidden={i !== index}
            className="absolute inset-0 bg-cover transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              backgroundImage: `url(${slide.src})`,
              backgroundPosition: slide.position,
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.45) 30%, rgba(10,9,8,0.40) 55%, rgba(10,9,8,0.82) 75%, rgba(10,9,8,0.98) 100%)" }} />
      <div className="absolute inset-x-0 top-0 h-[50%] pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 70% at 30% 30%, rgba(10,9,8,0.6), transparent 70%)" }} />
      <div className="absolute inset-0 hidden sm:block" style={{ background: "linear-gradient(90deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.50) 40%, rgba(10,9,8,0.05) 70%)" }} />
      <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ background: "radial-gradient(ellipse at 75% 35%, rgba(200,148,107,0.18), transparent 65%)" }} />

      <div
        ref={fadeRef}
        className="relative z-10 w-full px-6 sm:px-10"
        style={{ paddingTop: "clamp(80px, 12vh, 120px)" }}
      >
        {/* BUTTONS — top, left-aligned */}
        <div
          className="raj-rise-sm flex flex-row items-center gap-3 mb-10 sm:mb-12"
          style={{ animationDelay: "0.2s", animationDuration: "1s" }}
        >
          <Link
            to="/nexus"
            className="group inline-flex items-center justify-center gap-2 rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(160deg, ${GOLD_SOFT} 0%, ${GOLD} 60%, #7a4e2a 100%)`,
              color: "#0a0908",
              letterSpacing: "0.2em",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "14px 28px",
              boxShadow: `0 20px 50px -12px ${GOLD}aa, 0 8px 20px -8px ${GOLD}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
              whiteSpace: "nowrap",
            }}
          >
            NEXUS entdecken
            <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ fontSize: "12px" }}>→</span>
          </Link>

          <button
            disabled
            aria-disabled="true"
            className="inline-flex items-center justify-center rounded-full cursor-not-allowed"
            style={{
              background: "rgba(10,8,6,0.55)",
              border: `1px solid rgba(201,168,118,0.35)`,
              color: `rgba(201,168,118,0.5)`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              letterSpacing: "0.2em",
              fontSize: "10px",
              fontWeight: 400,
              textTransform: "uppercase",
              padding: "14px 28px",
              whiteSpace: "nowrap",
              boxShadow: `inset 0 1px 0 rgba(201,168,118,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)`,
            }}
          >
            Kaufen — CHF 99
          </button>
        </div>

        {/* TITLE */}
        <h1
          className="raj-rise text-[13vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[5rem] xl:text-[5.75rem] font-extralight text-white leading-[1.0] tracking-[-0.03em]"
          style={{
            textShadow: "0 4px 40px rgba(0,0,0,0.75), 0 2px 12px rgba(0,0,0,0.6)",
            animationDuration: "1.4s",
            animationDelay: "0.4s",
            maxWidth: "600px",
          }}
        >
          {t("brand.hero.h1.line1")}
          <br />
          <span className="italic font-thin" style={{ color: GOLD_SOFT, textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,0.9), 0 8px 48px rgba(0,0,0,0.85)" }}>
            {t("brand.hero.h1.line2")}
          </span>
        </h1>

        {/* Slide indicators */}
        <div className="mt-8 flex items-center gap-3">
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

        {/* MANIFEST mobile */}
        <div
          className="raj-rise mt-10 lg:hidden"
          style={{ animationDelay: "0.9s", animationDuration: "1.2s", maxWidth: "420px" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
            <p className="text-[9px] uppercase font-light" style={{ letterSpacing: "0.45em", color: GOLD_SOFT }}>Manifest</p>
          </div>
          <p className="text-base text-white font-extralight leading-[1.6] italic" style={{ letterSpacing: "0.005em", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            {t("brand.hero.sub").split("\n")[0]}
          </p>
        </div>

        {/* MANIFEST desktop */}
        <div
          className="raj-rise hidden lg:block mt-10"
          style={{ animationDelay: "0.9s", animationDuration: "1.2s", maxWidth: "480px" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
            <p className="text-[10px] uppercase font-light" style={{ letterSpacing: "0.45em", color: GOLD_SOFT }}>Manifest</p>
          </div>
          {t("brand.hero.sub").split("\n").map((line, i, arr) => (
            <p key={i} className="text-xl text-white font-extralight leading-[1.6] italic" style={{ letterSpacing: "0.005em", textShadow: "0 2px 16px rgba(0,0,0,0.9)", marginBottom: i < arr.length - 1 ? "0.75rem" : 0 }}>
              {line}
            </p>
          ))}
          <p className="mt-6 text-[10px] uppercase font-normal" style={{ letterSpacing: "0.5em", color: GOLD_SOFT }}>— RAJ</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="raj-fade absolute bottom-6 left-1/2 -translate-x-1/2 z-10" style={{ animationDelay: "1.5s", animationDuration: "1s" }}>
        <div className="w-px h-10 animate-float-slow" style={{ background: `linear-gradient(180deg, transparent, ${GOLD_SOFT})` }} />
      </div>
    </section>
  );
};

export default BrandHero;

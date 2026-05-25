import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusLaptop from "@/assets/lifestyle-laptop-clean.webp";
import nexusSuite from "@/assets/lifestyle-nexus-suite.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

// First slide is served from /public so the <link rel="preload"> in index.html
// hits the exact same URL — guarantees the LCP image is reused instantly.
const nexusBedroom = "/assets/hero/lifestyle-nexus-bedside.webp";

const SLIDES = [nexusBedroom, nexusLaptop, nexusSuite];
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

  // Lightweight scroll-linked parallax via CSS vars (rAF throttled).
  // Cheaper than framer-motion `useScroll/useTransform` which run per-frame
  // and force layout reads.
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
        // 0 at top, 1 when fully scrolled past
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
      className="relative h-[100svh] min-h-[640px] overflow-hidden flex items-center sm:items-center"
      style={{ background: "#0a0908" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Rotating lifestyle images with parallax — pure CSS cross-fade */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {SLIDES.map((src, i) => (
          <div
            key={src}
            aria-hidden={i !== index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,8,0.75) 0%, rgba(10,9,8,0.55) 20%, rgba(10,9,8,0.45) 40%, rgba(10,9,8,0.80) 70%, rgba(10,9,8,0.98) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 30% 40%, rgba(10,9,8,0.65), transparent 70%)",
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

      <div
        ref={fadeRef}
        className="relative z-10 container mx-auto px-6 sm:px-10 pt-24 sm:pt-28 pb-20 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-end">
          {/* Left */}
          <div className="lg:col-span-7">
            <h1
              className="raj-rise text-[12vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[5rem] xl:text-[5.75rem] font-extralight text-white leading-[0.98] tracking-[-0.035em]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75), 0 2px 12px rgba(0,0,0,0.6)", animationDuration: "1.4s" }}
            >
              {t("brand.hero.h1.line1")}
              <br />
              <span
                className="italic font-thin"
                style={{
                  color: GOLD_SOFT,
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,0.9), 0 8px 48px rgba(0,0,0,0.85), 0 0 60px rgba(0,0,0,0.6)",
                }}
              >
                {t("brand.hero.h1.line2")}
              </span>
            </h1>

            <div
              className="raj-rise-sm mt-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
              style={{ animationDelay: "0.7s", animationDuration: "1s" }}
            >
              <div className="flex flex-col gap-3">
                <Link
                  to="/nexus"
                  className="group inline-flex items-center justify-center gap-3 py-5 px-10 rounded-full transition-all duration-500 hover:gap-5 self-start"
                  style={{
                    background: GOLD,
                    color: "#0a0908",
                    letterSpacing: "0.28em",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    boxShadow: `0 20px 50px -12px ${GOLD}, 0 8px 20px -8px ${GOLD}`,
                  }}
                >
                  RAJ NEXUS entdecken →
                </Link>

                <p
                  className="sm:hidden text-center"
                  style={{
                    color: GOLD_SOFT,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textShadow: "0 1px 8px rgba(0,0,0,0.85)",
                  }}
                >
                  CHF 99.– · Founder Edition · Nur 100 Stück
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-[11px] font-normal uppercase">
                <Link
                  to="/ueber-raj"
                  className="group inline-flex items-center gap-2 text-white hover:text-white transition-all"
                  style={{ letterSpacing: "0.28em", textShadow: "0 1px 8px rgba(0,0,0,0.85)" }}
                >
                  <span className="relative pb-1 border-b" style={{ borderColor: `${GOLD_SOFT}` }}>
                    {t("brand.hero.cta.secondary")}
                  </span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ color: GOLD_SOFT }}>→</span>
                </Link>
                <span className="w-px h-4" style={{ background: `${GOLD_SOFT}88` }} />
                <a
                  href="#ecosystem"
                  className="group inline-flex items-center gap-2 text-white hover:text-white transition-all"
                  style={{ letterSpacing: "0.28em", textShadow: "0 1px 8px rgba(0,0,0,0.85)" }}
                >
                  <span className="relative pb-1 border-b" style={{ borderColor: `${GOLD_SOFT}` }}>
                    {t("brand.story.link.eco.eyebrow")}
                  </span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ color: GOLD_SOFT }}>→</span>
                </a>
              </div>
            </div>

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

          {/* Manifesto */}
          <aside
            className="raj-rise lg:col-span-5 lg:pl-8 lg:border-l lg:max-w-md lg:ml-auto relative"
            style={{ animationDelay: "0.9s", animationDuration: "1.2s", borderColor: `${GOLD_SOFT}40` }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-px w-8 sm:w-10" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
              <p
                className="text-[9px] sm:text-[10px] uppercase font-light"
                style={{ letterSpacing: "0.45em", color: GOLD_SOFT, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
              >
                Manifest
              </p>
            </div>
            {t("brand.hero.sub").split("\n").map((line, i, arr) => (
              <p
                key={i}
                className="text-base sm:text-xl text-white font-extralight leading-[1.55] sm:leading-[1.6] italic"
                style={{
                  letterSpacing: "0.005em",
                  textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)",
                  marginBottom: i < arr.length - 1 ? "0.75rem" : 0,
                }}
              >
                {line}
              </p>
            ))}
            <p
              className="mt-5 sm:mt-7 text-[9px] sm:text-[10px] uppercase font-normal"
              style={{ letterSpacing: "0.5em", color: GOLD_SOFT, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              — RAJ
            </p>
          </aside>
        </div>
      </div>

      <div
        className="raj-fade absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        style={{ animationDelay: "1.5s", animationDuration: "1s" }}
      >
        <div
          className="w-px h-10 animate-float-slow"
          style={{ background: `linear-gradient(180deg, transparent, ${GOLD_SOFT})` }}
        />
      </div>
    </section>
  );
};

export default BrandHero;

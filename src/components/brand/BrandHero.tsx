import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusLaptop from "@/assets/lifestyle-laptop-clean.webp";
import nexusSuite from "@/assets/lifestyle-nexus-suite.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const nexusBedroom = "/assets/hero/lifestyle-nexus-bedside.webp";
const nexusBedroomMobile = "/assets/hero/mobile-bedside.webp";
const nexusLaptopMobile = "/assets/hero/mobile-laptop.webp";
const nexusSuiteMobile = "/assets/hero/mobile-suite.webp";

const SLIDES = [
  { src: nexusBedroom, mobileSrc: nexusBedroomMobile, position: "center 30%", mobilePosition: "center center" },
  { src: nexusLaptop, mobileSrc: nexusLaptopMobile, position: "65% center", mobilePosition: "center center" },
  { src: nexusSuite, mobileSrc: nexusSuiteMobile, position: "40% center", mobilePosition: "center 35%" },
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
      className="relative h-[100svh] min-h-[640px] overflow-hidden flex items-center sm:items-center"
      style={{ background: "#0a0908" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {/* Desktop slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={`d-${slide.src}`}
            aria-hidden={i !== index}
            className="absolute inset-0 bg-cover transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hidden lg:block"
            style={{
              backgroundImage: `url(${slide.src})`,
              backgroundPosition: slide.position,
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}
        {/* Mobile slides — premium framed, product-centric, with subtle Ken-Burns */}
        {SLIDES.map((slide, i) => (
          <div
            key={`m-${slide.src}`}
            aria-hidden={i !== index}
            className="absolute inset-0 overflow-hidden transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden"
            style={{
              backgroundColor: "#0a0908",
              opacity: i === index ? 1 : 0,
            }}
          >
            <div
              key={i === index ? `kb-${index}` : `kb-idle-${i}`}
              className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
              style={{
                backgroundImage: `url(${slide.mobileSrc})`,
                backgroundPosition: slide.mobilePosition,
                animation: i === index ? "raj-ken-burns 9s ease-out both" : undefined,
                transform: i === index ? undefined : "scale(1.04)",
              }}
            />

          </div>
        ))}
      </div>

      {/* Desktop overlays (heavier left gradient for text legibility) */}
      <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.75) 0%, rgba(10,9,8,0.55) 20%, rgba(10,9,8,0.45) 40%, rgba(10,9,8,0.80) 70%, rgba(10,9,8,0.98) 100%)" }} />
      <div className="absolute inset-x-0 top-0 h-[55%] pointer-events-none hidden lg:block" style={{ background: "radial-gradient(ellipse 90% 70% at 30% 40%, rgba(10,9,8,0.65), transparent 70%)" }} />
      <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(90deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.50) 40%, rgba(10,9,8,0.05) 70%)" }} />
      <div className="absolute inset-0 mix-blend-overlay opacity-40 hidden lg:block" style={{ background: "radial-gradient(ellipse at 75% 35%, rgba(200,148,107,0.18), transparent 65%)" }} />

      {/* Mobile overlays — premium vignette: dark top for text, BRIGHT product center, soft bottom fade */}
      {/* 1) Top dimmer only for headline area */}
      <div className="absolute inset-x-0 top-0 h-[42%] lg:hidden pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.65) 50%, rgba(10,9,8,0) 100%)" }} />
      {/* 2) Bottom fade for manifest readability */}
      <div className="absolute inset-x-0 bottom-0 h-[32%] lg:hidden pointer-events-none" style={{ background: "linear-gradient(0deg, rgba(10,9,8,0.96) 0%, rgba(10,9,8,0.70) 45%, rgba(10,9,8,0) 100%)" }} />
      {/* 3) Edge vignette — darkens corners, lets product center shine */}
      <div className="absolute inset-0 lg:hidden pointer-events-none" style={{ background: "radial-gradient(ellipse 95% 70% at 50% 55%, transparent 35%, rgba(10,9,8,0.55) 90%)" }} />
      {/* 4) Subtle gold halo behind product */}
      <div className="absolute inset-0 lg:hidden pointer-events-none mix-blend-overlay opacity-60" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(200,148,107,0.28), transparent 70%)" }} />


      {/* ===================== MOBILE LAYOUT (lg:hidden, additive) ===================== */}
      <div className="lg:hidden absolute inset-0 z-10 flex flex-col pt-[104px] pb-16 px-6">
        {/* CTAs — ganz oben */}
        <div
          className="raj-rise-sm flex flex-row items-center justify-center gap-3"
          style={{ animationDelay: "0.2s", animationDuration: "1s" }}
        >
          <Link
            to="/nexus"
            className="group inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full transition-all duration-500 active:scale-[0.98]"
            style={{
              background: `linear-gradient(160deg, ${GOLD_SOFT} 0%, ${GOLD} 60%, #7a4e2a 100%)`,
              color: "#0a0908",
              letterSpacing: "0.2em",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              boxShadow: `0 20px 50px -12px ${GOLD}aa, 0 8px 20px -8px ${GOLD}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
              whiteSpace: "nowrap",
            }}
          >
            NEXUS entdecken
            <span style={{ fontSize: "12px" }}>→</span>
          </Link>
          <button
            disabled
            aria-disabled="true"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full cursor-not-allowed"
            style={{
              background: "rgba(201,168,118,0.07)",
              border: `1px solid ${GOLD_SOFT}50`,
              color: `${GOLD_SOFT}90`,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              letterSpacing: "0.2em",
              fontSize: "10px",
              fontWeight: 500,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              boxShadow: `inset 0 1px 0 rgba(201,168,118,0.15), 0 4px 20px rgba(0,0,0,0.2)`,
            }}
          >
            Kaufen — CHF 99
          </button>
        </div>

        {/* H1 — "Energie," 1 Zeile, "in Form gegossen" 1 Zeile */}
        <h1
          className="raj-rise mt-10 text-left font-extralight text-white leading-[0.95] tracking-[-0.035em]"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75), 0 2px 12px rgba(0,0,0,0.6)", animationDuration: "1.4s" }}
        >
          <span className="block text-[11vw]">{t("brand.hero.h1.line1")}</span>
          <span
            className="italic font-thin block text-[11vw] whitespace-nowrap"
            style={{ color: GOLD_SOFT, lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,0.9), 0 8px 48px rgba(0,0,0,0.85)" }}
          >
            in Form gegossen
          </span>
        </h1>


        {/* Carousel dots */}
        <div className="raj-rise mt-7 flex items-center justify-start gap-3" style={{ animationDelay: "0.6s", animationDuration: "1s" }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-px transition-all duration-700 ease-out"
              style={{
                width: i === index ? "48px" : "18px",
                background: i === index ? GOLD_SOFT : "rgba(255,255,255,0.32)",
              }}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Manifest — erster Satz, über dem Pfeil */}
        <div className="raj-fade flex flex-col items-center text-center" style={{ animationDelay: "0.9s", animationDuration: "1.2s" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_SOFT})` }} />
            <p className="text-[9px] uppercase font-light" style={{ letterSpacing: "0.45em", color: GOLD_SOFT, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              Manifest
            </p>
            <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
          </div>
          <p
            className="text-[12px] text-white font-extralight italic leading-[1.6]"
            style={{ letterSpacing: "0.01em", textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)" }}
          >
            <span className="block whitespace-nowrap">Das Gewöhnliche überzeugt durch Lautstärke.</span>
            <span className="block whitespace-nowrap">Das Aussergewöhnliche durch Stille.</span>
          </p>

        </div>
      </div>

      {/* Mobile-only Helligkeit: macht das Produkt-Bild besser sichtbar (überlagert nur die dunklen Overlays auf Mobile) */}
      <div
        className="lg:hidden absolute inset-x-0 z-[5] pointer-events-none"
        style={{
          top: "30%",
          bottom: "30%",
          background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,255,255,0.12), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />


      {/* ===================== DESKTOP LAYOUT (unchanged, hidden on mobile) ===================== */}
      <div ref={fadeRef} className="relative z-10 container mx-auto px-6 sm:px-10 pt-28 sm:pt-28 pb-20 w-full hidden lg:block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-end">
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            <div
              className="raj-rise-sm mb-8 sm:mb-10 flex flex-row items-center justify-start gap-3"
              style={{ animationDelay: "0.3s", animationDuration: "1s" }}
            >
              <Link
                to="/nexus"
                className="group inline-flex items-center justify-center gap-2 py-3.5 px-7 sm:py-4 sm:px-9 rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(160deg, ${GOLD_SOFT} 0%, ${GOLD} 60%, #7a4e2a 100%)`,
                  color: "#0a0908",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
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
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 sm:py-4 sm:px-9 rounded-full cursor-not-allowed"
                style={{
                  background: "rgba(201,168,118,0.07)",
                  border: `1px solid ${GOLD_SOFT}50`,
                  color: `${GOLD_SOFT}60`,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  boxShadow: `inset 0 1px 0 rgba(201,168,118,0.15), 0 4px 20px rgba(0,0,0,0.2)`,
                }}
              >
                Kaufen — CHF 99
              </button>
            </div>

            <h1
              className="raj-rise text-[12vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[5rem] xl:text-[5.75rem] font-extralight text-white leading-[0.98] tracking-[-0.035em]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75), 0 2px 12px rgba(0,0,0,0.6)", animationDuration: "1.4s" }}
            >
              <span className="block">{t("brand.hero.h1.line1")}</span>
              <span className="italic font-thin block" style={{ color: GOLD_SOFT, textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,0.9), 0 8px 48px rgba(0,0,0,0.85), 0 0 60px rgba(0,0,0,0.6)" }}>
                {t("brand.hero.h1.line2")}
              </span>
            </h1>

            <div className="mt-10 flex items-center justify-start gap-3">
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

          <aside
            className="raj-rise hidden lg:block lg:col-span-5 lg:pl-8 lg:border-l lg:max-w-md lg:ml-auto relative"
            style={{ animationDelay: "0.9s", animationDuration: "1.2s", borderColor: `${GOLD_SOFT}40` }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-px w-8 sm:w-10" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
              <p className="text-[9px] sm:text-[10px] uppercase font-light" style={{ letterSpacing: "0.45em", color: GOLD_SOFT, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
                Manifest
              </p>
            </div>
            {t("brand.hero.sub").split("\n").map((line, i, arr) => (
              <p
                key={i}
                className="text-base sm:text-xl text-white font-extralight leading-[1.55] sm:leading-[1.6] italic"
                style={{ letterSpacing: "0.005em", textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)", marginBottom: i < arr.length - 1 ? "0.75rem" : 0 }}
              >
                {line}
              </p>
            ))}
            <p className="mt-5 sm:mt-7 text-[9px] sm:text-[10px] uppercase font-normal" style={{ letterSpacing: "0.5em", color: GOLD_SOFT, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              — RAJ
            </p>
          </aside>
        </div>
      </div>

      <div className="raj-fade absolute bottom-6 left-1/2 -translate-x-1/2 z-10" style={{ animationDelay: "1.5s", animationDuration: "1s" }}>
        <div className="w-px h-10 animate-float-slow" style={{ background: `linear-gradient(180deg, transparent, ${GOLD_SOFT})` }} />
      </div>
    </section>
  );
};

export default BrandHero;

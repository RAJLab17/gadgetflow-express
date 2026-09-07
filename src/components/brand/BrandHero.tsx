import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

/**
 * BrandHero — Editorial Swiss Luxury.
 * Eine ruhige Typo-Bühne: Headline + Manifest auf dunklem Grund,
 * sanftes Gold-Licht. Kein lauter Banner — das Produkt lebt in "Die Objekte".
 */
const BrandHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Sanftes Ausblenden des Hero-Inhalts beim Scrollen — ruhig, nicht springend.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        const fd = fadeRef.current;
        if (!el || !fd) return;
        const rect = el.getBoundingClientRect();
        const h = rect.height || 1;
        const p = Math.min(1, Math.max(0, -rect.top / h));
        fd.style.opacity = String(Math.max(0, 1 - p / 0.9));
        fd.style.transform = `translateY(${p * -24}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[72svh] min-h-[540px] lg:h-[680px] lg:min-h-[680px] flex items-start pt-32 sm:pt-36 lg:pt-36 overflow-hidden border-b"
      style={{ background: "#0a0908", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Sanftes Gold-Licht oben rechts — Editorial-Stimmung */}
      <div
        className="absolute top-0 right-0 w-[65%] h-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 80% at 80% 30%, rgba(200,148,107,0.10), transparent 65%)",
        }}
      />
      {/* Dezente Vignette für Tiefenwirkung */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 50%, rgba(10,9,8,0.55) 100%)" }}
      />

      <div
        ref={fadeRef}
        className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-20 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Headline + CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div
              className="raj-rise-sm mb-8 sm:mb-10 flex flex-row items-center justify-start gap-3"
              style={{ animationDelay: "0.2s", animationDuration: "1s" }}
            >
              <Link
                to="/nexus"
                className="group inline-flex items-center justify-center gap-2 py-3 px-5 sm:py-3.5 sm:px-7 rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(160deg, ${GOLD_SOFT} 0%, ${GOLD} 60%, #7a4e2a 100%)`,
                  color: "#0a0908",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  boxShadow: `0 20px 50px -12px ${GOLD}aa, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  whiteSpace: "nowrap",
                }}
              >
                {t("brand.hero.cta.primary")}
                <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ fontSize: "12px" }}>→</span>
              </Link>
              <Link
                to="/produkte"
                className="inline-flex items-center justify-center gap-2 py-3 px-5 sm:py-3.5 sm:px-7 rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "rgba(201,168,118,0.05)",
                  border: `1px solid ${GOLD_SOFT}55`,
                  color: GOLD_SOFT,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Produkte entdecken
              </Link>
            </div>

            <h1
              className="raj-rise text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw] xl:text-[5.5rem] font-extralight text-white leading-[1.05] tracking-[-0.035em]"
              style={{ animationDuration: "1.4s" }}
            >
              <span className="block" style={{ paddingBottom: "0.08em" }}>{t("brand.hero.h1.line1")}</span>
              <span
                className="font-serif italic font-light block"
                style={{
                  backgroundImage: `linear-gradient(180deg, #f5dcb8 0%, ${GOLD_SOFT} 48%, ${GOLD} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.35,
                  paddingBottom: "0.16em",
                  marginTop: "0.02em",
                }}
              >
                {t("brand.hero.h1.line2")}
              </span>
            </h1>
          </div>

          {/* Manifest */}
          <aside
            className="raj-fade lg:col-span-5 lg:pl-8 lg:border-l lg:max-w-md lg:ml-auto"
            style={{ animationDelay: "0.9s", animationDuration: "1.2s", borderColor: `${GOLD_SOFT}40` }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-px w-8 sm:w-10" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
              <p
                className="text-[9px] sm:text-[10px] uppercase font-light"
                style={{ letterSpacing: "0.45em", color: GOLD_SOFT }}
              >
                Manifest
              </p>
            </div>
            <p
              className="text-base sm:text-xl text-white/85 font-extralight leading-[1.6] italic font-serif"
              style={{ letterSpacing: "0.005em", marginBottom: "0.75rem" }}
            >
              Das Gewöhnliche überzeugt durch Lautstärke.
            </p>
            <p
              className="text-base sm:text-xl text-white/85 font-extralight leading-[1.6] italic font-serif"
              style={{ letterSpacing: "0.005em" }}
            >
              Das Aussergewöhnliche durch Stille.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="h-px w-12" style={{ background: `${GOLD_SOFT}55` }} />
              <p
                className="text-[9px] sm:text-[10px] uppercase font-normal"
                style={{ letterSpacing: "0.5em", color: `${GOLD_SOFT}cc` }}
              >
                RAJ — Swiss Luxury Tech
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Scroll-Indikator */}
      <div
        className="raj-fade absolute bottom-6 left-6 lg:left-20 flex items-center gap-4 z-10"
        style={{ animationDelay: "1.5s", animationDuration: "1s" }}
      >
        <div className="w-px h-12 animate-float-slow" style={{ background: `linear-gradient(180deg, transparent, ${GOLD_SOFT})` }} />
        <span className="text-[9px] uppercase font-light" style={{ letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)" }}>
          Scrollen
        </span>
      </div>
    </section>
  );
};

export default BrandHero;

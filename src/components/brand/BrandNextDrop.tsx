import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/lib/reveal";
import matrixImg from "@/assets/home/objekt-matrix-correct.jpg";
import apexImg from "@/assets/home/objekt-apex-correct.jpg";
import airpodsRender from "@/assets/matrix/airpods-cherry.webp";

const nexusImg = "/assets/products/nexus-bedside-night.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

/**
 * BrandNextDrop — "Die Objekte" als Editorial-Magazin (Swiss Luxury).
 * Asymmetrisches Raster: NEXUS als grosses Hauptobjekt (kaufbar),
 * MATRIX und APEX als zurückhaltende, seitliche Teaser.
 */
const BrandNextDrop = () => {
  const headRef = useReveal<HTMLDivElement>();
  const nexusRef = useReveal<HTMLDivElement>();
  const matrixRef = useReveal<HTMLDivElement>();
  const apexRef = useReveal<HTMLDivElement>();

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0908 0%, #0c0b0a 100%)" }}
    >
      <div className="container mx-auto px-6 sm:px-10 max-w-[1240px] relative z-10">
        {/* Header — Editorial Hairline */}
        <div
          ref={headRef}
          className="reveal flex flex-col md:flex-row justify-between items-baseline border-b pb-8 mb-16 md:mb-24 gap-6"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="space-y-3">
            <span
              className="text-[10px] uppercase font-light"
              style={{ color: GOLD, letterSpacing: "0.5em" }}
            >
              Kollektion 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">
              Die <span className="font-serif italic">Objekte</span>
            </h2>
          </div>
          <p
            className="max-w-sm text-sm font-light leading-relaxed text-right md:text-right"
            style={{ color: "rgba(245,245,240,0.42)" }}
          >
            Eine Synthese aus Schweizer Präzision und puristischem Design.
            Jedes Objekt eine Antwort auf die Komplexität des Alltags.
          </p>
        </div>

        {/* Editorial Asymmetrisches Raster */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 lg:gap-x-12 gap-y-16 md:gap-y-24">
          {/* NEXUS — Hauptobjekt */}
          <Link
            to="/nexus"
            ref={nexusRef as never}
            className="reveal group block md:col-span-7"
          >

            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src={nexusImg}
                alt="RAJ NEXUS 3-in-1 Wireless Charger auf dem Nachttisch"
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "linear-gradient(180deg, transparent 60%, rgba(10,9,8,0.4))" }}
              />
              <div className="absolute top-5 left-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase font-bold"
                  style={{
                    letterSpacing: "0.25em",
                    color: "#0a0908",
                    background: `linear-gradient(160deg, ${GOLD_SOFT}, ${GOLD})`,
                    boxShadow: `0 8px 24px -8px ${GOLD}aa`,
                  }}
                >
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: "#0a0908" }} />
                  Verfügbar
                </span>
              </div>
            </div>
            <div className="mt-8 flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                  NEXUS
                </h3>
                <p
                  className="text-[11px] uppercase font-medium"
                  style={{ color: GOLD, letterSpacing: "0.2em" }}
                >
                  3-in-1 Qi2.2 Ladestation
                </p>
              </div>
              <div className="text-right space-y-3">
                <p className="text-xl font-extralight tracking-tight text-white">
                  CHF 99.–
                </p>
                <span
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full text-[10px] uppercase font-bold transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(160deg, ${GOLD_SOFT} 0%, ${GOLD} 60%, #7a4e2a 100%)`,
                    color: "#0a0908",
                    letterSpacing: "0.2em",
                    boxShadow: `0 12px 32px -10px ${GOLD}aa`,
                  }}
                >
                  Kaufen
                  <span style={{ fontSize: "12px" }}>→</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Seiten-Spalte: MATRIX & APEX als Teaser */}
          <div className="md:col-span-5 flex flex-col gap-16 md:gap-24">
            {/* MATRIX */}
            <Link to="/matrix" className="reveal group block md:mt-20">
              <div className="relative aspect-[5/6] overflow-hidden rounded-sm">
                <img
                  src={matrixImg}
                  alt="RAJ MATRIX Aramid Case in Cherry Carbon mit goldenem Blitz"
                  width={600}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  style={{ filter: "grayscale(0.55) brightness(0.85)" }}
                />
                <div
                  className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
                  style={{ background: "rgba(10,9,8,0.25)" }}
                />
                <div className="absolute top-5 left-5">
                  <span
                    className="px-3 py-1.5 rounded-full text-[9px] uppercase font-medium italic border"
                    style={{
                      letterSpacing: "0.25em",
                      color: "#f0d9b8",
                      background: "rgba(155,107,63,0.22)",
                      borderColor: "rgba(200,148,107,0.35)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    Als Nächstes
                  </span>
                </div>
                {/* AirPods 4 Case — Inset neben dem iPhone-Case */}
                <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5">
                  <div
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-105"
                    style={{
                      boxShadow: "0 10px 30px -8px rgba(0,0,0,0.55)",
                      border: `1px solid ${GOLD_SOFT}88`,
                    }}
                  >
                    <img
                      src={airpodsRender}
                      alt="RAJ MATRIX AirPods 4 Case in Cherry Carbon"
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="text-[8px] uppercase font-medium"
                    style={{ color: "#f0d9b8", letterSpacing: "0.25em" }}
                  >
                    AirPods 4
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-end gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-light tracking-tight text-white">
                    MATRIX
                  </h3>
                  <p
                    className="text-[10px] uppercase font-light"
                    style={{ color: "rgba(245,245,240,0.4)", letterSpacing: "0.2em" }}
                  >
                    Aramid Schutzhüllen
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase font-medium whitespace-nowrap"
                  style={{ color: GOLD_SOFT, letterSpacing: "0.25em" }}
                >
                  Vorschau
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>

            {/* APEX */}
            <Link to="/apex" className="reveal group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                <img
                  src={apexImg}
                  alt="RAJ APEX MagSafe Auto-Ladehalterung"
                  width={600}
                  height={375}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  style={{ filter: "grayscale(0.55) brightness(0.85)" }}
                />
                <div
                  className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
                  style={{ background: "rgba(10,9,8,0.25)" }}
                />
                <div className="absolute top-5 left-5">
                  <span
                    className="px-3 py-1.5 rounded-full text-[9px] uppercase font-medium border"
                    style={{
                      letterSpacing: "0.25em",
                      color: "#f5f5f0",
                      background: "rgba(10,9,8,0.5)",
                      borderColor: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    Early Access
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-end gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-light tracking-tight text-white">
                    APEX
                  </h3>
                  <p
                    className="text-[10px] uppercase font-light"
                    style={{ color: "rgba(245,245,240,0.4)", letterSpacing: "0.2em" }}
                  >
                    MagSafe Auto-Halterung
                  </p>
                </div>
                <span
                  className="w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-300 group-hover:border-[rgba(200,148,107,0.5)]"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                >
                  <ArrowUpRight
                    className="w-4 h-4 transition-colors duration-300"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Ganze Kollektion */}
        <div className="mt-16 md:mt-20 flex justify-center">
          <Link
            to="/produkte"
            className="group inline-flex items-center gap-2 text-[10px] uppercase font-medium tracking-[0.3em] pb-1 border-b transition-colors"
            style={{ color: GOLD_SOFT, borderColor: `${GOLD_SOFT}55` }}
          >
            Ganze Kollektion
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandNextDrop;

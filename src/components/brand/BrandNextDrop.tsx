import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/lib/reveal";
import matrixImg from "@/assets/home/objekt-matrix-sharp.webp";
import apexImg from "@/assets/home/objekt-apex-correct.jpg";
import airpodsRender from "@/assets/matrix/airpods-cherry-bolt.webp";

const nexusImg = "/assets/products/nexus-bedside-night.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#d7ad82";

/**
 * BrandNextDrop — "Die Objekte" als Editorial-Magazin.
 * Warme Premium-Stillleben, versetztes Raster: NEXUS im Fokus (kaufbar),
 * MATRIX als "Als Nächstes", APEX als "Early Access".
 */
const BrandNextDrop = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section
      className="relative pt-10 md:pt-0 pb-20 md:pb-28 mt-0 md:-mt-36 lg:-mt-44 z-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0908 0%, #121009 100%)" }}
    >
      <div className="container mx-auto px-6 sm:px-10 max-w-[1240px] relative z-10">
        {/* Header — Editorial hairline */}
        <div
          ref={headRef}
          className="reveal flex justify-between items-end border-b pb-5 mb-12 md:mb-16"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span
             className="text-[11px] uppercase font-semibold"
             style={{ color: GOLD_SOFT, letterSpacing: "0.2em" }}
          >
            Kollektion 2026
          </span>
           <h2 className="text-2xl md:text-3xl font-normal italic text-white tracking-normal">
            Die Kollektion
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-14 md:gap-y-20">
          {/* NEXUS — Hauptobjekt */}
          <Link to="/nexus" className="group block">
            <div className="relative mb-6 overflow-hidden rounded-sm">
              <img
                src={nexusImg}
                alt="RAJ NEXUS 3-in-1 Wireless Charger auf dem Nachttisch"
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[3/4] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute top-4 left-4">
                <span
                   className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-semibold border"
                  style={{
                     letterSpacing: "0.12em",
                    color: "#f5f5f0",
                    background: "rgba(10,9,8,0.45)",
                    borderColor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: GOLD_SOFT }} />
                  Verfügbar
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end gap-4">
              <div>
                 <h3 className="text-xl font-medium text-white" style={{ letterSpacing: "0.08em" }}>
                  NEXUS
                </h3>
                 <p className="text-sm font-normal mt-1" style={{ color: "rgba(245,245,240,0.76)" }}>
                  3-in-1 Qi2.2 Wireless Charger
                </p>
              </div>
               <span className="text-base font-medium" style={{ color: GOLD_SOFT }}>
                CHF 99.–
              </span>
            </div>
            <div className="mt-4">
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
          </Link>

          {/* MATRIX — Als Nächstes (versetzt) */}
          <Link to="/matrix" className="group block md:mt-16">
            <div className="relative mb-6 overflow-hidden rounded-sm">
              <img
                src={matrixImg}
                alt="RAJ MATRIX Aramid Case in Cherry Carbon mit goldenem Blitz"
                width={768}
                height={1024}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[3/4] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute top-4 left-4">
                <span
                   className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold italic border"
                  style={{
                     letterSpacing: "0.12em",
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
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden"
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
                   className="text-[10px] uppercase font-semibold"
                   style={{ color: "#f0d9b8", letterSpacing: "0.12em", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                >
                  AirPods 4
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end gap-4">
              <div>
                 <h3 className="text-xl font-medium text-white" style={{ letterSpacing: "0.08em" }}>
                  MATRIX
                </h3>
                 <p className="text-sm font-normal mt-1" style={{ color: "rgba(245,245,240,0.76)" }}>
                  Aramid-Cases für iPhone & AirPods
                </p>
              </div>
              <span
                 className="inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold whitespace-nowrap"
                 style={{ color: GOLD_SOFT, letterSpacing: "0.12em" }}
              >
                Vorschau
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>

          {/* APEX — Early Access (weiter versetzt) */}
          <Link to="/apex" className="group block md:col-span-2 lg:col-span-1 lg:mt-32 md:max-w-[calc(50%-1rem)] lg:max-w-none">
            <div className="relative mb-6 overflow-hidden rounded-sm">
              <img
                src={apexImg}
                alt="RAJ APEX MagSafe Auto-Ladehalterung"
                width={768}
                height={1024}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[3/4] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute top-4 left-4">
                <span
                   className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold border"
                  style={{
                     letterSpacing: "0.12em",
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
            <div className="flex justify-between items-end gap-4">
              <div>
                 <h3 className="text-xl font-medium text-white" style={{ letterSpacing: "0.08em" }}>
                  APEX
                </h3>
                 <p className="text-sm font-normal mt-1" style={{ color: "rgba(245,245,240,0.76)" }}>
                  MagSafe Auto-Ladehalterung
                </p>
              </div>
              <span
                className="w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-300"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <ArrowUpRight className="w-4 h-4 transition-colors duration-300" style={{ color: "rgba(255,255,255,0.5)" }} />
              </span>
            </div>
          </Link>
        </div>

        {/* Ganze Kollektion */}
        <div className="mt-14 md:mt-16 flex justify-center">
          <Link
            to="/produkte"
             className="group inline-flex items-center gap-2 text-[11px] uppercase font-semibold tracking-[0.14em] pb-1 border-b transition-colors"
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/lib/reveal";
import matrixImgAsset from "@/assets/home/matrix-cherry-raj-home.png.asset.json";
import matrixCollection480 from "@/assets/home/matrix-collection-v2-480.webp.asset.json";
import matrixCollection800 from "@/assets/home/matrix-collection-v2-800.webp.asset.json";
import airpodsRender from "@/assets/matrix/airpods-cherry-bolt.webp";
import airpodsPhoto from "@/assets/matrix/airpods-cherry.png";
import apexCarImg from "@/assets/home/objekt-apex-correct.jpg";

const nexusImg = "/assets/products/nexus-bedside-night.webp";
const matrixImg = matrixImgAsset.url;
const GOLD = "#9b6b3f";
const GOLD_SOFT = "#d7ad82";

/**
 * BrandNextDrop — "Die Objekte" als Editorial-Magazin.
 * Warme Premium-Stillleben, versetztes Raster: NEXUS im Fokus (kaufbar),
 * MATRIX als "Jetzt verfügbar", APEX als "Bald verfügbar".
 */
const BrandNextDrop = ({ variant = "default" }: { variant?: "default" | "carousel" }) => {
  const headRef = useReveal<HTMLDivElement>();
  const carousel = variant === "carousel";
  const [active, setActive] = useState(0);
  const card = carousel ? "snap-start shrink-0 w-[82%]" : "";
  const imgH = carousel ? "w-full h-[min(40svh,360px)] object-cover" : "w-full aspect-[3/4] object-cover";
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    setActive(Math.min(2, Math.max(0, Math.round(el.scrollLeft / (w + 16)))));
  };

  return (
    <section
      className={carousel ? "relative pt-5 pb-8 overflow-hidden" : "relative hidden md:block pt-10 md:pt-12 pb-12 md:pb-16 mt-0 z-20 overflow-hidden"}
      style={carousel ? undefined : { background: "linear-gradient(180deg, #0a0908 0%, #121009 100%)" }}
    >
      <div className={carousel ? "relative z-10" : "container mx-auto px-6 sm:px-10 max-w-[1240px] relative z-10"}>
        {/* Header — Editorial hairline */}
        {!carousel && <div
          ref={headRef}
          className="reveal border-b pb-3 md:pb-4 mb-8 md:mb-12"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-2xl md:text-3xl font-normal italic text-white tracking-normal">
            Die Kollektion
          </h2>
        </div>}

        <div
          onScroll={carousel ? onScroll : undefined}
          aria-label={carousel ? "Die Kollektion" : undefined}
          className={carousel ? "mobile-collection-track flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 scroll-px-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-8 gap-y-10 md:gap-y-20"}
        >
          {/* NEXUS — Hauptobjekt */}
          <Link to="/nexus" className={`group block ${card}`}>
            <div className="relative mb-6 overflow-hidden rounded-sm">
              <img
                src={nexusImg}
                alt="RAJ NEXUS 3-in-1 Wireless Charger auf dem Nachttisch"
                width={1200}
                height={1200}
                loading={carousel ? "eager" : "lazy"}
                fetchPriority={carousel ? "high" : undefined}
                decoding="async"
                className={`${imgH} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]`}
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
                CHF 99
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

          {/* MATRIX — Verfügbar (versetzt) */}
          <div className={carousel ? card : "md:mt-16"}>
          <Link to="/matrix" className="group block">
            <div className="relative mb-6 overflow-hidden rounded-sm">
              {carousel ? (
              <div className="w-full h-[min(40svh,360px)] flex items-center justify-center" style={{ background: "#f6f1e9" }}>
                <img
                  src={matrixCollection480.url}
                  srcSet={`${matrixCollection480.url} 480w, ${matrixCollection800.url} 800w`}
                  sizes="82vw"
                  alt="RAJ MATRIX Hüllen in Cherry Carbon und Onyx Carbon mit passenden AirPods Cases"
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              ) : (
              <img
                src={matrixImg}
                alt="RAJ MATRIX Carbon-Case in Cherry Carbon mit goldenem Blitz"
                width={1344}
                height={1800}
                loading="lazy"
                decoding="async"
                className={`${imgH} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]`}
              />
              )}
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
              {/* AirPods 4 & 5 Case — Inset neben dem iPhone-Case */}
              <div className={`absolute bottom-4 right-4 flex-col items-center gap-1.5 ${carousel ? "hidden" : "flex"}`}>
                <div
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: "0 10px 30px -8px rgba(0,0,0,0.55)",
                    border: `1px solid ${GOLD_SOFT}88`,
                  }}
                >
                  <img
                    src={airpodsRender}
                    alt="RAJ MATRIX AirPods 4 & 5 Case in Cherry Carbon"
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                   className="text-[10px] uppercase font-semibold"
                   style={{ color: "#f0d9b8", letterSpacing: "0.12em", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                >
                  AirPods 4 &amp; 5
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end gap-4">
              <div>
                 <h3 className="text-xl font-medium text-white" style={{ letterSpacing: "0.08em" }}>
                  MATRIX
                </h3>
                 <p className="text-sm font-normal mt-1" style={{ color: "rgba(245,245,240,0.76)" }}>
                  Carbon-Cases für iPhone & AirPods
                </p>
              </div>
               <span className="text-base font-medium" style={{ color: GOLD_SOFT }}>
                CHF 59.–
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
            {/* AirPods Case — Link unter dem MATRIX-Bild (ausserhalb des MATRIX-Links, damit die Route stimmt) */}
            <Link
              to="/airpods-case"
              className="mt-3 flex items-center gap-2 text-[11px] uppercase font-semibold tracking-[0.12em] transition-colors group/airpods"
              style={{ color: GOLD_SOFT }}
            >
              <span
                className="w-6 h-6 rounded-md overflow-hidden shrink-0 border"
                style={{ borderColor: `${GOLD_SOFT}55`, background: "rgba(10,9,8,0.4)" }}
              >
                <img
                  src={airpodsRender}
                  alt="RAJ MATRIX AirPods 4 & 5 Case in Cherry Carbon mit goldenem Blitz"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </span>
              AirPods 4 & 5 Case — CHF 35.-
              <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/airpods:translate-x-0.5 group-hover/airpods:-translate-y-0.5" />
            </Link>
          </div>


          {/* APEX — Bald verfügbar (weiter versetzt) */}
          <Link to="/apex" className={`group block lg:mt-32 ${card}`}>
            <div className={`relative mb-6 overflow-hidden rounded-sm ${carousel ? "h-[min(40svh,360px)]" : "aspect-[3/4]"}`}>
              <img
                src={apexCarImg}
                alt="RAJ APEX MagSafe Auto-Ladehalterung im Fahrzeug"
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
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
                  Bald verfügbar
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

        {carousel && (
          <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === active ? 18 : 6, background: i === active ? GOLD_SOFT : "rgba(255,255,255,0.25)" }} />
            ))}
          </div>
        )}

        {/* Ganze Kollektion */}
        <div className={carousel ? "mt-6 flex justify-center" : "mt-10 md:mt-12 flex justify-center"}>
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

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/lib/reveal";
import nexusAsset from "@/assets/products/nexus-transparent.webp.asset.json";
import apexAsset from "@/assets/products/apex-transparent.webp.asset.json";
import matrixAsset from "@/assets/matrix/onyx-black.webp.asset.json";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";
const INK = "#1a1612";

/**
 * BrandNextDrop — sanfte Produktentdeckung nach dem Hero.
 * NEXUS bleibt klar im Fokus (gross, kaufbar). MATRIX wird als
 * "Als Nächstes" angeteasert, APEX als weiteres Objekt.
 */
const BrandNextDrop = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0908 0%, #121009 100%)" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none opacity-25"
        style={{ background: `radial-gradient(ellipse, ${GOLD}30, transparent 70%)`, filter: "blur(90px)" }}
      />

      <div className="container mx-auto px-6 sm:px-10 max-w-7xl relative z-10">
        {/* Header */}
        <div ref={headRef} className="reveal mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p
              className="text-[10px] font-light uppercase mb-5"
              style={{ color: GOLD, letterSpacing: "0.5em" }}
            >
              Die Objekte
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white leading-[1.0] tracking-[-0.02em]"
            >
              Es beginnt mit einem.
              <br />
              <span className="italic font-thin" style={{ color: GOLD_SOFT }}>
                Es bleibt nicht bei einem.
              </span>
            </h2>
          </div>
          <Link
            to="/produkte"
            className="group inline-flex items-center gap-2 text-[10px] uppercase font-medium tracking-[0.3em] pb-1 border-b transition-colors"
            style={{ color: GOLD_SOFT, borderColor: `${GOLD_SOFT}55` }}
          >
            Ganze Kollektion
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* NEXUS — Hauptobjekt */}
          <Link
            to="/nexus"
            className="group lg:col-span-7 relative rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-1"
            style={{
              borderColor: `${GOLD}66`,
              background: "linear-gradient(165deg, #221c17 0%, #14100d 70%)",
              boxShadow: `0 30px 80px -30px ${GOLD}44`,
            }}
          >
            <div className="grid md:grid-cols-2 items-center gap-4 p-8 md:p-12">
              <div className="relative aspect-square flex items-center justify-center order-first">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(55% 55% at 50% 55%, ${GOLD}22, transparent 70%)` }}
                />
                <img
                  src={nexusAsset.url}
                  alt="RAJ NEXUS 3-in-1 Wireless Charger"
                  width={480}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 max-h-[85%] w-auto object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.5))" }}
                />
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase px-2.5 py-1 rounded-full"
                    style={{ letterSpacing: "0.25em", color: "#0a0a0a", background: GOLD }}
                  >
                    <span className="w-1 h-1 rounded-full bg-black/70 animate-pulse" />
                    Jetzt verfügbar
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extralight text-white mb-2" style={{ letterSpacing: "0.12em" }}>
                  NEXUS
                </h3>
                <p className="text-sm italic font-light mb-6" style={{ color: GOLD_SOFT }}>
                  Drei Geräte. Ein Objekt.
                </p>
                <p className="text-sm text-white/55 font-light leading-relaxed mb-8 max-w-xs mx-auto md:mx-0">
                  Der Qi2.2-zertifizierte 3-in-1 Charger mit 25 Watt — unser erstes Objekt, jetzt im Verkauf.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-5">
                  <span
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full text-[10px] uppercase font-bold transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{
                      background: `linear-gradient(160deg, ${GOLD_SOFT} 0%, ${GOLD} 60%, #7a4e2a 100%)`,
                      color: "#0a0908",
                      letterSpacing: "0.2em",
                      boxShadow: `0 12px 32px -10px ${GOLD}aa`,
                    }}
                  >
                    Kaufen · CHF 99.–
                    <span style={{ fontSize: "12px" }}>→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* MATRIX + APEX — Teaser */}
          <div className="lg:col-span-5 grid grid-rows-2 gap-5">
            {/* MATRIX — Als Nächstes */}
            <Link
              to="/matrix"
              className="group relative rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:-translate-y-1 hover:border-[#9b6b3f]/60"
              style={{ background: "linear-gradient(165deg, #1c1815 0%, #100e0c 100%)" }}
            >
              <div className="flex items-center gap-6 p-6 md:p-8 h-full">
                <div className="relative w-28 md:w-36 shrink-0 aspect-square flex items-center justify-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(60% 60% at 50% 50%, ${GOLD}18, transparent 70%)` }}
                  />
                  <img
                    src={matrixAsset.url}
                    alt="RAJ MATRIX Aramid Case in Onyx Carbon"
                    width={240}
                    height={240}
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                    style={{ filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.5))" }}
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase px-2.5 py-1 rounded-full mb-3"
                    style={{
                      letterSpacing: "0.25em",
                      color: GOLD_SOFT,
                      border: `1px solid ${GOLD_SOFT}66`,
                      background: "rgba(200,148,107,0.06)",
                    }}
                  >
                    Als Nächstes
                  </span>
                  <h3 className="text-xl md:text-2xl font-extralight text-white mb-1" style={{ letterSpacing: "0.14em" }}>
                    MATRIX
                  </h3>
                  <p className="text-xs italic font-light mb-3" style={{ color: GOLD_SOFT }}>
                    Aramid-Cases für iPhone & AirPods.
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] uppercase font-medium"
                    style={{ color: GOLD_SOFT, letterSpacing: "0.25em" }}
                  >
                    Vorschau ansehen
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* APEX — Weiteres Objekt */}
            <Link
              to="/apex"
              className="group relative rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:-translate-y-1 hover:border-[#9b6b3f]/60"
              style={{ background: "linear-gradient(165deg, #1c1815 0%, #100e0c 100%)" }}
            >
              <div className="flex items-center gap-6 p-6 md:p-8 h-full">
                <div className="relative w-28 md:w-36 shrink-0 aspect-square flex items-center justify-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(60% 60% at 50% 50%, ${GOLD}18, transparent 70%)` }}
                  />
                  <img
                    src={apexAsset.url}
                    alt="RAJ APEX MagSafe Auto-Ladehalterung"
                    width={240}
                    height={240}
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                    style={{ filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.5))" }}
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase px-2.5 py-1 rounded-full mb-3"
                    style={{
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    Early Access
                  </span>
                  <h3 className="text-xl md:text-2xl font-extralight text-white mb-1" style={{ letterSpacing: "0.14em" }}>
                    APEX
                  </h3>
                  <p className="text-xs italic font-light mb-3" style={{ color: GOLD_SOFT }}>
                    Halt im Bewegten.
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] uppercase font-medium"
                    style={{ color: GOLD_SOFT, letterSpacing: "0.25em" }}
                  >
                    Entdecken
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandNextDrop;

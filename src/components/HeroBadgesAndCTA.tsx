import { motion } from "framer-motion";
import { Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import SwissFlag from "./SwissFlag";

const ICON_COLOR = "#9b6b3f";

const badges: { icon: React.ReactNode; label: string }[] = [
  { icon: <SwissFlag size={18} />, label: "Swiss Brand" },
  { icon: <Zap size={18} color={ICON_COLOR} strokeWidth={2} />, label: "Qi2.2 Zertifiziert" },
  { icon: <ShieldCheck size={18} color={ICON_COLOR} strokeWidth={2} />, label: "3 Jahre Garantie" },
  { icon: <Truck size={18} color={ICON_COLOR} strokeWidth={2} />, label: "Gratis Versand" },
  { icon: <RotateCcw size={18} color={ICON_COLOR} strokeWidth={2} />, label: "14 Tage Rückgabe" },
];

interface Props {
  spotsLeft?: number;
  onCtaClick?: () => void;
}

const HeroBadgesAndCTA = ({ spotsLeft, onCtaClick }: Props) => {
  const handleClick = () => {
    if (onCtaClick) return onCtaClick();
    document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* Badge-Leiste */}
      <div className="w-full bg-[#f0ede6] border-b border-[#9b6b3f]/15">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10 text-xs md:text-sm overflow-x-auto">
            {badges.map((b) => (
              <span key={b.label} className="whitespace-nowrap inline-flex items-center gap-1.5" style={{ color: "#888" }}>
                <span className="inline-flex items-center">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Preis + CTA */}
      <section className="w-full" style={{ backgroundColor: "#faf6f0" }}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            {/* Founder Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(155, 107, 63, 0.1)",
                borderColor: "#9b6b3f",
                color: "#9b6b3f",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#9b6b3f" }} />
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase">
                Founder Edition · Nur 100 Stück
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2c2c2c] mb-6 tracking-tight leading-tight"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
            >
              Sichere dir den Launch-Preis.
            </h2>

            <div className="flex items-baseline justify-center gap-4 mb-2">
              <span className="text-5xl md:text-6xl font-extrabold" style={{ color: "#9b6b3f" }}>
                CHF 99
              </span>
              <span className="text-xl md:text-2xl text-[#888] line-through">CHF 129</span>
            </div>
            <p className="text-sm md:text-base text-[#666] mb-6">
              Du sparst <span className="font-semibold text-[#2c2c2c]">CHF 30</span>
            </p>

            {typeof spotsLeft === "number" && (
              <p className="text-xs md:text-sm font-semibold mb-6" style={{ color: "#9b6b3f" }}>
                Nur noch <span className="text-base font-extrabold">{spotsLeft}</span> von 100 Plätzen verfügbar
              </p>
            )}

            <button
              onClick={handleClick}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#9b6b3f] text-white font-bold text-base hover:bg-[#8a5d36] transition-all shadow-[0_4px_14px_-4px_rgba(155,107,63,0.35)] hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2"
            >
              Jetzt sichern
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </button>

            <p className="mt-4 text-xs text-[#888]">
              Kostenlose Reservierung · Keine Zahlungsdaten nötig
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

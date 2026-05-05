import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

type Milestone = {
  name: string;
  status: "unlocked" | "locked";
  eta: string;
  href?: string;
};

const milestones: Milestone[] = [
  { name: "RAJ NEXUS", status: "unlocked", eta: "Available Now", href: "/nexus" },
  { name: "RAJ MATRIX", status: "locked", eta: "Coming 2026" },
  { name: "RAJ AURORA", status: "locked", eta: "Coming 2026" },
  { name: "RAJ DRIVE", status: "locked", eta: "Coming 2027" },
  { name: "RAJ NOMAD", status: "locked", eta: "Coming 2027" },
  { name: "RAJ STUDIO", status: "locked", eta: "Coming 2027" },
  { name: "RAJ ELITE", status: "locked", eta: "Coming Soon" },
];

const GOLD = "#9b6b3f";
const BLACK = "#0a0a0a";

const Card = ({ m, index }: { m: Milestone; index: number }) => {
  const isUnlocked = m.status === "unlocked";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative h-full snap-center shrink-0 w-[72vw] sm:w-[44vw] md:w-auto md:shrink"
    >
      <div
        className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 ${
          isUnlocked
            ? "border-2 shadow-[0_0_40px_-10px_rgba(155,107,63,0.6)] hover:shadow-[0_0_60px_-10px_rgba(155,107,63,0.9)]"
            : "border border-white/10"
        }`}
        style={{
          background: isUnlocked
            ? `linear-gradient(180deg, #1a1614 0%, ${BLACK} 100%)`
            : BLACK,
          borderColor: isUnlocked ? GOLD : undefined,
          minHeight: "240px",
        }}
      >
        {isUnlocked && (
          <div
            className="absolute inset-0 opacity-30 pointer-events-none animate-pulse"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${GOLD}40, transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-7" style={{ minHeight: "240px" }}>
          <div className="flex items-start justify-between">
            <span
              className="text-[10px] font-light uppercase"
              style={{
                color: isUnlocked ? GOLD : "rgba(255,255,255,0.4)",
                letterSpacing: "0.25em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {!isUnlocked && (
              <Lock className="w-4 h-4" style={{ color: GOLD, opacity: 0.7 }} />
            )}
            {isUnlocked && (
              <span
                className="text-[9px] font-medium uppercase px-2 py-1 rounded-full"
                style={{
                  letterSpacing: "0.2em",
                  color: BLACK,
                  background: GOLD,
                }}
              >
                Unlocked
              </span>
            )}
          </div>

          <div>
            <h3
              className={`text-lg sm:text-xl font-light mb-3 ${
                isUnlocked ? "text-white" : "text-white/60"
              }`}
              style={{ letterSpacing: "0.2em" }}
            >
              {m.name}
            </h3>
            <p
              className="text-[10px] font-light uppercase"
              style={{
                color: isUnlocked ? GOLD : "rgba(255,255,255,0.35)",
                letterSpacing: "0.2em",
              }}
            >
              {m.eta}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isUnlocked && m.href) {
    return (
      <Link to={m.href} aria-label={`${m.name} — ${m.eta}`} className="block h-full">
        {inner}
      </Link>
    );
  }
  return <div aria-disabled className="h-full">{inner}</div>;
};

const RajRoadmap = () => {
  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
      style={{ background: "#f0ede6" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2
            className="text-xs sm:text-sm font-light uppercase mb-4"
            style={{ color: GOLD, letterSpacing: "0.4em" }}
          >
            The RAJ Collection
          </h2>
          <p
            className="text-sm sm:text-base max-w-xl mx-auto font-light"
            style={{ color: BLACK, opacity: 0.6, letterSpacing: "0.05em" }}
          >
            Eine Vision in sieben Kapiteln. Ein neues Produkt erscheint, sobald es bereit ist.
          </p>
        </motion.div>

        {/* Mobile: horizontal swipe */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {milestones.map((m, i) => (
              <Card key={m.name} m={m} index={i} />
            ))}
            <div className="shrink-0 w-2" aria-hidden />
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {milestones.map((m, i) => (
            <Card key={m.name} m={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RajRoadmap;

import { Link } from "react-router-dom";
import { Lock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusLifestyle from "@/assets/lifestyle-laptop-clean.webp";

type Milestone = {
  name: string;
  taglineKey: string;
  status: "unlocked" | "locked";
  etaKey: string;
  href?: string;
};

const milestones: Milestone[] = [
  { name: "RAJ NEXUS",  taglineKey: "brand.road.tagline.nexus",  status: "unlocked", etaKey: "brand.road.eta.now",  href: "/nexus" },
  { name: "RAJ MATRIX", taglineKey: "brand.road.tagline.matrix", status: "locked",   etaKey: "brand.road.eta.2026" },
  { name: "RAJ AURORA", taglineKey: "brand.road.tagline.aurora", status: "locked",   etaKey: "brand.road.eta.2026" },
  { name: "RAJ APEX",  taglineKey: "brand.road.tagline.drive",  status: "locked",   etaKey: "brand.road.eta.2027" },
  { name: "RAJ ATLAS",  taglineKey: "brand.road.tagline.nomad",  status: "locked",   etaKey: "brand.road.eta.2027" },
  { name: "RAJ ATELIER", taglineKey: "brand.road.tagline.studio", status: "locked",   etaKey: "brand.road.eta.2027" },
  { name: "RAJ ELITE",  taglineKey: "brand.road.tagline.elite",  status: "locked",   etaKey: "brand.road.eta.soon" },
];

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const Card = ({ m, index }: { m: Milestone; index: number }) => {
  const { t } = useLanguage();
  const isUnlocked = m.status === "unlocked";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group relative h-full snap-center shrink-0 w-[78vw] sm:w-[46vw] md:w-auto md:shrink"
    >
      <div
        className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 ${
          isUnlocked
            ? "border border-[#9b6b3f]/70 shadow-[0_0_60px_-15px_rgba(155,107,63,0.55)] group-hover:shadow-[0_0_80px_-10px_rgba(155,107,63,0.85)] group-hover:border-[#9b6b3f]"
            : "border border-white/15 group-hover:border-[#9b6b3f]/60 group-hover:shadow-[0_0_60px_-20px_rgba(155,107,63,0.5)]"
        }`}
        style={{
          background: isUnlocked
            ? "linear-gradient(165deg, #2a2320 0%, #161310 60%, #100e0c 100%)"
            : "linear-gradient(165deg, #242220 0%, #17150f 100%)",
          minHeight: "320px",
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(200,148,107,0.08) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.5s linear infinite",
          }}
        />

        {/* Unlocked: lifestyle photo background */}
        {isUnlocked && (
          <>
            <div
              className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-55 group-hover:opacity-70 transition-opacity duration-700"
              style={{ backgroundImage: `url(${nexusLifestyle})` }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.7) 55%, rgba(10,10,10,0.95) 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-40 pointer-events-none animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 100%, ${GOLD}40, transparent 65%)`,
              }}
            />
          </>
        )}

        <div className="relative z-10 flex flex-col justify-between h-full p-7 sm:p-8" style={{ minHeight: "320px" }}>
          <div className="flex items-start justify-between">
            <span
              className="text-[10px] font-light"
              style={{
                color: isUnlocked ? GOLD_SOFT : "rgba(255,255,255,0.55)",
                letterSpacing: "0.3em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {isUnlocked ? (
              <span
                className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase px-2.5 py-1 rounded-full"
                style={{ letterSpacing: "0.25em", color: "#0a0a0a", background: GOLD }}
              >
                <span className="w-1 h-1 rounded-full bg-black/70 animate-pulse" />
                {t("brand.road.unlocked")}
              </span>
            ) : (
              <Lock className="w-3.5 h-3.5" style={{ color: GOLD_SOFT, opacity: 0.85 }} />
            )}
          </div>

          <div>
            <h3
              className={`text-xl sm:text-2xl font-extralight mb-3 transition-colors duration-500 ${
                isUnlocked ? "text-white" : "text-white/90 group-hover:text-white"
              }`}
              style={{ letterSpacing: "0.18em" }}
            >
              {m.name}
            </h3>
            <p
              className={`text-sm font-light italic mb-6 transition-colors duration-500 ${
                isUnlocked ? "text-white/80" : "text-white/65 group-hover:text-white/80"
              }`}
              style={{ letterSpacing: "0.02em" }}
            >
              {t(m.taglineKey)}
            </p>
            <div className="flex items-center justify-between">
              <p
                className="text-[10px] font-light uppercase"
                style={{
                  color: isUnlocked ? GOLD_SOFT : "rgba(200,148,107,0.75)",
                  letterSpacing: "0.25em",
                }}
              >
                {t(m.etaKey)}
              </p>
              {isUnlocked && (
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{ color: GOLD }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isUnlocked && m.href) {
    return (
      <Link to={m.href} aria-label={`${m.name} — ${t(m.etaKey)}`} className="block h-full">
        {inner}
      </Link>
    );
  }
  return <div aria-disabled className="h-full">{inner}</div>;
};

const RajRoadmap = () => {
  const { t } = useLanguage();
  return (
    <section
      id="ecosystem"
      className="relative py-24 sm:py-32 md:py-40 overflow-hidden scroll-mt-24"
      style={{
        background:
          "linear-gradient(180deg, #050505 0%, #0a0a0a 40%, #14100d 100%)",
      }}
    >
      {/* Ambient gold glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-30 animate-blob-a"
        style={{
          background: `radial-gradient(circle, ${GOLD}25, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 animate-blob-b"
        style={{
          background: `radial-gradient(circle, ${GOLD}30, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-16 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs font-light uppercase mb-6"
            style={{ color: GOLD, letterSpacing: "0.5em" }}
          >
            {t("brand.road.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white mb-8 leading-[0.95]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("brand.road.headline.l1")}{" "}
            <span className="italic font-thin" style={{ color: GOLD_SOFT }}>
              {t("brand.road.headline.l2")}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-base sm:text-lg md:text-xl font-extralight text-white/55 leading-relaxed max-w-xl"
            style={{ letterSpacing: "0.02em" }}
          >
            {t("brand.road.sub.l1")}
            <br />
            {t("brand.road.sub.l2")}
          </motion.p>
        </div>

        {/* Mobile: horizontal swipe */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide">
            {milestones.map((m, i) => (
              <Card key={m.name} m={m} index={i} />
            ))}
            <div className="shrink-0 w-2" aria-hidden />
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5">
          {milestones.map((m, i) => (
            <Card key={m.name} m={m} index={i} />
          ))}
        </div>

        {/* Progress line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden md:block mt-16 px-2"
        >
          <div className="relative">
            <div
              className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(90deg, rgba(155,107,63,0.8) 0%, rgba(155,107,63,0.15) 14%, rgba(255,255,255,0.06) 100%)",
              }}
            />
            <div className="relative grid grid-cols-7 gap-5">
              {milestones.map((m, i) => (
                <div key={m.name} className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                    className="relative"
                  >
                    {i === 0 && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ background: GOLD, opacity: 0.5 }}
                      />
                    )}
                    <span
                      className="relative block w-2.5 h-2.5 rounded-full"
                      style={{
                        background: i === 0 ? GOLD : "#2a2520",
                        boxShadow: i === 0 ? `0 0 16px ${GOLD}` : "none",
                        border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scarcity line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto"
        >
          <div
            className="w-12 h-px mx-auto mb-8"
            style={{ background: GOLD }}
          />
          <p
            className="text-base sm:text-lg md:text-xl font-extralight text-white/80 leading-relaxed"
            style={{ letterSpacing: "0.02em" }}
          >
            {t("brand.road.scarcity.l1")}{" "}
            <span style={{ color: GOLD_SOFT }} className="italic">
              RAJ NEXUS
            </span>
            .
            <br />
            <span className="text-white/45">{t("brand.road.scarcity.l2")}</span>
          </p>

          <Link
            to="/nexus"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-full transition-all duration-500 hover:gap-5 group"
            style={{
              background: GOLD,
              color: "#0a0a0a",
              letterSpacing: "0.25em",
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              boxShadow: `0 10px 40px -10px ${GOLD}`,
            }}
          >
            {t("brand.road.cta")}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RajRoadmap;

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import nexusHero from "@/assets/nexus-hero-720.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const NexusShowcase = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #0d0b09 50%, #050505 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none animate-blob-a"
        style={{
          background: `radial-gradient(circle, ${GOLD}30, transparent 60%)`,
          filter: "blur(100px)",
          opacity: 0.5,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 sm:pt-32 md:pt-40 pb-20 sm:pb-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Text */}
          <div className="order-2 md:order-1">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[10px] sm:text-xs font-light uppercase mb-6"
              style={{ color: GOLD, letterSpacing: "0.5em" }}
            >
              — Chapter 01 · Available now
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-extralight text-white mb-6 leading-[0.95]"
              style={{ letterSpacing: "-0.02em" }}
            >
              RAJ{" "}
              <span className="italic font-thin" style={{ color: GOLD_SOFT }}>
                NEXUS.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-base sm:text-lg text-white/60 font-light max-w-md leading-relaxed mb-8"
            >
              Drei Geräte. Eine Oberfläche. Qi2.2 mit 25 W. <br className="hidden sm:block" />
              Wo das System beginnt.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link
                to="/nexus"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 hover:gap-5 group"
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
                Discover NEXUS
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span
                className="text-xs font-light text-white/50"
                style={{ letterSpacing: "0.2em" }}
              >
                CHF 99.–
              </span>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 md:order-2 relative"
          >
            {/* Gold glow behind image */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${GOLD}70, transparent 60%)`,
              }}
            />
            <motion.img
              src={nexusHero}
              alt="RAJ NEXUS — premium 3-in-1 wireless charger"
              className="relative w-full max-w-lg mx-auto animate-float-slow"
              loading="eager"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Reflection / floor */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-2xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(155,107,63,0.5), transparent 70%)",
              }}
            />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 sm:mt-28 flex flex-col items-center gap-3"
        >
          <span
            className="text-[10px] font-light uppercase text-white/40"
            style={{ letterSpacing: "0.4em" }}
          >
            The Collection
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10"
            style={{
              background: `linear-gradient(180deg, ${GOLD}, transparent)`,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default NexusShowcase;

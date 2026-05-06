import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nexusLifestyle from "@/assets/lifestyle-laptop-clean.webp";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const BrandHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden flex items-end"
      style={{ background: "#0a0908" }}
    >
      <motion.div
        style={{ scale, y, backgroundImage: `url(${nexusLifestyle})` }}
        className="absolute inset-0 bg-cover bg-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.25) 35%, rgba(10,9,8,0.85) 80%, rgba(10,9,8,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(200,148,107,0.25), transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-24 left-0 right-0 z-10 text-center px-4"
      >
        <span
          className="text-[10px] font-light uppercase"
          style={{ color: GOLD, letterSpacing: "0.6em" }}
        >
          {t("brand.hero.eyebrow")}
        </span>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 sm:px-10 pb-20 sm:pb-28"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[7rem] xl:text-[8.5rem] font-extralight text-white leading-[0.9] tracking-[-0.03em] max-w-6xl"
        >
          {t("brand.hero.h1.line1")}
          <br />
          <span className="italic font-thin" style={{ color: GOLD_SOFT }}>
            {t("brand.hero.h1.line2")}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 max-w-5xl"
        >
          <p
            className="text-base sm:text-lg text-white/70 font-light max-w-md leading-relaxed whitespace-pre-line"
            style={{ letterSpacing: "0.01em" }}
          >
            {t("brand.hero.sub")}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/nexus"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 hover:gap-5"
              style={{
                background: GOLD,
                color: "#0a0908",
                letterSpacing: "0.25em",
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                boxShadow: `0 14px 40px -12px ${GOLD}`,
              }}
            >
              {t("brand.hero.cta.primary")}
            </Link>
            <Link
              to="/ueber-raj"
              className="text-[11px] font-light uppercase text-white/60 hover:text-white transition-colors"
              style={{ letterSpacing: "0.3em" }}
            >
              {t("brand.hero.cta.secondary")}
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ background: `linear-gradient(180deg, transparent, ${GOLD_SOFT})` }}
        />
      </motion.div>
    </section>
  );
};

export default BrandHero;

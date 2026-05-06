import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const BrandStory = () => {
  const { t } = useLanguage();
  const chapters = [
    { n: "I", title: t("brand.story.c1.title"), body: t("brand.story.c1.body") },
    { n: "II", title: t("brand.story.c2.title"), body: t("brand.story.c2.body") },
    { n: "III", title: t("brand.story.c3.title"), body: t("brand.story.c3.body") },
  ];

  return (
    <section
      className="relative py-32 md:py-44 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0908 0%, #14110e 50%, #1a1612 100%)",
      }}
    >
      <div className="container mx-auto px-6 sm:px-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8"
        >
          <span
            className="text-[10px] font-light uppercase"
            style={{ color: GOLD, letterSpacing: "0.5em" }}
          >
            {t("brand.story.eyebrow")}
          </span>
          <span className="hidden sm:inline-block w-8 h-px" style={{ background: `${GOLD}66` }} />
          <a
            href="#ecosystem"
            className="group inline-flex items-center gap-2 text-[10px] font-light uppercase transition-colors"
            style={{ color: GOLD_SOFT, letterSpacing: "0.5em" }}
          >
            {t("brand.story.link.eco.eyebrow")}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-extralight text-white leading-[1.1] tracking-[-0.02em] max-w-4xl mb-24 md:mb-32"
        >
          {t("brand.story.headline.l1")}
          <br />
          <span className="italic" style={{ color: GOLD_SOFT }}>
            {t("brand.story.headline.l2")}
          </span>
        </motion.h2>

        <div className="space-y-20 md:space-y-28">
          {chapters.map((c, i) => (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-12 gap-6 md:gap-10 items-start"
            >
              <div className="col-span-12 md:col-span-3">
                <div
                  className="text-5xl md:text-6xl font-extralight italic"
                  style={{ color: GOLD_SOFT, letterSpacing: "0.05em" }}
                >
                  {c.n}
                </div>
                <div className="mt-3 w-10 h-px" style={{ background: GOLD }} />
              </div>
              <div className="col-span-12 md:col-span-9">
                <h3
                  className="text-2xl md:text-4xl font-extralight text-white mb-5 leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-base md:text-lg text-white/55 font-light leading-relaxed max-w-2xl"
                  style={{ letterSpacing: "0.01em" }}
                >
                  {c.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-32 md:mt-40 text-center"
        >
          <div className="w-16 h-px mx-auto mb-8" style={{ background: GOLD }} />
          <p
            className="text-xl md:text-2xl font-extralight italic text-white/85"
            style={{ letterSpacing: "0.02em" }}
          >
            {t("brand.story.signature")}
          </p>
          <p
            className="mt-4 text-[10px] font-light uppercase"
            style={{ color: GOLD, letterSpacing: "0.5em" }}
          >
            {t("brand.story.madeIn")}
          </p>

          {/* Two doors: Über RAJ + Ecosystem */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-px max-w-3xl mx-auto border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
            <Link
              to="/ueber-raj"
              className="group relative p-8 sm:p-10 text-left transition-colors duration-500 hover:bg-white/[0.03]"
            >
              <p
                className="text-[10px] font-light uppercase mb-4"
                style={{ color: GOLD, letterSpacing: "0.4em" }}
              >
                {t("brand.story.link.about.eyebrow")}
              </p>
              <h4
                className="text-xl md:text-2xl font-extralight text-white mb-3 leading-tight"
                style={{ letterSpacing: "-0.01em" }}
              >
                {t("brand.story.link.about.title")}
              </h4>
              <p className="text-sm text-white/55 font-light leading-relaxed mb-6">
                {t("brand.story.link.about.body")}
              </p>
              <span
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase transition-all duration-500 group-hover:gap-3"
                style={{ color: GOLD_SOFT, letterSpacing: "0.25em" }}
              >
                {t("brand.story.link.about.cta")}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>

            <a
              href="#ecosystem"
              className="group relative p-8 sm:p-10 text-left transition-colors duration-500 hover:bg-white/[0.03] border-t sm:border-t-0 sm:border-l border-white/10"
            >
              <p
                className="text-[10px] font-light uppercase mb-4"
                style={{ color: GOLD, letterSpacing: "0.4em" }}
              >
                {t("brand.story.link.eco.eyebrow")}
              </p>
              <h4
                className="text-xl md:text-2xl font-extralight text-white mb-3 leading-tight"
                style={{ letterSpacing: "-0.01em" }}
              >
                {t("brand.story.link.eco.title")}
              </h4>
              <p className="text-sm text-white/55 font-light leading-relaxed mb-6">
                {t("brand.story.link.eco.body")}
              </p>
              <span
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase transition-all duration-500 group-hover:gap-3"
                style={{ color: GOLD_SOFT, letterSpacing: "0.25em" }}
              >
                {t("brand.story.link.eco.cta")}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;

import { motion } from "framer-motion";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const pillars = [
  {
    n: "01",
    title: "Precision",
    body: "Tolerances measured in tenths. Materials chosen, not specified. The work shows in what you don't see.",
  },
  {
    n: "02",
    title: "Permanence",
    body: "Designed to outlast its category. Replaceable parts. Repairable design. Beauty that earns its place over years.",
  },
  {
    n: "03",
    title: "Character",
    body: "Quiet objects with conviction. No screens shouting for attention. Just substance — present when you need it.",
  },
];

const BrandPillars = () => {
  return (
    <section
      className="relative py-32 md:py-44 overflow-hidden"
      style={{ background: "#f5efe6" }}
    >
      <div className="container mx-auto px-6 sm:px-10 max-w-7xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] font-light uppercase mb-8"
          style={{ color: GOLD, letterSpacing: "0.5em" }}
        >
          — Our principles
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-extralight leading-[0.95] tracking-[-0.02em] max-w-4xl mb-20 md:mb-28"
          style={{ color: "#1a1612" }}
        >
          Three values.
          <br />
          <span className="italic" style={{ color: GOLD }}>
            One standard.
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1612]/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-[#f5efe6] p-10 md:p-14 transition-all duration-700 hover:bg-white"
            >
              <div
                className="text-[10px] font-light uppercase mb-10"
                style={{ color: GOLD, letterSpacing: "0.4em" }}
              >
                {p.n}
              </div>
              <h3
                className="text-3xl md:text-4xl font-extralight mb-6 leading-tight"
                style={{ color: "#1a1612", letterSpacing: "-0.01em" }}
              >
                {p.title}
              </h3>
              <div
                className="w-10 h-px mb-6 transition-all duration-500 group-hover:w-20"
                style={{ background: GOLD }}
              />
              <p
                className="text-base font-light leading-relaxed"
                style={{ color: "#3a3128" }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPillars;

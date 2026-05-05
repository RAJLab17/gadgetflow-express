import { motion } from "framer-motion";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const chapters = [
  {
    n: "I",
    title: "A quiet beginning.",
    body:
      "RAJ began in a small studio in the Thurgau — not with a product, but with a question. Why does technology feel disposable in a world that values craft?",
  },
  {
    n: "II",
    title: "Substance over noise.",
    body:
      "We chose restraint. Materials that age with grace. Engineering you don't see, but feel. Every detail considered, then considered again.",
  },
  {
    n: "III",
    title: "Built to last.",
    body:
      "Not a season. Not a trend. Objects designed to remain — beside your bed, on your desk, in your life — long after the next launch is forgotten.",
  },
];

const BrandStory = () => {
  return (
    <section
      className="relative py-32 md:py-44 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0908 0%, #14110e 50%, #1a1612 100%)",
      }}
    >
      <div className="container mx-auto px-6 sm:px-10 max-w-6xl">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] font-light uppercase mb-8"
          style={{ color: GOLD, letterSpacing: "0.5em" }}
        >
          — The story
        </motion.p>

        {/* Pull quote */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-extralight text-white leading-[1.1] tracking-[-0.02em] max-w-4xl mb-24 md:mb-32"
        >
          We don't make accessories.
          <br />
          <span className="italic" style={{ color: GOLD_SOFT }}>
            We make companions.
          </span>
        </motion.h2>

        {/* Chapters */}
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
                <div
                  className="mt-3 w-10 h-px"
                  style={{ background: GOLD }}
                />
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

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-32 md:mt-40 text-center"
        >
          <div
            className="w-16 h-px mx-auto mb-8"
            style={{ background: GOLD }}
          />
          <p
            className="text-xl md:text-2xl font-extralight italic text-white/85"
            style={{ letterSpacing: "0.02em" }}
          >
            Power. Always there.
          </p>
          <p
            className="mt-4 text-[10px] font-light uppercase"
            style={{ color: GOLD, letterSpacing: "0.5em" }}
          >
            — Made in Switzerland
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;

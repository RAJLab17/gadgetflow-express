import { useLanguage } from "@/contexts/LanguageContext";
import { useReveal } from "@/lib/reveal";

const GOLD = "#9b6b3f";

const PillarCard = ({
  p,
  i,
}: {
  p: { n: string; title: string; body: string };
  i: number;
}) => {
  const ref = useReveal<HTMLDivElement>();
  const parts = p.body.includes("\n") ? p.body.split("\n") : p.body.split(/(?<=[.!?])\s+/);
  const lead = parts[0].trim();
  const rest = parts.slice(1).join(" ").trim();

  return (
    <div
      ref={ref}
      className="reveal group relative bg-[#f5efe6] p-10 md:p-14 transition-all duration-700 hover:bg-white cursor-default"
      style={{ transitionDelay: `${i * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-12">
        <span className="text-[10px] font-light uppercase" style={{ color: GOLD, letterSpacing: "0.4em" }}>
          {p.n}
        </span>
        <span className="h-px w-6" style={{ background: `${GOLD}55` }} />
      </div>

      <h3
        className="text-4xl md:text-5xl font-extralight mb-8 leading-[1.05]"
        style={{ color: "#1a1612", letterSpacing: "-0.015em" }}
      >
        {p.title}
      </h3>

      <p className="text-lg md:text-xl font-light leading-snug mb-8 italic" style={{ color: "#1a1612" }}>
        {lead}
      </p>

      <div
        className="w-10 h-px mb-6 transition-all duration-500 group-hover:w-20"
        style={{ background: GOLD }}
      />

      {rest && (
        <div className="overflow-hidden transition-all duration-700 ease-out max-h-0 opacity-0 group-hover:max-h-60 group-hover:opacity-100">
          <p className="text-sm font-light leading-relaxed pt-2" style={{ color: "#3a3128" }}>
            {rest}
          </p>
        </div>
      )}

      {rest && (
        <div
          className="mt-4 inline-flex items-center gap-2 text-[10px] font-light uppercase opacity-70 group-hover:opacity-0 transition-opacity duration-300"
          style={{ color: GOLD, letterSpacing: "0.3em" }}
        >
          <span>Mehr</span>
          <span className="block w-3 h-px" style={{ background: GOLD }} />
        </div>
      )}
    </div>
  );
};

const BrandPillars = () => {
  const { t } = useLanguage();
  const pillars = [
    { n: "01", title: t("brand.pillars.p1.title"), body: t("brand.pillars.p1.body") },
    { n: "02", title: t("brand.pillars.p2.title"), body: t("brand.pillars.p2.body") },
    { n: "03", title: t("brand.pillars.p3.title"), body: t("brand.pillars.p3.body") },
  ];
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const headlineRef = useReveal<HTMLHeadingElement>();

  return (
    <section className="relative py-32 md:py-44 overflow-hidden" style={{ background: "#f5efe6" }}>
      <div className="container mx-auto px-6 sm:px-10 max-w-7xl">
        <p
          ref={eyebrowRef}
          className="reveal-fade text-[10px] font-light uppercase mb-8"
          style={{ color: GOLD, letterSpacing: "0.5em" }}
        >
          {t("brand.pillars.eyebrow")}
        </p>

        <h2
          ref={headlineRef}
          className="reveal text-4xl sm:text-6xl md:text-7xl font-extralight leading-[0.95] tracking-[-0.02em] max-w-4xl mb-20 md:mb-28"
          style={{ color: "#1a1612" }}
        >
          {t("brand.pillars.headline.l1")}
          <br />
          <span className="italic" style={{ color: GOLD }}>
            {t("brand.pillars.headline.l2")}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1612]/10">
          {pillars.map((p, i) => (
            <PillarCard key={p.n} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPillars;

import { useLanguage } from "@/contexts/LanguageContext";

const LaunchFAQSection = () => {
  const { t } = useLanguage();

  const faqItems = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <section className="py-12 md:py-28 bg-[#f5f2ec]">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2c2c2c] text-center mb-10 tracking-tight">
          {t("faq.title")}
        </h2>
        <div className="space-y-0">
          {faqItems.map((item, i) => (
            <details key={i} className="group border-b border-[#9b6b3f]/10">
              <summary className="flex items-center justify-between py-5 cursor-pointer list-none text-left">
                <span className="text-[15px] md:text-base font-medium text-[#2c2c2c] pr-6 [@media(hover:hover)]:group-hover:text-[#9b6b3f] transition-colors">
                  {item.q}
                </span>
                <svg
                  className="w-4 h-4 shrink-0 text-[#888888] transition-transform duration-300 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="pb-5 pr-10">
                <p className="text-[#666666] text-sm leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchFAQSection;

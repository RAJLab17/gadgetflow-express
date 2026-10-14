import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import type { FaqItem } from "@/content/matrixFaq";

export type FaqLink = { to: string; label: string };

const LINKS: FaqLink[] = [
  { to: "/nexus", label: "RAJ NEXUS Ladestation" },
  { to: "/qi2-erklaert", label: "Qi2.2 erklärt" },
  { to: "/versand", label: "Versand & Rückgabe" },
];

const ProductFaqSection = ({
  title,
  items,
  accordion = false,
  links = LINKS,
  linksAsList = false,
}: {
  title: string;
  items: FaqItem[];
  accordion?: boolean;
  links?: FaqLink[];
  linksAsList?: boolean;
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section className="border-t border-border">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="container mx-auto max-w-3xl px-6 py-14 md:py-20">
        <h2 className="mb-8 font-light tracking-tight" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>{title}</h2>
        <div className="space-y-8">
          {items.map(({ q, a }, index) => accordion ? (
            <details key={q} open={index === 0} className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-medium md:text-lg [&::-webkit-details-marker]:hidden">
                <span>{q}</span>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ) : (
            <div key={q}>
              <h3 className="text-base font-medium md:text-lg">{q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
        {linksAsList ? (
          <nav aria-label="Mehr erfahren" className="mt-12">
            <h3 className="mb-3 font-light tracking-tight" style={{ fontSize: "clamp(19px,2.3vw,24px)" }}>Mehr erfahren</h3>
            <ul className="border-t border-border">
              {links.map((l) => (
                <li key={l.to} className="border-b border-border">
                  <Link to={l.to} className="flex min-h-12 items-center justify-between gap-4 py-3 text-[15px] font-light text-foreground no-underline">
                    <span>{l.label}</span>
                    <span aria-hidden="true" className="shrink-0 text-[18px] leading-none text-primary">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <nav aria-label="Weiterlesen" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-primary underline underline-offset-4">{l.label}</Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
};

export default ProductFaqSection;

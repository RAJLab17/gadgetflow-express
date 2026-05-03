import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";

interface Article {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  excerpt: string;
  href: string;
}

const articles: Article[] = [
  {
    slug: "magsafe-ladestation-schweiz",
    title: "MagSafe kompatible Ladestation Schweiz – was bedeutet das wirklich?",
    date: "03.05.2026",
    dateISO: "2026-05-03",
    excerpt:
      "Nicht alles was MagSafe-kompatibel heisst ist gleich gut. Was du wissen musst bevor du kaufst.",
    href: "/magsafe-ladestation-schweiz",
  },
  {
    slug: "iphone-standby-ladestation",
    title: "iPhone StandBy Modus – Die perfekte Ladestation",
    date: "03.05.2026",
    dateISO: "2026-05-03",
    excerpt:
      "StandBy ist Apples beste Nachttisch-Funktion. Was du brauchst um sie optimal zu nutzen.",
    href: "/iphone-standby-ladestation-schweiz",
  },
  {
    slug: "qi2-vs-qi22",
    title: "Qi2 vs. Qi2.2 – Was ist der Unterschied?",
    date: "02.05.2026",
    dateISO: "2026-05-02",
    excerpt:
      "Qi2.2 ist der neue Standard. Was sich geändert hat und was das für dein iPhone bedeutet.",
    href: "/qi2-erklaert",
  },
  {
    slug: "nexus-vs-belkin-vs-anker",
    title: "RAJ NEXUS vs. Belkin vs. Anker – Welcher lohnt sich?",
    date: "02.05.2026",
    dateISO: "2026-05-02",
    excerpt:
      "Direkter Vergleich der drei beliebtesten 3-in-1 Wireless Charger für iPhone. Qi2.2, Preis, Design.",
    href: "/vergleich",
  },
  {
    slug: "bester-wireless-charger-schweiz-2026",
    title: "Bester Wireless Charger Schweiz 2026 – Top 3 im Vergleich",
    date: "02.05.2026",
    dateISO: "2026-05-02",
    excerpt:
      "Qi2.2, MagSafe, 3-in-1 – welcher Charger lohnt sich wirklich für iPhone-Nutzer in der Schweiz?",
    href: "/bester-wireless-charger-schweiz",
  },
  {
    slug: "kabelloses-laden-buero-schweiz",
    title: "Kabelloses Laden im Büro – Kabelsalat eliminieren für Schweizer KMUs",
    date: "02.05.2026",
    dateISO: "2026-05-02",
    excerpt:
      "Ein Gerät pro Arbeitsplatz statt drei Kabel. Wie Schweizer Unternehmen mit Qi2.2 Ordnung schaffen.",
    href: "/kabelloses-laden-buero-schweiz",
  },
  {
    slug: "kabelloses-laden-firmen-schweiz",
    title: "Kabelloses Laden für Unternehmen – Sicherheit und Ordnung für Schweizer KMUs",
    date: "02.05.2026",
    dateISO: "2026-05-02",
    excerpt:
      "Mitarbeitende bringen eigene Ladekabel mit – ein unterschätztes Risiko. Wie KMUs das eleganter lösen.",
    href: "/kabelloses-laden-firmen-schweiz",
  },
];

const BlogPage = () => {
  return (
    <PremiumPageLayout
      title="RAJ Blog – Wissen rund um kabelloses Laden & Apple-Zubehör"
      metaDescription="Wissen rund um kabelloses Laden, MagSafe und Apple-Zubehör. Artikel, Guides und Standards aus der Welt von RAJ."
      canonical="https://raj.ch/blog"
      eyebrow="Blog"
      heading="RAJ Blog"
      intro="Wissen rund um kabelloses Laden, MagSafe und Apple-Zubehör."
      width="wide"
    >
      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={article.href}
            className="group block border border-border/60 hover:border-primary/60 transition-colors duration-300 bg-background"
          >
            <article className="p-6 md:p-8">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
                <time dateTime={article.dateISO}>{article.date}</time>
              </p>
              <h2 className="text-xl md:text-2xl font-light tracking-tight text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed text-[15px] md:text-base mb-5">
                {article.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Artikel lesen
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </article>
          </Link>
        ))}
      </div>
    </PremiumPageLayout>
  );
};

export default BlogPage;

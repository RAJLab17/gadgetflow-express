import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { BLOG_ARTICLES } from "@/content/site-urls";

const articles = [...BLOG_ARTICLES].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO),
);

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
            to={article.path}
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

        {/* Weiterführende Ratgeber – interne Verlinkung mit sprechendem Ankertext */}
        <div className="border border-border/60 bg-background p-6 md:p-8 mt-10">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-5">
            Weiterführende Ratgeber
          </p>
          <ul className="space-y-4">
            <li>
              <Link
                to="/blog/nexus-iphone-18-ladegeraet"
                className="inline-flex items-start gap-2 text-[15px] md:text-base text-foreground/90 hover:text-primary transition-colors font-light leading-relaxed"
              >
                <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-primary" />
                <span>
                  RAJ NEXUS – 3-in-1 Ladestation fürs iPhone 18 mit Qi2.2 und
                  25 Watt im Detail
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/3-in-1-ladestation-iphone-apple-watch-airpods"
                className="inline-flex items-start gap-2 text-[15px] md:text-base text-foreground/90 hover:text-primary transition-colors font-light leading-relaxed"
              >
                <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-primary" />
                <span>
                  3-in-1 Ladestation für iPhone, Apple Watch und AirPods – die
                  beste Lösung 2026
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/iphone-standby-ladestation-schweiz"
                className="inline-flex items-start gap-2 text-[15px] md:text-base text-foreground/90 hover:text-primary transition-colors font-light leading-relaxed"
              >
                <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-primary" />
                <span>
                  iPhone StandBy Ladestation in der Schweiz – Nachttisch-Setup
                  optimal nutzen
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </PremiumPageLayout>
  );
};

export default BlogPage;

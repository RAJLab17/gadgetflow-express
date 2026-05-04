import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd } from "@/lib/schemas";

const PAGE_URL = "https://raj.ch/magsafe-ladestation-schweiz";
const article = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "MagSafe kompatible Ladestation Schweiz – was bedeutet das wirklich?",
  description: "Nicht alles was MagSafe-kompatibel heisst ist gleich gut. Was du wissen musst bevor du kaufst.",
  datePublished: "2026-05-03",
  dateModified: "2026-05-03",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: PAGE_URL,
  image: "https://raj.ch/raj-nexus-product.png",
};
const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "MagSafe kompatible Ladestation Schweiz", url: PAGE_URL },
]);

const MagSafeLadestationPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
    <PremiumPageLayout
      title="MagSafe kompatible Ladestation Schweiz – Was du wissen musst | RAJ"
      metaDescription="MagSafe Ladestation für iPhone, Apple Watch und AirPods in der Schweiz. Was MagSafe-kompatibel bedeutet und welche Ladestation wirklich passt."
      canonical="https://raj.ch/magsafe-ladestation-schweiz"
      eyebrow="Guide"
      heading={<>MagSafe kompatible Ladestation Schweiz – was bedeutet das wirklich?</>}
      intro={
        <>
          MagSafe steht auf vielen Produkten – aber nicht alles was «MagSafe-kompatibel» heisst ist gleich gut. Wir erklären was der Begriff wirklich bedeutet und worauf du beim Kauf einer Ladestation in der Schweiz achten solltest.
        </>
      }
    >
      <div className="space-y-12 text-foreground/85 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Was ist MagSafe?
          </h2>
          <p>
            MagSafe ist Apples magnetisches Ladesystem für iPhone 12 und neuer. Ein Ring aus Magneten im iPhone sorgt für präzise Ausrichtung auf dem Ladegerät – automatisch, ohne Suchen. Das Ergebnis: schnelleres, stabileres Laden.
          </p>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Was bedeutet «MagSafe-kompatibel»?
          </h2>
          <p className="mb-4">Nicht jedes Ladegerät mit Magnet ist offiziell MagSafe-zertifiziert. Es gibt drei Kategorien:</p>
          <ul className="space-y-3 list-disc pl-6 marker:text-primary">
            <li><strong className="font-medium text-foreground">Offizielles MagSafe</strong> (Apple) → teuer, nur iPhone</li>
            <li><strong className="font-medium text-foreground">Qi2/Qi2.2 zertifiziert</strong> → offener Standard, gleiche Magnettechnologie, günstiger, mehr Geräte</li>
            <li><strong className="font-medium text-foreground">Nur magnetisch</strong> → Magnet vorhanden aber kein Ladestandard → langsam, unzuverlässig</li>
          </ul>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Qi2.2 ist der bessere MagSafe
          </h2>
          <p>
            Qi2.2 basiert auf der gleichen Magnettechnologie wie MagSafe – entwickelt vom Wireless Power Consortium unter Mitwirkung von Apple. Der Unterschied: Qi2.2 unterstützt bis zu 25W und ist nicht auf Apple-Geräte limitiert. Für iPhone-Nutzer ist Qi2.2 mindestens gleichwertig zu MagSafe – oft sogar besser.
          </p>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Die beste MagSafe-kompatible Ladestation in der Schweiz
          </h2>
          <p>
            Der RAJ NEXUS ist Qi2.2-zertifiziert und vollständig MagSafe-kompatibel. Er lädt iPhone, Apple Watch und AirPods gleichzeitig – mit präziser magnetischer Ausrichtung, 25W Ladeleistung und Schweizer Support.
          </p>
        </section>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium tracking-wide rounded-md"
          >
            RAJ NEXUS entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PremiumPageLayout>
    </>
  );
};

export default MagSafeLadestationPage;

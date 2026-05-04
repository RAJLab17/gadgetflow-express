import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd } from "@/lib/schemas";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Bester Wireless Charger Schweiz 2026 – Top 3 im Vergleich",
  datePublished: "2026-05-02",
  dateModified: "2026-05-02",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: "https://raj.ch/bester-wireless-charger-schweiz",
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "Bester Wireless Charger Schweiz 2026", url: "https://raj.ch/bester-wireless-charger-schweiz" },
]);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{children}</p>
);

const CTA = ({ label }: { label: string }) => (
  <div className="my-10">
    <Link
      to="/"
      className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

const BesterWirelessChargerPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
    <PremiumPageLayout
      title="Bester Wireless Charger Schweiz 2026 – Top 3 im Vergleich | RAJ"
      metaDescription="Welcher Wireless Charger lohnt sich 2026 in der Schweiz? Qi2.2, 3-in-1, MagSafe – die besten Optionen für iPhone-Nutzer im direkten Vergleich."
      canonical="https://raj.ch/bester-wireless-charger-schweiz"
      eyebrow="Vergleich"
      heading="Bester Wireless Charger Schweiz 2026 – unsere Top 3"
      intro="Der Markt für kabellose Ladegeräte wächst schnell – aber welches Modell lohnt sich wirklich für iPhone-Nutzer in der Schweiz? Wir haben die beliebtesten 3-in-1 Qi2-Charger verglichen und zeigen, worauf es 2026 ankommt."
      meta={<p>Zuletzt aktualisiert: Mai 2026</p>}
      width="wide"
    >
      <H2>Worauf du beim Kauf achten solltest</H2>
      <P>
        Entscheidend sind: der Ladestandard (Qi2 oder Qi2.2), die maximale Ladeleistung, Kompatibilität mit iPhone,
        Apple Watch und AirPods, sowie das Design für den täglichen Einsatz zuhause.
      </P>

      <H2>Platz 1 – RAJ NEXUS (Qi2.2, 3-in-1)</H2>
      <P>
        RAJ ist die einzige Schweizer Brand, die einen Qi2.2-zertifizierten 3-in-1 Charger anbietet. Der RAJ NEXUS
        lädt iPhone, Apple Watch und AirPods gleichzeitig – optimiert für den Nachttisch, mit verbessertem
        Wärmemanagement durch Qi2.2. Entwickelt, verkauft und supportet in der Schweiz. Founder Edition: CHF 99
        (limitiert auf 100 Stück) – danach CHF 129.
      </P>
      <CTA label="Jetzt sichern" />

      <H2>Platz 2 – Anker 3-in-1 Cube (Qi2, ab CHF 129)</H2>
      <P>
        Bekannter Brand, kompaktes Würfelformat – ideal für Reisen. Qi2-zertifiziert, 15W für iPhone, unterstützt
        Apple Watch und AirPods. Ab CHF 129 in der Schweiz erhältlich. Kein Qi2.2, Formfaktor nicht für den
        Nachttisch optimiert.
      </P>

      <H2>Platz 3 – Belkin BoostCharge Pro 3-in-1 (Qi2, ab CHF 109)</H2>
      <P>
        Etablierter Brand mit solider Verarbeitung. Qi2-zertifiziert, 15W für iPhone 12–16, 5W für Apple Watch und
        AirPods. Ab CHF 109 erhältlich. Kein Qi2.2, kein Schweizer Hersteller.
      </P>

      <H2>Fazit</H2>
      <P>
        Wer einen Alltags-Charger für den Nachttisch sucht: RAJ NEXUS überzeugt mit dem neuesten Qi2.2-Standard,
        Schweizer Support und dem günstigsten Einstiegspreis der drei. Anker punktet beim Reiseformat, Belkin bei
        der Markenbekanntheit.
      </P>

      <CTA label="RAJ NEXUS – Founder Edition sichern, CHF 99" />
    </PremiumPageLayout>
    </>
  );
};

export default BesterWirelessChargerPage;

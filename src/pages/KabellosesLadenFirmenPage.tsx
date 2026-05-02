import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kabelloses Laden für Unternehmen Schweiz",
  datePublished: "2026-05-02",
  dateModified: "2026-05-02",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: "https://raj.ch/kabelloses-laden-firmen-schweiz",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{children}</p>
);

const KabellosesLadenFirmenPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>
    <PremiumPageLayout
      title="Kabelloses Laden für Unternehmen Schweiz – Sicher und ohne Kabelsalat | RAJ"
      metaDescription="Mitarbeitende bringen eigene Ladekabel mit – ein unterschätztes Risiko im Schweizer Büroalltag. Wie KMUs das eleganter lösen."
      canonical="https://raj.ch/kabelloses-laden-firmen-schweiz"
      eyebrow="Business"
      heading="Kabelloses Laden im Büro – warum Schweizer KMUs umdenken"
      intro="Fast jeder Mitarbeiter der ein iPhone nutzt bringt sein eigenes Ladekabel mit. Manchmal ein günstiges Ersatzkabel vom Markt, manchmal eines vom letzten Hotelaufenthalt. Im Büroalltag fällt das kaum auf – bis es ein Problem wird."
      meta={<p>Zuletzt aktualisiert: Mai 2026</p>}
      width="wide"
    >
      <H2>Ein unterschätztes Risiko</H2>
      <P>
        Elektrizität verursacht in der Schweiz rund 3'000 Brände pro Jahr mit einem Schadenvolumen von gegen
        CHF 100 Millionen – das entspricht 25% aller Brandkosten. Laut der Beratungsstelle für Brandverhütung (BFB)
        sind die meisten dieser Brände nicht auf technische Defekte zurückzuführen, sondern auf Fehlverhalten der
        Benutzer. Das Eidgenössische Starkstrominspektorat ESTI warnt zudem explizit vor günstigen Elektrogeräten
        aus Online-Plattformen – oft ohne Schweizer Zertifizierung und mit lückenhaften Sicherheitsprüfungen.
      </P>
      <P>
        Mitgebrachte Ladekabel fallen in genau diese Kategorie. Als Arbeitgeber trägt man Verantwortung für die
        elektrische Sicherheit am Arbeitsplatz.
      </P>

      <H2>Das andere Problem – Kabelsalat kostet Zeit</H2>
      <P>
        Drei Kabel pro Arbeitsplatz. Täglich eingesteckt, ausgesteckt, gesucht. Multipliziert mit 10 oder 20
        Mitarbeitenden wird das zur stillen Ineffizienz die niemand misst aber jeder kennt. Dazu kommt: ein
        unaufgeräumter Schreibtisch signalisiert Unordnung – im Homeoffice wie im Büro.
      </P>

      <H2>Die logische Konsequenz</H2>
      <P>
        Wer einmal zertifizierte, kabellose Ladestationen pro Arbeitsplatz einführt, löst beide Probleme
        gleichzeitig. Ein Gerät liegt auf dem Schreibtisch. iPhone ablegen, Apple Watch einhängen, AirPods
        platzieren – fertig. Keine Kabel, keine Risiken durch unkontrolliertes Fremdequipment, kein Suchen.
      </P>

      <H2>RAJ NEXUS – entwickelt für genau diesen Alltag</H2>
      <P>
        Der RAJ NEXUS ist Qi2.2-zertifiziert nach dem aktuellsten Standard des Wireless Power Consortium. Er wurde
        nicht für den Massenmarkt entwickelt, sondern für Menschen die täglich mit iPhone, Apple Watch und AirPods
        arbeiten und dabei keine Zeit verlieren wollen.
      </P>
      <P>Für Unternehmen bedeutet das:</P>
      <ul className="space-y-3 text-foreground/85 font-light mb-8 pl-1">
        {[
          "Ein geprüftes, zertifiziertes Gerät pro Arbeitsplatz",
          "Kein unkontrolliertes Fremdequipment mehr",
          "Swiss Brand – Support und Kommunikation auf Deutsch",
          "Dezentes Design das zu jedem Büro passt",
          "Mengenpreise für Teams auf Anfrage",
        ].map((item) => (
          <li key={item} className="flex gap-3 text-[15px] md:text-base">
            <span className="text-primary select-none">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <H2>Interesse?</H2>
      <P>
        Kein Formular, kein Sales-Funnel. Einfach eine kurze Mail – wir antworten innerhalb von 24 Stunden.
      </P>

      <div className="my-8">
        <a
          href="mailto:founder@raj.ch?subject=Business%20Anfrage%20RAJ%20NEXUS"
          className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
        >
          Anfrage senden
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
        <p className="mt-4 text-sm text-muted-foreground font-light">
          founder@raj.ch · Antwort auf Deutsch, aus der Schweiz, innerhalb von 24h.
        </p>
      </div>

      <div className="mt-12">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-7 py-4 border border-border hover:border-primary text-foreground text-sm font-medium tracking-wide transition-colors"
        >
          RAJ NEXUS entdecken
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </PremiumPageLayout>
  );
};

export default KabellosesLadenFirmenPage;

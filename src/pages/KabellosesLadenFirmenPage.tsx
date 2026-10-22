import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/schemas";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kabelloses Laden für Unternehmen Schweiz",
  datePublished: "2026-05-02",
  dateModified: "2026-10-22",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: "https://raj.ch/kabelloses-laden-firmen-schweiz",
};

const companyFaq = [
  { question: "Kann ich auf Rechnung bestellen?", answer: "Ja, für Firmenbestellungen auf Rechnung." },
  { question: "Wie schnell wird geliefert?", answer: "In der Regel innert weniger Werktage ab Lager in Weinfelden TG." },
  { question: "Mit welchen Geräten ist der RAJ NEXUS kompatibel?", answer: "iPhone 12 bis iPhone 18 Pro Max, Apple Watch sowie AirPods mit kabellosem Ladecase." },
  { question: "Wer ist für Garantie und Support zuständig?", answer: "RAJ direkt, persönlich und auf Deutsch." },
];
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: companyFaq.map(({ question, answer }) => ({
    "@type": "Question", name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "Kabelloses Laden für Unternehmen Schweiz", url: "https://raj.ch/kabelloses-laden-firmen-schweiz" },
]);

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
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
    <PremiumPageLayout
      title="Kabelloses Laden für Schweizer Unternehmen | RAJ"
      metaDescription="Mitarbeitende bringen eigene Ladekabel mit – ein unterschätztes Risiko im Schweizer Büroalltag. Wie KMUs das eleganter lösen."
      canonical="https://raj.ch/kabelloses-laden-firmen-schweiz"
      eyebrow="Business"
      heading="Kabelloses Laden im Büro – warum Schweizer KMUs umdenken"
      intro="Fast jeder Mitarbeiter der ein iPhone nutzt bringt sein eigenes Ladekabel mit. Manchmal ein günstiges Ersatzkabel vom Markt, manchmal eines vom letzten Hotelaufenthalt. Im Büroalltag fällt das kaum auf – bis es ein Problem wird."
       meta={<p>Zuletzt aktualisiert: 22. Oktober 2026</p>}
      width="wide"
    >
      <H2>Ein unterschätztes Risiko</H2>
      <P>
        Die <a href="https://www.bfb-cipi.ch/" className="text-primary underline underline-offset-4">Beratungsstelle für Brandverhütung (BFB)</a> und das <a href="https://www.esti.admin.ch/" className="text-primary underline underline-offset-4">Eidgenössische Starkstrominspektorat (ESTI)</a> weisen regelmässig auf Risiken durch ungeprüfte Elektrogeräte hin.
      </P>
      <P>
        Auch mitgebrachte Elektrogeräte sollten geprüft werden. Als Arbeitgeber trägt man Verantwortung für die
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
        Wer einheitliche, kabellose Ladestationen pro Arbeitsplatz einführt, kann beide Probleme
        reduzieren. Ein Gerät liegt auf dem Schreibtisch. iPhone ablegen, Apple Watch einhängen, AirPods
        platzieren – fertig. Weniger Kabel und weniger unkontrolliertes Fremdequipment, kein Suchen.
      </P>

      <H2>RAJ NEXUS – gemacht für genau diesen Alltag</H2>
      <P>
        Der RAJ NEXUS unterstützt den Qi2.2-Standard mit bis zu 25 W laut Herstellerangabe. Er richtet sich
        an Menschen, die täglich mit iPhone, Apple Watch und AirPods
        arbeiten und dabei keine Zeit verlieren wollen.
      </P>
      <P>Für Unternehmen bedeutet das:</P>
      <ul className="space-y-3 text-foreground/85 font-light mb-8 pl-1">
        {[
          "Ein einheitliches, hochwertiges Gerät pro Arbeitsplatz",
          "Weniger unkontrolliertes Fremdequipment",
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

      <H2>Für wen</H2>
      <P>Der RAJ NEXUS eignet sich für Mitarbeitergeschenke, Kundengeschenke, Büroausstattung und den Aussendienst.</P>

      <H2>So läuft es ab</H2>
      <ol className="list-decimal pl-6 space-y-3 text-foreground/85 font-light mb-8 text-[15px] md:text-base">
        <li>Anfrage per E-Mail.</li>
        <li>Kostenloses Muster auf Wunsch.</li>
        <li>Bestellung auf Rechnung.</li>
        <li>Lieferung innert weniger Tage aus Weinfelden TG.</li>
      </ol>

      <H2>Mengenpreise</H2>
      <P>Für Teams ab 10 Stück bieten wir Mengenpreise. Schreiben Sie uns, wir senden Ihnen gerne ein Angebot.</P>

      <H2>Häufige Fragen</H2>
      {companyFaq.map(({ question, answer }) => (
        <div key={question} className="mb-6">
          <h3 className="text-xl font-light text-foreground mb-3">{question}</h3>
          <P>{answer}</P>
        </div>
      ))}

      <H2>Interesse?</H2>
      <P>
        Kein Formular, kein Sales-Funnel. Einfach eine kurze Mail – wir antworten innerhalb von 24 Stunden.
      </P>

      <div className="my-8">
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
      <div className="mt-8">
        <Button asChild className="group h-auto rounded-none px-7 py-4 text-sm font-medium tracking-wide hover:opacity-90">
          <a href="mailto:founder@raj.ch?subject=Business%20Anfrage%20RAJ%20NEXUS">
            Firmenanfrage senden
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </PremiumPageLayout>
    </>
  );
};

export default KabellosesLadenFirmenPage;

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{children}</p>
);

const KabellosesLadenBueroPage = () => {
  return (
    <PremiumPageLayout
      title="Kabelloses Laden im Büro Schweiz – Kabelsalat eliminieren | RAJ"
      metaDescription="Wie Schweizer KMUs mit kabellosen Ladestationen Ordnung auf den Schreibtisch bringen. Qi2.2, Swiss Support, Mengenpreise für Teams."
      canonical="https://raj.ch/kabelloses-laden-buero-schweiz"
      eyebrow="Business"
      heading="Kabelloses Laden im Büro – wie Schweizer KMUs Kabelsalat eliminieren"
      intro="Jeder Mitarbeiter, der ein iPhone nutzt, kennt das Problem: Ladekabel, Watch-Kabel, AirPods-Kabel – drei Kabel pro Arbeitsplatz, täglich im Weg. Die Lösung ist einfacher als gedacht."
      meta={<p>Zuletzt aktualisiert: Mai 2026</p>}
      width="wide"
    >
      <H2>Das Problem in Schweizer Büros</H2>
      <P>
        iPhone, Apple Watch und AirPods gehören heute zum Standard-Equipment vieler Mitarbeiter. Drei separate Kabel
        pro Desk bedeuten Unordnung, Zeitverlust beim Anschliessen und unnötigen Verschleiss. Multipliziert mit 10,
        20 oder 50 Mitarbeitenden wird das schnell zum echten Problem.
      </P>

      <H2>Die Lösung – ein Gerät pro Arbeitsplatz</H2>
      <P>
        Ein Qi2.2-zertifizierter 3-in-1 Charger ersetzt alle drei Kabel. iPhone einfach hinlegen, Apple Watch
        einhängen, AirPods ablegen – alles lädt gleichzeitig, der Schreibtisch bleibt aufgeräumt. Kein Suchen, kein
        Einstecken, kein Kabelsalat.
      </P>

      <H2>Warum RAJ NEXUS für Teams</H2>
      <ul className="space-y-3 text-foreground/85 font-light mb-8 pl-1">
        {[
          "Qi2.2-zertifiziert: neuester Standard, stabiles und kühles Laden",
          "Swiss Brand: Support, Kommunikation und Abwicklung auf Deutsch in der Schweiz",
          "Ein Gerät ersetzt drei Kabel pro Arbeitsplatz",
          "Dezentes Design das zu jedem Büro passt",
          "Mengenpreise für Teams und Unternehmen auf Anfrage",
        ].map((item) => (
          <li key={item} className="flex gap-3 text-[15px] md:text-base">
            <span className="text-primary select-none">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <H2>Für wen lohnt es sich?</H2>
      <P>
        Ob 5 oder 500 Mitarbeitende – überall wo iPhones im Einsatz sind, macht kabelloses Laden Sinn. Besonders
        relevant für: KMUs mit Apple-Geräten, Co-Working Spaces, Empfangsbereiche, Konferenzräume und Home Office
        Setups.
      </P>

      <H2>Jetzt anfragen</H2>
      <P>
        Für Teamlösungen, Mengenpreise oder individuelle Beratung – melde dich direkt bei uns.
      </P>

      <div className="my-8">
        <a
          href="mailto:founder@raj.ch?subject=Business%20Anfrage%20RAJ%20NEXUS"
          className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
        >
          Business-Anfrage stellen
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
        <p className="mt-4 text-sm text-muted-foreground font-light">
          Wir antworten innerhalb von 24 Stunden. Auf Deutsch, aus der Schweiz.
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

export default KabellosesLadenBueroPage;

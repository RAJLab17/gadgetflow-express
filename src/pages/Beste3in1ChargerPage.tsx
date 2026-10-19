import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/schemas";

const articleSchema = articleJsonLd({
  headline: "3-in-1 Wireless Ladestationen Schweiz 2026 – Qi2.2 Vergleich",
  url: "https://raj.ch/blog/bester-3in1-wireless-charger-schweiz-2026",
  dateModified: "2026-10-19",
});

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  {
    name: "3-in-1 Wireless Ladestationen Schweiz 2026",
    url: "https://raj.ch/blog/bester-3in1-wireless-charger-schweiz-2026",
  },
]);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Welche 3-in-1 Wireless Ladestation empfiehlt RAJ für die Schweiz 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Als Marke hinter NEXUS empfehlen wir unsere eigene Ladestation: Der RAJ NEXUS bietet laut Herstellerangabe bis zu 25W Ladeleistung für CHF 99. RAJ ist eine Schweizer Marke aus Weinfelden TG und bietet Support auf Deutsch aus dem Thurgau.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist Qi2.2?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qi2.2 ist ein Standard für kabelloses Laden, entwickelt vom Wireless Power Consortium. Er ermöglicht bis zu 25W Ladeleistung mit magnetischer Ausrichtung. Die tatsächlich erreichte Leistung hängt vom Gerät, Netzteil und den Ladebedingungen ab.",
      },
    },
    {
      "@type": "Question",
      name: "Funktioniert der RAJ NEXUS mit iPhone 15?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Der RAJ NEXUS ist kompatibel mit iPhone 12 bis iPhone 16 Pro Max.",
      },
    },
  ],
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{children}</h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-light tracking-tight text-foreground mt-10 mb-4">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-2 mb-6 text-foreground/85 font-light text-[15px] md:text-base">{children}</ul>
);

const CTA = ({ label }: { label: string }) => (
  <div className="my-10">
    <Link
      to="/nexus"
      className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="my-8 overflow-x-auto">
    <table className="w-full text-left text-sm md:text-[15px] border-collapse">
      <thead>
        <tr className="border-b border-border">
          {headers.map((h) => (
            <th key={h} className="py-3 pr-4 font-medium text-foreground tracking-wide">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border/40">
            {row.map((cell, j) => (
              <td key={j} className="py-3 pr-4 text-foreground/85 font-light align-top">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Beste3in1ChargerPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <PremiumPageLayout
        title="Beste 3-in-1 Ladestation Schweiz 2026: Qi2.2 Vergleich | RAJ"
        metaDescription="Qi2.2 Ladestationen für iPhone, Apple Watch und AirPods im Überblick: Ladeleistung, Bauform und Preise in CHF. Ein Vergleich von RAJ, Stand Oktober 2026."
        canonical="https://raj.ch/blog/bester-3in1-wireless-charger-schweiz-2026"
        eyebrow="Vergleich · Oktober 2026"
        heading="3-in-1 Wireless Ladestationen Schweiz 2026 – Qi2.2 Vergleich"
        intro={<>
          <p className="mb-6 text-base font-medium leading-relaxed text-foreground">Transparenz: Dieser Vergleich stammt von RAJ, der Marke hinter NEXUS. Alle Angaben beruhen auf Herstellerangaben, nicht auf eigenen Labormessungen. Stand: Oktober 2026.</p>
          <p>Drei Geräte, drei Kabel, drei Stecker – jede Nacht das gleiche Chaos auf dem Nachttisch. Eine 3-in-1 Wireless Ladestation lädt diese Geräte über einen einzigen Anschluss. Dieser Vergleich stellt Herstellerangaben zu Ladeleistung und Bauform gegenüber und ordnet den RAJ NEXUS als Ladestation einer Schweizer Marke ein.</p>
        </>}
        meta={<p>Zuletzt aktualisiert: 19. Oktober 2026</p>}
        width="wide"
      >
        <H2>Was ist eine 3-in-1 Wireless Ladestation?</H2>
        <P>
          Eine 3-in-1 Wireless Ladestation lädt iPhone, Apple Watch und AirPods gleichzeitig – kabellos, über
          einen einzigen USB-C Anschluss. Modelle mit Qi2.2 unterstützen laut Standard bis zu 25W
          Ladeleistung für kompatible Smartphones.
        </P>

        <H2>Qi2 vs. Qi2.2 – was ist der Unterschied?</H2>
        <UL>
          <li><strong>Qi2</strong> – bis 15W, magnetische Ausrichtung, kompatibel mit iPhone 12 und neuer</li>
          <li><strong>Qi2.2</strong> – bis 25W, magnetische Ausrichtung; 25W auf unterstützten iPhone-16-Modellen mit iOS 26 und neueren kompatiblen Modellen</li>
        </UL>
        <P>
          Die Wattangaben bezeichnen die maximale Ladeleistung. Die tatsächlich erreichte Leistung und
          Ladedauer hängen unter anderem vom Gerät, Netzteil, Akkustand und der Temperatur ab.
        </P>

        <H2>Schnellübersicht: 3-in-1 Ladestationen Schweiz 2026</H2>
        <Table
          headers={["Produkt", "Standard", "iPhone-Leistung laut Hersteller", "Herkunft"]}
          rows={[
            ["RAJ NEXUS", "Qi2.2", "bis 25W", "Schweizer Marke"],
            ["Anker MagGo 3-in-1", "Qi2.2", "bis 25W", "USA"],
            ["Belkin 3-in-1", "Qi2", "bis 15W", "USA"],
            ["ESR CryoBoost", "Qi2.2", "bis 25W", "International"],
            ["freeVoice 3-in-1", "Qi2", "bis 15W", "International"],
          ]}
        />

        <H2>RAJ NEXUS – Die Schweizer Alternative</H2>
        <P>
          Der RAJ NEXUS ist eine 3-in-1 Qi2.2 Ladestation einer Schweizer Marke aus Weinfelden TG
          – für iPhone, Apple Watch und AirPods.
        </P>

        <H3>Technische Daten RAJ NEXUS</H3>
        <UL>
          <li>iPhone: bis 25W (Qi2.2, iPhone 16 und neuer)</li>
          <li>Apple Watch: bis 5W</li>
          <li>AirPods: bis 3W</li>
          <li>Kompatibilität: iPhone 12–16 Pro Max, Apple Watch Series 1–10, AirPods Pro 2, AirPods 3/4</li>
          <li>Standard: Qi2.2 zertifiziert</li>
          <li>Anschluss: USB-C</li>
          <li>Preis: CHF 99</li>
        </UL>

        <H3>Was RAJ NEXUS von der Konkurrenz unterscheidet</H3>
        <P>
          Der RAJ NEXUS kommt von einer Schweizer Marke aus Weinfelden TG. RAJ bietet den NEXUS für
          CHF 99 und Support auf Deutsch aus dem Thurgau. Anker und Belkin sind internationale Marken.
        </P>

        <CTA label="RAJ NEXUS sichern – CHF 99" />

        <H2>Vergleich RAJ NEXUS vs. Anker vs. Belkin</H2>

        <H3>RAJ NEXUS vs. Anker MagGo 3-in-1</H3>
        <Table
          headers={["", "RAJ NEXUS", "Anker MagGo"]}
          rows={[
            ["Standard", "Qi2.2", "Qi2.2"],
            ["iPhone-Leistung laut Hersteller", "bis 25W", "bis 25W"],
            ["Marke", "Schweizer Marke (RAJ)", "Internationale Marke"],
            ["Support", "Schweiz, auf Deutsch", "International"],
          ]}
        />
        <P><strong>Fazit:</strong> Laut Herstellerangaben unterstützen RAJ NEXUS und das hier aufgeführte Anker MagGo Modell jeweils bis zu 25W iPhone-Ladeleistung.</P>

        <H3>RAJ NEXUS vs. Belkin 3-in-1</H3>
        <Table
          headers={["", "RAJ NEXUS", "Belkin 3-in-1"]}
          rows={[
            ["Standard", "Qi2.2", "Qi2"],
            ["iPhone-Leistung laut Hersteller", "bis 25W", "bis 15W"],
            ["Marke", "Schweizer Marke (RAJ)", "Internationale Marke"],
            ["Support", "Schweiz, auf Deutsch", "International"],
          ]}
        />
        <P><strong>Fazit:</strong> Laut Herstellerangaben unterstützt RAJ NEXUS bis zu 25W iPhone-Ladeleistung; das hier aufgeführte Belkin 3-in-1 Modell mit Qi2 unterstützt bis zu 15W. Diese Angaben sind keine Messung der tatsächlichen Ladedauer.</P>

        <H2>Für wen ist eine 3-in-1 Wireless Ladestation sinnvoll?</H2>
        <P><strong>Ja, wenn du:</strong></P>
        <UL>
          <li>iPhone, Apple Watch und AirPods besitzt</li>
          <li>Kabelchaos auf dem Nachttisch oder Schreibtisch hasst</li>
          <li>Nachts alle Geräte gleichzeitig lädst</li>
          <li>Wert auf Ästhetik und Design legst</li>
        </UL>
        <P><strong>Eher nicht, wenn du:</strong></P>
        <UL>
          <li>Nur ein Gerät lädst</li>
          <li>Eine bestimmte Ladeleistung über USB-C benötigst; die Leistung hängt vom Gerät und Netzteil ab</li>
          <li>Ein sehr dickes Case (über 5mm) verwendest, das Wireless Charging blockiert</li>
        </UL>

        <H2>Häufig gestellte Fragen (FAQ)</H2>

        <H3>Welche 3-in-1 Wireless Ladestation empfiehlt RAJ für die Schweiz 2026?</H3>
        <P>
          Als Marke hinter NEXUS empfehlen wir unsere eigene Ladestation: Der RAJ NEXUS bietet laut
          Herstellerangabe bis zu 25W Ladeleistung für CHF 99. RAJ ist eine Schweizer Marke aus Weinfelden TG
          und bietet Support auf Deutsch aus dem Thurgau.
        </P>

        <H3>Was ist Qi2.2?</H3>
        <P>
          Qi2.2 ist ein Standard für kabelloses Laden, entwickelt vom Wireless Power Consortium. Er
          ermöglicht bis zu 25W Ladeleistung mit magnetischer Ausrichtung. Die tatsächlich erreichte
          Leistung hängt vom Gerät, Netzteil und den Ladebedingungen ab.
        </P>

        <H3>Funktioniert der RAJ NEXUS mit iPhone 15?</H3>
        <P>
          Ja. Der RAJ NEXUS ist kompatibel mit iPhone 12 bis iPhone 16 Pro Max. Für die volle 25W Qi2.2-Leistung
          ist ein iPhone 16 oder neuer empfohlen.
        </P>

        <H3>Brauche ich ein spezielles Netzteil?</H3>
        <P>
          Für die volle Qi2.2 Leistung wird ein USB-C Netzteil mit mindestens 30W empfohlen. Ein 20W Adapter
          funktioniert, reduziert aber die maximale Ladeleistung.
        </P>

        <H3>Wie unterscheidet sich Qi2 von MagSafe?</H3>
        <P>
          MagSafe ist Apples proprietärer Standard, Qi2 ist der offene Industriestandard basierend auf
          MagSafe-Technologie. Qi2 unterstützt bis zu 15W und Qi2.2 bis zu 25W. Die MagSafe-Ladeleistung
          hängt von der Generation des Ladegeräts und dem iPhone-Modell ab.
        </P>

        <H3>Ist kabelloses Laden schlecht für den Akku?</H3>
        <P>
          Nein, bei zertifizierten Geräten mit Temperaturschutz und Überladeschutz ist kabelloses Laden genauso
          sicher wie kabelgebundenes Laden.
        </P>

        <H3>Kann ich den RAJ NEXUS mit Android verwenden?</H3>
        <P>
          Der RAJ NEXUS ist optimiert für das Apple-Ökosystem. Qi2-kompatible Android-Geräte können ebenfalls
          kabellos geladen werden, jedoch ohne die volle magnetische Ausrichtung.
        </P>

        <H2>Fazit: Welche 3-in-1 Ladestation kaufen?</H2>
        <P>
          Unsere Empfehlung als Marke hinter NEXUS ist die eigene 3-in-1 Qi2.2 Ladestation für CHF 99.
          Für die Auswahl sind die unterstützten Geräte, die maximale Ladeleistung laut Hersteller und
          die Bauform relevant.
        </P>
        <UL>
          <li><strong>Unsere Empfehlung:</strong> RAJ NEXUS – CHF 99, Qi2.2 bis 25W, Schweizer Marke</li>
          <li><strong>Modell mit Qi2:</strong> freeVoice 3-in-1 – bis 15W laut Herstellerangabe</li>
          <li><strong>Modell mit Qi2.2:</strong> ESR CryoBoost – bis 25W laut Herstellerangabe</li>
        </UL>

        <CTA label="RAJ NEXUS bestellen" />

        <p className="mt-12 pt-8 border-t border-border/60 text-sm text-muted-foreground font-light">
          RAJ ist eine Schweizer Consumer Electronics Marke aus Weinfelden, Thurgau. PRÄZISION · BESTÄNDIGKEIT ·
          CHARAKTER.
        </p>
      </PremiumPageLayout>
    </>
  );
};

export default Beste3in1ChargerPage;

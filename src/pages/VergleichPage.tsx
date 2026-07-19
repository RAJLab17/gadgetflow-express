import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd } from "@/lib/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HERO_IMAGE =
  "https://raj.ch/__l5e/assets-v1/97f0b3a9-fba5-4a82-b109-6c82e5582779/nexus-hero-v2-1200w.webp";
const DETAIL_IMAGE =
  "https://raj.ch/assets/nexus-real-topview-qi2-1200w-BOZmMyqC.webp";

const PAGE_TITLE =
  "3-in-1 Wireless Charger Vergleich Schweiz 2026: RAJ NEXUS vs. Belkin vs. Anker";
const PAGE_DESC =
  "RAJ NEXUS, Belkin UltraCharge Pro und Anker MagGo im direkten Vergleich: Preis, Qi2.2-Standard, Ladeleistung und Verfügbarkeit in der Schweiz – aktualisiert Juli 2026.";
const CANONICAL = "https://raj.ch/vergleich";
const LAST_UPDATED_ISO = "2026-07-19";
const LAST_UPDATED_LABEL = "Juli 2026";

const faqs = [
  {
    q: "Ist Qi2.2 besser als Qi2?",
    a: "Ja, Qi2.2 ist die Weiterentwicklung von Qi2 mit verbessertem Wärmemanagement und strengeren Sicherheitsprüfungen bei gleicher maximaler Ladeleistung von 25W.",
  },
  {
    q: "Welcher 3-in-1 Charger ist am günstigsten in der Schweiz?",
    a: "Das ältere Belkin BoostCharge Pro, aktuell im Sale ab CHF 39.–, allerdings mit geringerer Ladeleistung (15W) für das iPhone.",
  },
  {
    q: "Gibt es einen 3-in-1 Charger aus der Schweiz?",
    a: "Ja, der RAJ NEXUS ist aktuell die einzige Schweizer Marke in diesem Vergleich, entwickelt und supportet aus dem Thurgau.",
  },
  {
    q: "Welcher Charger lädt am schnellsten?",
    a: "RAJ NEXUS und Belkin UltraCharge Pro laden das iPhone beide mit bis zu 25W. Anker MagGo und das ältere Belkin BoostCharge Pro laden mit 15W.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: PAGE_TITLE,
  description: PAGE_DESC,
  datePublished: "2026-05-02",
  dateModified: LAST_UPDATED_ISO,
  author: { "@type": "Organization", name: "RAJ" },
  publisher: {
    "@type": "Organization",
    name: "RAJ",
    url: "https://raj.ch",
  },
  image: [HERO_IMAGE, DETAIL_IMAGE],
  mainEntityOfPage: CANONICAL,
  url: CANONICAL,
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "Vergleich: RAJ NEXUS vs Belkin vs Anker", url: CANONICAL },
]);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "RAJ NEXUS 3-in-1 Wireless Charger",
  brand: { "@type": "Brand", name: "RAJ" },
  image: [HERO_IMAGE, DETAIL_IMAGE],
  description:
    "Schweizer 3-in-1 Wireless Charger mit Qi2.2-Zertifizierung, 25W für iPhone, 5W für Apple Watch und AirPods, verstellbarer Winkel 0–75°, faltbares Design.",
  offers: {
    "@type": "Offer",
    price: "99.00",
    priceCurrency: "CHF",
    availability: "https://schema.org/InStock",
    url: "https://raj.ch/nexus",
  },
};

// ————————————————————————————————————————————————
// Editorial helpers

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2
    id={id}
    className="text-3xl md:text-4xl font-light tracking-tight text-foreground mt-20 mb-6 leading-tight"
  >
    {children}
  </h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-normal text-foreground mt-12 mb-4 tracking-tight">
    {children}
  </h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-[1.8] mb-6 text-[16px] md:text-[17px]">
    {children}
  </p>
);

const EditorialImage = ({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) => (
  <figure className="my-14 -mx-6 md:mx-0">
    <div className="overflow-hidden md:rounded-sm bg-[#f5f3ee]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto object-cover"
      />
    </div>
    {caption && (
      <figcaption className="mt-3 px-6 md:px-0 text-xs uppercase tracking-[0.2em] text-muted-foreground font-light">
        {caption}
      </figcaption>
    )}
  </figure>
);

const ImagePlaceholder = ({ label }: { label: string }) => (
  <div className="my-14 -mx-6 md:mx-0">
    <div className="aspect-[16/9] w-full flex items-center justify-center bg-[#f5f3ee] border border-dashed border-border/60 md:rounded-sm">
      <div className="text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
          Bild folgt
        </p>
        <p className="text-sm text-foreground/60 font-light">{label}</p>
      </div>
    </div>
  </div>
);

const Callout = ({ children }: { children: React.ReactNode }) => (
  <aside className="my-10 border-l-2 border-primary/70 pl-6 py-2">
    <p className="text-[15px] md:text-base text-foreground/90 font-light leading-relaxed italic">
      {children}
    </p>
  </aside>
);

// ————————————————————————————————————————————————
// Comparison table

type Row = { label: string; nexus: string; boost: string; ultra: string; anker: string };
const rows: Row[] = [
  {
    label: "Preis Schweiz (Digitec/Galaxus, Juli 2026)",
    nexus: "CHF 99 (Early Access) / 129",
    boost: "CHF 39.– (Sale, regulär 64.40)",
    ultra: "CHF 90.90",
    anker: "CHF 85.90",
  },
  { label: "Qi-Standard", nexus: "Qi2.2", boost: "Qi2", ultra: "Qi2", anker: "Qi2" },
  {
    label: "iPhone Ladeleistung",
    nexus: "Bis zu 25W",
    boost: "15W",
    ultra: "Bis zu 25W",
    anker: "15W",
  },
  {
    label: "Apple Watch",
    nexus: "5W Fast Charge",
    boost: "5W Fast Charge",
    ultra: "5W Fast Charge",
    anker: "5W Fast Charge",
  },
  { label: "AirPods", nexus: "5W Qi", boost: "5W Qi", ultra: "5W Qi", anker: "5W Qi" },
  {
    label: "Garantie",
    nexus: "3 Jahre",
    boost: "Herstellergarantie",
    ultra: "2 Jahre + Geräteversicherung (2500 USD)",
    anker: "Herstellergarantie",
  },
  {
    label: "Faltbar",
    nexus: "Ja",
    boost: "Teilweise",
    ultra: "Nein (Dock-Design)",
    anker: "Ja",
  },
  {
    label: "Herkunft der Marke",
    nexus: "Schweiz",
    boost: "USA",
    ultra: "USA",
    anker: "China",
  },
  {
    label: "Support",
    nexus: "Schweiz, Deutsch",
    boost: "International",
    ultra: "International",
    anker: "International",
  },
  {
    label: "Verfügbar auf Digitec/Galaxus",
    nexus: "Nein (nur raj.ch)",
    boost: "Ja",
    ultra: "Ja (nur noch 4 Stk.)",
    anker: "Ja",
  },
];

const ComparisonTable = () => (
  <div className="my-14 -mx-6 md:mx-0">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm md:text-[15px] min-w-[820px]">
        <thead>
          <tr className="border-y border-foreground/15">
            <th className="text-left py-5 px-4 font-medium text-foreground align-bottom w-[22%]">
              Eigenschaft
            </th>
            <th className="text-left py-5 px-4 align-bottom relative bg-primary/5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-2">
                <Sparkles className="w-3 h-3" /> Empfehlung
              </span>
              <div className="font-medium text-foreground">RAJ NEXUS</div>
            </th>
            <th className="text-left py-5 px-4 align-bottom font-medium text-foreground/80">
              Belkin BoostCharge Pro
            </th>
            <th className="text-left py-5 px-4 align-bottom font-medium text-foreground/80">
              Belkin UltraCharge Pro
            </th>
            <th className="text-left py-5 px-4 align-bottom font-medium text-foreground/80">
              Anker MagGo
            </th>
          </tr>
        </thead>
        <tbody className="text-foreground/85 font-light">
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/40">
              <td className="py-4 px-4 text-foreground font-medium">{r.label}</td>
              <td className="py-4 px-4 bg-primary/5 text-foreground">{r.nexus}</td>
              <td className="py-4 px-4">{r.boost}</td>
              <td className="py-4 px-4">{r.ultra}</td>
              <td className="py-4 px-4">{r.anker}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-3 px-6 md:px-0 text-xs text-muted-foreground font-light md:hidden">
      → seitlich scrollen für den vollständigen Vergleich
    </p>
  </div>
);

// ————————————————————————————————————————————————

const VergleichPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <PremiumPageLayout
        title={PAGE_TITLE}
        metaDescription={PAGE_DESC}
        canonical={CANONICAL}
        ogImage={HERO_IMAGE}
        eyebrow="Vergleich"
        heading={
          <>
            3-in-1 Wireless Charger
            <br />
            im Vergleich.
          </>
        }
        intro="RAJ NEXUS vs. Belkin vs. Anker – Preise, Standards und Verfügbarkeit in der Schweiz 2026."
        meta={
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/90">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            Zuletzt aktualisiert: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_LABEL}</time>
          </p>
        }
        width="wide"
      >
        {/* Hero image */}
        <EditorialImage
          src={HERO_IMAGE}
          alt="RAJ NEXUS 3-in-1 Wireless Charger lädt iPhone, Apple Watch und AirPods gleichzeitig"
          caption="RAJ NEXUS – Schweizer 3-in-1 Charger mit Qi2.2"
        />

        <P>
          Wer ein iPhone, eine Apple Watch und AirPods besitzt, kennt das Problem: drei Geräte, drei Kabel,
          ein Chaos auf dem Nachttisch. Die Lösung sind 3-in-1 Wireless Charger – Ladestationen, die alle
          drei Apple-Geräte gleichzeitig kabellos laden. Doch welcher ist der richtige? Wir vergleichen drei
          aktuelle Modelle, die in der Schweiz erhältlich sind.
        </P>

        <Callout>
          <strong className="not-italic font-medium text-foreground">Kurz zusammengefasst:</strong>{" "}
          RAJ NEXUS (Qi2.2, 25W, CHF 99–129) ist die einzige Schweizer Marke der drei mit Schweizer Support.
          Belkin bietet zwei Modelle an: das ältere BoostCharge Pro (15W, ab CHF 39.–) und das neuere
          UltraCharge Pro (25W, CHF 90.90). Anker MagGo (Qi2, 15W, CHF 85.90) liegt preislich dazwischen.
          Alle Modelle laden iPhone, Apple Watch und AirPods gleichzeitig.
        </Callout>

        <H2 id="kandidaten">Die drei Kandidaten</H2>

        <H3>RAJ NEXUS 3-in-1 Wireless Charger</H3>
        <P>
          Der RAJ NEXUS ist ein 3-in-1 Wireless Charger einer Swiss Brand mit Qi2.2-Zertifizierung. Das
          faltbare Design mit verstellbarem Winkel (0–75°) macht ihn sowohl für den Schreibtisch als auch
          für unterwegs geeignet. Das iPhone wird mit bis zu 25W geladen, Apple Watch und AirPods jeweils
          mit 5W. Die Founder Edition ist für CHF 99 erhältlich (regulär CHF 129), inklusive 3 Jahren
          Garantie.
        </P>

        <H3>Anker MagGo 3-in-1</H3>
        <P>
          Anker ist bekannt für ein gutes Preis-Leistungs-Verhältnis. Die MagGo 3-in-1 Ladestation ist
          kompakt und faltbar – zusammengeklappt etwa so gross wie ein Kartenspiel. Mit Qi2-Zertifizierung
          und 15W für das iPhone bietet sie die Kernfunktionen zu einem soliden Preis. In der Schweiz
          kostet sie CHF 85.90 (gebraucht bereits ab CHF 54.–).
        </P>

        <ImagePlaceholder label="Anker MagGo 3-in-1" />

        <H2 id="vergleich">Vergleich auf einen Blick</H2>
        <ComparisonTable />

        <H2 id="unterschiede">Was unterscheidet sie wirklich?</H2>

        <EditorialImage
          src={DETAIL_IMAGE}
          alt="RAJ NEXUS Aufsicht mit Qi2.2-Zertifizierung"
          caption="Qi2.2-Zertifizierung – der neueste Standard des Wireless Power Consortium"
        />

        <H3>Preis</H3>
        <P>
          Belkins älteres BoostCharge Pro ist aktuell die günstigste Option im Sale, allerdings mit der
          schwächeren 15W-Ladeleistung. Vergleicht man Modelle mit gleicher 25W-Leistungsklasse, liegen
          RAJ NEXUS (CHF 99 Early Access) und Belkin UltraCharge Pro (CHF 90.90) sehr nah beieinander.
          Anker MagGo bietet mit CHF 85.90 bei 15W ein solides Mittelfeld-Angebot.
        </P>

        <H3>Technologie</H3>
        <P>
          Der RAJ NEXUS ist mit Qi2.2 zertifiziert – dem neuesten Standard des Wireless Power Consortium
          mit verbessertem Wärmemanagement und strengeren Sicherheitsprüfungen gegenüber Qi2, bei gleicher
          maximaler Ladeleistung von 25W. Belkins UltraCharge Pro erreicht mit Qi2 ebenfalls 25W, während
          das ältere BoostCharge Pro und der Anker MagGo bei 15W bleiben.
        </P>

        <H3>Design und Portabilität</H3>
        <P>
          Alle Modelle sind kompakt. Der Anker MagGo ist besonders reisefreundlich. Der RAJ NEXUS bietet
          den grössten Verstellbereich (0–75°) und ein faltbares Design für Stand- oder Flachnutzung.
          Belkins UltraCharge Pro ist als festes Dock konzipiert und dadurch weniger für unterwegs
          geeignet.
        </P>

        <H3>Verfügbarkeit in der Schweiz</H3>
        <P>
          Belkin und Anker sind über Digitec, Galaxus und weitere Schweizer Händler erhältlich, teils mit
          begrenzten Lagerbeständen (z.B. nur noch 4 Stück beim Belkin UltraCharge Pro, Stand Juli 2026).
          Der RAJ NEXUS ist ausschliesslich über raj.ch verfügbar – direkt vom Hersteller, ohne
          Zwischenhändler.
        </P>

        <H2 id="fuer-wen">Für wen eignet sich welcher?</H2>

        <div className="grid md:grid-cols-3 gap-px bg-border/40 border-y border-border/40 my-10 -mx-6 md:mx-0">
          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
                RAJ NEXUS
              </p>
            </div>
            <p className="text-foreground/85 font-light leading-relaxed text-[15px]">
              Für Käufer, die Wert auf ein Schweizer Produkt legen, den neuesten Qi2.2-Standard wollen und
              bereit sind, direkt beim Hersteller zu kaufen. Die Founder Edition mit persönlicher
              Seriennummer spricht Early Adopters an.
            </p>
          </div>
          <div className="bg-background p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
              Belkin
            </p>
            <p className="text-foreground/85 font-light leading-relaxed text-[15px]">
              Der UltraCharge Pro ist eine gute Wahl für alle, die eine etablierte Marke, sofortige
              Verfügbarkeit über Schweizer Retailer und die Geräte-Versicherung schätzen. Das günstigere
              BoostCharge Pro eignet sich, wenn 15W ausreichen und der Preis im Vordergrund steht.
            </p>
          </div>
          <div className="bg-background p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
              Anker MagGo
            </p>
            <p className="text-foreground/85 font-light leading-relaxed text-[15px]">
              Ideal für preisbewusste Käufer, die eine kompakte, bewährte Reise-Ladestation suchen.
            </p>
          </div>
        </div>

        <H2 id="faq">Häufige Fragen</H2>
        <Accordion type="single" collapsible className="my-8 border-y border-border/60">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/60 last:border-b-0">
              <AccordionTrigger className="text-left text-base md:text-lg font-normal text-foreground py-6 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 font-light leading-relaxed text-[15px] md:text-base pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <H2 id="fazit">Fazit</H2>
        <P>
          Alle vier Ladestationen erfüllen ihren Zweck gut. Die Unterschiede liegen im Detail: Preis,
          Ladeleistung, Zertifizierung und Verfügbarkeit. Wer den neuesten Standard (Qi2.2), ein Schweizer
          Produkt und einen fairen Preis sucht, findet im{" "}
          <Link to="/nexus" className="underline decoration-primary/40 underline-offset-4 hover:text-primary transition-colors">
            RAJ NEXUS
          </Link>{" "}
          eine überzeugende Option. Wer auf eine etablierte Marke mit sofortiger Lieferung setzt, greift zu
          Belkin. Und wer vor allem den Preis im Blick hat, ist bei Anker oder dem älteren Belkin-Modell
          richtig.
        </P>

        <div className="mt-16 mb-4 p-8 md:p-10 bg-[#fafaf7] border border-border/50">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium mb-3">
            RAJ NEXUS
          </p>
          <h3 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-3">
            Der einzige Schweizer 3-in-1 mit Qi2.2.
          </h3>
          <p className="text-foreground/80 font-light leading-relaxed mb-6 max-w-xl">
            Founder Edition ab CHF 99. 3 Jahre Garantie. Direkt vom Hersteller aus dem Thurgau.
          </p>
          <Link
            to="/nexus"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-primary transition-colors"
          >
            RAJ NEXUS ansehen →
          </Link>
        </div>

        <hr className="my-12 border-border/60" />
        <p className="text-xs text-muted-foreground italic font-light leading-relaxed">
          Dieser Vergleich wurde nach bestem Wissen erstellt. Preise und Lagerbestände wurden im Juli 2026
          auf digitec.ch und galaxus.ch geprüft und können sich seither geändert haben. Der RAJ NEXUS ist
          über <a href="https://raj.ch" className="underline hover:text-foreground">raj.ch</a> erhältlich.
        </p>
      </PremiumPageLayout>
    </>
  );
};

export default VergleichPage;

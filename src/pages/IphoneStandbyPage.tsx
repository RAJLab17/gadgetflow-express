import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/schemas";

const PAGE_URL = "https://raj.ch/iphone-standby-ladestation-schweiz";
const article = articleJsonLd({
  headline: "iPhone Standby Ladestation Schweiz 2026",
  url: PAGE_URL,
});
const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "iPhone Standby Ladestation Schweiz 2026", url: PAGE_URL },
]);

const IphoneStandbyPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
    <PremiumPageLayout
      title="iPhone StandBy Modus – Die perfekte Ladestation dafür | RAJ"
      metaDescription="Der StandBy Modus vom iPhone braucht die richtige Ladestation. Welche Voraussetzungen es gibt und warum Qi2.2 der beste Standard dafür ist."
      canonical="https://raj.ch/iphone-standby-ladestation-schweiz"
      eyebrow="Guide"
      heading={<>iPhone StandBy Modus – was du für die perfekte Nutzung brauchst</>}
      intro={
        <>
          Seit iOS 17 hat Apple den StandBy Modus eingeführt – eine der nützlichsten Funktionen die kaum jemand richtig nutzt. Wenn dein iPhone geladen wird und im Querformat liegt, verwandelt es sich in eine smarte Uhr, einen Fotorahmen oder ein Info-Display. Aber nicht jede Ladestation unterstützt das optimal.
        </>
      }
    >
      <div className="space-y-12 text-foreground/85 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Was ist der iPhone StandBy Modus?
          </h2>
          <p className="mb-4">StandBy aktiviert sich automatisch wenn dein iPhone:</p>
          <ul className="space-y-2 list-disc pl-6 marker:text-primary">
            <li>Kabellos geladen wird</li>
            <li>Im Querformat liegt</li>
            <li>Auf einer stabilen Unterlage steht</li>
          </ul>
          <p className="mt-4">
            Das Display zeigt dann Uhrzeit, Wetter, Kalender, Fotos oder Widgets – anpassbar nach deinen Vorlieben. Ideal für den Nachttisch oder Schreibtisch.
          </p>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Welche Ladestation braucht es?
          </h2>
          <p className="mb-4">Nicht jede Ladestation unterstützt StandBy optimal. Du brauchst:</p>
          <ul className="space-y-2 list-disc pl-6 marker:text-primary">
            <li>Kabelloses Laden (Qi oder Qi2.2)</li>
            <li>Einen Ständer der das iPhone im Querformat hält</li>
            <li>Stabile magnetische Ausrichtung damit das iPhone nicht verrutscht</li>
          </ul>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Warum Qi2.2 die beste Wahl ist
          </h2>
          <p>
            Mit Qi2.2 bleibt das iPhone kühler beim Laden – das ist besonders wichtig wenn StandBy die ganze Nacht aktiv ist. Ältere Qi-Ladegeräte können das iPhone beim Dauerbetrieb überhitzen lassen, was Apple dazu veranlasst die Ladung zu drosseln.
          </p>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            RAJ NEXUS – entwickelt für StandBy
          </h2>
          <p>
            Der RAJ NEXUS hält das iPhone präzise im richtigen Winkel für StandBy, lädt mit Qi2.2 für optimale Temperatur, und lädt gleichzeitig Apple Watch und AirPods. Ein Gerät, eine Lösung – für den Nachttisch oder Schreibtisch.
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

export default IphoneStandbyPage;

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd } from "@/lib/schemas";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Die RAJ MATRIX Carbon-Hülle für iPhone 18 Pro und Pro Max",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: "https://raj.ch/blog/matrix-iphone-18-case",
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "MATRIX Carbon-Hülle iPhone 18 Pro", url: "https://raj.ch/blog/matrix-iphone-18-case" },
]);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{children}</p>
);
const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="text-foreground/85 font-light leading-relaxed text-[15px] md:text-base">{children}</li>
);

const MatrixBlogPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <PremiumPageLayout
        title="MATRIX Carbon-Hülle iPhone 18 Pro & Pro Max – MagSafe | RAJ"
        metaDescription="Die RAJ MATRIX Carbon-Hülle für iPhone 18 Pro und Pro Max: schlanker Hightech-Look, MagSafe-kompatibel, präzise Passform. Schweizer Marke."
        canonical="https://raj.ch/blog/matrix-iphone-18-case"
        eyebrow="Ratgeber"
        heading="Die RAJ MATRIX Carbon-Hülle für iPhone 18 Pro und Pro Max"
        intro="Ein neues iPhone verdient eine Hülle, die seinem Design gerecht wird. Kein klobiger Plastikpanzer, keine langweilige Standardhülle – sondern ein Case, das genauso hochwertig wirkt wie das Gerät darin. Genau dafür haben wir die RAJ MATRIX entwickelt: eine Carbon-Hülle für das iPhone 18 Pro und iPhone 18 Pro Max, die schlank, griffig und unverkennbar edel ist – und dank MagSafe perfekt in dein Apple-Setup passt."
        meta={<p>Zuletzt aktualisiert: Juni 2026</p>}
        width="wide"
      >
        <H2>Der Carbon-Look, der nie aus der Mode kommt</H2>
        <P>
          Die geflochtene Carbon-Struktur kennt man aus dem Motorsport, aus Supersportwagen und aus hochwertiger
          Technik. Sie steht für Leichtigkeit, Stärke und Stil. Auf deinem iPhone 18 Pro oder iPhone 18 Pro Max
          wirkt dieser Look edel und unaufdringlich zugleich – ein Case, das auffällt, ohne aufzutragen. Und es
          fühlt sich genauso gut an, wie es aussieht: angenehm griffig, mit sicherem Halt in der Hand.
        </P>

        <H2>MagSafe-kompatibel – kabelloses Laden ohne Abnehmen</H2>
        <P>
          Die MATRIX Hülle ist MagSafe-kompatibel. Das heisst: MagSafe-Zubehör hält magnetisch, und du kannst dein
          iPhone 18 Pro oder Pro Max kabellos laden, ohne die Hülle jedes Mal abzunehmen. Einfach auflegen und
          laden – zum Beispiel auf der{" "}
          <Link to="/nexus" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">
            RAJ NEXUS 3-in-1 Ladestation
          </Link>
          , die iPhone, Apple Watch und AirPods gleichzeitig an einem Platz lädt.
        </P>

        <H2>Passgenau für iPhone 18 Pro und iPhone 18 Pro Max</H2>
        <P>
          Jede MATRIX Hülle ist exakt auf das jeweilige Modell zugeschnitten. Alle Aussparungen für Kameras, Tasten,
          Anschlüsse und Lautsprecher sitzen präzise – egal ob du das iPhone 18 Pro oder das grössere iPhone 18 Pro
          Max nutzt.
        </P>
        <ul className="list-disc pl-5 space-y-2 mb-5">
          <Li>Präziser Sitz für iPhone 18 Pro und iPhone 18 Pro Max</Li>
          <Li>MagSafe-kompatibel für kabelloses Laden und Zubehör</Li>
          <Li>Erhöhter Rand um Display und Kamera für zusätzlichen Schutz</Li>
          <Li>Tastenabdeckungen mit klarem, sauberem Druckpunkt</Li>
        </ul>

        <H2>Schlank, aber schützend</H2>
        <P>
          Viele robuste Hüllen machen aus einem eleganten iPhone einen unförmigen Klotz. Die MATRIX geht den
          anderen Weg: Sie trägt kaum auf und behält die schlanke Linie deines iPhone 18 Pro bei – schützt aber
          trotzdem dort, wo es zählt. Der erhöhte Rand hält Display und Kamera vom Untergrund fern, wenn das
          Telefon einmal flach liegt.
        </P>

        <H2>Teil deines RAJ Setups</H2>
        <P>
          Ein Case ist für uns nie ein Einzelstück – es ist Teil deines Apple-Setups. Weil die MATRIX
          MagSafe-kompatibel ist, arbeitet sie nahtlos mit deinem restlichen Zubehör zusammen, allen voran der{" "}
          <Link to="/nexus" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">
            RAJ NEXUS 3-in-1 Ladestation
          </Link>{" "}
          für iPhone, Apple Watch und AirPods.
        </P>
        <P>
          Und weil zu einem runden Setup mehr gehört als die iPhone-Hülle, erweitern wir unser Sortiment laufend –
          von Hüllen für iPhone 18 Pro und Pro Max bis zu passendem Zubehör für deine AirPods. Ein Look, ein
          Materialgefühl, eine Marke.
        </P>

        <H2>Warum RAJ?</H2>
        <P>
          RAJ ist eine Schweizer Marke für durchdachtes Apple-Zubehör. Uns geht es nicht um möglichst billig oder
          möglichst laut – sondern um Produkte, die im Alltag Freude machen und lange halten. Ehrliche Materialien,
          saubere Verarbeitung, ein klarer Look.
        </P>
        <P>
          Wenn du für dein iPhone 18 Pro oder iPhone 18 Pro Max eine Hülle suchst, die hochwertig aussieht, gut in
          der Hand liegt, MagSafe unterstützt und zu deinem restlichen Setup passt, bist du bei der{" "}
          <Link to="/matrix" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">
            MATRIX
          </Link>{" "}
          richtig.
        </P>

        <H2>Fazit</H2>
        <P>
          Die RAJ MATRIX Carbon-Hülle für iPhone 18 Pro und Pro Max verbindet den zeitlosen Carbon-Look mit einem
          schlanken, griffigen Design, präziser Passform und MagSafe-Kompatibilität. Kein Kompromiss zwischen Stil
          und Schutz – sondern beides in einer Hülle, die zu deinem Apple-Ökosystem passt.
        </P>

        <div className="my-10">
          <Link
            to="/matrix"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            MATRIX Hülle ansehen
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </PremiumPageLayout>
    </>
  );
};

export default MatrixBlogPage;

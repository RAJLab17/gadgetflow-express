import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd } from "@/lib/schemas";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "RAJ NEXUS: Die durchdachte Ladelösung für dein iPhone 18",
  datePublished: "2026-09-17",
  dateModified: "2026-09-17",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: "https://raj.ch/blog/nexus-iphone-18-ladegeraet",
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "RAJ NEXUS Ladestation iPhone 18", url: "https://raj.ch/blog/nexus-iphone-18-ladegeraet" },
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

const NexusBlogPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <PremiumPageLayout
        title="RAJ NEXUS – 3-in-1 Ladestation fürs iPhone 18 | Qi2.2 25W"
        metaDescription="Die RAJ NEXUS lädt iPhone 18, Apple Watch und AirPods gleichzeitig – Qi2.2 mit 25W, MagSafe, Schweizer Marke. Die durchdachte Ladelösung."
        canonical="https://raj.ch/blog/nexus-iphone-18-ladegeraet"
        eyebrow="Ratgeber"
        heading="RAJ NEXUS: Die durchdachte Ladelösung für dein iPhone 18"
        intro="Ein neues iPhone lädt am besten mit Zubehör, das mithält. Wer ein iPhone 18, iPhone 18 Pro oder Pro Max besitzt, will nicht drei Kabel auf dem Nachttisch – sondern eine Ladestation, die alles an einem Platz erledigt. Genau das ist die RAJ NEXUS: eine 3-in-1 Ladestation, die iPhone, Apple Watch und AirPods gleichzeitig lädt. Schnell, aufgeräumt, MagSafe-fest."
        meta={<p>Zuletzt aktualisiert: September 2026</p>}
        width="wide"
      >
        <H2>Volle Ladeleistung mit Qi2.2 und 25W</H2>
        <P>
          Das iPhone 18 unterstützt modernes kabelloses Laden nach Qi2-Standard. Die RAJ NEXUS ist Qi2.2-zertifiziert
          und lädt mit bis zu 25W – dein iPhone kommt also schnell wieder auf Touren, ohne Kabel, ohne Fummelei.
          Einfach magnetisch auflegen, perfekt ausgerichtet dank MagSafe, und laden.
        </P>
        <ul className="list-disc pl-5 space-y-2 mb-5">
          <Li>Qi2.2-zertifiziert für sicheres, effizientes Laden</Li>
          <Li>Bis zu 25W Ladeleistung</Li>
          <Li>MagSafe: das iPhone rastet perfekt ausgerichtet ein</Li>
          <Li>Alles an einem Platz: iPhone, Apple Watch, AirPods</Li>
        </ul>

        <H2>Alles an einem Platz: iPhone, Apple Watch, AirPods</H2>
        <P>
          Der eigentliche Vorteil der NEXUS ist, dass sie dein ganzes Apple-Setup an einem einzigen Ort lädt:
        </P>
        <ul className="list-disc pl-5 space-y-2 mb-5">
          <Li>iPhone 18 / Pro / Pro Max im perfekten Blickwinkel, magnetisch gehalten</Li>
          <Li>Apple Watch daneben – auch im Nachttisch-Modus nutzbar</Li>
          <Li>AirPods auf der Ladefläche darunter</Li>
        </ul>
        <P>
          Ein Kabel, ein Platz, ein Handgriff. Kein Kabelsalat, kein Suchen am Morgen.
        </P>

        <H2>Passt in dein Zuhause – und auf jeden Nachttisch</H2>
        <P>
          Die NEXUS ist so gebaut, dass sie nicht nur funktioniert, sondern auch gut aussieht. Kompaktes Design,
          saubere Linien, angenehm auf dem Nachttisch, dem Schreibtisch oder der Kommode. Und weil das iPhone im
          aufgestellten Winkel geladen wird, siehst du Uhrzeit, Benachrichtigungen oder den StandBy-Modus auf einen
          Blick.
        </P>

        <H2>Teil des RAJ Ökosystems</H2>
        <P>
          Die NEXUS spielt nahtlos mit dem restlichen RAJ Zubehör zusammen. Unsere{" "}
          <Link to="/matrix" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">
            MATRIX Carbon-Hülle
          </Link>{" "}
          für iPhone 18 Pro und Pro Max ist zum Beispiel MagSafe-kompatibel – Hülle drauflassen, iPhone auflegen,
          laden. Alles aus einer Hand, alles aufeinander abgestimmt.
        </P>

        <H2>Warum RAJ?</H2>
        <P>
          RAJ ist eine Schweizer Marke für durchdachtes Apple-Zubehör. Statt möglichst billig oder möglichst laut
          setzen wir auf Produkte, die im Alltag Freude machen und lange halten – mit ehrlichen Angaben, sauberer
          Verarbeitung und Schweizer Support. Dazu gehören Gratisversand, 30 Tage Rückgabe und Garantie.
        </P>

        <H2>Fazit</H2>
        <P>
          Wer eine Ladelösung fürs iPhone 18 sucht, die schnell lädt (Qi2.2, 25W), MagSafe unterstützt und
          gleichzeitig Apple Watch und AirPods versorgt, findet in der{" "}
          <Link to="/nexus" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">
            RAJ NEXUS
          </Link>{" "}
          eine durchdachte, aufgeräumte Antwort. Ein Ladeplatz für dein ganzes Apple-Setup – aus einer Schweizer
          Marke.
        </P>

        <div className="my-10">
          <Link
            to="/nexus"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            RAJ NEXUS ansehen
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </PremiumPageLayout>
    </>
  );
};

export default NexusBlogPage;

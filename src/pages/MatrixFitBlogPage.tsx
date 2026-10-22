import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { breadcrumbJsonLd } from "@/lib/schemas";
import { shareImages } from "@/lib/shareImages";
import cherryAsset from "@/assets/matrix/uploaded-renders/cherry-silver-18-v1-full.webp.asset.json";

const URL = "https://raj.ch/blog/iphone-17-pro-huelle-iphone-18-pro";
const DATE_ISO = "2026-10-12";
const DATE = "12.10.2026";
const H1 = "Passt eine iPhone 17 Pro Hülle auf das iPhone 18 Pro?";

const INTRO =
  "Bei der RAJ MATRIX lautet die Antwort ja. Das iPhone 17 Pro und das iPhone 18 Pro nutzen dieselbe Hülle, genauso das iPhone 17 Pro Max und das iPhone 18 Pro Max. Bei Hüllen anderer Marken hängt es vom jeweiligen Modell ab. Prüfe dort am besten die Kompatibilitätsliste des Herstellers, bevor du bestellst.";

const SECTIONS: { q: string; a: string; faq: boolean }[] = [
  {
    q: "Passt die RAJ MATRIX auf iPhone 17 Pro und iPhone 18 Pro?",
    a: "Ja. Die RAJ MATRIX Carbon Hülle ist für das iPhone 17 Pro und das iPhone 18 Pro identisch. Es ist dieselbe Hülle, und sie sitzt an beiden Modellen gleich: Die Aussparungen für Kamera, Tasten und Anschluss liegen an derselben Stelle. Wenn du dein iPhone wechselst, kannst du deine MATRIX also weiterverwenden. Im Shop wählst du trotzdem dein genaues Modell aus. So können wir deine Bestellung eindeutig zuordnen und dir bei Fragen schneller helfen. Die Hülle gibt es in zwei Farben, Cherry Carbon und Onyx Carbon, beide mit goldfarbenen Knöpfen aus Aluminium.",
    faq: true,
  },
  {
    q: "Und beim iPhone 17 Pro Max und 18 Pro Max?",
    a: "Auch hier gilt: Die RAJ MATRIX für das iPhone 17 Pro Max passt genauso auf das iPhone 18 Pro Max. Beide Modelle nutzen dieselbe Hülle. Wichtig ist nur, dass du Pro und Pro Max nicht verwechselst. Die Pro Max Modelle sind grösser, eine Hülle für das Pro passt deshalb nicht auf das Pro Max und umgekehrt. Wenn du unsicher bist, welches Modell du hast, findest du die Bezeichnung auf deinem iPhone unter Einstellungen, Allgemein, Info. Dort steht der Modellname gleich in der ersten Zeile.",
    faq: true,
  },
  {
    q: "Worauf solltest du bei Hüllen anderer Marken achten?",
    a: "Bei Hüllen anderer Marken lohnt sich ein kurzer Check, bevor du eine alte Hülle auf ein neues iPhone ziehst oder eine neue bestellst. Achte vor allem auf vier Punkte. Erstens die Kameraaussparung: Sie muss das ganze Kameramodul frei lassen, sonst können dunkle Ränder auf Fotos entstehen. Zweitens die Aussparungen für die Tasten und für Camera Control, damit du alles normal bedienen kannst. Drittens den MagSafe-Magnetring, falls du kabellos laden oder Zubehör anbringen willst. Viertens die Kompatibilitätsliste des Herstellers. Steht dein Modell dort nicht ausdrücklich drauf, frag lieber nach, bevor du bestellst.",
    faq: true,
  },
  {
    q: "Funktioniert kabelloses Laden durch die Hülle?",
    a: "Ja. In der RAJ MATRIX sind Magnete integriert, die Hülle ist MagSafe-kompatibel. Zum Laden musst du sie also nicht abnehmen. Auf einem Qi2.2-Ladegerät wie der RAJ NEXUS lädt dein iPhone durch die Hülle hindurch. Ein iPhone 16 oder neuer mit iOS 26 erreicht dabei bis zu 25 W, sofern das Netzteil genug Leistung liefert. Die Magnete sorgen ausserdem dafür, dass das iPhone sauber auf dem Ladegerät sitzt und nicht verrutscht. Das gilt genauso für MagSafe-Halterungen im Auto und anderes magnetisches Zubehör.",
    faq: true,
  },
  {
    q: "Schützt die Hülle Kamera und Display?",
    a: "Die RAJ MATRIX ist eine robuste Hartschale aus Polycarbonat mit Carbon-Finish. Sie ist leicht, schlagfest und hat eine griffige Oberfläche, damit dir das iPhone nicht so leicht aus der Hand rutscht. Um Kamera und Display ist der Rand erhöht. Legst du das iPhone auf den Tisch, liegen also nicht die Kameralinsen oder das Glas direkt auf, sondern der Rand der Hülle. Das schützt im Alltag vor Kratzern. Trägst du dein iPhone oft zusammen mit Schlüsseln in der Tasche, empfehlen wir für das Display zusätzlich eine Schutzfolie.",
    faq: true,
  },
  {
    q: "Was kostet die RAJ MATRIX und wie schnell ist sie da?",
    a: "Die RAJ MATRIX kostet CHF 59. Zwei Hüllen bekommst du zusammen für CHF 99, zum Beispiel für dich und deine Partnerin oder deinen Partner. Im Set mit der passenden MATRIX AirPods-Hülle zahlst du CHF 79. Der Versand innerhalb der Schweiz ist kostenlos, und die aktuelle Lieferzeit siehst du direkt auf der Produktseite. Gefällt dir die Hülle nicht, kannst du sie innerhalb von 30 Tagen zurückgeben, auch wenn du sie ausprobiert hast. Sie sollte einfach keine Gebrauchsspuren haben und in der Originalverpackung zurückkommen. Bezahlen kannst du mit TWINT, Apple Pay oder Karte.",
    faq: true,
  },
  {
    q: "Aus unserer Erfahrung",
    a: "Wir haben die MATRIX von Anfang an so gestaltet, dass eine Hülle für zwei iPhone-Generationen passt. Wer vom iPhone 17 Pro auf das iPhone 18 Pro wechselt, soll seine Hülle nicht wegwerfen müssen. Deshalb gibt es bei uns keine eigene Version pro Jahrgang, sondern eine Hülle für Pro und eine für Pro Max. Das spart dir Geld und vermeidet unnötigen Abfall.",
    faq: false,
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: H1,
  datePublished: DATE_ISO,
  dateModified: DATE_ISO,
  author: { "@type": "Organization", name: "RAJ Team" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: URL,
  mainEntityOfPage: URL,
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "iPhone 17 Pro Hülle auf iPhone 18 Pro", url: URL },
]);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SECTIONS.filter((s) => s.faq).map((s) => ({
    "@type": "Question",
    name: s.q,
    acceptedAnswer: { "@type": "Answer", text: s.a },
  })),
};

const MatrixFitBlogPage = () => (
  <>
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </Helmet>
    <PremiumPageLayout
      title="Passt eine iPhone 17 Pro Hülle auf das iPhone 18 Pro? | RAJ"
      metaDescription="Kurz gesagt: Bei der RAJ MATRIX ja. iPhone 17 Pro und 18 Pro nutzen dieselbe Hülle, ebenso 17 Pro Max und 18 Pro Max. Worauf du bei anderen Hüllen achten musst."
      canonical={URL}
      ogImage={shareImages.matrix.url}
      eyebrow="Ratgeber"
      heading={H1}
      intro={<p>{INTRO}</p>}
      meta={<p>Autor: RAJ Team, Weinfelden · <time dateTime={DATE_ISO}>{DATE}</time></p>}
      width="wide"
    >
      {SECTIONS.map((s) => (
        <section key={s.q}>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{s.q}</h2>
          <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{s.a}</p>
        </section>
      ))}

      <div className="my-12 border border-border/60 bg-background p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={cherryAsset.url}
          alt="RAJ MATRIX Cherry Carbon Hülle mit MagSafe"
          width={160}
          height={160}
          loading="lazy"
          className="w-40 h-40 object-contain"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-lg md:text-xl font-light tracking-tight text-foreground">RAJ MATRIX Carbon Hülle MagSafe</p>
          <p className="text-foreground/85 font-light mt-1 mb-4">CHF 59</p>
          <Link
            to="/matrix"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            Zur MATRIX
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-light">
        Quelle:{" "}
        <a
          href="https://www.apple.com/chde/iphone/compare/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-primary"
        >
          Apple: iPhone Modelle vergleichen
        </a>
      </p>
    </PremiumPageLayout>
  </>
);

export default MatrixFitBlogPage;

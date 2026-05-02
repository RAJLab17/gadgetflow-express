import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Qi2 vs. Qi2.2 – Was ist der Unterschied?",
  datePublished: "2026-05-02",
  dateModified: "2026-05-02",
  author: { "@type": "Organization", name: "RAJ" },
  publisher: { "@type": "Organization", name: "RAJ", url: "https://raj.ch" },
  url: "https://raj.ch/qi2-erklaert",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mt-16 mb-6">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 font-light leading-relaxed mb-5 text-[15px] md:text-base">{children}</p>
);
const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-foreground font-medium">{children}</strong>
);

const Qi2ErklaertPage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>
    <PremiumPageLayout
      title="Qi2 vs. Qi2.2: Was bedeutet der neue Wireless-Charging-Standard für dein iPhone?"
      metaDescription="Qi2 vs. Qi2.2 erklärt: Unterschiede, Vorteile und worauf du beim Kauf eines kabellosen Ladegeräts achten solltest. Stand April 2026."
      canonical="https://raj.ch/qi2-erklaert"
      eyebrow="Wissen"
      heading="Qi2 vs. Qi2.2 erklärt."
      intro="Was der neue Wireless-Charging-Standard für dein iPhone bedeutet."
      meta={<p>Zuletzt aktualisiert: April 2026</p>}
    >
      <P>
        Kabelloses Laden hat sich in den letzten Jahren stark weiterentwickelt. Mit der Einführung von Qi2 durch das
        Wireless Power Consortium (WPC) im Jahr 2023 wurde ein neuer Standard gesetzt – schneller, sicherer und mit
        magnetischer Ausrichtung. Doch seit Ende 2024 gibt es bereits den Nachfolger: Qi2.2. Was hat sich geändert,
        und was bedeutet das für dich als iPhone-Nutzer?
      </P>

      <H2>Was ist Qi2?</H2>
      <P>
        Qi2 (ausgesprochen «Tschi Zwei») ist der kabellose Ladestandard, der 2023 vom Wireless Power Consortium
        veröffentlicht wurde. Er basiert auf Apples MagSafe-Technologie und bringt zwei wesentliche Neuerungen
        gegenüber dem alten Qi-Standard:
      </P>
      <P>
        <Strong>Magnetische Ausrichtung:</Strong> Magnete im Ladegerät und im Smartphone sorgen dafür, dass das Gerät
        automatisch in der optimalen Position liegt. Schluss mit dem Hin-und-Her-Schieben, bis das Laden endlich
        startet.
      </P>
      <P>
        <Strong>Höhere Ladeleistung:</Strong> Qi2 unterstützt bis zu 15W kabelloses Laden – doppelt so viel wie der
        alte Qi-Standard mit 7,5W für iPhones. Das bedeutet: schnelleres Laden ohne Kabel.
      </P>
      <P>Qi2 ist mit allen iPhones ab dem iPhone 12 kompatibel und wird auch zunehmend von Android-Herstellern unterstützt.</P>

      <H2>Was ist Qi2.2?</H2>
      <P>
        Qi2.2 ist die Weiterentwicklung von Qi2 und wurde Ende 2024 durch das WPC spezifiziert. Es ist kein komplett
        neuer Standard, sondern ein Update, das den bestehenden Qi2-Standard in mehreren Bereichen verbessert:
      </P>
      <P>
        <Strong>Verbesserte Energieeffizienz:</Strong> Qi2.2 optimiert die Energieübertragung zwischen Ladegerät und
        Gerät. Weniger Energie geht als Wärme verloren, was sowohl den Ladevorgang als auch die Lebensdauer des Akkus
        verbessert.
      </P>
      <P>
        <Strong>Erweitertes Wärmemanagement:</Strong> Eines der grössten Probleme beim kabellosen Laden ist Hitze.
        Qi2.2 führt strengere Anforderungen an das Thermal Management ein. Das Ergebnis: Geräte bleiben kühler während
        des Ladens, was wiederum zu schnellerem und sichererem Laden führt.
      </P>
      <P>
        <Strong>Höhere Ladeleistungen möglich:</Strong> Während Qi2 bei 15W liegt, ermöglicht Qi2.2 perspektivisch
        höhere Leistungen. Erste Hersteller wie Belkin (UltraCharge) bieten bereits Qi2.2-Ladegeräte mit 25W an. Ob
        ein Gerät diese höheren Leistungen nutzen kann, hängt allerdings vom Smartphone ab – aktuelle iPhones laden
        weiterhin mit maximal 15W kabellos.
      </P>
      <P>
        <Strong>Strengere Sicherheitsprüfungen:</Strong> Qi2.2 verschärft die Authentifizierungsprotokolle. Das
        bedeutet: Das Ladegerät und das Smartphone «verifizieren» sich gegenseitig, bevor der Ladevorgang mit voller
        Leistung startet. Das schützt vor minderwertigen oder unsicheren Ladegeräten.
      </P>

      <H2>Was ist der Unterschied für den Alltag?</H2>
      <P>
        Für die meisten iPhone-Nutzer ist der Unterschied zwischen Qi2 und Qi2.2 im Alltag aktuell noch gering. Beide
        Standards laden das iPhone mit bis zu 15W. Die Vorteile von Qi2.2 zeigen sich eher langfristig:
      </P>
      <P>
        <Strong>Weniger Hitze</Strong> bedeutet weniger Verschleiss am Akku. Wer sein Ladegerät jede Nacht nutzt,
        profitiert über die Monate hinweg von der besseren Wärmeabfuhr.
      </P>
      <P>
        <Strong>Zukunftssicherheit:</Strong> Wenn Apple in zukünftigen iPhone-Generationen höhere kabellose
        Ladegeschwindigkeiten unterstützt (z.B. 25W), ist ein Qi2.2-Ladegerät bereits dafür bereit. Ein Qi2-Ladegerät
        müsste dann ersetzt werden.
      </P>
      <P>
        <Strong>Sicherheit:</Strong> Die strengeren Authentifizierungsprotokolle von Qi2.2 bedeuten, dass du sicher
        sein kannst, dass dein Ladegerät geprüft und zertifiziert ist.
      </P>

      <H2>Worauf sollte ich beim Kauf achten?</H2>
      <P>Wenn du jetzt ein kabelloses Ladegerät kaufst, beachte folgende Punkte:</P>
      <P>
        <Strong>Zertifizierung prüfen:</Strong> Achte darauf, ob das Ladegerät Qi2 oder Qi2.2 zertifiziert ist. Die
        Zertifizierung erfolgt durch das Wireless Power Consortium – sie stellt sicher, dass das Gerät den Standard
        tatsächlich einhält und nicht nur behauptet.
      </P>
      <P>
        <Strong>Netzteil inklusive?</Strong> Kabelloses Laden mit 15W erfordert ein ausreichend starkes Netzteil.
        Manche Hersteller liefern keins mit – dann lädt das Gerät nur mit 5–7,5W, obwohl es 15W könnte.
      </P>
      <P>
        <Strong>MagSafe-Kompatibilität:</Strong> Alle Qi2- und Qi2.2-Ladegeräte sind mit MagSafe kompatibel. Die
        magnetische Ausrichtung funktioniert auch mit den meisten MagSafe-Hüllen.
      </P>
      <P>
        <Strong>3-in-1 oder einzeln?</Strong> Wer iPhone, Apple Watch und AirPods besitzt, spart mit einer 3-in-1
        Ladestation Platz und Kabel. Diese Stationen kosten mehr als ein einfaches Ladepad, vereinfachen aber das
        Setup erheblich.
      </P>

      <H2>Qi2.2-zertifizierte Ladegeräte in der Schweiz</H2>
      <P>Noch gibt es nicht viele Qi2.2-Ladegeräte auf dem Markt. Zu den ersten gehören:</P>
      <ul className="space-y-3 text-foreground/85 font-light mb-8 pl-1">
        <li className="flex gap-3">
          <span className="text-muted-foreground select-none">·</span>
          <span><Strong>RAJ NEXUS 3-in-1 Wireless Charger</Strong> – CHF 99 (Early Access) / CHF 129 regulär. Qi2.2-zertifiziert, faltbar, von einer Swiss Brand. Erhältlich über raj.ch.</span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground select-none">·</span>
          <span><Strong>Belkin UltraCharge Pro 3-in-1</Strong> – Ab ca. CHF 139. Qi2.2 mit 25W, aktive Kühlung. Erhältlich über Digitec/Galaxus.</span>
        </li>
      </ul>
      <P>Die meisten anderen aktuell erhältlichen Ladestationen (Anker MagGo, ältere Belkin-Modelle) sind Qi2-zertifiziert, nicht Qi2.2.</P>

      <H2>Fazit</H2>
      <P>
        Qi2.2 ist keine Revolution, sondern eine sinnvolle Evolution. Wer heute ein neues kabelloses Ladegerät kauft
        und es mehrere Jahre nutzen will, ist mit Qi2.2 besser aufgestellt – besseres Wärmemanagement, höhere
        Zukunftssicherheit und strengere Sicherheitsstandards. Für den sofortigen Alltagsgebrauch liefern beide
        Standards die gleiche Ladeleistung von 15W.
      </P>

      <hr className="my-12 border-border/60" />

      <p className="text-sm text-muted-foreground italic font-light">
        RAJ NEXUS ist einer der ersten Qi2.2-zertifizierten 3-in-1 Wireless Charger in der Schweiz. Mehr erfahren:{" "}
        <a href="https://raj.ch" className="text-primary underline hover:opacity-80">raj.ch</a>
      </p>
    </PremiumPageLayout>
  );
};

export default Qi2ErklaertPage;

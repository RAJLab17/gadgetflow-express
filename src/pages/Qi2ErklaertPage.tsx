import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Qi2ErklaertPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Qi2 vs. Qi2.2: Was bedeutet der neue Wireless-Charging-Standard für dein iPhone?</title>
        <meta
          name="description"
          content="Qi2 vs. Qi2.2 erklärt: Unterschiede, Vorteile und worauf du beim Kauf eines kabellosen Ladegeräts achten solltest. Stand April 2026."
        />
        <link rel="canonical" href="https://raj.ch/qi2-erklaert" />
      </Helmet>

      <Header />

      <main className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-foreground mb-4">
            Qi2 vs. Qi2.2: Was bedeutet der neue Wireless-Charging-Standard für dein iPhone?
          </h1>
          <p className="text-sm text-muted-foreground mb-10">Zuletzt aktualisiert: April 2026</p>

          <p className="text-foreground/80 leading-relaxed mb-8">
            Kabelloses Laden hat sich in den letzten Jahren stark weiterentwickelt. Mit der Einführung von Qi2 durch
            das Wireless Power Consortium (WPC) im Jahr 2023 wurde ein neuer Standard gesetzt – schneller, sicherer
            und mit magnetischer Ausrichtung. Doch seit Ende 2024 gibt es bereits den Nachfolger: Qi2.2. Was hat sich
            geändert, und was bedeutet das für dich als iPhone-Nutzer?
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Was ist Qi2?</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Qi2 (ausgesprochen «Tschi Zwei») ist der kabellose Ladestandard, der 2023 vom Wireless Power Consortium
            veröffentlicht wurde. Er basiert auf Apples MagSafe-Technologie und bringt zwei wesentliche Neuerungen
            gegenüber dem alten Qi-Standard:
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Magnetische Ausrichtung:</strong> Magnete im Ladegerät und im
            Smartphone sorgen dafür, dass das Gerät automatisch in der optimalen Position liegt. Schluss mit dem
            Hin-und-Her-Schieben, bis das Laden endlich startet.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Höhere Ladeleistung:</strong> Qi2 unterstützt bis zu 15W kabelloses
            Laden – doppelt so viel wie der alte Qi-Standard mit 7,5W für iPhones. Das bedeutet: schnelleres Laden
            ohne Kabel.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8">
            Qi2 ist mit allen iPhones ab dem iPhone 12 kompatibel und wird auch zunehmend von Android-Herstellern
            unterstützt.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Was ist Qi2.2?</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Qi2.2 ist die Weiterentwicklung von Qi2 und wurde Ende 2024 durch das WPC spezifiziert. Es ist kein
            komplett neuer Standard, sondern ein Update, das den bestehenden Qi2-Standard in mehreren Bereichen
            verbessert:
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Verbesserte Energieeffizienz:</strong> Qi2.2 optimiert die
            Energieübertragung zwischen Ladegerät und Gerät. Weniger Energie geht als Wärme verloren, was sowohl den
            Ladevorgang als auch die Lebensdauer des Akkus verbessert.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Erweitertes Wärmemanagement:</strong> Eines der grössten Probleme
            beim kabellosen Laden ist Hitze. Qi2.2 führt strengere Anforderungen an das Thermal Management ein. Das
            Ergebnis: Geräte bleiben kühler während des Ladens, was wiederum zu schnellerem und sichererem Laden
            führt.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Höhere Ladeleistungen möglich:</strong> Während Qi2 bei 15W liegt,
            ermöglicht Qi2.2 perspektivisch höhere Leistungen. Erste Hersteller wie Belkin (UltraCharge) bieten
            bereits Qi2.2-Ladegeräte mit 25W an. Ob ein Gerät diese höheren Leistungen nutzen kann, hängt allerdings
            vom Smartphone ab – aktuelle iPhones laden weiterhin mit maximal 15W kabellos.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8">
            <strong className="text-foreground">Strengere Sicherheitsprüfungen:</strong> Qi2.2 verschärft die
            Authentifizierungsprotokolle. Das bedeutet: Das Ladegerät und das Smartphone «verifizieren» sich
            gegenseitig, bevor der Ladevorgang mit voller Leistung startet. Das schützt vor minderwertigen oder
            unsicheren Ladegeräten.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">
            Was ist der Unterschied für den Alltag?
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Für die meisten iPhone-Nutzer ist der Unterschied zwischen Qi2 und Qi2.2 im Alltag aktuell noch gering.
            Beide Standards laden das iPhone mit bis zu 15W. Die Vorteile von Qi2.2 zeigen sich eher langfristig:
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Weniger Hitze</strong> bedeutet weniger Verschleiss am Akku. Wer sein
            Ladegerät jede Nacht nutzt, profitiert über die Monate hinweg von der besseren Wärmeabfuhr.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Zukunftssicherheit:</strong> Wenn Apple in zukünftigen
            iPhone-Generationen höhere kabellose Ladegeschwindigkeiten unterstützt (z.B. 25W), ist ein
            Qi2.2-Ladegerät bereits dafür bereit. Ein Qi2-Ladegerät müsste dann ersetzt werden.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8">
            <strong className="text-foreground">Sicherheit:</strong> Die strengeren Authentifizierungsprotokolle von
            Qi2.2 bedeuten, dass du sicher sein kannst, dass dein Ladegerät geprüft und zertifiziert ist.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">
            Worauf sollte ich beim Kauf achten?
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Wenn du jetzt ein kabelloses Ladegerät kaufst, beachte folgende Punkte:
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Zertifizierung prüfen:</strong> Achte darauf, ob das Ladegerät Qi2
            oder Qi2.2 zertifiziert ist. Die Zertifizierung erfolgt durch das Wireless Power Consortium – sie stellt
            sicher, dass das Gerät den Standard tatsächlich einhält und nicht nur behauptet.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Netzteil inklusive?</strong> Kabelloses Laden mit 15W erfordert ein
            ausreichend starkes Netzteil. Manche Hersteller liefern keins mit – dann lädt das Gerät nur mit 5–7,5W,
            obwohl es 15W könnte.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">MagSafe-Kompatibilität:</strong> Alle Qi2- und Qi2.2-Ladegeräte sind
            mit MagSafe kompatibel. Die magnetische Ausrichtung funktioniert auch mit den meisten MagSafe-Hüllen.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8">
            <strong className="text-foreground">3-in-1 oder einzeln?</strong> Wer iPhone, Apple Watch und AirPods
            besitzt, spart mit einer 3-in-1 Ladestation Platz und Kabel. Diese Stationen kosten mehr als ein einfaches
            Ladepad, vereinfachen aber das Setup erheblich.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">
            Qi2.2-zertifizierte Ladegeräte in der Schweiz
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Noch gibt es nicht viele Qi2.2-Ladegeräte auf dem Markt. Zu den ersten gehören:
          </p>
          <ul className="space-y-3 text-foreground/80 mb-8 list-disc pl-6">
            <li>
              <strong className="text-foreground">RAJ NEXUS 3-in-1 Wireless Charger</strong> – CHF 99 (Early Access) /
              CHF 129 regulär. Qi2.2-zertifiziert, faltbar, in der Schweiz designed. Erhältlich über raj.ch.
            </li>
            <li>
              <strong className="text-foreground">Belkin UltraCharge Pro 3-in-1</strong> – Ab ca. CHF 139. Qi2.2 mit
              25W, aktive Kühlung. Erhältlich über Digitec/Galaxus.
            </li>
          </ul>
          <p className="text-foreground/80 leading-relaxed mb-8">
            Die meisten anderen aktuell erhältlichen Ladestationen (Anker MagGo, ältere Belkin-Modelle) sind
            Qi2-zertifiziert, nicht Qi2.2.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Fazit</h2>
          <p className="text-foreground/80 leading-relaxed mb-8">
            Qi2.2 ist keine Revolution, sondern eine sinnvolle Evolution. Wer heute ein neues kabelloses Ladegerät
            kauft und es mehrere Jahre nutzen will, ist mit Qi2.2 besser aufgestellt – besseres Wärmemanagement,
            höhere Zukunftssicherheit und strengere Sicherheitsstandards. Für den sofortigen Alltagsgebrauch liefern
            beide Standards die gleiche Ladeleistung von 15W.
          </p>

          <hr className="my-10 border-border" />

          <p className="text-sm text-muted-foreground italic">
            RAJ NEXUS ist einer der ersten Qi2.2-zertifizierten 3-in-1 Wireless Charger in der Schweiz. Mehr erfahren:{" "}
            <a href="https://raj.ch" className="text-primary underline hover:opacity-80">
              raj.ch
            </a>
          </p>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
};

export default Qi2ErklaertPage;

import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VergleichPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>3-in-1 Qi2 Wireless Charger Vergleich: RAJ NEXUS vs Belkin vs Anker (Schweiz 2026)</title>
        <meta
          name="description"
          content="3-in-1 Wireless Charger im Vergleich: RAJ NEXUS, Belkin BoostCharge Pro und Anker MagGo. Preise, Qi2.2-Standard und Verfügbarkeit in der Schweiz 2026."
        />
        <link rel="canonical" href="https://raj.ch/vergleich" />
      </Helmet>

      <Header />

      <main className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-neutral max-w-none"
        >
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-foreground mb-4">
            3-in-1 Qi2 Wireless Charger im Vergleich: RAJ NEXUS vs. Belkin vs. Anker (Schweiz 2026)
          </h1>
          <p className="text-sm text-muted-foreground mb-10">Zuletzt aktualisiert: April 2026</p>

          <p className="text-foreground/80 leading-relaxed mb-8">
            Wer ein iPhone, eine Apple Watch und AirPods besitzt, kennt das Problem: drei Geräte, drei Kabel, ein Chaos
            auf dem Nachttisch. Die Lösung sind 3-in-1 Wireless Charger – Ladestationen, die alle drei Apple-Geräte
            gleichzeitig kabellos laden. Doch welcher ist der richtige? Wir vergleichen drei aktuelle Modelle, die in
            der Schweiz erhältlich sind.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Die drei Kandidaten</h2>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">RAJ NEXUS 3-in-1 Wireless Charger</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Der RAJ NEXUS ist ein in der Schweiz designter 3-in-1 Wireless Charger mit Qi2.2-Zertifizierung. Das
            faltbare Design mit verstellbarem Winkel (0–75°) macht ihn sowohl für den Schreibtisch als auch für
            unterwegs geeignet. Das iPhone wird mit bis zu 25W geladen, Apple Watch und AirPods jeweils mit 5W. Die
            Founder Edition ist für CHF 99 erhältlich (regulär CHF 129).
          </p>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">Belkin BoostCharge Pro 3-in-1</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Belkin ist ein etablierter Name im Zubehörmarkt. Die BoostCharge Pro 3-in-1 Ladestation nutzt
            Qi2-Technologie und lädt das iPhone ebenfalls mit bis zu 15W. Die Verarbeitung ist hochwertig, und Belkin
            bietet eine Garantie für angeschlossene Geräte bis 2'000 Euro. In der Schweiz ist die Belkin BoostCharge
            Pro 3-in-1 ab etwa CHF 95 (älteres Modell) bis CHF 159 (UltraCharge Pro 25W) erhältlich – je nach Modell
            und Händler.
          </p>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">Anker MagGo 3-in-1</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Anker ist bekannt für ein gutes Preis-Leistungs-Verhältnis. Die MagGo 3-in-1 Ladestation ist kompakt und
            faltbar – zusammengeklappt etwa so gross wie ein Kartenspiel. Mit Qi2-Zertifizierung und 15W für das
            iPhone bietet sie die Kernfunktionen zu einem günstigeren Preis. In der Schweiz liegt der Preis bei etwa
            CHF 79–99.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Vergleich auf einen Blick</h2>

          <div className="overflow-x-auto -mx-4 md:mx-0 mb-8">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-foreground">Eigenschaft</th>
                  <th className="text-left p-3 font-medium text-foreground">RAJ NEXUS</th>
                  <th className="text-left p-3 font-medium text-foreground">Belkin BoostCharge Pro</th>
                  <th className="text-left p-3 font-medium text-foreground">Anker MagGo</th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                {[
                  ["Preis in der Schweiz", "CHF 99 (Early Access) / CHF 129", "CHF 95–159", "CHF 79–99"],
                  ["Qi-Standard", "Qi2.2", "Qi2 (bzw. Qi2.2 bei UltraCharge)", "Qi2"],
                  ["iPhone Ladeleistung", "Bis zu 25W", "15W (25W bei UltraCharge)", "15W"],
                  ["Apple Watch", "5W Fast Charge", "5W Fast Charge", "5W Fast Charge"],
                  ["AirPods", "5W Qi", "5W Qi", "5W Qi"],
                  ["Faltbar", "Ja", "Teilweise (je nach Modell)", "Ja"],
                  ["Verstellbarer Winkel", "0–75°", "Modellabhängig", "60–70°"],
                  ["StandBy-Modus", "Ja", "Ja", "Ja"],
                  ["Netzteil inklusive", "Ja", "Ja", "Ja"],
                  ["MagSafe-kompatibel", "Ja", "Ja", "Ja"],
                  ["Herkunft der Marke", "Schweiz", "USA", "China"],
                  ["Verfügbar auf Digitec/Galaxus", "Nein (nur raj.ch)", "Ja", "Ja"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3 font-medium">{row[0]}</td>
                    <td className="p-3">{row[1]}</td>
                    <td className="p-3">{row[2]}</td>
                    <td className="p-3">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Was unterscheidet sie wirklich?</h2>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">Preis</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Der Anker MagGo ist die günstigste Option. Der RAJ NEXUS liegt mit CHF 99 (Early Access) im Mittelfeld und
            bietet ein starkes Preis-Leistungs-Verhältnis – besonders im Vergleich zu den teureren Belkin-Modellen.
            Der reguläre Preis des RAJ NEXUS (CHF 129) entspricht etwa dem der Belkin-Mittelklasse.
          </p>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">Technologie</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Der RAJ NEXUS ist mit Qi2.2 zertifiziert – dem neuesten Standard der Wireless Power Consortium. Qi2.2
            bringt im Vergleich zu Qi2 Verbesserungen bei der Effizienz und Wärmemanagement. Die meisten Belkin- und
            Anker-Modelle nutzen Qi2, wobei Belkins neueste UltraCharge-Linie ebenfalls auf Qi2.2 setzt.
          </p>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">Design und Portabilität</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Alle drei Charger sind kompakt. Der Anker MagGo ist der kleinste und leichteste – ideal für Reisen. Der
            RAJ NEXUS bietet den grössten Verstellbereich (0–75°) und ein faltbares Design, das sowohl als Stand als
            auch flach verwendet werden kann. Belkin variiert je nach Modell – einige sind faltbar, andere als fester
            Stand konzipiert.
          </p>

          <h3 className="text-xl font-medium text-foreground mt-8 mb-3">Verfügbarkeit in der Schweiz</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Belkin und Anker sind über Digitec, Galaxus und weitere Schweizer Händler erhältlich. Der RAJ NEXUS ist
            ausschliesslich über raj.ch verfügbar – direkt vom Hersteller, ohne Zwischenhändler.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Für wen eignet sich welcher?</h2>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">RAJ NEXUS</strong> eignet sich für Käufer, die Wert auf ein Schweizer
            Produkt legen, den neuesten Qi2.2-Standard wollen und bereit sind, direkt beim Hersteller zu kaufen. Die
            Founder Edition mit persönlicher Seriennummer spricht Early Adopters an.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong className="text-foreground">Belkin BoostCharge Pro</strong> ist die richtige Wahl für alle, die
            eine etablierte Marke bevorzugen und den Komfort des Kaufs über Schweizer Retailer wie Digitec schätzen.
            Die Garantie für angeschlossene Geräte (bis 2'000 Euro) ist ein Alleinstellungsmerkmal.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8">
            <strong className="text-foreground">Anker MagGo</strong> ist der Preis-Leistungs-Sieger und ideal für
            preisbewusste Käufer, die eine kompakte Reise-Ladestation suchen.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-6">Fazit</h2>
          <p className="text-foreground/80 leading-relaxed mb-8">
            Alle drei Ladestationen erfüllen ihren Zweck gut. Die Unterschiede liegen im Detail: Preis, Zertifizierung,
            Design und Verfügbarkeit. Wer den neuesten Standard (Qi2.2), ein Schweizer Produkt und einen fairen Preis
            sucht, sollte sich den RAJ NEXUS ansehen. Wer auf Nummer sicher gehen will, greift zu Belkin. Und wer vor
            allem den Preis im Blick hat, ist bei Anker richtig.
          </p>

          <hr className="my-10 border-border" />

          <p className="text-sm text-muted-foreground italic">
            Dieser Vergleich wurde nach bestem Wissen erstellt. Preise können je nach Händler und Zeitpunkt variieren.
            Der RAJ NEXUS ist über{" "}
            <a href="https://raj.ch" className="underline hover:text-foreground">
              raj.ch
            </a>{" "}
            erhältlich.
          </p>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
};

export default VergleichPage;

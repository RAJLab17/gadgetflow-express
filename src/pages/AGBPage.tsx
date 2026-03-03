import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    title: "1. Geltungsbereich",
    content: [
      `Diese Allgemeinen Gesch\u00e4ftsbedingungen (AGB) gelten f\u00fcr alle Bestellungen und Lieferungen von Produkten der RAJ AG (nachfolgend \u201eRAJ\u201c, \u201ewir\u201c oder \u201euns\u201c) \u00fcber den Online\u2011Shop auf unserer Website.`,
      `Abweichende Bedingungen von Kundinnen und Kunden (nachfolgend \u201eKunde\u201c) finden keine Anwendung, sofern sie nicht ausdr\u00fccklich und schriftlich von RAJ best\u00e4tigt wurden.`,
    ],
  },
  {
    title: "2. Angebot und Vertragsschluss",
    content: [
      "Die Pr\u00e4sentation der Produkte auf unserer Website stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Abgabe einer Bestellung.",
      `Durch Anklicken des Bestellbuttons (z.\u00a0B. \u201eJetzt sichern\u201c, \u201eJetzt vorbestellen\u201c, \u201eJetzt kaufen\u201c oder \u201eBestellung abschliessen\u201c) gibt der Kunde ein verbindliches Angebot zum Abschluss eines Kaufvertrages ab. Der Vertrag kommt zustande, sobald RAJ die Bestellung per E\u2011Mail best\u00e4tigt oder die Ware versendet.`,
    ],
  },
  {
    title: "3. Vorbestellungen",
    content: [
      "Einzelne Produkte k\u00f6nnen als Vorbestellung angeboten werden. In diesem Fall erfolgt die Produktion oder Beschaffung erst nach Eingang der Bestellung.",
      "Die auf der Produktseite angegebene Lieferzeit stellt eine unverbindliche Richtangabe dar. Verz\u00f6gerungen aufgrund von Produktion, Logistik, Lieferengp\u00e4ssen oder h\u00f6herer Gewalt bleiben vorbehalten.",
      "Sollte eine Lieferung ausnahmsweise nicht m\u00f6glich sein, informiert RAJ den Kunden unverz\u00fcglich. Bereits geleistete Zahlungen werden in diesem Fall vollst\u00e4ndig zur\u00fcckerstattet.",
    ],
  },
  {
    title: "4. Preise und Zahlungsbedingungen",
    content: [
      "Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive der gesetzlichen Mehrwertsteuer, sofern anwendbar.",
      "Die verf\u00fcgbaren Zahlungsmethoden werden im Bestellprozess angezeigt. Die Belastung des gew\u00e4hlten Zahlungsmittels erfolgt unmittelbar bei Abschluss der Bestellung, auch bei Vorbestellungen.",
      "Akzeptierte Zahlungsmethoden sind: Kreditkarte (Visa, Mastercard, American Express), TWINT, Apple Pay, Google Pay sowie Klarna.",
    ],
  },
  {
    title: "5. Lieferung und Versand",
    content: [
      "Die Lieferung erfolgt ausschliesslich an Lieferadressen innerhalb der Schweiz, sofern nicht ausdr\u00fccklich anders angegeben.",
      "Die Lieferzeit richtet sich nach den Angaben auf der jeweiligen Produktseite. Teillieferungen sind zul\u00e4ssig, sofern sie f\u00fcr den Kunden zumutbar sind.",
      "Der Versand ist ab einem Bestellwert von CHF 65.00 kostenlos. Bei Bestellungen unter CHF 65.00 wird eine Versandpauschale von CHF 4.90 berechnet.",
    ],
  },
  {
    title: "6. Eigentumsvorbehalt",
    content: [
      "Die gelieferte Ware bleibt bis zur vollst\u00e4ndigen Bezahlung Eigentum der RAJ AG.",
    ],
  },
  {
    title: "7. R\u00fccktritts\u2011 und R\u00fcckgaberecht",
    content: [
      "Der Kunde hat das Recht, innerhalb von 30 Tagen nach Erhalt der Ware vom Kaufvertrag zur\u00fcckzutreten.",
      "Voraussetzung f\u00fcr die R\u00fcckgabe ist, dass sich die Ware in unbenutztem, unbesch\u00e4digtem Zustand und \u2013 sofern m\u00f6glich \u2013 in der Originalverpackung befindet.",
      "Vom R\u00fccktrittsrecht ausgeschlossen sind individuell angefertigte oder personalisierte Produkte, sofern diese entsprechend gekennzeichnet sind.",
      "Die R\u00fcckerstattung erfolgt nach Pr\u00fcfung der zur\u00fcckgesendeten Ware \u00fcber das urspr\u00fcnglich verwendete Zahlungsmittel.",
      "Die R\u00fccksendkosten tr\u00e4gt der Kunde, sofern nicht anders vereinbart.",
    ],
  },
  {
    title: "8. Gew\u00e4hrleistung und Garantie",
    content: [
      "Es gelten die gesetzlichen Gew\u00e4hrleistungsbestimmungen des schweizerischen Rechts.",
      "Sofern auf der Produktseite angegeben, gew\u00e4hrt RAJ zus\u00e4tzlich eine freiwillige Garantie von zwei Jahren ab Lieferdatum. Die Garantie deckt Material\u2011 und Herstellungsfehler ab.",
      "Von der Garantie ausgeschlossen sind insbesondere Sch\u00e4den, die durch unsachgem\u00e4sse Nutzung, normale Abnutzung, \u00e4ussere Einwirkungen oder eigenm\u00e4chtige Reparaturen entstehen.",
    ],
  },
  {
    title: "9. Haftung",
    content: [
      "RAJ haftet ausschliesslich f\u00fcr Sch\u00e4den, die durch vors\u00e4tzliches oder grob fahrl\u00e4ssiges Verhalten verursacht wurden.",
      "Eine Haftung f\u00fcr indirekte Sch\u00e4den, Folgesch\u00e4den oder entgangenen Gewinn ist \u2013 soweit gesetzlich zul\u00e4ssig \u2013 ausgeschlossen.",
      "Zwingende gesetzliche Haftungsbestimmungen bleiben unber\u00fchrt.",
    ],
  },
  {
    title: "10. Technische Angaben und Kompatibilit\u00e4t",
    content: [
      "Produktabbildungen, Beschreibungen und technische Angaben dienen der Information und k\u00f6nnen geringf\u00fcgig vom gelieferten Produkt abweichen.",
      "Angaben zur Kompatibilit\u00e4t mit Endger\u00e4ten (z.\u00a0B. Smartphones, Smartwatches oder Kopfh\u00f6rern) basieren auf den jeweils geltenden Standards und den Herstellerangaben der Endger\u00e4te.",
    ],
  },
  {
    title: "11. Datenschutz",
    content: [
      "Die Verarbeitung personenbezogener Daten erfolgt gem\u00e4ss unserer Datenschutzerkl\u00e4rung, welche integraler Bestandteil dieser AGB ist.",
    ],
  },
  {
    title: "12. \u00c4nderungen der AGB",
    content: [
      "RAJ beh\u00e4lt sich das Recht vor, diese AGB jederzeit anzupassen. Massgeblich ist die jeweils zum Zeitpunkt der Bestellung g\u00fcltige Fassung.",
    ],
  },
  {
    title: "13. Anwendbares Recht und Gerichtsstand",
    content: [
      "Es gilt ausschliesslich schweizerisches Recht unter Ausschluss des UN\u2011Kaufrechts (CISG).",
      "Gerichtsstand ist \u2013 soweit gesetzlich zul\u00e4ssig \u2013 der Sitz der RAJ AG.",
    ],
  },
  {
    title: "14. Salvatorische Klausel",
    content: [
      "Sollte eine Bestimmung dieser AGB ganz oder teilweise unwirksam sein oder werden, bleibt die Wirksamkeit der \u00fcbrigen Bestimmungen unber\u00fchrt.",
    ],
  },
];

const AGBPage = () => {
  return (
    <>
      <Helmet>
        <title>AGB – RAJ</title>
        <meta name="description" content="Allgemeine Gesch\u00e4ftsbedingungen der RAJ AG." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Allgemeine Gesch&auml;ftsbedingungen (AGB)
            </h1>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">RAJ AG</p>
              <p>Gaswerkstrasse 9a</p>
              <p>E-Mail: info@raj.ch</p>
              <p>UID: [UID-Nummer]</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Stand: 19.02.2026
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-lg font-bold text-foreground mb-3">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-muted-foreground leading-relaxed text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AGBPage;

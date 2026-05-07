import PremiumPageLayout from "@/components/PremiumPageLayout";

const sections = [
  {
    title: "1. Geltungsbereich",
    content: [
      `Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen und Lieferungen von Produkten der RAJ GmbH (in Gründung) (nachfolgend „wir" oder „uns") über den Online‑Shop auf unserer Website.`,
      `Abweichende Bedingungen von Kundinnen und Kunden (nachfolgend „Kunde") finden keine Anwendung, sofern sie nicht ausdrücklich und schriftlich von der RAJ GmbH (in Gründung) bestätigt wurden.`,
    ],
  },
  {
    title: "2. Angebot und Vertragsschluss",
    content: [
      "Die Präsentation der Produkte auf unserer Website stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Abgabe einer Bestellung.",
      `Durch Anklicken des Bestellbuttons (z. B. „Jetzt sichern", „Jetzt vorbestellen", „Jetzt kaufen" oder „Bestellung abschliessen") gibt der Kunde ein verbindliches Angebot zum Abschluss eines Kaufvertrages ab. Der Vertrag kommt zustande, sobald die RAJ GmbH (in Gründung) die Bestellung per E‑Mail bestätigt oder die Ware versendet.`,
    ],
  },
  {
    title: "3. Vorbestellungen",
    content: [
      "Einzelne Produkte können als Vorbestellung angeboten werden. In diesem Fall erfolgt die Produktion oder Beschaffung erst nach Eingang der Bestellung.",
      "Die auf der Produktseite angegebene Lieferzeit stellt eine unverbindliche Richtangabe dar. Verzögerungen aufgrund von Produktion, Logistik, Lieferengpässen oder höherer Gewalt bleiben vorbehalten.",
      "Sollte eine Lieferung ausnahmsweise nicht möglich sein, informiert die RAJ GmbH (in Gründung) den Kunden unverzüglich. Bereits geleistete Zahlungen werden in diesem Fall vollständig zurückerstattet.",
    ],
  },
  {
    title: "4. Preise und Zahlungsbedingungen",
    content: [
      "Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive der gesetzlichen Mehrwertsteuer, sofern anwendbar.",
      "Die verfügbaren Zahlungsmethoden werden im Bestellprozess angezeigt. Die Belastung des gewählten Zahlungsmittels erfolgt unmittelbar bei Abschluss der Bestellung, auch bei Vorbestellungen.",
      "Akzeptierte Zahlungsmethoden sind: Kreditkarte (Visa, Mastercard, American Express), TWINT, Apple Pay, Google Pay sowie Klarna.",
    ],
  },
  {
    title: "5. Lieferung und Versand",
    content: [
      "Die Lieferung erfolgt ausschliesslich an Lieferadressen innerhalb der Schweiz, sofern nicht ausdrücklich anders angegeben.",
      "Die Lieferzeit richtet sich nach den Angaben auf der jeweiligen Produktseite. Teillieferungen sind zulässig, sofern sie für den Kunden zumutbar sind.",
      "Der Versand ist ab einem Bestellwert von CHF 50.00 kostenlos. Bei Bestellungen unter CHF 50.00 wird eine Versandpauschale von CHF 4.90 berechnet.",
    ],
  },
  {
    title: "6. Eigentumsvorbehalt",
    content: ["Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum der RAJ GmbH (in Gründung)."],
  },
  {
    title: "7. Rücktritts‑ und Rückgaberecht",
    content: [
      "Der Kunde hat das Recht, innerhalb von 30 Tagen nach Erhalt der Ware vom Kaufvertrag zurückzutreten.",
      "Voraussetzung für die Rückgabe ist, dass sich die Ware in unbenutztem, unbeschädigtem Zustand und – sofern möglich – in der Originalverpackung befindet.",
      "Vom Rücktrittsrecht ausgeschlossen sind individuell angefertigte oder personalisierte Produkte, sofern diese entsprechend gekennzeichnet sind.",
      "Die Rückerstattung erfolgt nach Prüfung der zurückgesendeten Ware über das ursprünglich verwendete Zahlungsmittel.",
      "Die Rücksendkosten trägt der Kunde, sofern nicht anders vereinbart.",
    ],
  },
  {
    title: "8. Gewährleistung und Garantie",
    content: [
      "Es gelten die gesetzlichen Gewährleistungsbestimmungen des schweizerischen Rechts.",
      "Sofern auf der Produktseite angegeben, gewährt die RAJ GmbH (in Gründung) zusätzlich eine freiwillige Garantie von zwei Jahren ab Lieferdatum. Die Garantie deckt Material‑ und Herstellungsfehler ab.",
      "Von der Garantie ausgeschlossen sind insbesondere Schäden, die durch unsachgemässe Nutzung, normale Abnutzung, äussere Einwirkungen oder eigenmächtige Reparaturen entstehen.",
    ],
  },
  {
    title: "9. Haftung",
    content: [
      "Die RAJ GmbH (in Gründung) haftet ausschliesslich für Schäden, die durch vorsätzliches oder grob fahrlässiges Verhalten verursacht wurden.",
      "Eine Haftung für indirekte Schäden, Folgeschäden oder entgangenen Gewinn ist – soweit gesetzlich zulässig – ausgeschlossen.",
      "Zwingende gesetzliche Haftungsbestimmungen bleiben unberührt.",
    ],
  },
  {
    title: "10. Technische Angaben und Kompatibilität",
    content: [
      "Produktabbildungen, Beschreibungen und technische Angaben dienen der Information und können geringfügig vom gelieferten Produkt abweichen.",
      "Angaben zur Kompatibilität mit Endgeräten (z. B. Smartphones, Smartwatches oder Kopfhörern) basieren auf den jeweils geltenden Standards und den Herstellerangaben der Endgeräte.",
    ],
  },
  {
    title: "11. Datenschutz",
    content: [
      "Die Verarbeitung personenbezogener Daten erfolgt gemäss unserer Datenschutzerklärung, welche integraler Bestandteil dieser AGB ist.",
    ],
  },
  {
    title: "12. Änderungen der AGB",
    content: [
      "Die RAJ GmbH (in Gründung) behält sich das Recht vor, diese AGB jederzeit anzupassen. Massgeblich ist die jeweils zum Zeitpunkt der Bestellung gültige Fassung.",
    ],
  },
  {
    title: "13. Anwendbares Recht und Gerichtsstand",
    content: [
      "Es gilt ausschliesslich schweizerisches Recht unter Ausschluss des UN‑Kaufrechts (CISG).",
      "Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz der RAJ GmbH (in Gründung).",
    ],
  },
  {
    title: "14. Salvatorische Klausel",
    content: [
      "Sollte eine Bestimmung dieser AGB ganz oder teilweise unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
    ],
  },
];

const AGBPage = () => {
  return (
    <PremiumPageLayout
      title="AGB – RAJ"
      metaDescription="Allgemeine Geschäftsbedingungen von RAJ."
      canonical="https://raj.ch/agb"
      eyebrow="Rechtliches"
      heading={<>Allgemeine<br />Geschäftsbedingungen</>}
      meta={
        <div className="space-y-1">
          <p className="text-foreground font-medium">RAJ GmbH (in Gründung)</p>
          <p>Gaswerkstrasse 9a</p>
          <p>info@raj.ch</p>
          <p className="pt-2">Stand: 02.05.2026</p>
        </div>
      }
    >
      <div className="space-y-12 md:space-y-14">
        {sections.map((s, i) => (
          <section key={i} className="space-y-3">
            <h2 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
              {s.title}
            </h2>
            <div className="space-y-3 text-foreground/85 font-light leading-relaxed text-[15px] md:text-base">
              {s.content.map((p, pi) => (
                <p key={pi}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PremiumPageLayout>
  );
};

export default AGBPage;

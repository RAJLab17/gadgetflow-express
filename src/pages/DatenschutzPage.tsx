import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

interface Section {
  title: string;
  content: (string | { intro?: string; items: string[] })[];
}

const sections: Section[] = [
  {
    title: "1. Allgemeine Hinweise",
    content: [
      `Der Schutz deiner personenbezogenen Daten ist RAJ (nachfolgend „wir" oder „uns") ein wichtiges Anliegen. Diese Datenschutzerklärung informiert darüber, wie wir personenbezogene Daten im Zusammenhang mit dem Besuch unserer Website und der Nutzung unseres Online‑Shops bearbeiten.`,
      `Wir bearbeiten personenbezogene Daten im Einklang mit dem schweizerischen Datenschutzgesetz (DSG) sowie – soweit anwendbar – der Datenschutz‑Grundverordnung der Europäischen Union (DSGVO).`,
    ],
  },
  {
    title: "2. Verantwortliche Stelle",
    content: [
      `Verantwortlich für die Datenbearbeitung im Sinne des Datenschutzrechts ist:`,
      `RAJ\nGaswerkstrasse 9a\nE‑Mail: info@raj.ch`,
    ],
  },
  {
    title: "3. Erhebung und Bearbeitung personenbezogener Daten",
    content: [
      `Wir bearbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Website, zur Abwicklung von Bestellungen oder zur Kommunikation erforderlich ist.`,
      `3.1 Daten, die du uns mitteilst`,
      `Beim Besuch unserer Website oder bei einer Bestellung können insbesondere folgende Daten erhoben werden:`,
      {
        items: [
          "Vor‑ und Nachname",
          "Rechnungs‑ und Lieferadresse",
          "E‑Mail‑Adresse",
          "Telefonnummer",
          "Zahlungsinformationen",
        ],
      },
      `Diese Daten werden zur Vertragsabwicklung, Lieferung der Produkte sowie zur Kundenbetreuung verwendet.`,
      `3.2 Technische Daten`,
      `Beim Zugriff auf unsere Website werden automatisch technische Daten erfasst, unter anderem:`,
      {
        items: [
          "IP‑Adresse",
          "Datum und Uhrzeit des Zugriffs",
          "Browsertyp und ‑version",
          "Betriebssystem",
        ],
      },
      `Diese Daten dienen der Gewährleistung eines reibungslosen Betriebs, der Sicherheit sowie der Optimierung unseres Online‑Angebots.`,
    ],
  },
  {
    title: "4. Rechtsgrundlagen der Datenbearbeitung",
    content: [
      `Die Bearbeitung personenbezogener Daten erfolgt insbesondere auf folgenden Rechtsgrundlagen:`,
      {
        items: [
          "zur Erfüllung eines Vertrages oder vorvertraglicher Massnahmen",
          "aufgrund einer erteilten Einwilligung",
          "zur Erfüllung gesetzlicher Verpflichtungen",
          "zur Wahrung berechtigter Interessen (z. B. Sicherheit, Stabilität der Website)",
        ],
      },
    ],
  },
  {
    title: "5. Einsatz von Shopify und Drittanbietern",
    content: [
      `Unsere Website und unser Online‑Shop werden über die Plattform Shopify betrieben (Shopify Inc., Kanada/USA). Shopify verarbeitet personenbezogene Daten in unserem Auftrag, insbesondere im Rahmen von:`,
      {
        items: [
          "Bestellabwicklung",
          "Zahlungsabwicklung",
          "Hosting und technischer Betrieb",
        ],
      },
      `Je nach gewählter Zahlungsmethode können Daten an Zahlungsdienstleister (z. B. Kreditkartenanbieter, TWINT, Apple Pay, Google Pay) weitergegeben werden, soweit dies für die Zahlungsabwicklung erforderlich ist.`,
      `Shopify kann Daten in Länder ausserhalb der Schweiz oder der EU übertragen. In diesen Fällen stellt Shopify durch geeignete Garantien ein angemessenes Datenschutzniveau sicher.`,
    ],
  },
  {
    title: "6. Cookies und Tracking‑Technologien",
    content: [
      `Wir setzen Cookies und ähnliche Technologien ein, um die Funktionalität unserer Website sicherzustellen und – sofern du zugestimmt hast – das Nutzerverhalten zu analysieren.`,
      `6.1 Google Analytics 4`,
      `Wir nutzen Google Analytics 4 (Google LLC, USA) zur Analyse des Nutzerverhaltens auf unserer Website. Google Analytics erfasst u.\u202Fa. Seitenaufrufe, Verweildauer und Herkunft der Besucher. Die Daten werden anonymisiert verarbeitet. Weitere Informationen: policies.google.com/privacy`,
      `6.2 Microsoft Clarity`,
      `Wir verwenden Microsoft Clarity (Microsoft Corporation, USA) zur Analyse von Nutzerinteraktionen, inkl. Heatmaps und Session‑Recordings. Weitere Informationen: privacy.microsoft.com`,
      `6.3 Meta Pixel (Facebook & Instagram)`,
      `Wir setzen den Meta Pixel (Meta Platforms Ireland Ltd.) ein, um die Wirksamkeit unserer Werbeanzeigen auf Facebook und Instagram zu messen und Zielgruppen zu erstellen. Weitere Informationen: facebook.com/privacy`,
      `6.4 TikTok Pixel`,
      `Wir nutzen den TikTok Pixel (TikTok Technology Ltd., Irland) zur Messung der Wirksamkeit unserer TikTok‑Werbekampagnen. Weitere Informationen: tiktok.com/legal/privacy-policy`,
      `Cookies können jederzeit über die Einstellungen deines Browsers eingeschränkt oder gelöscht werden.`,
    ],
  },
  {
    title: "7. Newsletter und Marketing‑Kommunikation",
    content: [
      `Sofern du dich für unseren Newsletter anmeldest, verwenden wir deine E‑Mail‑Adresse ausschliesslich für den Versand von Informationen zu unseren Produkten und Angeboten.`,
      `Du kannst den Newsletter jederzeit über den Abmeldelink in jeder E‑Mail oder durch eine Nachricht an uns abbestellen.`,
      `Für den Versand von Newsletter und Marketing‑E‑Mails nutzen wir Brevo (Sendinblue SA, 55 rue d'Amsterdam, Paris, Frankreich). Deine E‑Mail‑Adresse wird ausschliesslich für den Versand verwendet und nicht an Dritte weitergegeben. Weitere Informationen: brevo.com/legal/privacypolicy`,
    ],
  },
  {
    title: "8. Weitergabe von Daten",
    content: [
      `Eine Weitergabe personenbezogener Daten erfolgt nur, soweit dies erforderlich ist:`,
      {
        items: [
          "an Versand‑ und Logistikpartner",
          "an Zahlungsdienstleister",
          "an IT‑ und Hosting‑Dienstleister",
          "an Behörden, sofern eine gesetzliche Verpflichtung besteht",
        ],
      },
      `Eine Weitergabe zu Marketingzwecken Dritter erfolgt nicht.`,
    ],
  },
  {
    title: "9. Aufbewahrungsdauer",
    content: [
      `Wir bewahren personenbezogene Daten nur so lange auf, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.`,
    ],
  },
  {
    title: "10. Datensicherheit",
    content: [
      `Wir treffen angemessene technische und organisatorische Sicherheitsmassnahmen, um deine Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen. Dazu gehören insbesondere verschlüsselte Datenübertragungen (SSL/TLS).`,
    ],
  },
  {
    title: "11. Rechte der betroffenen Personen",
    content: [
      `Du hast das Recht:`,
      {
        items: [
          "Auskunft über deine gespeicherten personenbezogenen Daten zu erhalten",
          "unrichtige Daten berichtigen zu lassen",
          "die Löschung oder Einschränkung der Bearbeitung zu verlangen",
          "eine erteilte Einwilligung jederzeit zu widerrufen",
        ],
      },
      `Anfragen hierzu kannst du an die oben angegebene Kontaktadresse richten.`,
    ],
  },
  {
    title: "12. Änderungen dieser Datenschutzerklärung",
    content: [
      `RAJ behält sich vor, diese Datenschutzerklärung jederzeit anzupassen, insbesondere bei Änderungen gesetzlicher Vorgaben oder unseres Angebots. Es gilt die jeweils aktuelle, auf der Website veröffentlichte Version.`,
      `Diese Datenschutzerklärung ist integraler Bestandteil unserer Website und unseres Online‑Shops.`,
    ],
  },
];

const DatenschutzPage = () => {
  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung – RAJ</title>
        <meta name="description" content="Datenschutzerklärung von RAJ. Informationen zur Erhebung und Bearbeitung personenbezogener Daten." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Datenschutzerkl&auml;rung
            </h1>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">RAJ GmbH</p>
              <p>Gaswerkstrasse 9a</p>
              <p>E‑Mail: info@raj.ch</p>
              <p>UID: [UID‑Nummer]</p>
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
                  {section.content.map((block, bIndex) => {
                    if (typeof block === "string") {
                      // Check if it's a sub-heading (e.g. "3.1 ...")
                      const isSubHeading = /^\d+\.\d+\s/.test(block);
                      if (isSubHeading) {
                        return (
                          <h3
                            key={bIndex}
                            className="text-base font-semibold text-foreground mt-4"
                          >
                            {block}
                          </h3>
                        );
                      }
                      // Multi-line block (address)
                      if (block.includes("\n")) {
                        return (
                          <div key={bIndex} className="text-muted-foreground leading-relaxed text-[15px]">
                            {block.split("\n").map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <p
                          key={bIndex}
                          className="text-muted-foreground leading-relaxed text-[15px]"
                        >
                          {block}
                        </p>
                      );
                    }
                    // List items
                    return (
                      <ul
                        key={bIndex}
                        className="list-disc list-inside space-y-1.5 text-muted-foreground text-[15px] ml-1"
                      >
                        {block.items.map((item, iIndex) => (
                          <li key={iIndex}>{item}</li>
                        ))}
                      </ul>
                    );
                  })}
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

export default DatenschutzPage;

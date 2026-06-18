import PremiumPageLayout from "@/components/PremiumPageLayout";
import { webPageJsonLd } from "@/lib/schemas";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{title}</h2>
    <div className="text-foreground/85 font-light leading-relaxed text-[15px] md:text-base space-y-3">
      {children}
    </div>
  </section>
);

const ImpressumPage = () => {
  return (
    <PremiumPageLayout
      title="Impressum – RAJ"
      metaDescription="Impressum der RAJ – Kontaktdaten, Unternehmensangaben und rechtliche Hinweise."
      canonical="https://raj.ch/impressum"
      jsonLd={webPageJsonLd({ name: "Impressum – RAJ", description: "Impressum der RAJ – Kontaktdaten, Unternehmensangaben und rechtliche Hinweise.", url: "https://raj.ch/impressum" })}
      eyebrow="Rechtliches"
      heading="Impressum"
      meta={
        <div className="space-y-1">
          <p className="text-foreground font-medium">RAJ GmbH</p>
          <p>Gaswerkstrasse 9a</p>
          <p>8570 Weinfelden</p>
          <p>Schweiz</p>
          <p className="pt-2">Stand: 08.06.2026</p>
        </div>
      }
    >
      <div className="space-y-12 md:space-y-14">
        <Section title="Kontakt">
          <p>E-Mail: info@raj.ch</p>
          <p>Telefon: +41 76 558 26 63</p>
        </Section>

        <Section title="Unternehmensangaben">
          <p>Firmensitz: Weinfelden, Schweiz</p>
          <p>UID: CHE-336.124.813</p>
        </Section>

        <Section title="Vertretungsberechtigte Person(en)">
          <p>Stefan Rajcic, Verwaltungsrat / Geschäftsführer</p>
        </Section>

        <Section title="Haftungsausschluss">
          <p>
            Die Inhalte dieser Website werden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
            Aktualität der Inhalte übernimmt die RAJ GmbH jedoch keine Gewähr.
          </p>
          <p>
            Haftungsansprüche gegen die RAJ GmbH wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder
            der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder
            durch technische Störungen entstanden sind, werden ausgeschlossen, soweit gesetzlich zulässig.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p>
            Verweise und Links auf Websites Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche
            Verantwortung für solche Websites abgelehnt. Der Zugriff und die Nutzung solcher Websites erfolgen auf
            eigene Gefahr des Nutzers.
          </p>
        </Section>

        <Section title="Urheberrechte">
          <p>
            Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website
            gehören ausschliesslich der RAJ GmbH oder den speziell genannten Rechteinhabern.
          </p>
          <p>
            Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus
            einzuholen.
          </p>
        </Section>
      </div>
    </PremiumPageLayout>
  );
};

export default ImpressumPage;

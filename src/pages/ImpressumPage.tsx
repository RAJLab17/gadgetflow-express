import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ImpressumPage = () => {
  return (
    <>
      <Helmet>
        <title>Impressum – RAJ</title>
        <meta name="description" content="Impressum der RAJ GmbH – Kontaktdaten, Unternehmensangaben und rechtliche Hinweise." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Impressum
            </h1>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">RAJ</p>
              <p>Gaswerkstrasse 9a</p>
              <p>8570 Weinfelden</p>
              <p>Schweiz</p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Kontakt */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Kontakt</h2>
              <div className="space-y-1 text-muted-foreground text-[15px] leading-relaxed">
                <p>E-Mail: info@raj.ch</p>
              </div>
            </section>

            {/* Unternehmensangaben */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Unternehmensangaben</h2>
              <div className="space-y-1 text-muted-foreground text-[15px] leading-relaxed">
                <p>Firmensitz: Schweiz</p>
              </div>
            </section>

            {/* Vertretungsberechtigte */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Vertretungsberechtigte Person(en)</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Stefan Rajcic, Verwaltungsrat / Geschäftsführer
              </p>
            </section>



            {/* Haftungsausschluss */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Haftungsausschluss</h2>
              <div className="space-y-3 text-muted-foreground text-[15px] leading-relaxed">
                <p>
                  Die Inhalte dieser Website werden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernimmt RAJ jedoch keine Gewähr.
                </p>
                <p>
                  Haftungsansprüche gegen RAJ wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen, soweit gesetzlich zulässig.
                </p>
              </div>
            </section>

            {/* Haftung für Links */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Haftung für Links</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Verweise und Links auf Websites Dritter liegen außerhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Websites abgelehnt. Der Zugriff und die Nutzung solcher Websites erfolgen auf eigene Gefahr des Nutzers.
              </p>
            </section>

            {/* Urheberrechte */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Urheberrechte</h2>
              <div className="space-y-3 text-muted-foreground text-[15px] leading-relaxed">
                <p>
                  Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website gehören ausschliesslich RAJ oder den speziell genannten Rechteinhabern.
                </p>
                <p>
                  Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.
                </p>
              </div>
            </section>
          </div>

          {/* Stand */}
          <p className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
            Stand: 19.02.2026
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ImpressumPage;

import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/schemas";

const PAGE_URL = "https://raj.ch/3-in-1-ladestation-iphone-apple-watch-airpods";
const article = articleJsonLd({
  headline: "3-in-1 Wireless Charger Schweiz 2026",
  url: PAGE_URL,
});
const breadcrumb = breadcrumbJsonLd([
  { name: "Home", url: "https://raj.ch" },
  { name: "Blog", url: "https://raj.ch/blog" },
  { name: "3-in-1 Wireless Charger Schweiz 2026", url: PAGE_URL },
]);

const ThreeInOnePage = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
    <PremiumPageLayout
      title="3-in-1 Ladestation iPhone Apple Watch AirPods Schweiz | RAJ"
      metaDescription="Alle drei Apple-Geräte gleichzeitig laden. Die beste 3-in-1 Ladestation für iPhone, Apple Watch und AirPods in der Schweiz – Qi2.2 zertifiziert."
      canonical="https://raj.ch/3-in-1-ladestation-iphone-apple-watch-airpods"
      eyebrow="Guide"
      heading={<>3-in-1 Ladestation für iPhone, Apple Watch und AirPods – die beste Lösung 2026</>}
      intro={
        <>
          iPhone, Apple Watch, AirPods – drei Geräte die täglich geladen werden müssen. Drei separate Kabel oder Ladegeräte sind 2026 keine Lösung mehr. Eine 3-in-1 Ladestation ersetzt alles – aber welche ist die richtige?
        </>
      }
      width="wide"
    >
      <div className="space-y-12 text-foreground/85 font-light leading-relaxed max-w-2xl">
        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Warum eine 3-in-1 Ladestation?
          </h2>
          <p>
            Wer täglich iPhone, Apple Watch und AirPods nutzt kennt das Problem: drei verschiedene Kabel, drei verschiedene Ladegeräte, Kabelsalat auf dem Nachttisch oder Schreibtisch. Eine 3-in-1 Ladestation löst das mit einem einzigen Gerät und einem einzigen Kabel zur Steckdose.
          </p>
        </section>

        <div className="h-px bg-border/60" />

        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Worauf du beim Kauf achten solltest
          </h2>
          <p className="mb-4">Nicht jede 3-in-1 Ladestation ist gleich. Die wichtigsten Kriterien:</p>
          <ul className="space-y-3 list-disc pl-6 marker:text-primary">
            <li><strong className="font-medium text-foreground">Ladestandard:</strong> Qi2.2 ist der aktuellste Standard – schneller und kühler als Qi2</li>
            <li><strong className="font-medium text-foreground">Apple Watch Kompatibilität:</strong> Braucht einen dedizierten Watch-Puck, nicht nur Qi</li>
            <li><strong className="font-medium text-foreground">Stabilität:</strong> Magnetische Ausrichtung für iPhone damit es nicht verrutscht</li>
            <li><strong className="font-medium text-foreground">Design:</strong> Kompakt genug für Nachttisch, stabil genug für Schreibtisch</li>
            <li><strong className="font-medium text-foreground">Netzteil:</strong> Min. 30W PD empfohlen für optimales gleichzeitiges Laden</li>
          </ul>
        </section>
      </div>

      <div className="h-px bg-border/60 my-12" />

      <section>
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-6">
          Die beste 3-in-1 Ladestation in der Schweiz 2026
        </h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm md:text-base border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-foreground"></th>
                <th className="text-left py-3 px-4 font-medium text-primary">RAJ NEXUS</th>
                <th className="text-left py-3 px-4 font-medium text-foreground/70">Belkin 3-in-1</th>
                <th className="text-left py-3 px-4 font-medium text-foreground/70">Anker 3-in-1</th>
              </tr>
            </thead>
            <tbody className="font-light text-foreground/85">
              {[
                ["Standard", "Qi2.2", "Qi2", "Qi2"],
                ["iPhone", "25W", "15W", "15W"],
                ["Apple Watch", "check", "check", "check"],
                ["AirPods", "check", "check", "check"],
                ["Preis CHF", "99.–", "ab 109.–", "ab 129.–"],
                ["Swiss Brand", "check", "x", "x"],
              ].map(([label, a, b, c]) => (
                <tr key={label} className="border-b border-border/50">
                  <td className="py-3 pr-4 text-foreground/70">{label}</td>
                  {[a, b, c].map((v, i) => (
                    <td key={i} className="py-3 px-4">
                      {v === "check" ? <Check className="w-4 h-4 text-primary" /> :
                       v === "x" ? <X className="w-4 h-4 text-foreground/30" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="h-px bg-border/60 my-12" />

      <div className="space-y-12 text-foreground/85 font-light leading-relaxed max-w-2xl">
        <section>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-5">
            Fazit
          </h2>
          <p>
            Für iPhone-Nutzer in der Schweiz die alle drei Apple-Geräte täglich laden: der RAJ NEXUS bietet den neuesten Standard, den günstigsten Preis und als einzige Option Schweizer Support. Faltbar, kompakt, für Nachttisch und Schreibtisch.
          </p>
        </section>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium tracking-wide rounded-md"
          >
            RAJ NEXUS – Jetzt Founder Edition sichern
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PremiumPageLayout>
    </>
  );
};

export default ThreeInOnePage;

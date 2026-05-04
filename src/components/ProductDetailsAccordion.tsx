import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductDetailsAccordion = () => {
  return (
    <section className="py-20 md:py-28 px-6 border-t border-border/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-primary">Alle Details</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mt-3">Was du wissen musst.</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="specs" className="border-border/60">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Technische Spezifikationen</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ["Standard", "Qi2.2 zertifiziert"],
                  ["Leistung", "25 W Schnellladung"],
                  ["Eingang", "USB-C PD 30 W"],
                  ["Material", "Aluminium · Silikon"],
                  ["Farbe", "Space Black"],
                  ["Gewicht", "ca. 220 g"],
                  ["Masse (gefaltet)", "100 × 95 × 28 mm"],
                  ["Lieferumfang", "Charger · 1.5 m USB-C Kabel · Anleitung"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border/40 pb-2">
                    <dt className="text-foreground/70">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="kompat" className="border-border/60">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Kompatibilität</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-2">
              <p><span className="text-foreground/80">iPhone:</span> 12, 13, 14, 15, 16, 17 (alle Modelle, inkl. Pro/Max).</p>
              <p><span className="text-foreground/80">Apple Watch:</span> Series 4 bis Ultra 2.</p>
              <p><span className="text-foreground/80">AirPods:</span> Pro, Pro 2, 3 (mit Qi-Lade-Case).</p>
              <p><span className="text-foreground/80">Android:</span> alle Qi/Qi2-fähigen Geräte (5–15 W).</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="versand" className="border-border/60">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Versand & Rückgabe</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-3">
              <p><span className="text-foreground/80">Gratis Versand</span> in der ganzen Schweiz · Lieferung in 2–4 Werktagen via Schweizer Post.</p>
              <p><span className="text-foreground/80">30 Tage Rückgaberecht</span> — kostenlos, ohne Wenn und Aber. Wir senden dir ein Retourenetikett zu.</p>
              <p>Versand erfolgt klimaneutral. Verpackung ist plastikfrei.</p>
              <Link to="/versand" className="inline-block text-primary hover:underline mt-2">Vollständige Versandbedingungen →</Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="garantie" className="border-border/60">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Garantie & Support</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-3">
              <p><span className="text-foreground/80">3 Jahre Herstellergarantie</span> auf alle Funktionen und Materialien.</p>
              <p>Defekt? Schreib uns an <a href="mailto:support@raj.ch" className="text-primary hover:underline">support@raj.ch</a> — wir antworten innerhalb von 24 h und schicken Ersatz oder reparieren kostenlos.</p>
              <p>Support auf Deutsch, Französisch, Italienisch und Englisch.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq" className="border-border/60">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Häufige Fragen</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-4">
              {[
                ["Lädt es mein iPhone wirklich mit 25 W?", "Ja — sofern dein iPhone Qi2.2 unterstützt (iPhone 15 und neuer). Ältere Modelle laden mit 15 W (MagSafe-Geschwindigkeit)."],
                ["Funktioniert es mit Hülle?", "Ja, mit MagSafe-kompatiblen Hüllen bis 3 mm Dicke."],
                ["Wird es heiss?", "Nein. Aktive Temperatursteuerung hält das Gerät und dein iPhone im sicheren Bereich."],
                ["Kann ich es im Auto/Flugzeug benutzen?", "Ja, der Eingang ist USB-C PD — funktioniert mit jedem 30 W+ Adapter."],
                ["Ist ein Netzteil dabei?", "Nein, um Elektroschrott zu reduzieren. Jedes USB-C PD 30 W+ Netzteil funktioniert."],
              ].map(([q, a]) => (
                <div key={q}>
                  <p className="text-foreground/80 font-normal mb-1">{q}</p>
                  <p>{a}</p>
                </div>
              ))}
              <Link to="/faq" className="inline-block text-primary hover:underline mt-2">Alle Fragen ansehen →</Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="docs" className="border-border/60">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Dokumente & Rechtliches</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6 text-sm">
              <ul className="space-y-2.5">
                {[
                  ["AGB", "/agb"],
                  ["Datenschutzerklärung", "/datenschutz"],
                  ["Impressum", "/impressum"],
                  ["Über RAJ", "/ueber-raj"],
                  ["Qi2 erklärt", "/qi2-erklaert"],
                  ["Vergleich mit anderen Chargern", "/vergleich"],
                  ["Versandbedingungen", "/versand"],
                  ["Manuals", "/manuals"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link to={href} className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                      <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand" className="border-border/60 border-b">
            <AccordionTrigger className="text-base font-light hover:no-underline py-5">Über RAJ</AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-3">
              <p>RAJ ist ein Schweizer Unternehmen. Wir entwickeln Ladegeräte, die einfach funktionieren — ohne Kompromisse bei Qualität, Design und Nachhaltigkeit.</p>
              <p>Swiss Brand. Hergestellt unter fairen Bedingungen.</p>
              <Link to="/about" className="inline-block text-primary hover:underline">Mehr über uns →</Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProductDetailsAccordion;

import { Truck, RotateCcw, Mail, Globe, Clock, ShieldCheck, Package } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const Item = ({ icon: Icon, title, desc }: { icon: typeof Truck; title: string; desc: React.ReactNode }) => (
  <li className="flex items-start gap-4 py-5 border-b border-border/60 last:border-0">
    <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
    <div>
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 font-light leading-relaxed">{desc}</p>
    </div>
  </li>
);

const VersandPage = () => {
  return (
    <PremiumPageLayout
      title="Versand & Rückgabe – RAJ"
      metaDescription="Alles zu Versand und Rückgabe bei RAJ – transparent, fair, schweizweit."
      canonical="https://raj.ch/versand"
      eyebrow="Service"
      heading={<>Transparent.<br />Fair.</>}
      intro="Alles, was du über Versand und Rückgabe bei RAJ wissen musst."
      width="wide"
    >
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        {/* Versand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <h2 className="text-2xl font-light tracking-tight">Versand</h2>
          </div>
          <ul>
            <Item icon={ShieldCheck} title="Kostenloser Versand" desc="In der gesamten Schweiz – ohne Mindestbestellwert." />
            <Item icon={Clock} title="3–5 Werktage Lieferzeit" desc="Schnelle und zuverlässige Lieferung direkt zu dir." />
            <Item icon={Globe} title="Schweizer Markt im Fokus" desc="Internationaler Versand folgt zu einem späteren Zeitpunkt." />
          </ul>
        </div>

        {/* Rückgabe */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <RotateCcw className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <h2 className="text-2xl font-light tracking-tight">Rückgabe</h2>
          </div>
          <ul>
            <Item icon={Clock} title="30 Tage Rückgaberecht" desc="Ab Erhalt der Ware – unkompliziert und fair." />
            <Item icon={Package} title="Unbenutzt & unbeschädigt" desc="Ware muss im Originalzustand zurückgesendet werden." />
            <Item icon={ShieldCheck} title="Schnelle Rückerstattung" desc="Über das ursprüngliche Zahlungsmittel innerhalb von 3–5 Werktagen." />
            <Item
              icon={Mail}
              title="Rückgaben melden"
              desc={<>Per E-Mail an <a href="mailto:info@raj.ch" className="text-primary hover:underline">info@raj.ch</a></>}
            />
          </ul>
        </div>
      </div>
    </PremiumPageLayout>
  );
};

export default VersandPage;

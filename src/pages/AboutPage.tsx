import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const missionPoints = [
  "RAJ steht für Energieprodukte mit klarem Fokus auf Funktion und Beständigkeit.",
  "Jedes Detail ist bewusst gestaltet und auf das Wesentliche reduziert.",
  "Design, Leistung und Service greifen ineinander und geben Sicherheit.",
  "So entsteht Energie mit Substanz: verlässlich im Alltag, stark im Moment, dauerhaft im Vertrauen.",
];

const values = [
  { title: "Fokus", lead: "Reduktion auf das Wesentliche.", desc: "Wir entwickeln keine Funktionen, sondern Lösungen, die bleiben." },
  { title: "Qualität", lead: "Anspruch ohne Kompromisse.", desc: "Jedes Detail folgt einem klaren Qualitätsverständnis – sichtbar und spürbar." },
  { title: "Vertrauen", lead: "Verlässlichkeit im Alltag.", desc: "Dein Vertrauen ist unser Antrieb – wir hören zu und liefern." },
  { title: "Transparenz", lead: "Klare Entscheidungen. Klare Preise.", desc: "Ohne versteckte Bedingungen. Ohne leere Versprechen." },
];

const AboutPage = () => {
  return (
    <PremiumPageLayout
      title="Über uns – RAJ | Power. Always There."
      metaDescription="Erfahre mehr über RAJ – unsere Vision, Mission und Werte. Energie mit Substanz – klar im Design, ehrlich in der Leistung."
      eyebrow="Über RAJ"
      heading={<>Power.<br /><span className="text-primary">Always There.</span></>}
      intro="Präzise Energielösungen für Menschen, die sich auf Qualität verlassen – jeden Tag."
      width="wide"
    >
      <div className="space-y-20 md:space-y-28">
        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-4">Vision</p>
            <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed">
              <span className="text-foreground">Power,</span>{" "}
              <span className="text-muted-foreground">die einfach da ist, wenn du sie brauchst.</span>
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-4">Mission</p>
            <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed">
              <span className="text-muted-foreground">Wir stehen für Energie mit Substanz –</span>{" "}
              <span className="text-foreground">klar im Design, ehrlich in der Leistung.</span>
            </p>
          </div>
        </div>

        {/* Was uns ausmacht */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-4">Was uns ausmacht</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Unsere Grundsätze.</h2>
          <div className="space-y-5">
            {missionPoints.map((p, i) => (
              <div key={i} className="flex gap-6 py-5 border-b border-border/60 last:border-0">
                <span className="text-xs text-muted-foreground font-light tabular-nums mt-1.5 w-6">
                  0{i + 1}
                </span>
                <p className="text-lg font-light text-foreground/85 leading-relaxed flex-1">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Werte */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-4">Unsere Werte</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Was uns antreibt.</h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {values.map((v, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-xl font-light text-primary">{v.title}</h3>
                <p className="text-foreground font-medium">{v.lead}</p>
                <p className="text-muted-foreground font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8 border-t border-border/60 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">Entdecke unsere Produkte.</h2>
          <p className="text-muted-foreground font-light">Durchdachtes Design trifft auf zuverlässige Leistung.</p>
          <Link
            to="/product/wireless-charger-3in1#product"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-4 h-4" strokeWidth={1.5} />
            Produkte ansehen
          </Link>
        </div>
      </div>
    </PremiumPageLayout>
  );
};

export default AboutPage;

import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";

const grundsaetze = [
  "RAJ steht für Energieprodukte mit klarem Fokus auf Funktion und Beständigkeit.",
  "Jedes Detail ist bewusst gestaltet und auf das Wesentliche reduziert.",
  "Design, Leistung und Service greifen ineinander und geben Sicherheit.",
  "So entsteht Energie mit Substanz: verlässlich im Alltag, stark im Moment, dauerhaft im Vertrauen.",
];

const values = [
  { title: "Fokus", lead: "Reduktion auf das Wesentliche.", desc: "Wir entwickeln keine Funktionen, sondern Lösungen die bleiben." },
  { title: "Qualität", lead: "Anspruch ohne Kompromisse.", desc: "Jedes Detail folgt einem klaren Qualitätsverständnis – sichtbar und spürbar." },
  { title: "Vertrauen", lead: "Verlässlichkeit im Alltag.", desc: "Dein Vertrauen ist unser Antrieb – wir hören zu und liefern." },
  { title: "Transparenz", lead: "Klare Entscheidungen. Klare Preise.", desc: "Ohne versteckte Bedingungen. Ohne leere Versprechen." },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <PremiumPageLayout
      title="Über RAJ – Swiss Brand aus dem Thurgau"
      metaDescription="RAJ ist eine Schweizer Consumer-Electronics-Marke aus dem Thurgau. Premium-Zubehör für das Apple-Ökosystem – mit Anspruch an Präzision, Qualität und Design."
      canonical="https://raj.ch/about"
      eyebrow="Über RAJ"
      heading={<>Swiss<br /><span className="text-primary italic">Brand.</span></>}
      intro="Schweizer Consumer-Electronics aus dem Thurgau – mit Anspruch an Präzision, Qualität und Design."
      width="wide"
    >
      <div className="space-y-20 md:space-y-28">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors -mt-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Zurück
        </button>
        {/* SECTION 2 — Brand Story */}
        <div className="space-y-6 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Brand Story</p>
          <p className="text-lg md:text-xl font-light text-foreground/85 leading-relaxed">
            RAJ ist eine Schweizer Consumer-Electronics-Marke mit Sitz im Kanton Thurgau. RAJ bringt Premium-Zubehör für das Apple-Ökosystem in die Schweiz – mit dem Anspruch an Schweizer Präzision, nachhaltige Qualität und kompromissloses Design.
          </p>
          <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
            Unser erstes Produkt, der <span className="text-foreground">RAJ NEXUS 3-in-1 Wireless Charger</span>, vereint Funktionalität und Ästhetik: Ein Ladegerät, ein Kabel, drei Geräte geladen. Qi2.2-zertifiziert, faltbar, verstellbar – Swiss Brand.
          </p>
        </div>

        {/* SECTION 3 — Vision & Mission */}
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

        {/* SECTION 4 — Grundsätze */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-4">Was uns ausmacht</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Unsere Grundsätze.</h2>
          <div className="space-y-5">
            {grundsaetze.map((p, i) => (
              <div key={i} className="flex gap-6 py-5 border-b border-border/60 last:border-0">
                <span className="text-xs text-primary font-light tabular-nums mt-1.5 w-8 tracking-wider">
                  0{i + 1}
                </span>
                <p className="text-lg font-light text-foreground/85 leading-relaxed flex-1">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 — Werte */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-4">Unsere Werte</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Was uns antreibt.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {values.map((v, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-xl font-light text-primary">{v.title}</h3>
                <p className="text-foreground font-medium">{v.lead}</p>
                <p className="text-muted-foreground font-light leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6 — Werte Tagline */}
        <div className="text-center space-y-6 py-8 border-y border-border/60">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-primary font-medium">
            PRÄZISION · BESTÄNDIGKEIT · CHARAKTER
          </p>
          <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed max-w-xl mx-auto">
            RAJ steht für Produkte die funktionieren. Einfach. Ohne Kompromisse.
          </p>
          <p className="text-sm tracking-[0.28em] uppercase text-muted-foreground font-light">
            Power. Always There.
          </p>
        </div>

        {/* SECTION 7 — Blog CTA */}
        <div className="pt-4 text-center space-y-6">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">RAJ Blog</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">Wissen rund um kabelloses Laden.</h2>
          <p className="text-muted-foreground font-light max-w-xl mx-auto">
            Artikel und Guides zu Qi2.2, MagSafe und Apple-Zubehör – direkt aus dem RAJ Team.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Zum RAJ Blog
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </PremiumPageLayout>
  );
};

export default AboutPage;

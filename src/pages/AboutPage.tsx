import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Mountain,
  Compass,
  Target,
  Crosshair,
  Gem,
  ShieldCheck,
  Eye,
  Zap,
} from "lucide-react";
import PremiumPageLayout from "@/components/PremiumPageLayout";
import thurgauMap from "@/assets/about-thurgau-clean.png";

const grundsaetze = [
  "RAJ steht für Energieprodukte mit klarem Fokus auf Funktion und Beständigkeit.",
  "Jedes Detail ist bewusst gestaltet und auf das Wesentliche reduziert.",
  "Design, Leistung und Service greifen ineinander und geben Sicherheit.",
  "So entsteht Energie mit Substanz: verlässlich im Alltag, stark im Moment, dauerhaft im Vertrauen.",
];

const values = [
  {
    title: "Fokus",
    lead: "Reduktion auf das Wesentliche.",
    desc: "Wir entwickeln keine Funktionen, sondern Lösungen die bleiben.",
    Icon: Crosshair,
  },
  {
    title: "Qualität",
    lead: "Anspruch ohne Kompromisse.",
    desc: "Jedes Detail folgt einem klaren Qualitätsverständnis – sichtbar und spürbar.",
    Icon: Gem,
  },
  {
    title: "Vertrauen",
    lead: "Verlässlichkeit im Alltag.",
    desc: "Dein Vertrauen ist unser Antrieb – wir hören zu und liefern.",
    Icon: ShieldCheck,
  },
  {
    title: "Transparenz",
    lead: "Klare Entscheidungen. Klare Preise.",
    desc: "Ohne versteckte Bedingungen. Ohne leere Versprechen.",
    Icon: Eye,
  },
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
      canonical="https://raj.ch/ueber-raj"
      eyebrow="Über RAJ"
      heading={<>Swiss<br /><span className="text-primary italic">Brand.</span></>}
      intro="Schweizer Consumer-Electronics aus dem Thurgau – mit Anspruch an Präzision, Qualität und Design."
      width="wide"
      heroImage={thurgauMap}
    >
      <div className="space-y-20 md:space-y-28">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors -mt-4 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
          Zurück
        </button>

        {/* SECTION 2 — Brand Story */}
        <div className="space-y-6 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">— Brand Story</p>
          <p className="text-lg md:text-xl font-light text-foreground/85 leading-relaxed">
            RAJ ist eine Schweizer Consumer-Electronics-Marke mit Sitz im Kanton Thurgau. RAJ bringt Premium-Zubehör für das Apple-Ökosystem in die Schweiz – mit dem Anspruch an Schweizer Präzision, nachhaltige Qualität und kompromissloses Design.
          </p>
          <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
            Unser erstes Produkt, der <span className="text-foreground">RAJ NEXUS 3-in-1 Wireless Charger</span>, vereint Funktionalität und Ästhetik: Ein Ladegerät, ein Kabel, drei Geräte geladen. Qi2.2-zertifiziert, faltbar, verstellbar – Swiss Brand.
          </p>
        </div>

        {/* SECTION 3 — Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          <div className="relative p-8 md:p-10 rounded-2xl border border-border/60 bg-gradient-to-br from-muted/40 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center bg-primary/5">
                <Mountain className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Vision</p>
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              <span className="text-foreground">Power,</span>{" "}
              <span className="text-muted-foreground">die einfach da ist, wenn du sie brauchst.</span>
            </p>
          </div>
          <div className="relative p-8 md:p-10 rounded-2xl border border-border/60 bg-gradient-to-br from-muted/40 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center bg-primary/5">
                <Compass className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Mission</p>
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              <span className="text-muted-foreground">Wir stehen für Energie mit Substanz –</span>{" "}
              <span className="text-foreground">klar im Design, ehrlich in der Leistung.</span>
            </p>
          </div>
        </div>

        {/* SECTION 4 — Grundsätze */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Was uns ausmacht</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Unsere Grundsätze.</h2>
          <div className="space-y-1">
            {grundsaetze.map((p, i) => (
              <div
                key={i}
                className="group flex gap-6 md:gap-8 py-6 border-b border-border/60 last:border-0 transition-colors hover:bg-muted/30 px-2 -mx-2 rounded-lg"
              >
                <span className="text-sm text-primary font-light tabular-nums tracking-[0.2em] mt-1 w-10 shrink-0">
                  0{i + 1}
                </span>
                <div className="h-px bg-border/60 self-center w-8 shrink-0 group-hover:bg-primary/60 transition-colors" />
                <p className="text-base md:text-lg font-light text-foreground/85 leading-relaxed flex-1">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 — Werte */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Gem className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Unsere Werte</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12">Was uns antreibt.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {values.map((v, i) => {
              const Icon = v.Icon;
              return (
                <div
                  key={i}
                  className="group relative p-6 rounded-xl border border-border/50 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 bg-gradient-to-b from-muted/20 to-transparent"
                >
                  <div className="w-11 h-11 rounded-full border border-primary/40 flex items-center justify-center mb-5 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-light text-primary mb-2 tracking-wide">{v.title}</h3>
                  <p className="text-foreground font-medium text-sm mb-2">{v.lead}</p>
                  <p className="text-muted-foreground font-light leading-relaxed text-sm">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6 — Werte Tagline */}
        <div className="relative text-center py-14 md:py-20 px-6 rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-muted/40 via-background to-muted/30">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-3 text-xs md:text-sm tracking-[0.32em] uppercase text-primary font-medium">
              <span className="h-px w-8 bg-primary/40" />
              Präzision · Beständigkeit · Charakter
              <span className="h-px w-8 bg-primary/40" />
            </div>
            <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed max-w-xl mx-auto">
              RAJ steht für Produkte die funktionieren. Einfach. Ohne Kompromisse.
            </p>
            <p className="text-sm tracking-[0.32em] uppercase text-muted-foreground font-light pt-2">
              Power. Always There.
            </p>
          </div>
        </div>

        {/* Swiss Origin — Thurgau */}
        <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-muted/30 to-background">
          <div className="relative aspect-[16/10] md:aspect-[16/8]">
            <img
              src={thurgauMap}
              alt="RAJ – Swiss Brand mit Sitz im Kanton Thurgau"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, hsl(var(--background)/0.6) 85%, hsl(var(--background)) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <div className="inline-flex items-center gap-3 text-[10px] md:text-xs tracking-[0.32em] uppercase text-primary font-medium">
                <span className="h-px w-8 bg-primary/50" />
                Swiss Brand · Kanton Thurgau
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7 — Blog CTA */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-primary font-medium">
            <Zap className="w-3.5 h-3.5" strokeWidth={1.5} />
            RAJ Blog
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">Wissen rund um kabelloses Laden.</h2>
          <p className="text-muted-foreground font-light max-w-xl mx-auto">
            Artikel und Guides zu Qi2.2, MagSafe und Apple-Zubehör – direkt aus dem RAJ Team.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:gap-3 shadow-sm hover:shadow-md"
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

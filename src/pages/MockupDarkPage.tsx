import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Smartphone, Headphones, Watch, Zap, Shield, Truck, ArrowRight, Check,
  Mail, Loader2, Hash, Tag, Gift, X, RotateCcw, Award, Plus, Minus,
} from "lucide-react";

import nexusHero from "@/assets/products/nexus-real-3quarter.jpg";
import nexusFolds from "@/assets/products/nexus-real-folds-text.webp";
import nexusDesk from "@/assets/products/nexus-real-desk-office.webp";
import nexusNight from "@/assets/products/nexus-real-night-city.webp";
import nexusNachttisch from "@/assets/nexus-nacht-480.webp";

/**
 * MOCKUP — Apple-Style Flow: Dark Hero → Light Trust → Dark Product → Light Specs → Light FAQ → Dark CTA
 * Lives at /mockup-dark. Does NOT touch the live LaunchPage.
 */

// Dark palette
const D = {
  bg: "#0A0A0A",
  surface: "#161513",
  surfaceHi: "#1F1D1A",
  beige: "#E8DCC4",
  muted: "#A89B82",
  mutedDim: "#6E665A",
  gold: "#C9A876",
  goldSoft: "#D9BE8C",
  border: "#2A2622",
};

// Light palette (warm cream — wie raj.ch aber etwas wärmer für Kontrast)
const L = {
  bg: "#FAF8F5",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#6B6358",
  textDim: "#9A9285",
  gold: "#9b6b3f",
  goldSoft: "#C09875",
  border: "#E8E2D6",
};

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();

// ─────────────────────────────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────────────────────────────
const Countdown = ({ dark = true }: { dark?: boolean }) => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [{ v: t.d, l: "Tage" }, { v: t.h, l: "Std" }, { v: t.m, l: "Min" }, { v: t.s, l: "Sek" }];
  const c = dark ? D : { beige: L.text, gold: L.gold, mutedDim: L.textDim };
  return (
    <div className="flex justify-center gap-5 md:gap-8">
      {units.map((u, i) => (
        <div key={u.l} className="flex flex-col items-center relative">
          <span className="text-4xl md:text-6xl font-extralight tabular-nums leading-none tracking-tight" style={{ color: c.beige }}>
            {String(u.v).padStart(2, "0")}
          </span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.32em] mt-2 font-medium" style={{ color: c.gold }}>
            {u.l}
          </span>
          {i < units.length - 1 && (
            <span className="absolute -right-3 md:-right-5 top-1.5 md:top-3 text-3xl md:text-5xl font-extralight" style={{ color: c.mutedDim }}>·</span>
          )}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: L.border }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left transition-colors group"
      >
        <span className="text-[15px] md:text-base font-medium pr-6 transition-colors" style={{ color: L.text }}>
          {q}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: open ? L.gold : "transparent", border: `1px solid ${open ? L.gold : L.border}` }}
        >
          {open ? <Minus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5" style={{ color: L.gold }} strokeWidth={2.5} />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{ maxHeight: open ? "400px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="pb-6 pr-12 text-[14px] md:text-[15px] leading-[1.75] font-light" style={{ color: L.textMuted }}>
          {a}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
const MockupDarkPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — Apple-Style Mockup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════
          COMPARE BAR (sticky top)
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-50 border-b text-[11px] tracking-[0.2em] uppercase backdrop-blur-md"
        style={{ borderColor: D.border, backgroundColor: "rgba(10,10,10,0.85)", color: D.muted }}
      >
        <div className="container mx-auto px-5 py-2.5 flex items-center justify-between">
          <span>Mockup · Dark / Light Apple-Flow</span>
          <Link to="/?mode=launch" className="flex items-center gap-2 transition-opacity hover:opacity-80" style={{ color: D.gold }}>
            Live vergleichen <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="font-sans">

        {/* ════════════════════════════════════════════════════════
            ① HERO — DARK
            ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ backgroundColor: D.bg, color: D.beige }}>
          {/* Ambient gold glow */}
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full pointer-events-none opacity-[0.08]"
            style={{ background: `radial-gradient(circle, ${D.gold} 0%, transparent 60%)` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: `radial-gradient(${D.beige} 1px, transparent 1px)`, backgroundSize: "44px 44px" }}
            aria-hidden
          />

          {/* Header */}
          <header className="relative z-10 container mx-auto px-5 md:px-8 pt-7 pb-2 flex items-center justify-between">
            <div className="text-2xl tracking-[0.4em] font-light" style={{ color: D.beige }}>RAJ</div>
            <div className="flex items-center gap-3 text-[11px] font-medium tracking-wider">
              {["DE", "FR", "IT"].map((l, i) => (
                <span key={l} className="flex items-center gap-3">
                  <button style={{ color: i === 0 ? D.beige : D.mutedDim }}>{l}</button>
                  {i < 2 && <span style={{ color: D.border }}>·</span>}
                </span>
              ))}
            </div>
          </header>

          <div className="relative z-10 container mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-20 md:pb-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="h-px w-8" style={{ backgroundColor: D.gold }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: D.gold }}>
                    Swiss Brand · Founder Edition
                  </span>
                </div>

                <h1 className="text-[2.6rem] sm:text-5xl lg:text-[4.5rem] font-extralight leading-[1.05] tracking-[-0.02em] mb-6" style={{ color: D.beige }}>
                  Drei Geräte.<br />
                  <span style={{ color: D.gold, fontStyle: "italic", fontWeight: 300 }}>Ein</span> Objekt.
                </h1>

                <p className="text-base md:text-lg leading-[1.7] font-light max-w-md mx-auto lg:mx-0 mb-10" style={{ color: D.muted }}>
                  RAJ NEXUS lädt iPhone, AirPods und Apple Watch gleichzeitig. Qi2.2 zertifiziert. 25W. Faltbar. In Space Black.
                </p>

                <div className="flex items-baseline justify-center lg:justify-start gap-4 mb-10">
                  <span className="text-4xl md:text-5xl font-extralight tracking-tight" style={{ color: D.beige }}>
                    CHF 99.<span style={{ color: D.gold }}>–</span>
                  </span>
                  <span className="text-sm line-through font-light" style={{ color: D.mutedDim }}>CHF 129.–</span>
                  <span className="text-[10px] tracking-[0.3em] uppercase font-semibold px-2.5 py-1 border" style={{ color: D.gold, borderColor: D.gold }}>
                    -23%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <a
                    href="#cta-final"
                    className="group relative overflow-hidden px-8 py-4 text-[13px] tracking-[0.25em] uppercase font-semibold transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,118,0.35)]"
                    style={{ backgroundColor: D.gold, color: D.bg }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Founder-Platz sichern
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[11px] tracking-wider" style={{ color: D.muted }}>
                  <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" style={{ color: D.gold }} /> Gratis Lieferung CH</span>
                  <span style={{ color: D.border }}>·</span>
                  <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" style={{ color: D.gold }} /> 3 Jahre Garantie</span>
                  <span style={{ color: D.border }}>·</span>
                  <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5" style={{ color: D.gold }} /> Nur 100 Stück</span>
                </div>
              </div>

              {/* Right: Product */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-[100px] opacity-40 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${D.gold} 0%, transparent 65%)` }}
                  aria-hidden
                />
                <div className="relative">
                  <div
                    className="absolute -inset-px rounded-[2rem] opacity-30"
                    style={{ background: `linear-gradient(135deg, ${D.gold}, transparent 50%, ${D.gold} 100%)` }}
                    aria-hidden
                  />
                  <div className="relative rounded-[2rem] overflow-hidden" style={{ backgroundColor: D.surface }}>
                    <img src={nexusHero} alt="RAJ NEXUS Space Black" className="w-full aspect-square object-cover" style={{ filter: "brightness(0.95) contrast(1.05)" }} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b pointer-events-none" style={{ borderColor: D.gold }} aria-hidden />
                </div>

                <div className="absolute -bottom-6 left-6 md:left-12 px-5 py-4 backdrop-blur-md border" style={{ backgroundColor: "rgba(22,21,19,0.85)", borderColor: D.border }}>
                  <div className="flex items-center gap-4">
                    <Zap className="w-5 h-5" style={{ color: D.gold }} strokeWidth={1.5} />
                    <div>
                      <div className="text-[10px] tracking-[0.25em] uppercase" style={{ color: D.muted }}>Qi2.2 · Magnetisch</div>
                      <div className="text-lg font-light" style={{ color: D.beige }}>25W Schnellladung</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Strip */}
            <div className="mt-24 md:mt-32 pt-12 border-t" style={{ borderColor: D.border }}>
              <p className="text-[10px] tracking-[0.4em] uppercase mb-6 font-semibold text-center" style={{ color: D.gold }}>
                Launch · 6. Mai 2026 · 20:00 Uhr
              </p>
              <Countdown dark />
              <p className="text-xs mt-6 font-light tracking-wide text-center" style={{ color: D.muted }}>
                <span style={{ color: D.beige, fontWeight: 500 }}>67</span> von 100 Founder-Plätzen vergeben
              </p>
              <div className="mt-3 max-w-xs mx-auto h-px" style={{ backgroundColor: D.border }}>
                <div className="h-px" style={{ backgroundColor: D.gold, width: "67%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ② FEATURES / TRUST — LIGHT
            ════════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: L.bg, color: L.text }} className="py-24 md:py-36 relative">
          <div className="container mx-auto px-5 md:px-8 max-w-6xl">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ backgroundColor: L.gold }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: L.gold }}>Was du bekommst</span>
                <div className="h-px w-8" style={{ backgroundColor: L.gold }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15] mb-5" style={{ color: L.text }}>
                Mehr als ein Ladegerät.<br />
                <span style={{ fontStyle: "italic", color: L.gold }}>Ein Versprechen.</span>
              </h2>
              <p className="text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed" style={{ color: L.textMuted }}>
                Premium Materialien. Echte Leistung. Fairer Preis. Präzise. Zuverlässig. Durchdacht.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: Tag, title: "CHF 30 sparen", desc: "CHF 99 statt CHF 129. Nur für die ersten 100 Founder." },
                { icon: Hash, title: "Persönliche Seriennummer", desc: "Founder Edition mit eingravierter Nummer auf der Verpackung." },
                { icon: Gift, title: "Lebenslanger Early Access", desc: "Zu jedem neuen RAJ Produkt — vor allen anderen." },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group relative p-8 md:p-10 rounded-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{ backgroundColor: L.surface, border: `1px solid ${L.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors"
                    style={{ backgroundColor: `${L.gold}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: L.gold }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-light mb-3 tracking-tight" style={{ color: L.text }}>{title}</h3>
                  <p className="text-[14px] font-light leading-[1.7]" style={{ color: L.textMuted }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-20 pt-12 border-t flex flex-wrap items-center justify-center gap-x-12 gap-y-6" style={{ borderColor: L.border }}>
              {[
                { icon: Truck, label: "Gratis Lieferung Schweiz" },
                { icon: Shield, label: "3 Jahre Garantie" },
                { icon: RotateCcw, label: "14 Tage Rückgaberecht" },
                { icon: Award, label: "Qi2.2 zertifiziert" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4" style={{ color: L.gold }} strokeWidth={1.5} />
                  <span className="text-[12px] tracking-wider uppercase font-medium" style={{ color: L.textMuted }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ③ PRODUCT STORY — DARK (3 Segments)
            ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-24 md:py-36" style={{ backgroundColor: D.bg, color: D.beige }}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full pointer-events-none opacity-[0.06]"
            style={{ background: `radial-gradient(ellipse, ${D.gold} 0%, transparent 70%)` }}
            aria-hidden
          />

          <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
            <div className="text-center mb-20 md:mb-28">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ backgroundColor: D.gold }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: D.gold }}>Drei Momente</span>
                <div className="h-px w-8" style={{ backgroundColor: D.gold }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15]" style={{ color: D.beige }}>
                Eine Bewegung.<br />
                <span style={{ fontStyle: "italic", color: D.gold }}>Der ganze Tag geladen.</span>
              </h2>
            </div>

            <div className="space-y-24 md:space-y-36">
              {[
                { img: nexusFolds, num: "01", eyebrow: "Für Vielreisende", title: "Faltet sich. Lädt überall.", copy: "Hotelzimmer. Lounge. Airbnb. Eine Bewegung — aufgeklappt. iPhone, Watch, AirPods. Alle gleichzeitig." },
                { img: nexusDesk, num: "02", eyebrow: "Für die, die Ordnung lieben", title: "Drei Kabel weg. Ein Objekt da.", copy: "Kein Kabelsalat. Kein Suchen. Ein einziger Ort — alles geladen, alles bereit." },
                { img: nexusNight, num: "03", eyebrow: "Für die späten Abende", title: "Hinlegen. Aufwachen mit 100 %.", copy: "Telefon drauf — magnetisch klick. Morgens: voll geladen, bereit für den Tag." },
              ].map((s, i) => {
                const right = i % 2 === 1;
                return (
                  <div key={s.num} className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className={`md:col-span-7 relative ${right ? "md:order-2" : ""}`}>
                      <div className="absolute -inset-2 rounded-[1.5rem] opacity-20 blur-xl pointer-events-none" style={{ backgroundColor: D.gold }} aria-hidden />
                      <div className="relative rounded-[1.5rem] overflow-hidden border" style={{ borderColor: D.border }}>
                        <img src={s.img} alt={s.title} loading="lazy" className="w-full aspect-[4/3] object-cover" style={{ filter: "brightness(0.85) contrast(1.05) saturate(0.95)" }} />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(${right ? "270deg" : "90deg"}, transparent 50%, ${D.bg}99 100%)` }} aria-hidden />
                      </div>
                    </div>
                    <div className={`md:col-span-5 ${right ? "md:order-1 md:text-right" : ""}`}>
                      <div className={`flex items-center gap-3 mb-5 ${right ? "md:justify-end" : ""}`}>
                        <span className="text-[10px] tracking-[0.4em] font-extralight" style={{ color: D.gold }}>{s.num}</span>
                        <div className="h-px w-8" style={{ backgroundColor: D.gold }} />
                        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: D.gold }}>{s.eyebrow}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-extralight leading-[1.15] tracking-tight mb-5" style={{ color: D.beige }}>{s.title}</h3>
                      <p className="text-base md:text-lg font-light leading-[1.75] max-w-md" style={{ color: D.muted, marginLeft: right ? "auto" : 0 }}>{s.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ④ COMPARISON — LIGHT (RAJ vs. Anker vs. Belkin)
            ════════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: L.bg, color: L.text }} className="py-24 md:py-36">
          <div className="container mx-auto px-5 md:px-8 max-w-5xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ backgroundColor: L.gold }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: L.gold }}>Im Vergleich</span>
                <div className="h-px w-8" style={{ backgroundColor: L.gold }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15]" style={{ color: L.text }}>
                RAJ vs. die Anderen.
              </h2>
              <p className="text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed mt-5" style={{ color: L.textMuted }}>
                Mehr Leistung. Modernster Standard. Schweizer Garantie.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: L.surface, border: `1px solid ${L.border}` }}>
              <div className="grid grid-cols-4 text-center">
                {/* Header row */}
                <div className="p-5 md:p-7" />
                <div className="p-5 md:p-7 relative" style={{ backgroundColor: `${L.gold}08` }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: L.gold }} />
                  <div className="text-2xl md:text-3xl font-light tracking-[0.3em] mb-1" style={{ color: L.gold }}>RAJ</div>
                  <div className="text-[10px] tracking-wider uppercase" style={{ color: L.textDim }}>NEXUS</div>
                </div>
                <div className="p-5 md:p-7">
                  <div className="text-base md:text-lg font-light" style={{ color: L.textMuted }}>Anker</div>
                  <div className="text-[10px] tracking-wider uppercase" style={{ color: L.textDim }}>3-in-1 Cube</div>
                </div>
                <div className="p-5 md:p-7">
                  <div className="text-base md:text-lg font-light" style={{ color: L.textMuted }}>Belkin</div>
                  <div className="text-[10px] tracking-wider uppercase" style={{ color: L.textDim }}>BoostCharge Pro</div>
                </div>

                {/* Rows */}
                {[
                  { f: "Standard", raj: "Qi2.2 (25W)", anker: "Qi2 (15W)", belkin: "Qi2 (15W)" },
                  { f: "Faltbar", raj: true, anker: false, belkin: false },
                  { f: "Magnetisch", raj: true, anker: true, belkin: true },
                  { f: "Apple Watch Fast Charge", raj: true, anker: true, belkin: true },
                  { f: "Garantie", raj: "3 Jahre", anker: "18 Monate", belkin: "2 Jahre" },
                  { f: "Schweizer Brand", raj: true, anker: false, belkin: false },
                  { f: "Preis", raj: "CHF 99.–", anker: "CHF 169.–", belkin: "CHF 159.–" },
                ].map((row, i) => (
                  <div key={row.f} className="contents">
                    <div
                      className="p-4 md:p-5 text-left text-[13px] md:text-[14px] font-medium border-t"
                      style={{ color: L.text, borderColor: L.border }}
                    >
                      {row.f}
                    </div>
                    <div
                      className="p-4 md:p-5 text-[13px] md:text-[14px] font-semibold border-t flex items-center justify-center"
                      style={{ color: L.gold, borderColor: L.border, backgroundColor: `${L.gold}08` }}
                    >
                      {typeof row.raj === "boolean" ? (row.raj ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" style={{ color: L.textDim }} />) : row.raj}
                    </div>
                    <div className="p-4 md:p-5 text-[13px] md:text-[14px] font-light border-t flex items-center justify-center" style={{ color: L.textMuted, borderColor: L.border }}>
                      {typeof row.anker === "boolean" ? (row.anker ? <Check className="w-4 h-4" style={{ color: L.textMuted }} /> : <X className="w-4 h-4" style={{ color: L.textDim }} />) : row.anker}
                    </div>
                    <div className="p-4 md:p-5 text-[13px] md:text-[14px] font-light border-t flex items-center justify-center" style={{ color: L.textMuted, borderColor: L.border }}>
                      {typeof row.belkin === "boolean" ? (row.belkin ? <Check className="w-4 h-4" style={{ color: L.textMuted }} /> : <X className="w-4 h-4" style={{ color: L.textDim }} />) : row.belkin}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ⑤ SPECS — DARK (technisch, premium)
            ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-24 md:py-36" style={{ backgroundColor: D.bg, color: D.beige }}>
          <div className="container mx-auto px-5 md:px-8 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-[80px] opacity-30 pointer-events-none" style={{ background: `radial-gradient(circle, ${D.gold} 0%, transparent 65%)` }} aria-hidden />
                <div className="relative rounded-[1.5rem] overflow-hidden" style={{ backgroundColor: D.surface, border: `1px solid ${D.border}` }}>
                  <img src={nexusNachttisch} alt="RAJ NEXUS Specs" className="w-full aspect-square object-cover" style={{ filter: "brightness(0.9) contrast(1.05)" }} />
                </div>
              </div>

              {/* Specs */}
              <div>
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-8" style={{ backgroundColor: D.gold }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: D.gold }}>Technische Daten</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15] mb-10" style={{ color: D.beige }}>
                  Bis ins letzte<br /><span style={{ fontStyle: "italic", color: D.gold }}>Detail.</span>
                </h2>

                <dl className="space-y-0">
                  {[
                    { k: "Standard", v: "Qi2.2 (WPC zertifiziert)" },
                    { k: "Leistung iPhone", v: "25W magnetisch" },
                    { k: "Leistung Apple Watch", v: "5W Fast Charge" },
                    { k: "Leistung AirPods", v: "5W" },
                    { k: "Eingang", v: "USB-C PD 30W" },
                    { k: "Material", v: "Aluminium · Vegan Leather" },
                    { k: "Gewicht", v: "245 g" },
                    { k: "Farbe", v: "Space Black" },
                    { k: "Garantie", v: "3 Jahre" },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex items-baseline justify-between py-4 border-b" style={{ borderColor: D.border }}>
                      <dt className="text-[13px] tracking-wider uppercase font-medium" style={{ color: D.muted }}>{k}</dt>
                      <dd className="text-[15px] md:text-base font-light text-right" style={{ color: D.beige }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Device compatibility */}
            <div className="mt-24 md:mt-32 text-center">
              <p className="text-[10px] tracking-[0.4em] uppercase mb-8 font-semibold" style={{ color: D.gold }}>Kompatibilität</p>
              <div className="flex items-center justify-center gap-12 md:gap-20">
                {[
                  { Icon: Smartphone, label: "iPhone 12+" },
                  { Icon: Headphones, label: "AirPods Pro" },
                  { Icon: Watch, label: "Apple Watch" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all hover:scale-105" style={{ borderColor: D.border, backgroundColor: D.surface }}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: D.gold }} strokeWidth={1.2} />
                    </div>
                    <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: D.muted }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ⑥ FAQ — LIGHT
            ════════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: L.bg, color: L.text }} className="py-24 md:py-36">
          <div className="container mx-auto px-5 md:px-8 max-w-3xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ backgroundColor: L.gold }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: L.gold }}>Häufige Fragen</span>
                <div className="h-px w-8" style={{ backgroundColor: L.gold }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15]" style={{ color: L.text }}>
                Zweifel?<br /><span style={{ fontStyle: "italic", color: L.gold }}>Hier die Antworten.</span>
              </h2>
            </div>

            <div className="space-y-0">
              {[
                { q: "Ist RAJ NEXUS mit meinem Gerät kompatibel?", a: "Ja. iPhone 12 und neuer mit MagSafe, Apple Watch Series 1–Ultra, AirPods Pro & AirPods 3. Generation+. Funktioniert auch mit MagSafe Cases. Dank Qi2.2 auch kompatibel mit Samsung Galaxy S25 und anderen Qi2-fähigen Android Geräten." },
                { q: "Muss ich mich zum Kauf verpflichten?", a: "Nein. Die Anmeldung ist unverbindlich. Im Mai erhältst du das Kaufangebot — du entscheidest dann." },
                { q: "Was unterscheidet RAJ NEXUS von anderen Chargern?", a: "Qi2.2 Technologie — der neueste Standard (seit Juli 2025), zertifiziert durch das Wireless Power Consortium (WPC). 25W Schnellladen, effizientere Energie, präzisere Ausrichtung. Dazu: Schweizer Qualitätsanspruch, Premium-Materialien, 3 Jahre Garantie." },
                { q: "Ist das Laden sicher? Was ist mit Überhitzung?", a: "Ja. WPC-zertifiziert mit integrierten Sicherheitsmechanismen: Überhitzungsschutz, Überladeschutz, Fremdkörpererkennung. Qi2.2 ist effizienter und erzeugt weniger Hitze als ältere Standards." },
                { q: "Wann kann ich meinen RAJ NEXUS erwarten?", a: "Mai 2026. Early Access Mitglieder haben Priorität bei der Auslieferung." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>

            <div className="mt-14 text-center">
              <p className="text-[13px] mb-2" style={{ color: L.textMuted }}>Noch Fragen? Schreib uns direkt:</p>
              <a href="mailto:founder@raj.ch" className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors hover:opacity-70" style={{ color: L.text, borderBottom: `1px solid ${L.gold}` }}>
                founder@raj.ch
              </a>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ⑦ FINAL CTA — DARK (Conversion-Push)
            ════════════════════════════════════════════════════════ */}
        <section
          id="cta-final"
          className="relative overflow-hidden py-24 md:py-36"
          style={{ background: `linear-gradient(180deg, ${D.bg} 0%, ${D.surface} 100%)`, color: D.beige }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none opacity-[0.1]"
            style={{ background: `radial-gradient(circle, ${D.gold} 0%, transparent 60%)` }}
            aria-hidden
          />

          <div className="container mx-auto px-5 md:px-8 text-center max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: D.gold }} />
              <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: D.gold }}>Limitiert auf 100</span>
              <div className="h-px w-12" style={{ backgroundColor: D.gold }} />
            </div>

            <h2 className="text-4xl md:text-6xl font-extralight tracking-tight leading-[1.1] mb-6" style={{ color: D.beige }}>
              Sei einer der<br />
              <span style={{ fontStyle: "italic", color: D.gold }}>ersten 100.</span>
            </h2>

            <p className="text-base md:text-lg font-light leading-relaxed mb-10" style={{ color: D.muted }}>
              Founder Edition. Persönliche Seriennummer. CHF 99.– statt CHF 129.–
            </p>

            {submitted ? (
              <div
                className="max-w-md mx-auto p-8 rounded-2xl backdrop-blur-md border animate-fade-in"
                style={{ backgroundColor: "rgba(22,21,19,0.85)", borderColor: D.gold }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: D.gold }}>
                  <Check className="w-7 h-7" style={{ color: D.bg }} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-light mb-2" style={{ color: D.beige }}>Du bist Founder #68.</h3>
                <p className="text-sm font-light" style={{ color: D.muted }}>Wir melden uns als Erstes — versprochen.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto"
              >
                <div
                  className="flex flex-col sm:flex-row gap-3 p-2 rounded-full"
                  style={{ backgroundColor: "rgba(22,21,19,0.7)", border: `1px solid ${D.border}`, backdropFilter: "blur(10px)" }}
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: D.gold }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deine@email.ch"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-transparent text-[14px] outline-none rounded-full"
                      style={{ color: D.beige }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group px-7 py-3.5 rounded-full text-[12px] tracking-[0.25em] uppercase font-semibold transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,118,0.5)] disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: D.gold, color: D.bg }}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>Reservieren <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></>
                    )}
                  </button>
                </div>
                <p className="text-[11px] mt-5 tracking-wider" style={{ color: D.mutedDim }}>
                  Keine Zahlungsdaten · Kein Spam · Jederzeit abmeldbar
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            FOOTER — DARK
            ════════════════════════════════════════════════════════ */}
        <footer className="border-t py-12" style={{ backgroundColor: D.bg, borderColor: D.border, color: D.mutedDim }}>
          <div className="container mx-auto px-5 md:px-8 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="text-2xl tracking-[0.4em] font-light" style={{ color: D.beige }}>RAJ</div>
                <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: D.muted }}>Power. Always There.</p>
              </div>
              <div className="flex items-center gap-6 text-[11px] tracking-wider">
                <a href="/impressum" className="transition-colors hover:opacity-80" style={{ color: D.muted }}>Impressum</a>
                <a href="/datenschutz" className="transition-colors hover:opacity-80" style={{ color: D.muted }}>Datenschutz</a>
                <a href="/agb" className="transition-colors hover:opacity-80" style={{ color: D.muted }}>AGB</a>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t text-center text-[11px]" style={{ borderColor: D.border, color: D.mutedDim }}>
              © {new Date().getFullYear()} RAJ GmbH (in Gründung) — Alle Rechte vorbehalten.
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default MockupDarkPage;

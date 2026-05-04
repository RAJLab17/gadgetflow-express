import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Smartphone, Headphones, Watch, Zap, Shield, Truck, ArrowRight, Check } from "lucide-react";

import nexusHero from "@/assets/products/nexus-real-3quarter.jpg";
import nexusFolds from "@/assets/products/nexus-real-folds-text.webp";
import nexusDesk from "@/assets/products/nexus-real-desk-office.webp";
import nexusNight from "@/assets/products/nexus-real-night-city.webp";

/**
 * MOCKUP — Dark + Beige + Gold variant of the Launch Page.
 * Lives at /mockup-dark. Does NOT touch the live LaunchPage.
 *
 * Palette (scoped, no global token changes):
 *  - Charcoal:   #0F0E0D  (background)
 *  - Surface:    #1A1817  (cards / elevated)
 *  - Beige:      #E8DCC4  (primary text on dark)
 *  - Muted:      #A89B82  (secondary text)
 *  - Gold:       #C9A876  (accent — CTA, price, eyebrows)
 *  - Gold soft:  #D9BE8C  (hover / glow)
 */

const C = {
  bg: "#0F0E0D",
  surface: "#1A1817",
  surfaceHi: "#221F1C",
  beige: "#E8DCC4",
  muted: "#A89B82",
  mutedDim: "#6E665A",
  gold: "#C9A876",
  goldSoft: "#D9BE8C",
  border: "#2A2622",
};

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();

const Countdown = () => {
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
  const units = [
    { v: t.d, l: "Tage" },
    { v: t.h, l: "Std" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Sek" },
  ];
  return (
    <div className="flex justify-center gap-5 md:gap-8">
      {units.map((u, i) => (
        <div key={u.l} className="flex flex-col items-center relative">
          <span
            className="text-4xl md:text-6xl font-extralight tabular-nums leading-none tracking-tight"
            style={{ color: C.beige }}
          >
            {String(u.v).padStart(2, "0")}
          </span>
          <span
            className="text-[9px] md:text-[10px] uppercase tracking-[0.32em] mt-2 font-medium"
            style={{ color: C.gold }}
          >
            {u.l}
          </span>
          {i < units.length - 1 && (
            <span
              className="absolute -right-3 md:-right-5 top-1.5 md:top-3 text-3xl md:text-5xl font-extralight"
              style={{ color: C.mutedDim }}
            >
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const MockupDarkPage = () => {
  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — Dark Mockup Preview</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div
        className="min-h-screen relative overflow-hidden font-sans"
        style={{ backgroundColor: C.bg, color: C.beige }}
      >
        {/* Ambient gold glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: `radial-gradient(circle, ${C.gold} 0%, transparent 60%)` }}
          aria-hidden
        />
        {/* Subtle noise grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${C.beige} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
          aria-hidden
        />

        {/* Compare bar */}
        <div
          className="relative z-20 border-b text-[11px] tracking-[0.2em] uppercase"
          style={{ borderColor: C.border, backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="container mx-auto px-5 py-2.5 flex items-center justify-between">
            <span style={{ color: C.muted }}>Mockup · Dark + Beige + Gold</span>
            <Link
              to="/?mode=launch"
              className="flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ color: C.gold }}
            >
              Live-Version vergleichen <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          {/* ===== HEADER ===== */}
          <header className="container mx-auto px-5 md:px-8 pt-6 pb-2 flex items-center justify-between">
            <div
              className="text-2xl tracking-[0.4em] font-light"
              style={{ color: C.beige }}
            >
              RAJ
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium tracking-wider">
              {["DE", "FR", "IT"].map((l, i) => (
                <span key={l} className="flex items-center gap-3">
                  <button
                    className="transition-colors"
                    style={{ color: i === 0 ? C.beige : C.mutedDim }}
                  >
                    {l}
                  </button>
                  {i < 2 && <span style={{ color: C.border }}>·</span>}
                </span>
              ))}
            </div>
          </header>

          {/* ===== HERO ===== */}
          <section className="container mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-16 md:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-3 mb-8">
                  <div
                    className="h-px w-8"
                    style={{ backgroundColor: C.gold }}
                  />
                  <span
                    className="text-[10px] tracking-[0.4em] uppercase font-semibold"
                    style={{ color: C.gold }}
                  >
                    Swiss Brand · Pre-Launch
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="text-[2.6rem] sm:text-5xl lg:text-[4.5rem] font-extralight leading-[1.05] tracking-[-0.02em] mb-6"
                  style={{ color: C.beige }}
                >
                  Drei Geräte.<br />
                  <span style={{ color: C.gold, fontStyle: "italic", fontWeight: 300 }}>
                    Ein
                  </span>{" "}
                  Objekt.
                </h1>

                <p
                  className="text-base md:text-lg leading-[1.7] font-light max-w-md mx-auto lg:mx-0 mb-10"
                  style={{ color: C.muted }}
                >
                  RAJ NEXUS lädt iPhone, AirPods und Apple Watch
                  gleichzeitig. Qi2.2 zertifiziert. 25W. Faltbar.
                  In Space Black.
                </p>

                {/* Price Block */}
                <div className="flex items-baseline justify-center lg:justify-start gap-4 mb-10">
                  <span
                    className="text-4xl md:text-5xl font-extralight tracking-tight"
                    style={{ color: C.beige }}
                  >
                    CHF 99.<span style={{ color: C.gold }}>–</span>
                  </span>
                  <span
                    className="text-sm line-through font-light"
                    style={{ color: C.mutedDim }}
                  >
                    CHF 149.–
                  </span>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase font-semibold px-2.5 py-1 border"
                    style={{ color: C.gold, borderColor: C.gold }}
                  >
                    -33%
                  </span>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <button
                    className="group relative overflow-hidden px-8 py-4 text-[13px] tracking-[0.25em] uppercase font-semibold transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,118,0.35)]"
                    style={{
                      backgroundColor: C.gold,
                      color: C.bg,
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Early Access sichern
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span
                      className="absolute inset-0 transition-transform duration-500 -translate-x-full group-hover:translate-x-0"
                      style={{ backgroundColor: C.goldSoft }}
                      aria-hidden
                    />
                  </button>
                </div>

                {/* Trust row */}
                <div
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[11px] tracking-wider"
                  style={{ color: C.muted }}
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" style={{ color: C.gold }} />
                    Gratis Lieferung CH
                  </span>
                  <span style={{ color: C.border }}>·</span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" style={{ color: C.gold }} />
                    2 Jahre Garantie
                  </span>
                  <span style={{ color: C.border }}>·</span>
                  <span className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: C.gold }} />
                    Nur 100 Stück
                  </span>
                </div>
              </div>

              {/* Right: Product Image */}
              <div className="relative">
                {/* Halo */}
                <div
                  className="absolute inset-0 rounded-full blur-[100px] opacity-40 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${C.gold} 0%, transparent 65%)`,
                  }}
                  aria-hidden
                />
                {/* Frame */}
                <div className="relative">
                  <div
                    className="absolute -inset-px rounded-[2rem] opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold}, transparent 50%, ${C.gold} 100%)`,
                    }}
                    aria-hidden
                  />
                  <div
                    className="relative rounded-[2rem] overflow-hidden"
                    style={{ backgroundColor: C.surface }}
                  >
                    <img
                      src={nexusHero}
                      alt="RAJ NEXUS in Space Black"
                      className="w-full aspect-square object-cover"
                      style={{ filter: "brightness(0.95) contrast(1.05)" }}
                    />
                  </div>
                  {/* Corner accent */}
                  <div
                    className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b pointer-events-none"
                    style={{ borderColor: C.gold }}
                    aria-hidden
                  />
                </div>

                {/* Floating spec card */}
                <div
                  className="absolute -bottom-6 left-6 md:left-12 px-5 py-4 backdrop-blur-md border"
                  style={{
                    backgroundColor: "rgba(26,24,23,0.85)",
                    borderColor: C.border,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Zap className="w-5 h-5" style={{ color: C.gold }} strokeWidth={1.5} />
                    <div>
                      <div
                        className="text-[10px] tracking-[0.25em] uppercase"
                        style={{ color: C.muted }}
                      >
                        Qi2.2 · Magnetisch
                      </div>
                      <div className="text-lg font-light" style={{ color: C.beige }}>
                        25W Schnellladung
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== COUNTDOWN STRIP ===== */}
          <section
            className="border-y py-10 md:py-14"
            style={{
              borderColor: C.border,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          >
            <div className="container mx-auto px-5 md:px-8 text-center">
              <p
                className="text-[10px] tracking-[0.4em] uppercase mb-6 font-semibold"
                style={{ color: C.gold }}
              >
                Launch · 6. Mai 2026 · 20:00 Uhr
              </p>
              <Countdown />
              <p
                className="text-xs mt-6 font-light tracking-wide"
                style={{ color: C.muted }}
              >
                <span style={{ color: C.beige, fontWeight: 500 }}>67</span>{" "}
                von 100 Early-Access-Plätzen vergeben
              </p>
              {/* Progress */}
              <div
                className="mt-3 max-w-xs mx-auto h-px"
                style={{ backgroundColor: C.border }}
              >
                <div
                  className="h-px"
                  style={{ backgroundColor: C.gold, width: "67%" }}
                />
              </div>
            </div>
          </section>

          {/* ===== STORY — 3 Segments ===== */}
          <section className="container mx-auto px-5 md:px-8 py-20 md:py-32">
            <div className="max-w-6xl mx-auto space-y-24 md:space-y-36">
              {[
                {
                  img: nexusFolds,
                  num: "01",
                  eyebrow: "Für Vielreisende",
                  title: "Faltet sich. Lädt überall.",
                  copy: "Hotelzimmer. Lounge. Airbnb. Eine Bewegung — aufgeklappt. iPhone, Watch, AirPods. Alle gleichzeitig.",
                },
                {
                  img: nexusDesk,
                  num: "02",
                  eyebrow: "Für die, die Ordnung lieben",
                  title: "Drei Kabel weg. Ein Objekt da.",
                  copy: "Kein Kabelsalat. Kein Suchen. Ein einziger Ort — alles geladen, alles bereit.",
                },
                {
                  img: nexusNight,
                  num: "03",
                  eyebrow: "Für die späten Abende",
                  title: "Hinlegen. Aufwachen mit 100 %.",
                  copy: "Telefon drauf — magnetisch klick. Morgens: voll geladen, bereit für den Tag.",
                },
              ].map((s, i) => {
                const right = i % 2 === 1;
                return (
                  <div
                    key={s.num}
                    className="grid md:grid-cols-12 gap-8 md:gap-12 items-center"
                  >
                    <div className={`md:col-span-7 relative ${right ? "md:order-2" : ""}`}>
                      <div
                        className="absolute -inset-2 rounded-[1.5rem] opacity-20 blur-xl pointer-events-none"
                        style={{ backgroundColor: C.gold }}
                        aria-hidden
                      />
                      <div
                        className="relative rounded-[1.5rem] overflow-hidden border"
                        style={{ borderColor: C.border }}
                      >
                        <img
                          src={s.img}
                          alt={s.title}
                          loading="lazy"
                          className="w-full aspect-[4/3] object-cover"
                          style={{ filter: "brightness(0.85) contrast(1.05) saturate(0.95)" }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `linear-gradient(${right ? "270deg" : "90deg"}, transparent 50%, ${C.bg}99 100%)`,
                          }}
                          aria-hidden
                        />
                      </div>
                    </div>
                    <div className={`md:col-span-5 ${right ? "md:order-1 md:text-right" : ""}`}>
                      <div
                        className={`flex items-center gap-3 mb-5 ${right ? "md:justify-end" : ""}`}
                      >
                        <span
                          className="text-[10px] tracking-[0.4em] font-extralight"
                          style={{ color: C.gold }}
                        >
                          {s.num}
                        </span>
                        <div className="h-px w-8" style={{ backgroundColor: C.gold }} />
                        <span
                          className="text-[10px] tracking-[0.3em] uppercase font-semibold"
                          style={{ color: C.gold }}
                        >
                          {s.eyebrow}
                        </span>
                      </div>
                      <h3
                        className="text-3xl md:text-4xl lg:text-5xl font-extralight leading-[1.15] tracking-tight mb-5"
                        style={{ color: C.beige }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="text-base md:text-lg font-light leading-[1.75] max-w-md"
                        style={{ color: C.muted, marginLeft: right ? "auto" : 0 }}
                      >
                        {s.copy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== DEVICE ICONS ===== */}
          <section className="container mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
            <p
              className="text-[10px] tracking-[0.4em] uppercase mb-8 font-semibold"
              style={{ color: C.gold }}
            >
              Kompatibilität
            </p>
            <h2
              className="text-3xl md:text-5xl font-extralight tracking-tight mb-12"
              style={{ color: C.beige }}
            >
              iPhone · AirPods · Apple Watch
            </h2>
            <div className="flex items-center justify-center gap-12 md:gap-20">
              {[
                { Icon: Smartphone, label: "iPhone" },
                { Icon: Headphones, label: "AirPods" },
                { Icon: Watch, label: "Apple Watch" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all hover:scale-105"
                    style={{ borderColor: C.border, backgroundColor: C.surface }}
                  >
                    <Icon
                      className="w-6 h-6 md:w-7 md:h-7"
                      style={{ color: C.gold }}
                      strokeWidth={1.2}
                    />
                  </div>
                  <span
                    className="text-[11px] tracking-[0.25em] uppercase font-medium"
                    style={{ color: C.muted }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ===== FINAL CTA ===== */}
          <section
            className="border-t py-20 md:py-28"
            style={{
              borderColor: C.border,
              background: `linear-gradient(180deg, ${C.bg} 0%, ${C.surface} 100%)`,
            }}
          >
            <div className="container mx-auto px-5 md:px-8 text-center max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-12" style={{ backgroundColor: C.gold }} />
                <span
                  className="text-[10px] tracking-[0.4em] uppercase font-semibold"
                  style={{ color: C.gold }}
                >
                  Limitiert
                </span>
                <div className="h-px w-12" style={{ backgroundColor: C.gold }} />
              </div>
              <h2
                className="text-4xl md:text-6xl font-extralight tracking-tight leading-[1.1] mb-6"
                style={{ color: C.beige }}
              >
                Sei einer der<br />
                <span style={{ fontStyle: "italic", color: C.gold }}>
                  ersten 100.
                </span>
              </h2>
              <p
                className="text-base md:text-lg font-light leading-relaxed mb-10"
                style={{ color: C.muted }}
              >
                Early Access. Persönliche Nummer auf der Verpackung. CHF 99.– statt 149.–
              </p>
              <button
                className="group inline-flex items-center gap-3 px-10 py-5 text-[13px] tracking-[0.3em] uppercase font-semibold transition-all duration-500 hover:shadow-[0_0_60px_rgba(201,168,118,0.4)]"
                style={{ backgroundColor: C.gold, color: C.bg }}
              >
                Platz reservieren
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </section>

          {/* ===== FOOTER ===== */}
          <footer
            className="border-t py-10"
            style={{ borderColor: C.border, backgroundColor: C.bg }}
          >
            <div
              className="container mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-wider"
              style={{ color: C.mutedDim }}
            >
              <div className="tracking-[0.4em]" style={{ color: C.muted }}>
                RAJ · SWITZERLAND
              </div>
              <div>© 2026 — Power. Always There.</div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default MockupDarkPage;

import { useEffect, useState, useCallback, FormEvent, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Smartphone, Headphones, Watch, Mail, Loader2, Check, ArrowRight,
  ShieldCheck, Truck, RotateCcw, Plus, Hash, Tag, Gift,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackMetaEvent } from "@/lib/meta-pixel";

// Echte Shop-Bilder (1:1 mit raj.ch)
import nexusHero from "@/assets/products/nexus-real-3quarter-white.jpg";
import nexusHeroDark from "@/assets/products/nexus-real-night-city.webp";
import nexusFolds from "@/assets/products/nexus-real-folds-text.webp";
import nexusDesk from "@/assets/products/nexus-real-desk-office.webp";
import nexusTopview from "@/assets/products/nexus-real-topview-qi2.jpg";
import nexusFeatures from "@/assets/products/nexus-real-features.jpg";
import nexusWindow from "@/assets/products/nexus-real-window.jpg";
import nexusSofa from "@/assets/products/nexus-real-lifestyle-sofa.jpg";
import logo from "@/assets/logo-new.webp";

/**
 * MOCKUP — Apple × Rolex Positioning
 * Dark Hero → Light Trust → Dark Story → Light Specs → Light FAQ → Dark CTA
 * Lives at /mockup-dark. Does NOT touch live LaunchPage.
 *
 * Positioning Doctrine:
 * - Kein Vergleich. Premium-Marken vergleichen sich nicht — sie definieren.
 * - Keine "vs. Anker / Belkin". Apple zeigt nicht Samsung. Rolex zeigt nicht Casio.
 * - Produkt als Objekt. Stille. Raum. Material.
 * - Eine Aussage pro Sektion. Atmen lassen.
 */

// Palette
const D = {
  bg: "#0A0A0A",
  surface: "#141312",
  surfaceHi: "#1C1A18",
  beige: "#E8DCC4",
  muted: "#A89B82",
  mutedDim: "#6E665A",
  gold: "#C9A876",
  border: "#26221E",
};
const L = {
  bg: "#FAF8F5",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#6B6358",
  textDim: "#9A9285",
  gold: "#9b6b3f",
  border: "#E8E2D6",
};

const LAUNCH_DATE = new Date("2026-05-06T20:00:00+02:00").getTime();
const getSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

// ─────────────────────────────────────────────────────────────────
// COUNTDOWN (theme-aware)
// ─────────────────────────────────────────────────────────────────
const Countdown = ({ dark = true }: { dark?: boolean }) => {
  const { t } = useLanguage();
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setTime({
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
    { v: time.d, l: t("countdown.days") },
    { v: time.h, l: t("countdown.hours") },
    { v: time.m, l: t("countdown.minutes") },
    { v: time.s, l: t("countdown.seconds") },
  ];

  const numColor = dark ? D.beige : L.text;
  const labelColor = dark ? D.gold : L.gold;

  return (
    <div className="flex justify-center gap-5 sm:gap-7">
      {units.map((u, i) => (
        <div key={u.l} className="flex flex-col items-center min-w-[44px]">
          <span
            className="text-3xl sm:text-4xl md:text-5xl tabular-nums leading-none tracking-tight"
            style={{ color: numColor, fontWeight: 300, fontVariantNumeric: "tabular-nums" }}
          >
            {String(u.v).padStart(2, "0")}
          </span>
          <span
            className="text-[9px] sm:text-[10px] uppercase mt-2 font-medium"
            style={{ color: labelColor, letterSpacing: "0.28em" }}
          >
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// SIGNUP (used in hero + final CTA)
// ─────────────────────────────────────────────────────────────────
const SignupForm = ({ dark = true, onSuccess }: { dark?: boolean; onSuccess?: () => void }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [hp1, setHp1] = useState("");
  const [hp2, setHp2] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (hp1 || hp2) { setDone(true); return; }
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setDone(true);
        trackMetaEvent("Lead", { email: email.trim() });
        onSuccess?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div
        className="flex items-center justify-center gap-3 px-6 py-4 rounded-full"
        style={{
          background: dark ? "rgba(201,168,118,0.12)" : "rgba(155,107,63,0.08)",
          border: `1px solid ${dark ? D.gold : L.gold}`,
          color: dark ? D.beige : L.text,
        }}
      >
        <Check className="w-4 h-4" style={{ color: dark ? D.gold : L.gold }} />
        <span className="text-sm font-medium tracking-wide">Du bist auf der Liste.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md mx-auto">
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <input value={hp1} onChange={(e) => setHp1(e.target.value)} tabIndex={-1} autoComplete="off" />
        <input value={hp2} onChange={(e) => setHp2(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <div
        className="flex items-center gap-1 p-1.5 rounded-full"
        style={{
          background: dark ? "rgba(232,220,196,0.06)" : "#FFFFFF",
          border: `1px solid ${dark ? D.border : L.border}`,
          backdropFilter: "blur(12px)",
        }}
      >
        <Mail className="w-4 h-4 ml-4 shrink-0" style={{ color: dark ? D.muted : L.textMuted }} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.ch"
          className="flex-1 bg-transparent outline-none px-3 py-3 text-sm"
          style={{ color: dark ? D.beige : L.text }}
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.18em] transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{
            background: dark ? D.beige : L.text,
            color: dark ? D.bg : L.bg,
          }}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Sichern <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </div>
      <p
        className="text-[10px] uppercase tracking-[0.22em] text-center mt-4"
        style={{ color: dark ? D.mutedDim : L.textDim }}
      >
        Unverbindlich · Jederzeit abmeldbar
      </p>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
const MockupDarkPage = () => {
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — Mockup Editorial Dark</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Sticky Comparison Bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-2.5 text-xs"
        style={{ background: D.bg, borderBottom: `1px solid ${D.border}`, color: D.muted }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: D.gold, letterSpacing: "0.28em" }} className="uppercase font-semibold">Mockup</span>
          <span className="hidden sm:inline" style={{ color: D.mutedDim }}>Editorial · Apple × Rolex</span>
        </div>
        <Link to="/" className="underline underline-offset-4 hover:opacity-80" style={{ color: D.beige }}>
          ← Live-Version vergleichen
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO — DARK · Stille, Objekt, Begehren                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: D.bg, color: D.beige }}
      >
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-5 sm:px-10 py-5">
          <img src={logo} alt="RAJ" className="h-7 w-auto opacity-90" style={{ filter: "invert(1) brightness(1.1)" }} />
          <nav className="flex items-center gap-1 text-[11px]">
            {(["de", "fr", "it"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2 py-1 uppercase tracking-widest transition-colors"
                style={{
                  color: lang === l ? D.beige : D.mutedDim,
                  fontWeight: lang === l ? 600 : 400,
                }}
              >
                {l}
              </button>
            ))}
          </nav>
        </header>

        {/* Hero content */}
        <div className="relative px-5 sm:px-10 pt-8 sm:pt-12 pb-20 sm:pb-32 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left: editorial copy */}
            <div className="md:col-span-5 md:pr-4 relative z-10">
              <span
                className="inline-block text-[10px] uppercase mb-6"
                style={{ color: D.gold, letterSpacing: "0.32em" }}
              >
                — Edition 01 · Mai 2026
              </span>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight"
                style={{ color: D.beige, fontWeight: 300 }}
              >
                Power.<br />
                <span style={{ fontStyle: "italic", fontWeight: 200 }}>Always</span><br />
                <span style={{ color: D.gold }}>There.</span>
              </h1>
              <div className="w-12 h-px my-8" style={{ background: D.gold }} />
              <p
                className="text-base sm:text-lg leading-relaxed max-w-md"
                style={{ color: D.muted, fontWeight: 300 }}
              >
                Drei Geräte. Ein Objekt. Kein Kabel.
                Qi2.2 zertifiziert. Schweizer Idee.
              </p>

              <div className="mt-10 hidden md:block">
                <Countdown dark />
              </div>
            </div>

            {/* Right: product as art object */}
            <div className="md:col-span-7 relative">
              {/* Gold halo */}
              <div
                className="absolute inset-0 rounded-full blur-[100px] opacity-50 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${D.gold}, transparent 65%)` }}
                aria-hidden
              />
              <img
                src={nexusHeroDark}
                alt="RAJ NEXUS in der Nacht"
                className="relative w-full aspect-[4/5] sm:aspect-[5/4] object-cover rounded-sm"
                style={{ boxShadow: "0 60px 120px -40px rgba(0,0,0,0.8)" }}
              />

              {/* Floating spec card */}
              <div
                className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 px-5 py-4 rounded-sm max-w-[200px]"
                style={{
                  background: "rgba(10,10,10,0.7)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${D.border}`,
                }}
              >
                <div className="text-[9px] uppercase mb-1" style={{ color: D.gold, letterSpacing: "0.28em" }}>
                  Qi 2.2 · 25W
                </div>
                <div className="text-xl font-light" style={{ color: D.beige }}>
                  CHF 99.–
                </div>
                <div className="text-[10px] mt-1" style={{ color: D.mutedDim }}>
                  Early Access · Limitiert auf 100
                </div>
              </div>
            </div>
          </div>

          {/* Mobile countdown */}
          <div className="mt-12 md:hidden">
            <Countdown dark />
          </div>
        </div>

        {/* Hairline gold divider */}
        <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${D.gold}, transparent)`, opacity: 0.4 }} />
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. TRUST — LIGHT · Drei Versprechen                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg, color: L.text }} className="py-20 md:py-32 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Drei Geräte · Ein Ort
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
              Alles was du am Bett brauchst.<br />
              <span style={{ fontStyle: "italic", color: L.textMuted }}>Nichts mehr.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              { icon: Smartphone, label: "iPhone", spec: "15W MagSafe" },
              { icon: Watch, label: "Apple Watch", spec: "Schnellladung" },
              { icon: Headphones, label: "AirPods", spec: "Qi2 Pad" },
            ].map((d) => (
              <div key={d.label} className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5"
                  style={{ background: "#FFFFFF", border: `1px solid ${L.border}` }}
                >
                  <d.icon className="w-6 h-6" style={{ color: L.gold }} strokeWidth={1.3} />
                </div>
                <div className="text-lg font-light tracking-tight">{d.label}</div>
                <div className="text-xs mt-1" style={{ color: L.textDim, letterSpacing: "0.16em" }}>
                  {d.spec.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-20 md:mt-28 grid grid-cols-3 gap-4 max-w-3xl mx-auto pt-10" style={{ borderTop: `1px solid ${L.border}` }}>
            {[
              { icon: ShieldCheck, label: "3 Jahre Garantie" },
              { icon: Truck, label: "Gratis Versand CH" },
              { icon: RotateCcw, label: "30 Tage Rückgabe" },
            ].map((it) => (
              <div key={it.label} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
                <it.icon className="w-4 h-4 shrink-0" style={{ color: L.gold }} strokeWidth={1.5} />
                <span className="text-[11px] sm:text-xs uppercase" style={{ color: L.textMuted, letterSpacing: "0.18em" }}>
                  {it.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. STORY — DARK · Editorial Zickzack mit echten Bildern    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: D.bg, color: D.beige }} className="py-24 md:py-36 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 md:mb-28">
            <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
              — Drei Momente
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
              Mehr als ein Ladegerät.
            </h2>
          </div>

          <div className="space-y-28 md:space-y-40">
            {[
              {
                img: nexusFolds,
                idx: "01",
                eyebrow: "Für Vielreisende",
                title: "Faltet sich. Lädt überall.",
                copy: "Hotelzimmer. Lounge. Airbnb. Eine Bewegung — aufgeklappt. iPhone, Watch, AirPods. Alle gleichzeitig.",
              },
              {
                img: nexusDesk,
                idx: "02",
                eyebrow: "Für die, die Ordnung lieben",
                title: "Drei Kabel weg. Ein Objekt da.",
                copy: "Kein Kabelsalat. Kein Suchen. Ein einziger Ort — alles geladen, alles bereit.",
              },
              {
                img: nexusWindow,
                idx: "03",
                eyebrow: "Für die späten Abende",
                title: "Hinlegen. Aufwachen mit 100 %.",
                copy: "Telefon drauf — magnetisch klick. Morgens: voll geladen, bereit für den Tag.",
              },
            ].map((s, i) => {
              const right = i % 2 === 1;
              return (
                <div key={s.idx} className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
                  <div className={`md:col-span-7 relative ${right ? "md:order-2" : ""}`}>
                    <div className="relative">
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover rounded-sm"
                        style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)" }}
                      />
                      {/* Gradient vignette */}
                      <div
                        className="absolute inset-0 rounded-sm pointer-events-none"
                        style={{ background: `linear-gradient(135deg, transparent 60%, rgba(10,10,10,0.4))` }}
                      />
                    </div>
                  </div>
                  <div className={`md:col-span-5 ${right ? "md:order-1 md:text-right" : ""}`}>
                    <div className="flex items-center gap-3 mb-5" style={{ justifyContent: right ? "flex-end" : "flex-start" }}>
                      <span className="text-5xl md:text-6xl font-extralight tabular-nums" style={{ color: D.gold }}>
                        {s.idx}
                      </span>
                      <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
                        {s.eyebrow}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl leading-tight tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
                      {s.title}
                    </h3>
                    <div className={`w-10 h-px my-5 ${right ? "ml-auto" : ""}`} style={{ background: D.gold }} />
                    <p className="text-base leading-relaxed max-w-md" style={{ color: D.muted, fontWeight: 300, marginLeft: right ? "auto" : 0 }}>
                      {s.copy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. SPECS — LIGHT · Material, Maß, Wahrheit                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg, color: L.text }} className="py-24 md:py-36 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Spezifikationen
            </span>
            <h2 className="text-3xl md:text-5xl mt-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
              Präzision in Zahlen.
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Image */}
            <div className="md:col-span-6">
              <img
                src={nexusTopview}
                alt="RAJ NEXUS Top View"
                className="w-full aspect-square object-cover rounded-sm"
                style={{ boxShadow: "0 30px 80px -30px rgba(26,26,26,0.25)" }}
              />
            </div>
            {/* Specs */}
            <div className="md:col-span-6">
              <dl className="space-y-0">
                {[
                  ["Standard", "Qi2.2 · WPC zertifiziert"],
                  ["Leistung", "25 W Schnellladung"],
                  ["Geräte", "iPhone · Watch · AirPods"],
                  ["Material", "Aluminium · Premium-Gewebe"],
                  ["Garantie", "3 Jahre Schweizer Service"],
                  ["Sicherheit", "Überhitzungs- & Überladeschutz"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between items-baseline py-4"
                    style={{ borderBottom: `1px solid ${L.border}` }}
                  >
                    <dt className="text-[11px] uppercase" style={{ color: L.textDim, letterSpacing: "0.2em" }}>
                      {k}
                    </dt>
                    <dd className="text-sm md:text-base text-right" style={{ color: L.text, fontWeight: 400 }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Conviction line */}
          <div className="text-center mt-20 md:mt-28 max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl leading-relaxed tracking-tight" style={{ fontWeight: 300, color: L.text }}>
              {t("launch.conviction2.bold")}
            </p>
            <p className="text-sm md:text-base italic mt-4" style={{ color: L.textMuted }}>
              {t("launch.conviction2.sub")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. WHY RAJ — LIGHT · Markenphilosophie (statt Vergleich)   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#F2EDE3", color: L.text }} className="py-20 md:py-32 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
            — {t("why.title")} RAJ?
          </span>
          <h2 className="text-3xl md:text-5xl mt-6 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
            Wir vergleichen uns nicht.<br />
            <span style={{ fontStyle: "italic", color: L.textMuted }}>Wir definieren.</span>
          </h2>
          <div className="w-12 h-px mx-auto my-8" style={{ background: L.gold }} />
          <p className="text-base md:text-lg leading-relaxed" style={{ color: L.textMuted, fontWeight: 300 }}>
            {t("why.text")}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. FAQ — LIGHT · Klarheit                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: L.bg }} className="py-20 md:py-32 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <span className="text-[10px] uppercase" style={{ color: L.gold, letterSpacing: "0.32em" }}>
              — Klarheit
            </span>
            <h2 className="text-3xl md:text-4xl mt-5 leading-tight tracking-tight" style={{ color: L.text, fontWeight: 300 }}>
              {t("faq.title")}
            </h2>
          </div>

          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <details key={n} className="group" style={{ borderBottom: `1px solid ${L.border}` }}>
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                  <span className="text-[15px] md:text-base pr-6" style={{ color: L.text, fontWeight: 400 }}>
                    {t(`faq.q${n}`)}
                  </span>
                  <Plus
                    className="w-4 h-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
                    style={{ color: L.gold }}
                    strokeWidth={1.5}
                  />
                </summary>
                <div className="pb-6 pr-10">
                  <p className="text-sm leading-relaxed" style={{ color: L.textMuted, fontWeight: 300 }}>
                    {t(`faq.a${n}`)}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-xs" style={{ color: L.textMuted }}>{t("faq.contact.lead")}</p>
            <a
              href="mailto:founder@raj.ch"
              className="inline-block mt-2 text-sm font-medium underline underline-offset-4"
              style={{ color: L.text, textDecorationColor: L.gold }}
            >
              founder@raj.ch
            </a>
            <p className="text-[10px] mt-2 uppercase" style={{ color: L.textDim, letterSpacing: "0.18em" }}>
              {t("faq.contact.sub")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. FINAL CTA — DARK · Begehren in Aktion                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-36 px-5"
        style={{ background: D.bg, color: D.beige }}
      >
        {/* Background image faded */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img src={nexusSofa} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${D.bg} 0%, rgba(10,10,10,0.7) 50%, ${D.bg} 100%)` }} />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <span className="text-[10px] uppercase" style={{ color: D.gold, letterSpacing: "0.32em" }}>
            — Edition 01 · Limitiert auf 100
          </span>
          <h2 className="text-4xl md:text-6xl mt-6 leading-[1.05] tracking-tight" style={{ color: D.beige, fontWeight: 300 }}>
            Sei unter den<br />
            <span style={{ fontStyle: "italic", color: D.gold }}>ersten Hundert.</span>
          </h2>
          <div className="w-12 h-px mx-auto my-8" style={{ background: D.gold }} />
          <p className="text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10" style={{ color: D.muted, fontWeight: 300 }}>
            Early Access Mai 2026. CHF 99.– statt regulärem Preis.
            Priorität bei der Auslieferung.
          </p>

          <div className="mb-10">
            <Countdown dark />
          </div>

          <SignupForm dark />

          <div className="mt-12 flex items-center justify-center gap-2 text-[10px] uppercase" style={{ color: D.mutedDim, letterSpacing: "0.22em" }}>
            <ShieldCheck className="w-3 h-3" style={{ color: D.gold }} />
            <span>Schweizer Brand · Weltweit zertifiziert</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: D.bg, borderTop: `1px solid ${D.border}` }} className="py-10 px-5 text-center">
        <img src={logo} alt="RAJ" className="h-7 w-auto mx-auto opacity-60" style={{ filter: "invert(1)" }} />
        <p className="text-[10px] uppercase mt-4" style={{ color: D.gold, letterSpacing: "0.28em" }}>
          Power. Always There.
        </p>
        <p className="text-[10px] mt-3" style={{ color: D.mutedDim }}>
          © {new Date().getFullYear()} RAJ GmbH (in Gründung)
        </p>
      </footer>
    </>
  );
};

export default MockupDarkPage;

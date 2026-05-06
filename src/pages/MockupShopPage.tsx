import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Zap, Plus, Package, Check, ShoppingBag, ArrowLeft } from "lucide-react";
import nexusReal from "@/assets/products/nexus-real-night-city.webp";
import logo from "@/assets/logo-new.webp";

/**
 * MOCKUP SHOP — Wegweiser im Stil des Referenzbildes.
 * Dark editorial · Produkt links · Spec-Liste rechts · Gold-CTA.
 * Lebt unter /mockup-shop. Ändert nichts am echten Shop.
 */

const D = {
  bg: "#0A0A0A",
  surface: "#141312",
  beige: "#E8DCC4",
  text: "#F5EFE2",
  muted: "#A89B82",
  mutedDim: "#6E665A",
  gold: "#C9A876",
  goldDeep: "#9b6b3f",
  border: "#26221E",
};

const MockupShopPage = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const specs = [
    { icon: Zap, title: "25W Qi 2.2", sub: "Schnellstes kabelloses Laden" },
    { icon: Plus, title: "Designed in Switzerland", sub: "Präzision. Qualität. Vertrauen." },
    { icon: Package, title: "Kostenloser Versand", sub: "In der ganzen Schweiz" },
  ];

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS · Shop Mockup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen" style={{ background: D.bg, color: D.text }}>
        {/* ─── Sticky comparison bar (back to live) ─────────────────── */}
        <div
          className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? `1px solid ${D.border}` : "1px solid transparent",
          }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-3 flex items-center justify-between text-[11px]">
            <Link to="/mockup-dark" className="flex items-center gap-2" style={{ color: D.muted }}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="uppercase" style={{ letterSpacing: "0.2em" }}>Mockup Launch</span>
            </Link>
            <span className="uppercase font-medium" style={{ color: D.gold, letterSpacing: "0.28em" }}>
              Shop · Mockup
            </span>
            <Link to="/" style={{ color: D.muted }} className="uppercase" >
              <span style={{ letterSpacing: "0.2em" }}>Live →</span>
            </Link>
          </div>
        </div>

        {/* ─── Header ──────────────────────────────────────────────── */}
        <header className="relative z-20 max-w-7xl mx-auto px-5 sm:px-10 pt-16 pb-6 flex items-center justify-between">
          <a
            href="https://raj.ch"
            aria-label="RAJ — Home"
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md"
            style={{ background: D.beige }}
          >
            <img src={logo} alt="RAJ" className="h-6 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-medium" style={{ letterSpacing: "0.28em" }}>
            {["Produkte", "Über RAJ", "Technologie", "Kontakt"].map((l) => (
              <a key={l} href="#" className="uppercase transition-colors hover:opacity-80" style={{ color: D.text }}>
                {l}
              </a>
            ))}
          </nav>
          <button aria-label="Warenkorb" className="transition-opacity hover:opacity-80">
            <ShoppingBag className="w-5 h-5" style={{ color: D.gold }} strokeWidth={1.5} />
          </button>
        </header>

        {/* ─── HERO PRODUCT ────────────────────────────────────────── */}
        <section className="relative max-w-7xl mx-auto px-5 sm:px-10 pt-6 sm:pt-10 pb-24">
          {/* ambient gold haze */}
          <div
            className="absolute right-0 top-1/3 w-[600px] h-[600px] pointer-events-none opacity-[0.12]"
            style={{ background: `radial-gradient(circle, ${D.gold} 0%, transparent 65%)` }}
            aria-hidden
          />

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
            {/* LEFT — product image */}
            <div className="md:col-span-7 relative">
              <div
                className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden rounded-sm"
                style={{ boxShadow: "0 60px 140px -40px rgba(0,0,0,0.85)" }}
              >
                <img
                  src={nexusReal}
                  alt="RAJ NEXUS 3-in-1 Wireless Charger mit Lavasteinen"
                  loading="eager"
                  decoding="sync"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* subtle vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }}
                  aria-hidden
                />
              </div>

              {/* tagline bottom-left, like reference */}
              <div className="mt-8 sm:mt-10">
                <p className="text-[11px] uppercase font-medium" style={{ letterSpacing: "0.32em", color: D.muted }}>
                  Engineered for <span style={{ color: D.gold }}>Performance.</span>
                </p>
                <p className="text-[11px] uppercase font-medium mt-1.5" style={{ letterSpacing: "0.32em", color: D.muted }}>
                  Designed to <span style={{ color: D.gold }}>Inspire.</span>
                </p>
                <div className="w-10 h-px mt-4" style={{ background: D.gold }} />
              </div>
            </div>

            {/* RIGHT — product info */}
            <div className="md:col-span-5">
              {/* Eyebrow */}
              <p
                className="text-[10px] sm:text-[11px] uppercase font-semibold mb-6"
                style={{ color: D.gold, letterSpacing: "0.32em" }}
              >
                Founder Edition — Nur 100 Stück
              </p>

              {/* Title */}
              <h1
                className="text-5xl sm:text-6xl md:text-[68px] leading-[0.95] tracking-[-0.02em]"
                style={{ color: D.text, fontWeight: 300 }}
              >
                RAJ NEXUS
              </h1>
              <p
                className="mt-4 text-lg sm:text-xl"
                style={{ color: D.muted, fontWeight: 300, letterSpacing: "0.005em" }}
              >
                3-in-1 Qi 2.2 Wireless Charger
              </p>

              {/* Spec list */}
              <ul className="mt-10 space-y-0">
                {specs.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex items-start gap-5 py-5"
                    style={{ borderTop: i === 0 ? `1px solid ${D.border}` : "none", borderBottom: `1px solid ${D.border}` }}
                  >
                    <div
                      className="w-11 h-11 rounded-sm flex items-center justify-center shrink-0"
                      style={{ border: `1px solid ${D.gold}55`, background: `${D.gold}0d` }}
                    >
                      <s.icon className="w-5 h-5" style={{ color: D.gold }} strokeWidth={1.6} />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-[15px] sm:text-base font-medium" style={{ color: D.text }}>
                        {s.title}
                      </p>
                      <p className="text-[13px] mt-0.5" style={{ color: D.mutedDim, fontWeight: 300 }}>
                        {s.sub}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="mt-10 flex items-baseline gap-3">
                <span
                  className="text-5xl sm:text-6xl tabular-nums"
                  style={{ color: D.gold, fontWeight: 300, letterSpacing: "-0.02em" }}
                >
                  CHF 99
                </span>
                <span className="text-base" style={{ color: D.mutedDim, fontWeight: 300 }}>
                  inkl. MwSt
                </span>
              </div>

              {/* CTA */}
              <button
                className="mt-6 w-full py-5 rounded-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-px"
                style={{
                  background: `linear-gradient(180deg, ${D.gold} 0%, ${D.goldDeep} 100%)`,
                  color: "#1a1410",
                  letterSpacing: "0.28em",
                  fontSize: "13px",
                  fontWeight: 600,
                  boxShadow: `0 20px 50px -15px ${D.gold}66`,
                }}
              >
                JETZT BESTELLEN
              </button>

              {/* Reassurance */}
              <div className="mt-5 flex items-center gap-2.5">
                <Check className="w-4 h-4" style={{ color: D.gold }} strokeWidth={2} />
                <span className="text-[12px] uppercase font-medium" style={{ color: D.muted, letterSpacing: "0.24em" }}>
                  14 Tage Rückgaberecht
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Hairline divider ───────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${D.gold}66, transparent)` }} />
        </div>

        {/* ─── Footer note ────────────────────────────────────────── */}
        <footer className="max-w-7xl mx-auto px-5 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase" style={{ letterSpacing: "0.28em", color: D.mutedDim }}>
          <span>© RAJ Switzerland</span>
          <span>Mockup · Wegweiser für Shop-Look</span>
        </footer>
      </div>
    </>
  );
};

export default MockupShopPage;

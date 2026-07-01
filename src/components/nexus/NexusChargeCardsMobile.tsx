import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only 3-card snap carousel showing live charging animations
 * for iPhone / Apple Watch / AirPods. Mirrors the floating ChargeChips
 * shown around the desktop hero image, redesigned for mobile.
 *
 * Performance rules:
 * - Pure CSS scroll-snap (no carousel library, ~0 extra JS)
 * - Animation only starts when component enters viewport (IntersectionObserver)
 * - Respects prefers-reduced-motion (static full state)
 * - contain: layout paint on each card
 */

const GOLD = "#C9A876";
const BEIGE = "#F5EFE6";
const MUTED = "#9c928a";
const MUTED_DIM = "#6a625c";

const IconPhone = () => (
  <svg width="14" height="18" viewBox="0 0 12 18" fill="none" aria-hidden>
    <rect x=".7" y=".7" width="10.6" height="16.6" rx="2.4" stroke={GOLD} strokeWidth="1.1" />
    <rect x="4" y="2.4" width="4" height="1" rx=".5" fill={GOLD} />
  </svg>
);
const IconWatch = () => (
  <svg width="15" height="17" viewBox="0 0 14 16" fill="none" aria-hidden>
    <rect x="3" y="3.6" width="8" height="8.8" rx="2.4" stroke={GOLD} strokeWidth="1.1" />
    <path d="M5 3.6 5.4 1.4h3.2L9 3.6M5 12.4l.4 2.2h3.2l.4-2.2" stroke={GOLD} strokeWidth="1.1" />
  </svg>
);
const IconPods = () => (
  <svg width="17" height="13" viewBox="0 0 16 12" fill="none" aria-hidden>
    <rect x="1.2" y="3" width="5" height="6" rx="2.3" stroke={GOLD} strokeWidth="1.1" />
    <rect x="9.8" y="3" width="5" height="6" rx="2.3" stroke={GOLD} strokeWidth="1.1" />
  </svg>
);

interface CardDef {
  label: string;
  sub: string;
  icon: React.ReactNode;
  start: number;
  delay: number;
  power: string;
}

const CARDS: CardDef[] = [
  { label: "iPhone", sub: "MagSafe · 15 W", icon: <IconPhone />, start: 58, delay: 0, power: "25 W" },
  { label: "Apple Watch", sub: "Fast Charge", icon: <IconWatch />, start: 79, delay: 900, power: "5 W" },
  { label: "AirPods Pro", sub: "Qi Wireless", icon: <IconPods />, start: 71, delay: 1600, power: "5 W" },
];

function ChargeCard({ card, active }: { card: CardDef; active: boolean }) {
  const [val, setVal] = useState(card.start);

  useEffect(() => {
    if (!active) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVal(100);
      return;
    }
    let interval: number | undefined;
    const t = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setVal((v) => {
          if (v >= 100) {
            if (interval) window.clearInterval(interval);
            return v;
          }
          return Math.min(100, v + Math.floor(Math.random() * 2 + 1));
        });
      }, 1400);
    }, card.delay);
    return () => {
      window.clearTimeout(t);
      if (interval) window.clearInterval(interval);
    };
  }, [active, card.delay]);

  return (
    <div
      style={{
        flex: "0 0 85%",
        scrollSnapAlign: "center",
        contain: "layout paint",
        padding: "16px 18px",
        borderRadius: 18,
        background: "linear-gradient(160deg, rgba(28,25,22,.92), rgba(18,17,16,.92))",
        border: "1px solid rgba(201,168,118,.24)",
        boxShadow: "0 18px 40px -14px rgba(0,0,0,.7)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(201,168,118,.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {card.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: BEIGE, fontWeight: 500, lineHeight: 1.1 }}>{card.label}</div>
          <div style={{ fontSize: 10, color: MUTED_DIM, marginTop: 2, letterSpacing: ".02em" }}>{card.sub}</div>
        </div>
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            color: GOLD,
            padding: "3px 7px",
            borderRadius: 100,
            background: "rgba(201,168,118,.1)",
            border: "1px solid rgba(201,168,118,.25)",
            letterSpacing: ".05em",
          }}
        >
          {card.power}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 34,
            fontWeight: 200,
            fontVariantNumeric: "tabular-nums",
            color: BEIGE,
            lineHeight: 1,
            letterSpacing: "-.02em",
          }}
        >
          {val}
        </span>
        <span style={{ fontSize: 15, color: MUTED_DIM, fontWeight: 300 }}>%</span>
        {val >= 100 && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 9.5,
              color: "#7ac47f",
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            ✓ Voll
          </span>
        )}
      </div>

      <div
        style={{
          height: 3,
          borderRadius: 3,
          background: "rgba(255,255,255,.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${val}%`,
            borderRadius: 3,
            background: `linear-gradient(90deg, #7a4e2a, ${GOLD})`,
            transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}

export default function NexusChargeCardsMobile() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Start animations only when carousel is in view
  useEffect(() => {
    if (!rootRef.current || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [visible]);

  // Track active card via scroll position
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const idx = Math.round(el.scrollLeft / (w * 0.85));
        setActiveIdx(Math.max(0, Math.min(CARDS.length - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="md:hidden" style={{ marginTop: 14, marginBottom: 6 }} aria-label="Live-Ladevorgang">
      <div
        ref={scrollerRef}
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          padding: "2px 8%",
          WebkitOverflowScrolling: "touch",
        }}
        className="scrollbar-hide"
      >
        {CARDS.map((c, i) => (
          <ChargeCard key={c.label} card={c} active={visible} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {CARDS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Karte ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              height: 5,
              width: i === activeIdx ? 20 : 5,
              borderRadius: 5,
              padding: 0,
              border: "none",
              background: i === activeIdx ? GOLD : "rgba(201,168,118,.3)",
              transition: "width 300ms ease, background 300ms ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

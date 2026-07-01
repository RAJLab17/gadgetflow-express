import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only floating charge chips — overlay on top of the hero image.
 * Mirrors the desktop ChargeChip floaters, but compact so they fit on 411px.
 *
 * Performance:
 * - Animation only starts when parent is in viewport (IntersectionObserver)
 * - Pure CSS float animation (keyframes defined globally as raj-float*)
 * - Respects prefers-reduced-motion
 */

const GOLD = "#C9A876";
const BEIGE = "#F5EFE6";
const MUTED_DIM = "#6a625c";

const IconPhone = () => (
  <svg width="10" height="14" viewBox="0 0 12 18" fill="none" aria-hidden>
    <rect x=".7" y=".7" width="10.6" height="16.6" rx="2.4" stroke={GOLD} strokeWidth="1.1" />
    <rect x="4" y="2.4" width="4" height="1" rx=".5" fill={GOLD} />
  </svg>
);
const IconWatch = () => (
  <svg width="11" height="13" viewBox="0 0 14 16" fill="none" aria-hidden>
    <rect x="3" y="3.6" width="8" height="8.8" rx="2.4" stroke={GOLD} strokeWidth="1.1" />
    <path d="M5 3.6 5.4 1.4h3.2L9 3.6M5 12.4l.4 2.2h3.2l.4-2.2" stroke={GOLD} strokeWidth="1.1" />
  </svg>
);
const IconPods = () => (
  <svg width="13" height="10" viewBox="0 0 16 12" fill="none" aria-hidden>
    <rect x="1.2" y="3" width="5" height="6" rx="2.3" stroke={GOLD} strokeWidth="1.1" />
    <rect x="9.8" y="3" width="5" height="6" rx="2.3" stroke={GOLD} strokeWidth="1.1" />
  </svg>
);

interface ChipProps {
  label: string;
  icon: React.ReactNode;
  startVal: number;
  phase: number;
  floatAnim: string;
  style: React.CSSProperties;
  active: boolean;
}

function MiniChip({ label, icon, startVal, phase, floatAnim, style, active }: ChipProps) {
  const [val, setVal] = useState(startVal);

  useEffect(() => {
    if (!active) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVal(100);
      return;
    }
    const delay = phase * 2500;
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
      }, 1600);
    }, delay);
    return () => {
      window.clearTimeout(t);
      if (interval) window.clearInterval(interval);
    };
  }, [active, phase]);

  return (
    <div
      style={{
        position: "absolute",
        padding: "6px 8px",
        borderRadius: 11,
        background: "rgba(18,17,16,.86)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(201,168,118,.28)",
        boxShadow: "0 10px 22px rgba(0,0,0,.55)",
        minWidth: 78,
        animation: active ? `${floatAnim} ease-in-out infinite` : "none",
        zIndex: 5,
        contain: "layout paint",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 5,
            background: "rgba(201,168,118,.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 9.5, color: BEIGE, fontWeight: 500, letterSpacing: ".01em" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 300,
            fontVariantNumeric: "tabular-nums",
            color: BEIGE,
            lineHeight: 1,
          }}
        >
          {val}
        </span>
        <span style={{ fontSize: 9, color: MUTED_DIM }}>%</span>
      </div>
      <div
        style={{
          marginTop: 4,
          height: 2,
          borderRadius: 2,
          background: "rgba(255,255,255,.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${val}%`,
            borderRadius: 2,
            background: `linear-gradient(90deg, #7a4e2a, ${GOLD})`,
            transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}

export default function NexusHeroChipsMobile() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.2 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div
      ref={rootRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}
      aria-hidden
    >
      <MiniChip
        label="iPhone"
        icon={<IconPhone />}
        startVal={58}
        phase={0}
        floatAnim="raj-float 6s"
        style={{ top: "6%", left: "8%" }}
        active={visible}
      />
      <MiniChip
        label="Watch"
        icon={<IconWatch />}
        startVal={79}
        phase={0.4}
        floatAnim="raj-float2 7s"
        style={{ top: "16%", right: "3%" }}
        active={visible}
      />
      <MiniChip
        label="AirPods"
        icon={<IconPods />}
        startVal={71}
        phase={0.75}
        floatAnim="raj-float 6.5s"
        style={{ bottom: "8%", left: "3%" }}
        active={visible}
      />
    </div>
  );
}

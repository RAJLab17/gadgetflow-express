interface Qi2CertifiedBadgeProps {
  size?: number;
  gold?: string;
  /** Compact = mark only (no wordmark). Default false shows the pill with label. */
  compact?: boolean;
}

/**
 * Qi2 · 25W certification mark, drawn as inline SVG.
 * Zero network cost (no image request), crisp at any DPR, respects the dark
 * premium theme. Shape follows the official Qi2 wordmark: lowercase "q" with
 * a dot above and a circle behind the stem (wireless nod), an oversized "2",
 * and a small "25W" wattage tag anchored under the 2.
 */
export default function Qi2CertifiedBadge({
  size = 44,
  gold = "#C9A876",
  compact = false,
}: Qi2CertifiedBadgeProps) {
  // Mark itself — a square SVG sized to `size`.
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      role="img"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="qi2-fill" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#efe6d7" />
        </linearGradient>
      </defs>

      {/* ── q: circular bowl + descender stem ───────────────────────── */}
      {/* Bowl (ring) */}
      <circle cx="42" cy="55" r="22" stroke="url(#qi2-fill)" strokeWidth="7" fill="none" />
      {/* Descender stem on right side of bowl */}
      <rect x="57" y="45" width="7" height="45" rx="1.5" fill="url(#qi2-fill)" />

      {/* ── i-dot above bowl (wireless-signal nod) ──────────────────── */}
      <circle cx="60.5" cy="24" r="6" fill="url(#qi2-fill)" />

      {/* ── 2 ────────────────────────────────────────────────────────── */}
      <path
        d="M74 44
           c0-9 7-15 16-15
           c9 0 16 6 16 14
           c0 6-3 10-9 15
           l-14 12
           h23
           v8
           H74
           v-6
           l20-17
           c4-4 5-6 5-9
           c0-4-3-7-7-7
           c-4 0-7 3-7 7
           z"
        fill="url(#qi2-fill)"
      />

      {/* ── 25W wattage tag under the 2 ─────────────────────────────── */}
      <text
        x="90"
        y="102"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="16"
        fontWeight={700}
        letterSpacing="0.5"
        fill={gold}
      >
        25W
      </text>
    </svg>
  );

  if (compact) return mark;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 14px 6px 8px",
        borderRadius: 999,
        background: "linear-gradient(135deg, rgba(18,17,16,.92), rgba(28,25,22,.88))",
        border: `1px solid ${gold}55`,
        boxShadow: `0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset, 0 0 12px ${gold}22`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {mark}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontSize: Math.round(size * 0.26),
            fontWeight: 700,
            color: "#F5EFE6",
            letterSpacing: ".02em",
          }}
        >
          Qi2 Certified
        </span>
        <span
          style={{
            marginTop: 3,
            fontSize: Math.round(size * 0.17),
            fontWeight: 600,
            color: gold,
            letterSpacing: ".22em",
            textTransform: "uppercase",
          }}
        >
          Official
        </span>
      </div>
    </div>
  );
}

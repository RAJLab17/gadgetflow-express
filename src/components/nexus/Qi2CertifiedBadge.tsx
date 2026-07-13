interface Qi2CertifiedBadgeProps {
  size?: number;
  /** Compact = mark only (no wordmark/pill). */
  compact?: boolean;
}

/**
 * Qi2 certification mark.
 * Rendered directly in pure black so it never falls back to a white CDN image.
 */
export default function Qi2CertifiedBadge({
  size = 44,
  compact = false,
}: Qi2CertifiedBadgeProps) {
  const mark = (
    <svg
      width={size}
      height={Math.round(size * 0.62)}
      viewBox="0 0 120 74"
      role="img"
      aria-label="Qi2 zertifiziert"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        width: size,
        height: Math.round(size * 0.62),
        color: "#000000",
      }}
    >
      <text
        x="2"
        y="50"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-7"
      >
        Qi
      </text>
      <text
        x="64"
        y="50"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="44"
        fontWeight="800"
        letterSpacing="-4"
      >
        2
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
        background: "rgba(255,255,255,.92)",
        border: "1px solid rgba(0,0,0,.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,.10)",
      }}
    >
      {mark}
      <span
        style={{
          fontSize: Math.round(size * 0.22),
          fontWeight: 600,
          color: "#000000",
          letterSpacing: ".22em",
          textTransform: "uppercase",
        }}
      >
        Zertifiziert
      </span>
    </div>
  );
}

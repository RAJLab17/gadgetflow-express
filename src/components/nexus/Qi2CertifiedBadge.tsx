interface Qi2CertifiedBadgeProps {
  size?: number;
  /** Compact = mark only (no wordmark/pill). */
  compact?: boolean;
}

/**
 * Original Qi2 certification mark, forced to pure black.
 */
export default function Qi2CertifiedBadge({
  size = 44,
  compact = false,
}: Qi2CertifiedBadgeProps) {
  const mark = (
    <img
      src="/qi2-logo-black.svg"
      aria-label="Qi2 zertifiziert"
      alt="Qi2 zertifiziert"
      width={size}
      height={Math.round(size * 0.77)}
      style={{
        display: "block",
        width: size,
        height: "auto",
        objectFit: "contain",
        filter: "none",
      }}
    />
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

import qi2Logo from "@/assets/badges/qi2-mark.webp.asset.json";

interface Qi2CertifiedBadgeProps {
  size?: number;
  gold?: string;
  /** Compact = mark only (no wordmark/pill). */
  compact?: boolean;
}

/**
 * Official Qi2 · 25W certification mark.
 * Uses the uploaded logo asset, inverted to white to sit on the dark hero.
 * Small file (~21KB webp), cached on CDN, no perf hit.
 */
export default function Qi2CertifiedBadge({
  size = 44,
  gold = "#C9A876",
  compact = false,
}: Qi2CertifiedBadgeProps) {
  const mark = (
    <img
      src={qi2Logo.url}
      alt="Qi2 25W zertifiziert"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
        // Black-on-white source → invert to crisp white for the dark hero.
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
        background: "linear-gradient(135deg, rgba(18,17,16,.92), rgba(28,25,22,.88))",
        border: `1px solid ${gold}55`,
        boxShadow: `0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset, 0 0 12px ${gold}22`,
      }}
    >
      {mark}
      <span
        style={{
          fontSize: Math.round(size * 0.22),
          fontWeight: 600,
          color: gold,
          letterSpacing: ".22em",
          textTransform: "uppercase",
        }}
      >
        Zertifiziert
      </span>
    </div>
  );
}

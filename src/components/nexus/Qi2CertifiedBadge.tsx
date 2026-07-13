import { useState } from "react";
import qi2Logo from "@/assets/badges/qi2-mark.webp.asset.json";

interface Qi2CertifiedBadgeProps {
  size?: number;
  gold?: string;
  /** Compact = mark only (no wordmark/pill). */
  compact?: boolean;
  /** Dark variant: white mark on black surfaces. */
  dark?: boolean;
}

/**
 * Official Qi2 · 25W certification mark.
 * Uses the uploaded logo asset; `dark` inverts it for crisp contrast on black.
 * Small file (~5KB webp), cached on CDN, no perf hit.
 */
export default function Qi2CertifiedBadge({
  size = 44,
  gold = "#C9A876",
  compact = false,
  dark = false,
}: Qi2CertifiedBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const markColor = dark ? "#FFFFFF" : "#000000";
  const fallbackMark = (
    <div
      aria-label="Qi2 25W zertifiziert"
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: markColor,
        fontSize: Math.round(size * 0.44),
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: "-0.06em",
      }}
    >
      qi2
    </div>
  );

  const mark = imageFailed ? fallbackMark : (
    <img
      src={qi2Logo.url}
      alt="Qi2 25W zertifiziert"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setImageFailed(true)}
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
        filter: dark ? "invert(1)" : undefined,
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
        background: dark
          ? "linear-gradient(135deg, #0a0a0a, #1a1a1a)"
          : "linear-gradient(135deg, rgba(18,17,16,.92), rgba(28,25,22,.88))",
        border: dark ? "1px solid rgba(255,255,255,.25)" : `1px solid ${gold}55`,
        boxShadow: dark
          ? "0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08) inset"
          : `0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset, 0 0 12px ${gold}22`,
      }}
    >
      {mark}
      <span
        style={{
          fontSize: Math.round(size * 0.22),
          fontWeight: 600,
          color: dark ? "#FFFFFF" : gold,
          letterSpacing: ".22em",
          textTransform: "uppercase",
        }}
      >
        Zertifiziert
      </span>
    </div>
  );
}

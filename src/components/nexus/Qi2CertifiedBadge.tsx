import { useState } from "react";
import qi2Logo from "@/assets/badges/qi2-mark.webp.asset.json";

interface Qi2CertifiedBadgeProps {
  size?: number;
  /** Compact = mark only (no wordmark/pill). */
  compact?: boolean;
}

/**
 * Official Qi2 · 25W certification mark.
 * Kept strictly in black on the original white/desk hero imagery.
 * Small file (~5KB webp), cached on CDN, no perf hit.
 */
export default function Qi2CertifiedBadge({
  size = 44,
  compact = false,
}: Qi2CertifiedBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const fallbackMark = (
    <div
      aria-label="Qi2 25W zertifiziert"
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000000",
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
        filter: "brightness(0) saturate(100%)",
        opacity: 1,
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

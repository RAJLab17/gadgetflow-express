interface Qi2CertifiedBadgeProps {
  size?: number;
  gold?: string;
}

/**
 * Premium circular Qi2.2 Certified badge (inline SVG, crisp at any size).
 * Dark glassy pill with a subtle gold ring and a stylised qi2.2 mark.
 */
export default function Qi2CertifiedBadge({ size = 44, gold = "#C9A876" }: Qi2CertifiedBadgeProps) {
  const height = size;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: `${Math.round(height * 0.16)}px ${Math.round(height * 0.32)}px ${Math.round(height * 0.16)}px ${Math.round(height * 0.22)}px`,
        borderRadius: 999,
        background: "linear-gradient(135deg, rgba(18,17,16,.92), rgba(28,25,22,.88))",
        border: `1px solid ${gold}55`,
        boxShadow: `0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset, 0 0 12px ${gold}22`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Circular Qi2 mark */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden
        style={{ display: "block", flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="qi2-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={gold} stopOpacity="0.9" />
            <stop offset="100%" stopColor={gold} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="qi2-mark" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#efe6d7" />
          </linearGradient>
        </defs>
        {/* outer ring */}
        <circle cx="32" cy="32" r="29" stroke="url(#qi2-ring)" strokeWidth="1.6" />
        {/* q */}
        <path
          d="M28 22c-4.4 0-8 3.6-8 8s3.6 8 8 8h2v4h4V22h-6zm0 4h2v8h-2c-2.2 0-4-1.8-4-4s1.8-4 4-4z"
          fill="url(#qi2-mark)"
        />
        {/* i dot + stem (inside q, wireless nod) */}
        <circle cx="33.2" cy="24.6" r="1.4" fill="url(#qi2-mark)" />
        <rect x="32.2" y="27.4" width="2" height="10.6" rx="0.6" fill="url(#qi2-mark)" />
        {/* 2 */}
        <path
          d="M38.6 26.4c.4-2.6 2.5-4.4 5.4-4.4 3 0 5.2 1.9 5.2 4.7 0 1.9-1 3.3-3 5l-4.1 3.4h7.4V38H38.6v-2l6.4-5.4c1.4-1.2 2-2.1 2-3.1 0-1.2-.9-2-2.3-2-1.4 0-2.4.9-2.5 2.4h-3.6z"
          fill="url(#qi2-mark)"
        />
      </svg>

      {/* Label */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontSize: Math.round(height * 0.24),
            fontWeight: 700,
            color: "#F5EFE6",
            letterSpacing: ".04em",
          }}
        >
          Qi2.2
        </span>
        <span
          style={{
            marginTop: 3,
            fontSize: Math.round(height * 0.16),
            fontWeight: 600,
            color: gold,
            letterSpacing: ".22em",
            textTransform: "uppercase",
          }}
        >
          Certified
        </span>
      </div>
    </div>
  );
}

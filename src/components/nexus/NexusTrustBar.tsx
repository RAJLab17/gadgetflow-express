const GOLD = "#C9A876";
const BEIGE = "#F5EFE6";
const DARK = "#0a0908";

/** Filled truck icon in gold, dark cut-outs for windows/wheels. */
function TruckGold({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* cargo box */}
      <rect x="1.5" y="6" width="11" height="10" rx="1.2" fill={GOLD} />
      {/* cab */}
      <path
        d="M12.5 9h4.2c.4 0 .77.19 1 .52L21 13.2c.16.22.25.48.25.76V15.5c0 .55-.45 1-1 1H12.5V9z"
        fill={GOLD}
      />
      {/* cab window */}
      <path d="M13.7 10.2h2.9l2.1 2.9h-5V10.2z" fill={DARK} />
      {/* wheels */}
      <circle cx="6.5" cy="17.5" r="2.1" fill={GOLD} />
      <circle cx="6.5" cy="17.5" r="0.9" fill={DARK} />
      <circle cx="17" cy="17.5" r="2.1" fill={GOLD} />
      <circle cx="17" cy="17.5" r="0.9" fill={DARK} />
    </svg>
  );
}

/** Shield with check, gold outline + subtle inner fill. */
function ShieldCheckGold({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5 4 5.2v6.1c0 4.6 3.2 8.6 8 10.2 4.8-1.6 8-5.6 8-10.2V5.2L12 2.5z"
        fill={GOLD}
        fillOpacity="0.18"
        stroke={GOLD}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12.2 2.6 2.6 4.4-4.8"
        stroke={GOLD}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Credit card with magnetic stripe + chip, gold outline. */
function CardGold({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="2"
        stroke={GOLD}
        strokeWidth="1.6"
      />
      <rect x="2.5" y="8.5" width="19" height="2.2" fill={GOLD} fillOpacity="0.55" />
      <rect x="14.5" y="13.5" width="4.5" height="2.6" rx="0.4" fill={GOLD} fillOpacity="0.8" />
    </svg>
  );
}

const items = [
  { Icon: TruckGold, label: "Gratis Versand CH" },
  { Icon: ShieldCheckGold, label: "30 Tage testen" },
  { Icon: CardGold, label: "TWINT & Apple Pay" },
];

/**
 * Slim trust strip — sits directly under the header on /nexus.
 * Dark background, gold custom icons, beige text.
 */
export default function NexusTrustBar() {
  return (
    <div
      className="w-full"
      style={{
        background: "linear-gradient(90deg, #050403 0%, #0a0908 50%, #050403 100%)",
        borderTop: `1px solid ${GOLD}22`,
        borderBottom: `1px solid ${GOLD}22`,
      }}
    >
      <div
        className="mx-auto flex items-center justify-center overflow-x-auto"
        style={{
          maxWidth: 1200,
          padding: "12px 16px",
          gap: 22,
          scrollbarWidth: "none",
        }}
      >
        {items.map(({ Icon, label }, i) => (
          <div key={label} className="flex items-center" style={{ gap: 22, flexShrink: 0 }}>
            <div className="flex items-center" style={{ gap: 10 }}>
              <Icon size={22} />
              <span
                style={{
                  fontSize: 13,
                  color: BEIGE,
                  fontWeight: 400,
                  letterSpacing: ".01em",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {i < items.length - 1 && (
              <span
                aria-hidden
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: GOLD,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

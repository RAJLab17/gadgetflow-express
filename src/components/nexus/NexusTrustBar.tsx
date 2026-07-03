const GOLD = "#C9A876";
const GOLD_SOFT = "#B8935A";
const BEIGE = "#EDE4D3";
const DARK = "#0a0908";

function TruckGold({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="1.5" y="6" width="11" height="10" rx="1.2" fill={GOLD} />
      <path
        d="M12.5 9h4.2c.4 0 .77.19 1 .52L21 13.2c.16.22.25.48.25.76V15.5c0 .55-.45 1-1 1H12.5V9z"
        fill={GOLD}
      />
      <path d="M13.7 10.2h2.9l2.1 2.9h-5V10.2z" fill={DARK} />
      <circle cx="6.5" cy="17.5" r="2.1" fill={GOLD} />
      <circle cx="6.5" cy="17.5" r="0.9" fill={DARK} />
      <circle cx="17" cy="17.5" r="2.1" fill={GOLD} />
      <circle cx="17" cy="17.5" r="0.9" fill={DARK} />
    </svg>
  );
}

function ShieldCheckGold({ size = 18 }: { size?: number }) {
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

function CardGold({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" stroke={GOLD} strokeWidth="1.6" />
      <rect x="2.5" y="8.5" width="19" height="2.2" fill={GOLD} fillOpacity="0.55" />
      <rect x="14.5" y="13.5" width="4.5" height="2.6" rx="0.4" fill={GOLD} fillOpacity="0.8" />
    </svg>
  );
}

const items = [
  { Icon: TruckGold, label: "Gratis Versand", labelLg: "Gratis Versand in CH" },
  { Icon: ShieldCheckGold, label: "30 Tage testen", labelLg: "30 Tage testen" },
  { Icon: CardGold, label: "TWINT · Apple Pay", labelLg: "TWINT & Apple Pay" },
];

/**
 * Premium trust strip — sits directly under the header on /nexus.
 * Mobile: 3-column grid, icons above compact labels, no scroll.
 * Desktop: single centered row, generous spacing, hairline separators.
 * Palette matches hero: obsidian gradient, gold accents, warm beige text.
 */
export default function NexusTrustBar() {
  return (
    <div
      className="w-full"
      style={{
        background:
          "linear-gradient(180deg, #050403 0%, #0b0a08 55%, #050403 100%)",
        borderTop: `1px solid ${GOLD}1f`,
        borderBottom: `1px solid ${GOLD}1f`,
        boxShadow: `inset 0 1px 0 0 ${GOLD}12`,
      }}
    >
      {/* subtle top hairline glow */}
      <div
        aria-hidden
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${GOLD_SOFT}55 50%, transparent 100%)`,
        }}
      />

      {/* MOBILE: continuous marquee — premium single-line ticker */}
      <div
        className="sm:hidden relative overflow-hidden"
        style={{
          padding: "11px 0",
          maskImage:
            "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: 28,
            width: "max-content",
            animation: "nexus-trust-marquee 22s linear infinite",
          }}
        >
          {[...items, ...items, ...items].map(({ Icon, labelLg }, i) => (
            <div
              key={i}
              className="flex items-center"
              style={{ gap: 28, flexShrink: 0 }}
            >
              <div className="flex items-center" style={{ gap: 9 }}>
                <Icon size={16} />
                <span
                  style={{
                    fontSize: 11.5,
                    color: BEIGE,
                    fontWeight: 500,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {labelLg}
                </span>
              </div>
              <span
                aria-hidden
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: GOLD,
                  opacity: 0.7,
                  boxShadow: `0 0 4px ${GOLD}66`,
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
        <style>{`
          @keyframes nexus-trust-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(calc(-100% / 3)); }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="nexus-trust-marquee"] { animation: none !important; }
          }
        `}</style>
      </div>

      {/* DESKTOP / TABLET: single centered row */}
      <div
        className="hidden sm:flex items-center justify-center mx-auto"
        style={{
          maxWidth: 1200,
          padding: "14px 24px",
          gap: 40,
        }}
      >
        {items.map(({ Icon, labelLg }, i) => (
          <div key={labelLg} className="flex items-center" style={{ gap: 40 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <Icon size={20} />
              <span
                style={{
                  fontSize: 13.5,
                  color: BEIGE,
                  fontWeight: 400,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {labelLg}
              </span>
            </div>
            {i < items.length - 1 && (
              <span
                aria-hidden
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: GOLD,
                  opacity: 0.75,
                  boxShadow: `0 0 6px ${GOLD}66`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* bottom hairline glow */}
      <div
        aria-hidden
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${GOLD_SOFT}33 50%, transparent 100%)`,
        }}
      />
    </div>
  );
}

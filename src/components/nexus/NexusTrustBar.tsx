import { Truck, ShieldCheck, CreditCard } from "lucide-react";

const GOLD = "#C9A876";
const BEIGE = "#F5EFE6";

const items = [
  { icon: Truck, label: "Gratis Versand CH" },
  { icon: ShieldCheck, label: "30 Tage testen" },
  { icon: CreditCard, label: "TWINT & Apple Pay" },
];

/**
 * Slim trust strip — sits directly under the header on /nexus.
 * Dark background, gold icons, beige text — matches the hero palette.
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
          padding: "10px 16px",
          gap: 18,
          scrollbarWidth: "none",
        }}
      >
        {items.map((it, i) => (
          <div key={it.label} className="flex items-center" style={{ gap: 18, flexShrink: 0 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <it.icon size={16} color={GOLD} strokeWidth={1.8} />
              <span
                style={{
                  fontSize: 12,
                  color: BEIGE,
                  fontWeight: 400,
                  letterSpacing: ".01em",
                  whiteSpace: "nowrap",
                }}
              >
                {it.label}
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

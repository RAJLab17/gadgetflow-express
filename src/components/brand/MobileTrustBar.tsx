import { Truck, RotateCcw, ShieldCheck, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/** Mobile-only trust bar below the homepage hero (kept from the previous hero). */
export default function MobileTrustBar() {
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return (
    <ul className="mobile-trust-bar mobile-collection-track" aria-label="Vorteile">
      <li><Truck aria-hidden="true" strokeWidth={1.4} />Lieferung 2–3 Werktage</li>
      <li><RotateCcw aria-hidden="true" strokeWidth={1.4} />30 Tage testen</li>
      <li><ShieldCheck aria-hidden="true" strokeWidth={1.4} />3 Jahre Garantie (NEXUS)</li>
      <li><Smartphone aria-hidden="true" strokeWidth={1.4} />TWINT &amp; Apple Pay</li>
    </ul>
  );
}

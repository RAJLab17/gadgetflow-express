import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeSection from "./HomeSection";
import "@/styles/home-products.css";

export default function HomeNexus() {
  return (
    <HomeSection tone="ivory" id="nexus" className="home-nexus">
      <div className="home-nexus-layout">
        <Link to="/nexus" className="home-nexus-photo" aria-label="RAJ NEXUS ansehen">
          <img src="/assets/products/nexus-bedside-night.webp" alt="RAJ NEXUS 3-in-1 Ladestation auf dem Nachttisch" width={1280} height={1120} loading="lazy" decoding="async" />
        </Link>
        <div className="home-nexus-copy">
          <p className="home-product-eyebrow">RAJ NEXUS</p>
          <h2 className="home-nexus-title">Drei Geräte.<br />Ein Platz.</h2>
          <p className="home-nexus-description">Lädt iPhone, Apple Watch und AirPods gleichzeitig. Qi2.2 mit bis zu 25 W, magnetisch ausgerichtet.</p>
          <div className="home-nexus-buy">
            <p className="home-nexus-price">CHF 99.–</p>
            <Button asChild className="home-nexus-button"><Link to="/nexus">Jetzt kaufen</Link></Button>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
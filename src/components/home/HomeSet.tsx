import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeSection from "./HomeSection";
import photo900 from "@/assets/home/raj-set-original-900.webp.asset.json";
import photoLarge from "@/assets/home/raj-set-original-952.webp.asset.json";
import "@/styles/home-social.css";

export default function HomeSet() {
  return <HomeSection tone="black" id="set" className="home-set">
    <div className="home-set-layout">
      <Link to="/matrix" className="home-set-photo" aria-label="Set ansehen"><img src={photo900.url} srcSet={`${photo900.url} 900w, ${photoLarge.url} 952w`} sizes="(max-width: 1023px) 350px, 480px" width={952} height={1269} loading="lazy" decoding="async" alt="RAJ MATRIX Hülle und AirPods-Hülle in Cherry Carbon, in der Hand am See" /></Link>
      <div className="home-set-copy">
        <p className="home-set-eyebrow">DAS SET</p>
        <h2 className="home-set-title">Hülle und AirPods-Hülle.<span>Im selben Carbon-Design.</span></h2>
        <div className="home-set-buy"><p className="home-set-price">CHF 79.–<del>CHF 94.–</del></p><Button asChild className="home-set-button"><Link to="/matrix">Set ansehen</Link></Button></div>
      </div>
    </div>
  </HomeSection>;
}
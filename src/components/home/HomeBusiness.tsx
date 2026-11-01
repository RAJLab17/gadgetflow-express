import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "@/styles/home-story.css";

const HomeBusiness = () => (
  <section id="firmen" className="home-business">
    <Link to="/kabelloses-laden-firmen-schweiz" className="home-business-card">
      <span className="home-business-copy">
        <span className="home-business-title">Für Firmen</span>
        <span className="home-business-sub">Mitarbeiter- und Kundengeschenke ab 10 Stück</span>
      </span>
      <span className="home-business-arrow" role="img" aria-label="Für Firmen ansehen"><ArrowRight size={18} aria-hidden="true" /></span>
      <span className="home-business-button" aria-hidden="true">Anfrage stellen →</span>
    </Link>
  </section>
);

export default HomeBusiness;

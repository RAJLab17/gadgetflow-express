import "@/styles/home-motion.css";
import "@/styles/home-products.css";

const TEXT = "GRATIS VERSAND · 30 TAGE RÜCKGABE · TWINT & APPLE PAY · SCHWEIZER MARKE · 3 JAHRE GARANTIE AUF NEXUS ·";

export default function HomeTicker() {
  return (
    <div className="home-ticker">
      <div className="home-ticker-track">
        <span className="home-ticker-copy">{TEXT}<span aria-hidden="true" className="home-ticker-desktop-repeat"> {TEXT}</span></span>
        <span className="home-ticker-copy" aria-hidden="true">{TEXT}<span className="home-ticker-desktop-repeat"> {TEXT}</span></span>
      </div>
    </div>
  );
}
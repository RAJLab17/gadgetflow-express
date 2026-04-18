import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const badges = [
  "🇨🇭 Swiss Brand",
  "⚡ Qi2.2 Zertifiziert",
  "✅ CE Zertifiziert",
  "📦 Gratis Versand",
  "↩️ 14 Tage Rückgabe",
];

const HeroBadgesAndCTA = () => {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Badge-Leiste */}
      <div className="w-full bg-background border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10 text-xs md:text-sm text-muted-foreground overflow-x-auto">
            {badges.map((b) => (
              <span key={b} className="whitespace-nowrap" style={{ color: "#888" }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Preis + CTA */}
      <section className="w-full" style={{ backgroundColor: "#faf6f0" }}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            {/* Founder Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(155, 107, 63, 0.1)",
                borderColor: "#9b6b3f",
                color: "#9b6b3f",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#9b6b3f" }} />
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase">
                Founder Edition · Nur 100 Stück
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
            >
              Sichere dir den Launch-Preis.
            </h2>

            {/* Preis */}
            <div className="flex items-baseline justify-center gap-4 mb-2">
              <span
                className="text-5xl md:text-6xl font-extrabold"
                style={{ color: "#9b6b3f" }}
              >
                CHF 99
              </span>
              <span className="text-xl md:text-2xl text-muted-foreground line-through">
                CHF 129
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-8">
              Du sparst <span className="font-semibold text-foreground">CHF 30</span>
            </p>

            {/* CTA */}
            <Button
              variant="hero"
              size="xl"
              onClick={scrollToProducts}
              className="w-full sm:w-auto text-base group shadow-elegant-lg"
            >
              Jetzt sichern
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              Lieferung innerhalb von 5–7 Werktagen · Sicher bezahlen
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroBadgesAndCTA;

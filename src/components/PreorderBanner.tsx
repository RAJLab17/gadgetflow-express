import { Gift, Clock, Sparkles, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface PreorderBannerProps {
  remainingSpots?: number;
}

const PreorderBanner = ({ remainingSpots = 100 }: PreorderBannerProps) => {
  const [spotsLeft, setSpotsLeft] = useState(remainingSpots);

  // Simulate urgency with countdown-style animation
  useEffect(() => {
    setSpotsLeft(remainingSpots);
  }, [remainingSpots]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/30 p-6 mb-8">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/30 rounded-full border border-primary/40">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Exklusive Vorbestellung
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Die ersten <span className="text-primary text-glow">100 Kunden</span> erhalten:
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground font-medium">
                  <span className="text-primary font-bold">10% Rabatt</span> auf den Einführungspreis
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
              <span className="text-foreground font-medium">
                  <span className="text-primary font-bold">Gratis Premium-Kabel</span> im Wert von CHF 26.99
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground font-medium">
                  Individuelle Produktion – Lieferung in <span className="text-primary font-bold">2-4 Wochen</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Urgency Counter */}
          <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Noch verfügbar:</span>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary text-glow mb-2">
              {spotsLeft}
            </div>
            <span className="text-sm text-muted-foreground">von 100 Plätzen</span>
            
            {/* Progress bar */}
            <div className="w-full max-w-[200px] h-2 bg-secondary rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                style={{ width: `${(spotsLeft / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-sm text-muted-foreground mt-4 text-center md:text-left">
          ⚡ Jede Bestellung wird individuell für dich produziert – Premium-Qualität, made for you.
        </p>
      </div>
    </div>
  );
};

export default PreorderBanner;

import { Zap, Shield, Heart, Sparkles } from "lucide-react";

const BrandMission = () => {
  const missionPoints = [
    {
      icon: Zap,
      text: "RAJ steht für Energieprodukte mit klarem Fokus auf Funktion und Beständigkeit.",
    },
    {
      icon: Sparkles,
      text: "Jedes Detail ist bewusst gestaltet und auf das Wesentliche reduziert.",
    },
    {
      icon: Shield,
      text: "Design, Leistung und Service greifen ineinander und geben Sicherheit.",
    },
    {
      icon: Heart,
      text: "So entsteht Energie mit Substanz: verlässlich im Alltag, stark im Moment, dauerhaft im Vertrauen.",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Slogan - Hero element */}
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold text-sm tracking-widest uppercase mb-8">
            Unsere Philosophie
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
            Power. <span className="text-primary">Always There.</span>
          </h2>
        </div>

        {/* Vision */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full hidden md:block" />
            <div className="md:pl-8">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Vision
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">Power,</span> die einfach da ist, wenn du sie brauchst.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="relative">
            <div className="absolute -right-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-primary rounded-full hidden md:block" />
            <div className="md:pr-8">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Mission
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Wir stehen für Energie mit Substanz – <br className="hidden md:block" />
                <span className="text-foreground font-medium">klar im Design, ehrlich in der Leistung.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Mission Points */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {missionPoints.map((point, index) => (
              <div
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <point.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                    {point.text}
                  </p>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/5 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="flex justify-center mt-16">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default BrandMission;

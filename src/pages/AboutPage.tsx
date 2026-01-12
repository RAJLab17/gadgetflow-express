import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Shield, Heart, Sparkles, Target, Eye, Award, Users } from "lucide-react";

const AboutPage = () => {
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

  const values = [
    {
      icon: Target,
      title: "Fokus",
      description: "Wir konzentrieren uns auf das Wesentliche – Qualität statt Quantität.",
    },
    {
      icon: Award,
      title: "Qualität",
      description: "Premium-Materialien und strenge Qualitätskontrollen für jedes Produkt.",
    },
    {
      icon: Users,
      title: "Kundenorientierung",
      description: "Ihr Vertrauen ist unser Antrieb – wir hören zu und liefern.",
    },
    {
      icon: Eye,
      title: "Transparenz",
      description: "Ehrliche Kommunikation und faire Preise ohne versteckte Kosten.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Über uns - RAJTech | Power. Always There.</title>
        <meta
          name="description"
          content="Erfahren Sie mehr über RAJTech - unsere Vision, Mission und Werte. Wir stehen für Energie mit Substanz – klar im Design, ehrlich in der Leistung."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center">
                <span className="inline-block px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold text-sm tracking-widest uppercase mb-8">
                  Über RAJTech
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                  Power. <span className="text-primary">Always There.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Wir sind RAJTech – Ihr Partner für zuverlässige Energielösungen im digitalen Alltag.
                </p>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                  {/* Vision */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
                    <div className="pl-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Eye className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-sm font-semibold text-primary uppercase tracking-widest">
                          Vision
                        </h2>
                      </div>
                      <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                        Power, die einfach da ist, wenn du sie brauchst.
                      </p>
                    </div>
                  </div>

                  {/* Mission */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-primary rounded-full" />
                    <div className="pl-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-sm font-semibold text-primary uppercase tracking-widest">
                          Mission
                        </h2>
                      </div>
                      <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                        Wir stehen für Energie mit Substanz – 
                        <span className="text-foreground font-medium"> klar im Design, ehrlich in der Leistung.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Points */}
          <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Was uns <span className="text-primary">ausmacht</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Unsere Grundsätze definieren, wer wir sind und wie wir arbeiten.
                </p>
              </div>

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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere <span className="text-primary">Werte</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Die Prinzipien, die uns jeden Tag antreiben.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group text-center p-8 rounded-2xl border border-border/50 bg-card/30 hover:bg-card hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Entdecken Sie unsere Produkte
                </h2>
                <p className="text-muted-foreground mb-8">
                  Erleben Sie Energie mit Substanz – durchdachtes Design trifft auf zuverlässige Leistung.
                </p>
                <Link
                  to="/#products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors duration-300"
                >
                  <Zap className="w-5 h-5" />
                  Produkte entdecken
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;

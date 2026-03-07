import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Check, Zap, Shield, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo-new.png";
import chargerHero from "@/assets/products/charger-3in1-inuse.png";
import chargerColors from "@/assets/products/charger-3in1-colors-new.png";
import chargerAction from "@/assets/products/charger-3in1-action1.png";
import chargerAngles from "@/assets/products/charger-3in1-angles.png";

const nexusImages = [chargerHero, chargerColors, chargerAction, chargerAngles];


const LaunchPage = () => {
  const [email, setEmail] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % nexusImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(data?.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Launch signup failed:", error);
      toast.error("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>RAJ – Coming Soon | Premium Ladezubehör aus der Schweiz</title>
        <meta
          name="description"
          content="RAJ lanciert bald: Premium Ladezubehör mit Schweizer Design. Trag dich ein und erfahre als Erstes, wann wir live gehen."
        />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[180px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[140px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <header className="flex items-center justify-center py-8">
            <motion.img
              src={logo}
              alt="RAJ"
              className="h-14 w-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            />
          </header>

          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-8 pb-16 md:pt-16 md:pb-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border shadow-elegant mb-8"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground tracking-wide">
                  Coming Soon
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-foreground mb-4"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
              >
                Premium Laden.
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-primary mb-8"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
              >
                Swiss Design.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 font-light leading-relaxed"
              >
                Wir lancieren bald unseren Shop mit Premium-Ladezubehör. Trag dich
                ein und erfahre als Erstes, wann es losgeht – inklusive exklusivem
                Launch-Angebot.
              </motion.p>

              {/* Email Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-md mx-auto"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-card rounded-2xl border border-border text-center space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-14 h-14 mx-auto rounded-full bg-primary/15 flex items-center justify-center"
                    >
                      <Check className="w-7 h-7 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Bitte bestätige deine E-Mail
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Wir haben dir eine E-Mail gesendet. Klick auf den
                      Bestätigungslink, um dabei zu sein.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="deine@email.ch"
                        required
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-elegant min-w-[160px]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Dabei sein
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Kein Spam. Nur der Launch-Termin & dein exklusives Angebot.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </section>

          {/* Product Teaser – RAJ NEXUS only */}
          <section className="container mx-auto px-4 pb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-2xl md:text-3xl font-bold text-foreground mb-3"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}
            >
              Unser erstes Produkt
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-muted-foreground mb-12 max-w-lg mx-auto italic"
            >
              Perfekte Eleganz. Qi2 neu definiert.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto"
            >
              <div className="group bg-card rounded-2xl border border-border p-6 md:p-8 text-center hover:shadow-elegant-lg transition-all duration-300">
                <div className="relative mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={nexusImages[currentImage]}
                      alt="RAJ NEXUS 3-in-1 Wireless Charger"
                      className="w-full aspect-square object-contain relative"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </AnimatePresence>
                </div>
                <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                  Coming Soon
                </span>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  RAJ <span className="text-primary">NEXUS</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  3-in-1 Wireless Charger · Qi2.2 · 25W
                </p>
              </div>
            </motion.div>
          </section>

          {/* Trust Section */}
          <section className="container mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Zap, title: "Schnellladetechnologie", desc: "Bis zu 25W MagSafe & Qi2" },
                { icon: Shield, title: "2 Jahre Garantie", desc: "Schweizer Qualitätsversprechen" },
                { icon: Truck, title: "Kostenloser Versand", desc: "Ab CHF 50 in der Schweiz" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border py-8">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
              <img src={logo} alt="RAJ" className="h-8 w-auto opacity-60" />
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                Power. Always There.
              </p>
              <div className="flex items-center gap-5">
                <a href="https://www.instagram.com/raj_swiss_" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="https://www.tiktok.com/@raj.swiss" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" /></svg>
                </a>
                <a href="https://www.facebook.com/share/1B5TZ9Xn5b/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} RAJ · Alle Rechte vorbehalten.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LaunchPage;

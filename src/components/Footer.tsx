import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-new.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast({ title: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("brevo-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      setIsSuccess(true);
      setEmail("");
      toast({ title: data?.message || "Erfolgreich angemeldet! 🎉" });
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err) {
      console.error("Newsletter error:", err);
      toast({ title: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />
      
      {/* Newsletter Section */}
      <div className="border-b border-border/50 relative">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl mx-auto text-center"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary/70 mb-4 font-medium">
              Newsletter
            </p>
            <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-3 text-foreground">
              Bleiben Sie <span className="italic">informiert</span>
            </h3>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-sm mx-auto">
              Exklusive Updates, neue Produkte und Angebote – direkt in Ihr Postfach.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative max-w-md mx-auto">
              <div className="flex border border-border/80 rounded-full overflow-hidden bg-background/60 backdrop-blur-sm transition-all focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ihre E-Mail-Adresse"
                  className="flex-1 px-6 py-3.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="px-6 py-3.5 bg-primary text-primary-foreground text-sm font-medium rounded-full m-1 hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Angemeldet</span>
                    </>
                  ) : (
                    "Anmelden"
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/50 mt-4 tracking-wide">
                Kein Spam. Jederzeit abmeldbar.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img 
                src={logo} 
                alt="RAJ" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="text-sm font-semibold text-foreground/80 tracking-wide">
                Power. Always There.
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Präzision in Form gegossen.<br />
              Leistung, auf den Punkt gebracht.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-6 text-foreground">Navigation</h4>
            <ul className="space-y-3">
              {["Produkt", "Über uns"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-6 text-foreground">Support</h4>
            <ul className="space-y-3">
              {["FAQ", "Versand", "Rückgabe", "Kontakt", "Manuals & Downloads"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-6 text-foreground">Rechtliches</h4>
            <ul className="space-y-3">
              {[
                { label: "Datenschutz", href: "/datenschutz" },
                { label: "AGB", href: "/agb" },
                { label: "Impressum", href: "/impressum" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Payment Methods & Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} RAJ. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SSL-Verschlüsselt
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sichere Zahlung
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Schweizer Shop
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-new.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />
      
      {/* Newsletter Section */}
      <div className="border-b border-border relative">
        <div className="container mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Bleiben Sie informiert</h3>
            <p className="text-muted-foreground mb-5 text-base">
              Exklusive Updates und Angebote direkt in Ihr Postfach
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 bg-background border-border focus:border-primary h-12 rounded-xl"
              />
              <Button variant="hero" size="lg" className="h-12">
                Abonnieren
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
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
              Leistung, auf den Punkt gebracht.<br />
              Konsequent bis ins Detail.
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
              {["FAQ", "Versand", "Rückgabe", "Kontakt"].map((link) => (
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
              {["Datenschutz", "AGB", "Impressum"].map((link) => (
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
        </div>

        {/* Payment Methods & Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border mt-12 pt-8"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-sm text-muted-foreground font-medium">Sichere Zahlungsmethoden</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Mastercard */}
              <div className="bg-background border border-border rounded-lg px-3 py-2 flex items-center justify-center hover:border-primary/50 transition-colors">
                <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                  <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
                  <path d="M19 17.5a7 7 0 0 1 0-11 7 7 0 0 0 0 11z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* Visa */}
              <div className="bg-background border border-border rounded-lg px-3 py-2 flex items-center justify-center hover:border-primary/50 transition-colors">
                <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 8L13 16h-2l2.5-8h2zm6.5 5.5c0-1.5-2-1.7-2-2.5 0-.3.3-.5.8-.5.7 0 1.4.3 1.8.5l.4-1.5c-.5-.2-1.2-.5-2.2-.5-2 0-3.3 1-3.3 2.5 0 1.7 2.5 1.8 2.5 2.7 0 .4-.4.6-1 .6-.8 0-1.7-.4-2.1-.6l-.4 1.5c.5.3 1.4.5 2.4.5 2.2 0 3.5-1 3.5-2.6zM28 16l-1.5-8h-1.8c-.5 0-.9.3-1 .7L21 16h2.2l.4-1.2h2.7l.3 1.2H28zm-2.5-3l1.1-3.2.6 3.2h-1.7zM11 8l-3.2 8H5.5L3.8 9.8c-.1-.4-.2-.5-.5-.7C2.8 8.9 2 8.6 1.5 8.4l.1-.4h3.3c.5 0 .9.3 1 .9l.8 4.3L9 8h2z" fill="#1434CB"/>
                </svg>
              </div>
              {/* Apple Pay */}
              <div className="bg-background border border-border rounded-lg px-3 py-2 flex items-center justify-center hover:border-primary/50 transition-colors">
                <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 8.5c-.4.5-1 .9-1.6.8-.1-.6.2-1.3.5-1.7.4-.5 1-.8 1.5-.9.1.7-.1 1.3-.4 1.8zm.4.9c-.9 0-1.7.5-2.1.5-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.5-1.1 1.9-.3 4.7.8 6.2.5.8 1.1 1.6 2 1.6.8 0 1.1-.5 2-.5 1 0 1.2.5 2 .5s1.4-.8 1.9-1.5c.6-.9.8-1.7.8-1.7s-1.6-.6-1.6-2.4c0-1.5 1.2-2.2 1.3-2.3-.7-1.1-1.8-1.2-2.2-1.2l-.4-.2z" fill="currentColor"/>
                  <path d="M17.5 7.5c2.2 0 3.8 1.5 3.8 3.8 0 2.3-1.6 3.8-3.9 3.8h-2.5v4h-1.8V7.5h4.4zm-2.6 6.1h2.1c1.5 0 2.4-1 2.4-2.4 0-1.4-.9-2.4-2.4-2.4h-2.1v4.8zm6.6 2.2c0-1.5 1.1-2.4 3.2-2.5l2.3-.1v-.7c0-1-.6-1.5-1.7-1.5-1 0-1.6.5-1.7 1.2h-1.7c.1-1.5 1.4-2.6 3.5-2.6s3.3 1.1 3.3 2.9v6.1h-1.7v-1.5c-.5 1-1.5 1.6-2.7 1.6-1.7 0-2.8-1-2.8-2.5v-.4zm5.5-.7v-.7l-2.1.1c-1 .1-1.6.5-1.6 1.2s.6 1.2 1.5 1.2c1.2 0 2.2-.8 2.2-1.8zm3.1 5.7v-1.4c.1 0 .4.1.6.1.9 0 1.4-.4 1.7-1.4l.2-.5-3.2-8.9h1.9l2.2 7.2 2.2-7.2h1.9l-3.3 9.4c-.8 2.2-1.6 2.9-3.5 2.9-.2 0-.5 0-.7-.2z" fill="currentColor"/>
                </svg>
              </div>
              {/* Google Pay */}
              <div className="bg-background border border-border rounded-lg px-3 py-2 flex items-center justify-center hover:border-primary/50 transition-colors">
                <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.5 12.2l-.1-.8h-4.2v1.5h2.4c-.1.6-.4 1.1-.8 1.4v1.2h1.3c.8-.7 1.4-1.9 1.4-3.3z" fill="#4285F4"/>
                  <path d="M14.2 16c1.1 0 2-.4 2.7-1l-1.3-1c-.4.3-.9.4-1.4.4-1.1 0-2-.7-2.3-1.7h-1.4v1c.7 1.4 2 2.3 3.7 2.3z" fill="#34A853"/>
                  <path d="M12.9 12.7c-.1-.2-.1-.5-.1-.7s0-.5.1-.7v-1h-1.4c-.3.5-.4 1.1-.4 1.7s.1 1.2.4 1.7l1.4-1z" fill="#FBBC05"/>
                  <path d="M14.2 9.3c.6 0 1.1.2 1.5.6l1.1-1.1c-.7-.7-1.6-1-2.6-1-1.7 0-3 .9-3.7 2.3l1.4 1c.3-1 1.2-1.8 2.3-1.8z" fill="#EA4335"/>
                  <path d="M24 10.8h-1.5v4.3H24v-4.3zm3.3 1.4c-.4 0-.8.2-1 .5l-.1-.4h-1.3v4.3h1.5v-2.1c0-.8.4-1.1.8-1.1.2 0 .3 0 .5.1l.2-1.4c-.2 0-.4-.1-.6 0v.1zm2.2-.1c-.8 0-1.3.4-1.6.9v-.8h-1.5v4.3h1.5v-2.3c0-.7.3-1 .8-1 .5 0 .7.3.7.9v2.4H31v-2.6c0-1.2-.6-1.8-1.5-1.8z" fill="currentColor"/>
                </svg>
              </div>
              {/* TWINT */}
              <div className="bg-background border border-border rounded-lg px-3 py-2 flex items-center justify-center hover:border-primary/50 transition-colors">
                <span className="font-bold text-sm tracking-tight" style={{ color: '#000' }}>TWINT</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
            <p className="text-muted-foreground text-sm">
              © {currentYear} RAJ. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SSL-Verschlüsselt
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

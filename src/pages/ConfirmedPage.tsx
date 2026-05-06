import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo-new.webp";

const ConfirmedPage = () => {
  return (
    <>
      <Helmet>
        <title>Anmeldung bestätigt – RAJ</title>
        <meta name="description" content="Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Willkommen bei RAJ." />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
        {/* Warm ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg w-full text-center relative z-10 pt-24 md:pt-32"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
            className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-10"
          >
            <Check className="w-9 h-9 text-primary" strokeWidth={2.5} />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight"
          >
            Willkommen bei RAJ
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-sm mx-auto"
          >
            Ihre E-Mail wurde erfolgreich bestätigt. Sie erhalten ab sofort exklusive Updates und Angebote von RAJ.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mb-16"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-elegant"
            >
              Produkte entdecken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mb-6"
          >
            <a href="https://raj.ch">
              <img src={logo} alt="RAJ" className="h-10 w-auto mx-auto hover:opacity-80 transition-opacity" />
            </a>
          </motion.div>

          {/* Subtle tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs text-muted-foreground/50 tracking-widest uppercase"
          >
            Power. Always There.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default ConfirmedPage;

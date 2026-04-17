import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UeberRajPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Über RAJ – Schweizer Premium Wireless Charging aus dem Thurgau</title>
        <meta
          name="description"
          content="RAJ ist eine Schweizer Consumer-Electronics-Marke aus dem Thurgau. Premium-Zubehör für das Apple-Ökosystem. Präzision · Beständigkeit · Charakter."
        />
        <link rel="canonical" href="https://raj.ch/ueber-raj" />
      </Helmet>

      <Header />

      <main className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-foreground mb-10">
            Über RAJ
          </h1>

          <p className="text-foreground/80 leading-relaxed mb-6">
            RAJ ist eine Schweizer Consumer-Electronics-Marke mit Sitz im Kanton Thurgau. Wir entwickeln
            Premium-Zubehör für das Apple-Ökosystem – mit dem Anspruch an Schweizer Präzision, nachhaltige Qualität
            und kompromissloses Design.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Unser erstes Produkt, der RAJ NEXUS 3-in-1 Wireless Charger, vereint Funktionalität und Ästhetik: Ein
            Ladegerät, ein Kabel, drei Geräte geladen. Qi2.2-zertifiziert, faltbar, verstellbar – designed in
            Switzerland.
          </p>

          <div className="my-10 py-8 border-y border-border text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Unsere Werte</p>
            <p className="text-lg md:text-xl font-light text-primary tracking-wide">
              PRÄZISION · BESTÄNDIGKEIT · CHARAKTER
            </p>
          </div>

          <p className="text-foreground/80 leading-relaxed mb-10">
            RAJ steht für Produkte die funktionieren. Einfach. Ohne Kompromisse.
          </p>

          <p className="text-2xl md:text-3xl font-light text-foreground italic text-center mt-12">
            Power. Always There.
          </p>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
};

export default UeberRajPage;

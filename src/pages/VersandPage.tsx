import { motion } from "framer-motion";
import { Truck, RotateCcw, Mail, Globe, Clock, ShieldCheck, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const VersandPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Versand & Rückgabe</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
              Transparent & <span className="text-primary">fair</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Alles, was Sie über Versand und Rückgabe bei RAJ wissen müssen – klar und einfach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

            {/* Versand Card */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Versand</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Kostenloser Versand</p>
                      <p className="text-sm text-muted-foreground mt-0.5">In der gesamten Schweiz – ohne Mindestbestellwert.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">3–5 Werktage Lieferzeit</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Schnelle und zuverlässige Lieferung direkt zu Ihnen.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Schweizer Markt im Fokus</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Internationaler Versand folgt zu einem späteren Zeitpunkt.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Rückgabe Card */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <RotateCcw className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Rückgabe</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">30 Tage Rückgaberecht</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Ab Erhalt der Ware – unkompliziert und fair.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Unbenutzt & unbeschädigt</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Ware muss im Originalzustand zurückgesendet werden.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Schnelle Rückerstattung</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Über das ursprüngliche Zahlungsmittel innerhalb von 3–5 Werktagen.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Rückgaben melden</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Per E-Mail an{" "}
                        <a href="mailto:info@raj.ch" className="text-primary hover:underline font-medium">
                          info@raj.ch
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VersandPage;

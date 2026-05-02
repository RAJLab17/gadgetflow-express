import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FileDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const manuals = [
  {
    flag: "🇩🇪",
    title: "Benutzerhandbuch",
    lang: "Deutsch",
    file: "/manuals/RAJ_Nexus_3-in-1_Wireless_Charger_Manual_DE.pdf",
  },
  {
    flag: "🇬🇧",
    title: "User Manual",
    lang: "English",
    file: "/manuals/RAJ_Nexus_3-in-1_Wireless_Charger_Manual_EN.pdf",
  },
  {
    flag: "🇫🇷",
    title: "Manuel utilisateur",
    lang: "Français",
    file: "/manuals/RAJ_Nexus_3-in-1_Wireless_Charger_Manual_FR.pdf",
  },
  {
    flag: "🇮🇹",
    title: "Manuale utente",
    lang: "Italiano",
    file: "/manuals/RAJ_Nexus_3-in-1_Wireless_Charger_Manual_IT.pdf",
  },
];

const DokumentePage = () => {
  return (
    <div className="min-h-screen bg-[#f0ede6] text-[#2b2725]">
      <Helmet>
        <title>Produktdokumentation – RAJ NEXUS</title>
        <meta
          name="description"
          content="Benutzerhandbücher für den RAJ NEXUS 3-in-1 Wireless Charger in Deutsch, Englisch, Französisch und Italienisch zum Download."
        />
        <link rel="canonical" href="https://www.raj.ch/dokumente" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Produktdokumentation
          </h1>
          <p className="text-lg text-[#2b2725]/70">
            RAJ NEXUS 3-in-1 Wireless Charger · Model RAJ-NEX-T3-Q2-BLK
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {manuals.map((m, i) => (
            <motion.a
              key={m.file}
              href={m.file}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[#9b6b3f]/25 bg-white/60 hover:bg-white px-5 py-5 transition-all hover:border-[#9b6b3f] hover:shadow-[0_8px_24px_-12px_rgba(155,107,63,0.4)]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-3xl leading-none" aria-hidden="true">
                  {m.flag}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-[#2b2725] truncate">
                    {m.title}
                  </div>
                  <div className="text-sm text-[#2b2725]/60">
                    {m.lang} · PDF
                  </div>
                </div>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9b6b3f] text-white transition-transform group-hover:scale-105">
                <FileDown className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
        </div>

        <p className="text-center text-sm text-[#2b2725]/50 mt-10">
          Die Dokumente öffnen sich in einem neuen Tab.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default DokumentePage;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import workshopDetail from "@/assets/about/workshop-detail.jpg";
import precisionCraft from "@/assets/about/precision-craft.jpg";
import thurgauMap from "@/assets/about-thurgau-clean.png";
import founderSignature from "@/assets/about/founder-signature.svg";

const L = {
  bg: "#FAF8F5",
  text: "#1A1A1A",
  textMuted: "#6B6358",
  border: "#E5DFD4",
  gold: "#9b6b3f",
};

const VALUES = [
  { n: "01", title: "Fokus", copy: "Reduktion auf das Wesentliche. Wir entwickeln keine Funktionen, sondern Lösungen, die bleiben." },
  { n: "02", title: "Qualität", copy: "Anspruch ohne Kompromisse. Jedes Detail folgt einem klaren Qualitätsverständnis , sichtbar und spürbar." },
  { n: "03", title: "Vertrauen", copy: "Verlässlichkeit im Alltag. Dein Vertrauen ist unser Antrieb , wir hören zu und liefern." },
  { n: "04", title: "Transparenz", copy: "Klare Entscheidungen, klare Preise. Ohne versteckte Bedingungen, ohne leere Versprechen." },
];

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const AboutPage = () => {
  return (
    <div style={{ background: L.bg, color: L.text }} className="min-h-screen font-light">
      <Helmet>
        <title>Über RAJ , Schweizer Präzision aus dem Thurgau</title>
        <meta
          name="description"
          content="RAJ ist eine Schweizer Consumer-Electronics-Marke aus dem Thurgau. Präzision, Beständigkeit und Charakter , gebaut auf 16 Jahren Erfahrung."
        />
        <link rel="canonical" href="https://raj.ch/about" />
        <meta property="og:title" content="Über RAJ , Schweizer Präzision aus dem Thurgau" />
        <meta property="og:description" content="Schweizer Consumer-Electronics aus dem Thurgau. Präzision · Beständigkeit · Charakter." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://raj.ch/about" />
      </Helmet>

      <Header />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: L.border }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-20 md:pt-32 md:pb-28 grid md:grid-cols-12 gap-12 items-end">
          <motion.div {...fade} className="md:col-span-7">
            <p className="text-[11px] tracking-[0.32em] uppercase font-medium mb-8" style={{ color: L.gold }}>
              , Über RAJ
            </p>
            <h1 className="font-light tracking-tight leading-[0.95] text-[clamp(3rem,8vw,6.5rem)]">
              Schweizer
              <br />
              <span className="italic" style={{ color: L.gold }}>Präzision.</span>
            </h1>
            <p className="mt-10 max-w-xl text-lg md:text-xl leading-relaxed" style={{ color: L.textMuted }}>
              Gegründet im Thurgau. Gebaut auf 16 Jahren Erfahrung in der Präzisionsindustrie.
              Kein Zubehör , ein Versprechen, das bleibt.
            </p>
          </motion.div>

          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src={workshopDetail}
                alt="Präzisionsfertigung , CNC-Detail"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                width={1408}
                height={1600}
              />
              <div className="absolute inset-0 ring-1 ring-black/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. BRIEF DES GRÜNDERS ═══ */}
      <section className="border-b" style={{ borderColor: L.border }}>
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 md:py-36">
          <motion.p {...fade} className="text-[11px] tracking-[0.32em] uppercase font-medium mb-6" style={{ color: L.gold }}>
            , Ein Brief
          </motion.p>
          <motion.h2 {...fade} className="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-14">
            Warum RAJ existiert.
          </motion.h2>

          <div className="space-y-8 text-lg md:text-xl leading-[1.75]" style={{ color: L.textMuted }}>
            <motion.p {...fade}>
              Ich habe 16 Jahre lang Präzisionsteile für andere gebaut , Toleranzen im
              Hundertstel-Millimeter-Bereich, für Produkte, die niemand je mit meinem Namen
              in Verbindung bringen würde. Ich habe gelernt, was ein Detail wert ist, das
              niemand sieht, aber jeder spürt, wenn es fehlt.
            </motion.p>

            <motion.p {...fade}>
              Was mich dabei immer gestört hat: die meisten Alltagsprodukte, die uns umgeben,
              sind genau andersherum gebaut. Laut im Auftritt, dünn in der Substanz. Ein
              Ladegerät, das nach drei Monaten wackelt. Ein Kabel, das man täglich sucht.
              Technik, die sich anfühlt, als müsste man sich für sie entschuldigen.
            </motion.p>

            <motion.blockquote
              {...fade}
              className="border-l-2 pl-6 my-12 italic text-2xl md:text-3xl font-light leading-snug"
              style={{ borderColor: L.gold, color: L.text }}
            >
              Unsere Vision ist einfach: Power, die einfach da ist, wenn du sie brauchst 
              ohne Nachdenken, ohne Kompromiss.
            </motion.blockquote>

            <motion.p {...fade}>
              Deshalb baue ich RAJ nach denselben Massstäben, die ich 16 Jahre lang für andere
              angewendet habe , nur jetzt für Menschen, die das direkt in der Hand spüren.
              Unsere Mission ist entsprechend konkret: Energie mit Substanz. Klar im Design,
              ehrlich in der Leistung, ohne versteckte Kompromisse im Material oder im Preis.
            </motion.p>

            <motion.p {...fade}>
              Das heisst auch: RAJ wird nie 20 Produkte gleichzeitig haben, nur damit das
              Sortiment grösser aussieht. Lieber wenige Dinge, die wir vollständig verstehen
              und verantworten , bevor das nächste entsteht.
            </motion.p>

            <motion.p {...fade}>
              Ich trete bewusst nicht mit Gesicht auf , noch nicht. Was zählt, ist, was wir
              bauen, nicht wer davorsteht.
            </motion.p>
          </div>

          <motion.div {...fade} className="mt-14 pt-10 border-t flex items-end gap-6" style={{ borderColor: L.border }}>
            <img
              src={founderSignature}
              alt="Unterschrift des Gründers"
              className="h-14 w-auto"
              style={{ color: L.text }}
            />
            <div className="pb-1">
              <p className="text-sm font-medium" style={{ color: L.text }}>Gründer, RAJ GmbH</p>
              <p className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: L.textMuted }}>Weinfelden, Thurgau</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3. STORY / URSPRUNG ═══ */}
      <section className="border-b" style={{ borderColor: L.border }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
          <motion.div {...fade} className="md:col-span-6 order-2 md:order-1">
            <p className="text-[11px] tracking-[0.32em] uppercase font-medium mb-6" style={{ color: L.gold }}>
              , Ursprung
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight mb-8">
              Ein leiser Anfang im Thurgau.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: L.textMuted }}>
              Alles, was heute unverzichtbar wirkt, begann einmal im Stillen. RAJ entstand nicht
              in einem Startup-Loft, sondern aus über einem Jahrzehnt Erfahrung mit Toleranzen im
              Hundertstel-Millimeter-Bereich , übertragen auf Produkte, die man täglich anfasst.
            </p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }} className="md:col-span-6 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src={precisionCraft}
                alt="Handwerk & Präzision"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                width={1408}
                height={1600}
              />
              <div className="absolute inset-0 ring-1 ring-black/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. GRUNDSÄTZE ═══ */}
      <section className="border-b" style={{ borderColor: L.border }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32">
          <motion.div {...fade} className="mb-16 md:mb-20">
            <p className="text-[11px] tracking-[0.32em] uppercase font-medium mb-4" style={{ color: L.gold }}>
              , Was uns antreibt
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">Unsere Grundsätze.</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.n}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.08 }}
                className="border-t pt-6"
                style={{ borderColor: L.border }}
              >
                <p className="text-xs tracking-[0.25em] font-medium mb-6" style={{ color: L.gold }}>{v.n}</p>
                <h3 className="text-xl font-medium mb-3">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: L.textMuted }}>{v.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. VON HIER , Karte ═══ */}
      <section className="border-b" style={{ borderColor: L.border }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32">
          <motion.div {...fade} className="mb-14 text-center">
            <p className="text-[11px] tracking-[0.32em] uppercase font-medium mb-4" style={{ color: L.gold }}>
              , Herkunft
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">Von hier. Für die Welt.</h2>
          </motion.div>

          <motion.div {...fade} className="relative rounded-sm overflow-hidden border" style={{ borderColor: L.border }}>
            <div className="relative aspect-[16/9] md:aspect-[16/7]">
              <img
                src={thurgauMap}
                alt="RAJ , Swiss Brand mit Sitz im Kanton Thurgau"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="inline-flex items-center gap-3 text-[10px] md:text-xs tracking-[0.32em] uppercase font-medium" style={{ color: L.gold }}>
                  <span className="h-px w-8" style={{ background: L.gold, opacity: 0.5 }} />
                  Swiss Brand · Kanton Thurgau
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 6. CTA ═══ */}
      <section>
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 md:py-32 text-center">
          <motion.p {...fade} className="text-[11px] md:text-xs tracking-[0.32em] uppercase font-medium mb-8 inline-flex items-center gap-3" style={{ color: L.gold }}>
            <span className="h-px w-8" style={{ background: L.gold, opacity: 0.5 }} />
            Präzision · Beständigkeit · Charakter
            <span className="h-px w-8" style={{ background: L.gold, opacity: 0.5 }} />
          </motion.p>
          <motion.h2 {...fade} className="text-3xl md:text-4xl font-light tracking-tight leading-snug mb-12">
            RAJ steht für Produkte, die funktionieren.
            <br />
            Einfach. Ohne Kompromisse.
          </motion.h2>
          <motion.div {...fade}>
            <Link
              to="/produkte"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all hover:gap-4"
              style={{ background: L.text, color: L.bg }}
            >
              Unsere Produkte entdecken
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

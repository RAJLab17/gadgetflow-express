import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import nexusHero800Asset from "@/assets/products/nexus-hero-v2-800w.webp.asset.json";
import nexusHero1200Asset from "@/assets/products/nexus-hero-v2-1200w.webp.asset.json";
import matrixImageAsset from "@/assets/home/matrix-cherry-raj-home.png.asset.json";
import matrixFallback from "@/assets/home/objekt-matrix-premium.webp";
import apexCarImage from "@/assets/home/objekt-apex-correct.jpg";

const TITLE = "Über RAJ – Schweizer Marke für Apple-Zubehör aus Weinfelden";
const DESCRIPTION =
  "RAJ ist eine Schweizer Marke für Apple-Zubehör aus Weinfelden. Geprüfte Qualität, 3 Jahre Garantie, Lieferung in 1 bis 2 Werktagen und persönlicher Support.";

/**
 * Hero photo. Placeholder until the owner's own landscape photo (~1600×1000) is uploaded;
 * replace these two entries to swap it.
 */
const HERO_IMAGE = {
  src: nexusHero1200Asset.url,
  srcSet: `${nexusHero800Asset.url} 800w, ${nexusHero1200Asset.url} 1200w`,
  alt: "RAJ NEXUS 3-in-1 Ladestation mit iPhone, Apple Watch und AirPods",
};

/** Team photo (portrait ~1000×1250). Set src once the owner's photo is uploaded. */
const TEAM_IMAGE: { src: string; alt: string } | null = null;

const MESSAGE = [
  "Hinter RAJ stehen über 16 Jahre Erfahrung in der Präzisionsindustrie. Toleranzen im Hundertstel-Millimeter, für Produkte, die niemand mit unserem Namen in Verbindung gebracht hat. Dabei haben wir gelernt, was ein Detail wert ist, das niemand sieht, aber jeder spürt, sobald es fehlt.",
  "Die meisten Dinge, die uns täglich umgeben, sind andersherum gebaut. Laut im Auftritt, dünn in der Substanz. Das Ladegerät, das nach drei Monaten wackelt. Das Kabel, das man jeden Morgen sucht.",
  "RAJ ist die Gegenbewegung. Dinge, die einfach da sind, wenn du sie brauchst. Ohne Nachdenken, ohne Ausrede.",
  "Jedes Produkt wählen, prüfen und begleiten wir mit denselben Massstäben. Klar im Design, ehrlich im Preis. Und wenn einmal etwas nicht stimmt, sind wir persönlich für dich da.",
  "Darum wird RAJ nie 20 Produkte gleichzeitig führen. Lieber wenige Dinge, für die wir geradestehen.",
];

const PROMISES = [
  { icon: ShieldCheck, title: "Geprüfte Qualität", copy: "Qi2.2-zertifiziert nach WPC-Standard. Materialien nach RoHS und REACH geprüft." },
  { icon: BadgeCheck, title: "3 Jahre Garantie", copy: "auf den RAJ NEXUS. 30 Tage Rückgabe auf alle Produkte." },
  { icon: Truck, title: "Schnell bei dir", copy: "Versand aus der Schweiz, Lieferung in 1 bis 2 Werktagen. Immer gratis." },
  { icon: MessageCircle, title: "Persönlicher Support", copy: "Keine Hotline, kein Ticketsystem. Du schreibst uns, wir antworten innerhalb von 24 Stunden." },
];

const COLLECTION = [
  {
    name: "RAJ NEXUS",
    copy: "3-in-1 Qi2.2 Ladestation für iPhone, Apple Watch und AirPods.",
    link: "/nexus",
    img: "/assets/products/nexus-bedside-night.webp",
    alt: "RAJ NEXUS 3-in-1 Ladestation auf einem Nachttisch",
    fallback: undefined as string | undefined,
  },
  {
    name: "RAJ MATRIX",
    copy: "Hülle im Carbon-Look für iPhone 17 und 18 Pro.",
    link: "/matrix",
    img: matrixImageAsset.url,
    alt: "RAJ MATRIX Hülle im Carbon-Look mit goldenem Emblem",
    fallback: matrixFallback,
  },
  {
    name: "RAJ APEX",
    copy: "Kabellose Ladehalterung fürs Auto. Bald verfügbar.",
    link: "/apex",
    img: apexCarImage,
    alt: "RAJ APEX kabellose Ladehalterung im Auto",
    fallback: undefined,
  },
];

const FACTS = ["Gegründet 2026", "RAJ GmbH", "Weinfelden TG", "UID CHE-336.124.813"];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.32em] text-primary">{children}</p>
);

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background font-light text-foreground">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://raj.ch/about" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://raj.ch/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Helmet>

      <Header />

      <main>
        {/* 1. HERO */}
        <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 md:pt-28">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <Eyebrow>Über RAJ</Eyebrow>
            <h1 className="text-[clamp(2.4rem,7vw,4.75rem)] font-light leading-[1.02] tracking-tight">
              Durchdacht bis ins Detail.
            </h1>
            <p className="mx-auto mt-7 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              RAJ ist eine Schweizer Marke für Apple-Zubehör, gegründet 2026 in Weinfelden, Thurgau.
            </p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="mt-14 md:mt-20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-card sm:aspect-[16/10]">
              <img
                src={HERO_IMAGE.src}
                srcSet={HERO_IMAGE.srcSet}
                sizes="(max-width: 1200px) 100vw, 1152px"
                alt={HERO_IMAGE.alt}
                width={1600}
                height={1000}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* 2. BOTSCHAFT DES TEAMS */}
        <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-36">
          <div className="grid gap-14 md:grid-cols-12 md:gap-16">
            <motion.div {...fade} className="md:col-span-7">
              <Eyebrow>Unsere Haltung</Eyebrow>
              <h2 className="mb-10 text-3xl font-light tracking-tight md:text-5xl">Warum RAJ existiert.</h2>
              <div className="space-y-6 text-base leading-[1.8] text-muted-foreground md:text-lg">
                {MESSAGE.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <blockquote className="my-12 border-l-2 border-primary pl-6 text-2xl font-light italic leading-snug text-primary md:text-3xl">
                «Dinge, die einfach da sind, wenn du sie brauchst.»
              </blockquote>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Team RAJ · Weinfelden, Thurgau
              </p>
            </motion.div>
            <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="md:col-span-5 md:pt-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
                {TEAM_IMAGE && (
                  <img
                    src={TEAM_IMAGE.src}
                    alt={TEAM_IMAGE.alt}
                    width={1000}
                    height={1250}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. UNSER VERSPRECHEN */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <motion.div {...fade} className="mb-12 md:mb-16">
              <Eyebrow>Unser Versprechen</Eyebrow>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">Worauf du dich verlassen kannst.</h2>
            </motion.div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-8">
              {PROMISES.map(({ icon: Icon, title, copy }, i) => (
                <motion.div
                  key={title}
                  {...fade}
                  transition={{ ...fade.transition, delay: i * 0.06 }}
                  className="border-t border-border pt-6"
                >
                  <Icon className="mb-5 h-6 w-6 text-primary" strokeWidth={1.1} aria-hidden />
                  <h3 className="mb-2 text-base font-medium md:text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. DIE KOLLEKTION */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl py-24 md:px-8 md:py-32">
            <motion.div {...fade} className="mb-12 px-5 md:mb-16 md:px-0">
              <Eyebrow>Die Kollektion</Eyebrow>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">Wenige Produkte. Jedes mit einem Grund.</h2>
            </motion.div>
            <div className="flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              {COLLECTION.map((p) => (
                <Link
                  key={p.name}
                  to={p.link}
                  className="group block w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto"
                  aria-label={`${p.name} entdecken`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-card">
                    <img
                      src={p.img}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      onError={
                        p.fallback
                          ? (e) => {
                              if (e.currentTarget.src !== p.fallback) e.currentTarget.src = p.fallback!;
                            }
                          : undefined
                      }
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FAKTEN */}
        <section className="border-t border-border">
          <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3 py-8 text-[10px] uppercase tracking-[0.06em] sm:gap-x-2.5 sm:text-[11px] sm:tracking-[0.18em] text-muted-foreground sm:px-8">
            {FACTS.map((f, i) => (
              <span key={f} className="inline-flex items-center gap-1.5 sm:gap-2.5">
                {i > 0 && <span className="text-primary" aria-hidden>·</span>}
                {f}
              </span>
            ))}
          </p>
        </section>

        {/* 6. ABSCHLUSS */}
        <section className="border-t border-border">
          <motion.div {...fade} className="mx-auto max-w-2xl px-5 py-24 text-center md:py-32">
            <h2 className="mb-10 text-3xl font-light tracking-tight md:text-4xl">Fragen? Schreib uns direkt.</h2>
            <div className="flex flex-row justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/kontakt">Kontakt</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/produkte">Produkte entdecken</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

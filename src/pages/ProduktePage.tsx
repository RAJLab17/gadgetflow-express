import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import nexusAsset from "@/assets/products/nexus-transparent.webp.asset.json";
import apexAsset from "@/assets/products/apex-transparent.webp.asset.json";

const H = {
  bg: "#faf9f7",
  bgSoft: "#ffffff",
  gold: "#9b6b3f",
  goldDeep: "#7a5230",
  line: "rgba(43,39,37,0.10)",
  text: "#2b2725",
  textMuted: "rgba(43,39,37,0.55)",
};

interface Product {
  index: string;
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  status: string;
  link: string;
  img: string;
  imgAlt: string;
  specs: { label: string; value: string }[];
}

const PRODUCTS: Product[] = [
  {
    index: "01",
    id: "nexus",
    name: "NEXUS",
    tagline: "Drei Geräte. Ein Objekt.",
    description:
      "Das 3-in-1 Ladeobjekt für den Nachttisch. Offiziell Qi2.2-zertifiziert, 25 Watt, präzise gefertigt. Für iPhone, Apple Watch und AirPods — in einer einzigen, ruhigen Geste.",
    price: "CHF 99.–",
    status: "Verfügbar",
    link: "/nexus",
    img: nexusAsset.url,
    imgAlt: "RAJ NEXUS 3-in-1 Wireless Charger",
    specs: [
      { label: "Standard", value: "Qi2.2 · 25 W" },
      { label: "Geräte", value: "iPhone · Watch · AirPods" },
      { label: "Herkunft", value: "Swiss Brand" },
    ],
  },
  {
    index: "02",
    id: "apex",
    name: "APEX",
    tagline: "Halt im Bewegten.",
    description:
      "Die MagSafe-Ladehalterung fürs Auto. Mit Saug- und Lüftungsmontage, aktiver Kühlung, USB-C-Kabel und Kfz-Adapter im Lieferumfang. Ein Objekt für jede Situation.",
    price: "ab CHF 69.–",
    status: "Early Access",
    link: "/apex",
    img: apexAsset.url,
    imgAlt: "RAJ APEX MagSafe Auto-Ladehalterung",
    specs: [
      { label: "Standard", value: "Qi2 · 25 W" },
      { label: "Montage", value: "Saugnapf · Lüftung" },
      { label: "Enthalten", value: "Kabel · Kfz-Adapter" },
    ],
  },
];

const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `RAJ ${p.name}`,
    url: `https://raj.ch${p.link}`,
    image: `https://raj.ch${p.img}`,
  })),
};

const Chapter = ({ product, reverse }: { product: Product; reverse: boolean }) => (
  <article
    className="relative border-t"
    style={{ borderColor: H.line }}
  >
    <div className="container mx-auto px-6 max-w-6xl py-16 md:py-28">
      <div className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        {/* Image column */}
        <div className="md:col-span-7 relative">
          <div className="relative aspect-[4/5] md:aspect-[5/6] flex items-center justify-center">
            {/* Radial gold glow behind product */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 55% at 50% 50%, rgba(201,168,118,0.22) 0%, rgba(201,168,118,0.06) 40%, rgba(10,9,8,0) 72%)",
              }}
            />
            {/* Faint horizon line */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-[68%] h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${H.line}, transparent)` }}
            />
            {/* Giant index number */}
            <span
              aria-hidden
              className="absolute -top-2 md:-top-6 left-0 select-none font-light leading-none"
              style={{
                fontSize: "clamp(120px, 22vw, 260px)",
                color: "transparent",
                WebkitTextStroke: `1px ${H.line}`,
                letterSpacing: "-0.04em",
              }}
            >
              {product.index}
            </span>

            <img
              src={product.img}
              alt={product.imgAlt}
              width={900}
              height={900}
              loading={product.id === "nexus" ? "eager" : "lazy"}
              decoding="async"
              className="relative z-10 max-h-[78%] w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" }}
            />
          </div>
        </div>

        {/* Text column */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: H.gold }} />
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-medium"
              style={{ color: H.gold }}
            >
              {product.index} · {product.status}
            </span>
          </div>

          <h2
            className="font-light leading-[0.95] tracking-tight mb-4"
            style={{ fontSize: "clamp(48px, 6vw, 88px)", color: H.text, letterSpacing: "-0.02em" }}
          >
            {product.name}
          </h2>
          <p
            className="italic mb-8"
            style={{ fontSize: "clamp(18px, 1.6vw, 22px)", color: H.gold, letterSpacing: "0.01em" }}
          >
            {product.tagline}
          </p>

          <p
            className="text-base leading-relaxed mb-10 max-w-md"
            style={{ color: H.textMuted }}
          >
            {product.description}
          </p>

          {/* Specs */}
          <dl className="mb-10 space-y-3">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between gap-6 border-b pb-3"
                style={{ borderColor: H.line }}
              >
                <dt
                  className="text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: H.textMuted }}
                >
                  {s.label}
                </dt>
                <dd className="text-sm font-medium" style={{ color: H.text }}>
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-6">
            <span
              className="font-light"
              style={{ fontSize: "clamp(22px, 2vw, 28px)", color: H.text }}
            >
              {product.price}
            </span>
            <Link
              to={product.link}
              className="group/cta inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium border-b pb-1 transition-colors"
              style={{ color: H.gold, borderColor: H.gold }}
            >
              Entdecken
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </article>
);

const ProduktePage = () => (
  <>
    <Helmet>
      <title>Kollektion — NEXUS & APEX | RAJ</title>
      <meta
        name="description"
        content="Die RAJ Kollektion: NEXUS 3-in-1 Wireless Charger und APEX MagSafe Auto-Ladehalterung. Premium-Objekte, Swiss Brand, Qi2, 25 W."
      />
      <link rel="canonical" href="https://raj.ch/produkte" />
      <meta property="og:title" content="Kollektion — NEXUS & APEX | RAJ" />
      <meta property="og:description" content="Premium-Objekte mit Substanz: NEXUS und APEX." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://raj.ch/produkte" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(ITEM_LIST_JSON_LD)}</script>
    </Helmet>

    <div className="min-h-screen" style={{ background: H.bg, color: H.text }}>
      <Header />
      <main>
        {/* Editorial masthead */}
        <section className="pt-32 pb-14 md:pt-44 md:pb-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-10" style={{ background: H.gold }} />
              <span
                className="text-[10px] uppercase tracking-[0.35em] font-medium"
                style={{ color: H.gold }}
              >
                Kollektion · MMXXVI
              </span>
            </div>
            <h1
              className="font-light leading-[0.9] tracking-tight max-w-4xl"
              style={{
                fontSize: "clamp(56px, 10vw, 160px)",
                color: H.text,
                letterSpacing: "-0.035em",
              }}
            >
              Objekte,<br />
              <span style={{ fontStyle: "italic", color: H.gold, fontWeight: 300 }}>
                die bleiben.
              </span>
            </h1>
            <p
              className="mt-10 max-w-md text-base md:text-lg leading-relaxed"
              style={{ color: H.textMuted }}
            >
              Zwei Stücke. Kein Katalog. Jedes Objekt aus der RAJ-Werkstatt entsteht
              mit einer einzigen Absicht — es soll länger dienen als der Trend, der es umgibt.
            </p>
          </div>
        </section>

        {/* Product chapters */}
        {PRODUCTS.map((product, i) => (
          <div key={product.id} className="group">
            <Chapter product={product} reverse={i % 2 === 1} />
          </div>
        ))}

        {/* Coda */}
        <section
          className="border-t"
          style={{ borderColor: H.line }}
        >
          <div className="container mx-auto px-6 max-w-6xl py-20 md:py-28 text-center">
            <span
              className="text-[10px] uppercase tracking-[0.35em] font-medium"
              style={{ color: H.gold }}
            >
              Fortsetzung folgt
            </span>
            <p
              className="mt-6 mx-auto max-w-2xl font-light leading-tight"
              style={{
                fontSize: "clamp(28px, 3.6vw, 48px)",
                color: H.text,
                letterSpacing: "-0.02em",
              }}
            >
              Weitere Objekte entstehen —{" "}
              <span style={{ fontStyle: "italic", color: H.gold }}>
                langsam, geduldig, unaufgeregt.
              </span>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default ProduktePage;

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const H = {
  gold: "#9b6b3f",
  goldLight: "#C9A876",
  border: "#E8E2D6",
  text: "#1A1A1A",
  textMuted: "#6B6358",
  surface: "#FAF9F7",
};

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  status: string;
  link: string;
  img: string;
  imgAlt: string;
}

const PRODUCTS: Product[] = [
  {
    id: "nexus",
    name: "RAJ NEXUS",
    tagline: "3-in-1 Wireless Charger · Qi2.2 · 25 W",
    description:
      "Ein Ladegerät für iPhone, Apple Watch und AirPods. Schweizer Präzision für den Nachttisch — kompakt, elegant und mit offiziellem Qi2.",
    price: "CHF 99.–",
    status: "Jetzt verfügbar",
    link: "/nexus",
    img: "/assets/products/nexus-real-hero-floating-white.webp",
    imgAlt: "RAJ NEXUS 3-in-1 Wireless Charger auf hellem Hintergrund",
  },
  {
    id: "apex",
    name: "RAJ APEX",
    tagline: "MagSafe Auto-Ladehalterung · Qi2 · 25 W",
    description:
      "Saug- oder Lüftungsmontage, aktive Kühlung, USB-C Kabel und Kfz-Ladeadapter inklusive. Für jedes Auto, jede Situation.",
    price: "ab CHF 69.–",
    status: "Early Access",
    link: "/apex",
    img: "/assets/products/apex-card-900.webp",
    imgAlt: "RAJ APEX MagSafe Auto-Ladehalterung in Silber",
  },
];

const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    url: `https://raj.ch${p.link}`,
    image: `https://raj.ch${p.img}`,
  })),
};

const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={product.link}
    className="group flex flex-col bg-white rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl"
    style={{ borderColor: H.border }}
  >
    <div className="relative aspect-[4/3] overflow-hidden" style={{ background: H.surface }}>
      <img
        src={product.img}
        alt={product.imgAlt}
        width={900}
        height={900}
        loading={product.id === "nexus" ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <span
          className="text-[10px] uppercase tracking-[0.2em] font-semibold"
          style={{ color: H.gold }}
        >
          {product.status}
        </span>
        <span className="text-xl font-bold" style={{ color: H.text }}>
          {product.price}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: H.text }}>
        {product.name}
      </h2>
      <p className="text-sm font-medium mb-2" style={{ color: H.textMuted }}>
        {product.tagline}
      </p>
      <p className="text-sm leading-relaxed mb-6" style={{ color: H.textMuted }}>
        {product.description}
      </p>
      <div className="mt-auto flex items-center gap-2 text-sm font-semibold" style={{ color: H.gold }}>
        Mehr erfahren
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </Link>
);

const ProduktePage = () => (
  <>
    <Helmet>
      <title>Produkte — RAJ NEXUS & APEX | RAJ</title>
      <meta
        name="description"
        content="Entdecke die RAJ Produktwelt: NEXUS 3-in-1 Wireless Charger und APEX MagSafe Auto-Ladehalterung. Swiss Brand, Qi2, 25 W."
      />
      <link rel="canonical" href="https://raj.ch/produkte" />
      <meta property="og:title" content="Produkte — RAJ NEXUS & APEX | RAJ" />
      <meta property="og:description" content="Premium-Technologie mit Substanz: NEXUS und APEX." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://raj.ch/produkte" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(ITEM_LIST_JSON_LD)}</script>
    </Helmet>

    <div className="min-h-screen" style={{ background: "#FFFFFF", color: H.text }}>
      <Header />
      <main>
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 md:mb-16">
              <p
                className="text-xs uppercase tracking-[0.25em] font-medium mb-4"
                style={{ color: H.gold }}
              >
                Produkte
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: H.text }}>
                Unsere Produkte
              </h1>
              <p className="mt-4 text-base md:text-lg max-w-xl mx-auto" style={{ color: H.textMuted }}>
                Premium-Technologie mit Substanz. Für Zuhause und unterwegs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default ProduktePage;

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import matrixImageAsset from "@/assets/home/matrix-cherry-raj-home.png.asset.json";
import matrixFallback from "@/assets/home/objekt-matrix-premium.webp";
import apexCarImage from "@/assets/home/objekt-apex-correct.jpg";

const matrixImg = matrixImageAsset.url;

interface Product {
  index: string;
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

const products: Product[] = [
  {
    index: "01",
    name: "NEXUS",
    tagline: "Drei Geräte. Ein Objekt.",
    description:
      "Das 3-in-1 Ladeobjekt für den Nachttisch. Offiziell Qi2.2-zertifiziert, 25 Watt, präzise gefertigt.",
    price: "CHF 99.–",
    status: "Verfügbar",
    link: "/nexus",
    img: "/assets/products/nexus-bedside-night.webp",
    imgAlt: "RAJ NEXUS 3-in-1 Wireless Charger auf einem Nachttisch",
    specs: [
      { label: "Standard", value: "Qi2.2 · 25 W" },
      { label: "Geräte", value: "iPhone · Watch · AirPods" },
    ],
  },
  {
    index: "02",
    name: "MATRIX",
    tagline: "Schutz mit Charakter.",
    description:
      "Carbon-Cases für iPhone und AirPods. Cherry Carbon oder Schwarz Carbon, goldene Knöpfe, MagSafe-kompatibel.",
    price: "ab CHF 59.–",
    status: "Als Nächstes",
    link: "/matrix",
    img: matrixImg,
    imgAlt: "RAJ MATRIX Carbon-Case in Cherry Carbon mit goldenen Details auf einem Podest",
    specs: [
      { label: "Material", value: "Carbon" },
      { label: "Modelle", value: "iPhone 17/18 Pro" },
    ],
  },
  {
    index: "03",
    name: "APEX",
    tagline: "Halt im Bewegten.",
    description:
      "Die MagSafe-Ladehalterung fürs Auto. Mit Saug- und Lüftungsmontage, aktiver Kühlung und 25 Watt.",
    price: "ab CHF 69.–",
    status: "Early Access",
    link: "/apex",
    img: apexCarImage,
    imgAlt: "RAJ APEX MagSafe Auto-Ladehalterung im Fahrzeug",
    specs: [
      { label: "Standard", value: "Qi2 · 25 W" },
      { label: "Montage", value: "Saugnapf · Lüftung" },
    ],
  },
];

const ProductDetails = ({ product }: { product: Product }) => (
  <div className="px-1 pt-6 text-center md:px-3 md:pt-8">
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-7 bg-primary" aria-hidden />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        {product.index} / {product.status}
      </span>
      <span className="h-px w-7 bg-primary" aria-hidden />
    </div>

    <h2 className="text-3xl font-light leading-none text-foreground md:text-4xl">{product.name}</h2>
    <p className="mt-3 text-sm font-medium text-primary">{product.tagline}</p>
    <p className="mx-auto mt-5 max-w-sm text-sm font-light leading-7 text-muted-foreground">
      {product.description}
    </p>

    <dl className="mt-7 border-t border-border">
      {product.specs.map((spec) => (
        <div key={spec.label} className="flex items-center justify-between gap-6 border-b border-border py-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {spec.label}
          </dt>
          <dd className="text-right text-xs font-medium text-foreground">{spec.value}</dd>
        </div>
      ))}
    </dl>

    <div className="mt-7 flex items-center justify-between gap-5">
      <span className="text-xl font-light text-foreground">{product.price}</span>
      <Link
        to={product.link}
        className="group inline-flex items-center gap-2 border-b border-primary pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground"
      >
        Entdecken
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  </div>
);

const ProduktePage = () => {
  const [nexus, matrix, apex] = products;

  if (!nexus || !matrix || !apex) return null;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `RAJ ${product.name}`,
      url: `https://raj.ch${product.link}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Kollektion — NEXUS, MATRIX & APEX | RAJ</title>
        <meta
          name="description"
          content="Die RAJ Kollektion: NEXUS 3-in-1 Wireless Charger, MATRIX Carbon-Cases und APEX MagSafe Auto-Ladehalterung. Premium-Objekte, Swiss Brand."
        />
        <link rel="canonical" href="https://raj.ch/produkte" />
        <meta property="og:title" content="Kollektion — NEXUS, MATRIX & APEX | RAJ" />
        <meta property="og:description" content="Premium-Objekte mit Substanz: NEXUS, MATRIX und APEX." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://raj.ch/produkte" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="overflow-hidden pb-24 pt-28 md:pb-32 md:pt-40">
          <header className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <div className="raj-rise-sm inline-flex items-center gap-3 border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              RAJ Kollektion · 2026
            </div>
            <h1 className="raj-rise mt-7 text-5xl font-light leading-none text-foreground sm:text-6xl md:text-8xl">
              Drei Objekte.
              <span className="mt-2 block text-primary">Eine klare Idee.</span>
            </h1>
            <p className="raj-rise-sm mx-auto mt-7 max-w-xl text-sm font-light leading-7 text-muted-foreground md:text-base">
              Technik, die sich zurücknimmt. Präzise gestaltet für die Momente, in denen sie gebraucht wird.
            </p>
          </header>

          <section className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-x-8 gap-y-20 px-5 sm:px-8 md:mt-28 md:grid-cols-3 lg:gap-x-12">
            <article className="group">
              <Link to={nexus.link} className="block" aria-label="RAJ NEXUS entdecken">
                <div className="relative aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src={nexus.img}
                    alt={nexus.imgAlt}
                    width={768}
                    height={1376}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-5 top-5 bg-background/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
                    Das Original
                  </span>
                </div>
              </Link>
              <ProductDetails product={nexus} />
            </article>

            <article className="group">
              <Link to={matrix.link} className="block" aria-label="RAJ MATRIX entdecken">
                <div className="relative aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src={matrix.img}
                    alt={matrix.imgAlt}
                    width={1050}
                    height={1406}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      if (event.currentTarget.src !== matrixFallback) event.currentTarget.src = matrixFallback;
                    }}
                    className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" aria-hidden />
                  <span className="absolute left-5 top-5 border border-background/30 bg-foreground/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-background backdrop-blur-sm">
                    Als Nächstes
                  </span>
                </div>
              </Link>
              <ProductDetails product={matrix} />
            </article>

            <article className="group">
              <Link to={apex.link} className="block" aria-label="RAJ APEX entdecken">
                <div className="relative aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src={apex.img}
                    alt={apex.imgAlt}
                    width={900}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-5 top-5 bg-background/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
                    Unterwegs
                  </span>
                </div>
              </Link>
              <ProductDetails product={apex} />
            </article>
          </section>

          <section className="mx-auto mt-28 max-w-6xl border-t border-border px-5 pt-14 text-center sm:px-8 md:mt-40 md:pt-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Swiss Luxury Tech</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-light leading-tight text-foreground md:text-5xl">
              Für ein Setup, das ruhiger aussieht und besser funktioniert.
            </h2>
            <Button asChild className="mt-8 rounded-none px-7">
              <Link to="/nexus">Mit NEXUS beginnen</Link>
            </Button>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProduktePage;
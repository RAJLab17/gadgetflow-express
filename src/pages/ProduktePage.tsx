import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import matrixImg from "@/assets/home/objekt-matrix-premium.webp";

interface Product {
  index: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  status: string;
  link: string;
  img?: string;
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
    price: "ab CHF 49.–",
    status: "Als Nächstes",
    link: "/matrix",
    img: matrixImg,
    imgAlt: "RAJ MATRIX Carbon-Case in Cherry Carbon mit goldenen Details",
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
    imgAlt: "RAJ APEX MagSafe Auto-Ladehalterung in Silber",
    specs: [
      { label: "Standard", value: "Qi2 · 25 W" },
      { label: "Montage", value: "Saugnapf · Lüftung" },
    ],
  },
];

const ProductDetails = ({ product, compact = false }: { product: Product; compact?: boolean }) => (
  <div className={compact ? "pt-6" : "pt-7 md:pt-8"}>
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-primary" aria-hidden />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        {product.index} / {product.status}
      </span>
    </div>

    <h2 className="text-4xl font-light leading-none text-foreground md:text-5xl">{product.name}</h2>
    <p className="mt-3 text-sm font-medium text-primary">{product.tagline}</p>
    <p className="mt-5 max-w-md text-sm font-light leading-7 text-muted-foreground">
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

          <section className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-x-12 gap-y-20 px-5 sm:px-8 md:mt-32 md:grid-cols-12 md:gap-y-32">
            <article className="group md:col-span-7">
              <Link to={nexus.link} className="block" aria-label="RAJ NEXUS entdecken">
                <div className="relative aspect-[4/5] overflow-hidden bg-card">
                  <div className="absolute inset-5 border border-border md:inset-8" aria-hidden />
                  <img
                    src={nexus.img}
                    alt={nexus.imgAlt}
                    width={768}
                    height={1376}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                  <span className="absolute bottom-5 left-5 bg-background/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm md:bottom-8 md:left-8">
                    01 / Das Original
                  </span>
                </div>
              </Link>
              <ProductDetails product={nexus} />
            </article>

            <article className="group md:col-span-5 md:mt-40">
              <Link to={matrix.link} className="block" aria-label="RAJ MATRIX entdecken">
                <div className="relative aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src={matrix.img}
                    alt={matrix.imgAlt}
                    width={1050}
                    height={1406}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" aria-hidden />
                  <span className="absolute bottom-5 left-5 border border-background/30 bg-foreground/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-background backdrop-blur-sm md:bottom-8 md:left-8">
                    02 / Als Nächstes
                  </span>
                </div>
              </Link>
              <ProductDetails product={matrix} compact />
            </article>

            <article className="group md:col-span-8 md:col-start-3">
              <Link to={apex.link} className="block" aria-label="RAJ APEX entdecken">
                <div className="relative aspect-[4/3] overflow-hidden bg-card md:aspect-[16/8]">
                  <div className="absolute inset-5 border border-border md:inset-8" aria-hidden />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transition-transform duration-700 ease-out group-hover:scale-[1.025]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Unterwegs</p>
                      <p className="mt-5 text-5xl font-light tracking-[0.08em] text-foreground md:text-7xl">APEX</p>
                      <div className="mx-auto mt-6 h-px w-14 bg-primary" />
                    </div>
                  </div>
                  <span className="absolute bottom-5 left-5 bg-background/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm md:bottom-8 md:left-8">
                    03 / Unterwegs
                  </span>
                </div>
              </Link>
              <div className="md:grid md:grid-cols-2 md:gap-16">
                <ProductDetails product={apex} />
                <div className="mt-9 hidden items-end border-l border-border pl-10 md:flex">
                  <p className="max-w-xs text-sm font-light leading-7 text-muted-foreground">
                    Vom Nachttisch bis ins Auto: Jedes RAJ Objekt folgt derselben Haltung — weniger Ablenkung, mehr Substanz.
                  </p>
                </div>
              </div>
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
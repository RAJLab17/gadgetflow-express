import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2, Check, Zap, Shield, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductVariantInfo, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import PaymentIcons from "@/components/PaymentIcons";
import SwissFlag from "@/components/SwissFlag";

import heroImg from "@/assets/products/charger-3in1-hero.png";
import angleImg from "@/assets/products/charger-3in1-angle.png";
import inuseImg from "@/assets/products/charger-3in1-inuse.png";
import specsImg from "@/assets/products/charger-3in1-specs-hero.png";
import lifestyleHome from "@/assets/products/charger-3in1-lifestyle-home.png";
import lifestyleOffice from "@/assets/products/charger-3in1-lifestyle-office.png";
import fastCharge from "@/assets/products/charger-3in1-fast-charge.png";

const NEXUS_HANDLE = "raj-nexus-3in1-wireless-charger";

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 5) { edges { node { url altText } } }
      variants(first: 10) {
        edges {
          node {
            id title availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

const ShopPreview = () => {
  const { addItem, isLoading, getCheckoutUrl, items } = useCartStore();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_QUERY, { handle: NEXUS_HANDLE });
        const node = data?.data?.productByHandle;
        if (node) {
          setProduct({ node });
          const v = node.variants?.edges?.[0]?.node;
          if (v) {
            setVariantId(v.id);
            setAvailable(v.availableForSale ?? true);
          }
        }
        const info = await fetchProductVariantInfo(NEXUS_HANDLE);
        if (info) {
          setVariantId(info.variantId);
          setAvailable(info.availableForSale);
        }
      } catch (e) {
        console.error("Failed to load NEXUS:", e);
      }
    })();
  }, []);

  const price = product?.node.priceRange.minVariantPrice;
  const priceLabel = price ? `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}` : "CHF 99.00";

  const handleBuyNow = async () => {
    if (!variantId || !product) return;
    setAdding(true);
    try {
      const variant = product.node.variants.edges[0]?.node;
      await addItem({
        product,
        variantId,
        variantTitle: variant?.title || "Default",
        price: variant?.price || { amount: "99.00", currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: variant?.selectedOptions || [],
      });
      const url = useCartStore.getState().getCheckoutUrl();
      if (url) window.open(url, "_blank");
    } finally {
      setAdding(false);
    }
  };

  const scrollToBuy = () => {
    document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — Preview</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Minimal floating brand mark */}
        <div className="fixed top-6 left-6 z-40 mix-blend-difference">
          <span className="text-sm tracking-[0.3em] font-light text-white">RAJ</span>
        </div>

        {/* HERO — Cinematic */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 via-transparent to-background z-10" />
            <img
              src={heroImg}
              alt="RAJ NEXUS"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          <div className="relative z-20 text-center px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="space-y-6"
            >
              <span className="inline-block text-xs tracking-[0.4em] uppercase text-muted-foreground font-light">
                Eine neue Ära des Ladens
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.95]">
                NEXUS
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-light tracking-wide">
                3-in-1 Qi2.2 Wireless Charger.<br />
                Drei Geräte. Eine Geste.
              </p>
            </motion.div>
          </div>

          <motion.button
            onClick={scrollToBuy}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.5, duration: 1 }, y: { repeat: Infinity, duration: 2 } }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Scroll"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </section>

        {/* MANIFESTO */}
        <section className="py-32 md:py-48 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight"
            >
              Schluss mit Kabelsalat.<br />
              <span className="text-primary">Willkommen Klarheit.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-8 text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
            >
              iPhone, Apple Watch und AirPods — gleichzeitig, kabellos, in einer einzigen, eleganten Geste.
            </motion.p>
          </div>
        </section>

        {/* SHOWCASE — Product Glamour */}
        <section className="relative py-24 md:py-32 bg-card overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img src={angleImg} alt="RAJ NEXUS Detail" className="w-full rounded-2xl shadow-elegant-lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Design</span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
                Aus einem Guss.<br />Aus Aluminium.
              </h3>
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                Präzisionsgefertigtes Aluminiumgehäuse, mattes Finish, magnetische Ausrichtung.
                Ein Objekt, das auf jedem Nachttisch zuhause ist — und auf keinem fehl am Platz wirkt.
              </p>
              <ul className="space-y-3 pt-4">
                {["MagSafe-kompatibel mit Magnetausrichtung", "Faltbar und reisefreundlich", "Premium Soft-Touch Finish"].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-foreground/80">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-light">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* PERFORMANCE */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 md:mb-24"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Performance</span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight mt-4">Qi2.2 — 25 Watt</h3>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-light">
                Die nächste Generation des kabellosen Ladens. Schneller. Effizienter. Kühler.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "25W Schnellladung", desc: "Qi2.2-zertifiziert für maximale Geschwindigkeit ohne Wärmeverlust." },
                { icon: Shield, title: "Über-Temperaturschutz", desc: "Intelligenter Chip schützt Akku und Gerät bei jeder Ladung." },
                { icon: Sparkles, title: "Magnetische Präzision", desc: "Perfekte Ausrichtung auf den ersten Versuch — jedes Mal." },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <f.icon className="w-8 h-8 text-primary mb-6" strokeWidth={1.5} />
                  <h4 className="text-xl font-medium mb-3">{f.title}</h4>
                  <p className="text-muted-foreground font-light leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LIFESTYLE — Fullwidth image break */}
        <section className="relative h-[70vh] md:h-screen overflow-hidden">
          <motion.img
            src={lifestyleHome}
            alt="RAJ NEXUS im Alltag"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-16 md:bottom-24 left-0 right-0 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground"
              >
                Vom Nachttisch.<br />Zum Schreibtisch.<br />Zur Reise.
              </motion.h3>
            </div>
          </div>
        </section>

        {/* SPECS */}
        <section className="py-24 md:py-32 px-6 bg-card">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Spezifikationen</span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight mt-4">Im Detail.</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <img src={specsImg} alt="Specs" className="w-full rounded-2xl" />
              <dl className="space-y-6">
                {[
                  ["Standard", "Qi2.2"],
                  ["Leistung iPhone", "25 W"],
                  ["Leistung Apple Watch", "5 W"],
                  ["Leistung AirPods", "5 W"],
                  ["Anschluss", "USB-C"],
                  ["Material", "Aluminium · Soft-Touch"],
                  ["Farbe", "Space Black"],
                  ["Garantie", "2 Jahre"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline border-b border-border/60 pb-3">
                    <dt className="text-muted-foreground font-light">{k}</dt>
                    <dd className="text-foreground font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* BUY SECTION */}
        <section id="buy" className="py-24 md:py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <SwissFlag className="w-5 h-4" />
                <span className="font-light">Designed in Switzerland</span>
              </div>

              <h3 className="text-4xl md:text-6xl font-light tracking-tight">RAJ NEXUS</h3>

              <div className="flex items-baseline justify-center gap-4">
                <span className="text-5xl md:text-6xl font-light text-foreground">{priceLabel}</span>
              </div>

              <p className="text-muted-foreground font-light max-w-md mx-auto">
                Inkl. USB-C Kabel · Kostenloser Versand in der Schweiz · 30 Tage Rückgaberecht
              </p>

              <Button
                size="xl"
                onClick={handleBuyNow}
                disabled={!variantId || !available || adding || isLoading}
                className="min-w-[280px]"
              >
                {adding || isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : !available ? (
                  "Ausverkauft"
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Jetzt kaufen
                  </>
                )}
              </Button>

              <div className="pt-8 max-w-sm mx-auto">
                <PaymentIcons size="sm" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer minimal */}
        <footer className="py-12 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} RAJ — Preview Only · Nicht öffentlich
          </div>
        </footer>

        {/* STICKY BUY BAR */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-elegant-lg"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <img src={heroImg} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm md:text-base font-medium truncate">RAJ NEXUS</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{priceLabel}</div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!variantId || !available || adding || isLoading}
                  className="flex-shrink-0"
                >
                  {adding || isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : !available ? (
                    "Ausverkauft"
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Jetzt kaufen</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ShopPreview;

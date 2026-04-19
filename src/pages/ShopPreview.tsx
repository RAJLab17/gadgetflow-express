import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, Check, Truck, ShieldCheck, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductVariantInfo, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import PaymentIcons from "@/components/PaymentIcons";

import productMain from "@/assets/products/nexus-product-1.jpg";
import productAlt from "@/assets/products/nexus-product-2.jpg";
import lifestyleDesk from "@/assets/products/nexus-desk-setup.png";
import lifestyleMinimal from "@/assets/products/nexus-lifestyle-minimal.png";
import folds from "@/assets/products/nexus-folds.jpg";
import fast from "@/assets/products/nexus-fast.png";

const NEXUS_HANDLE = "raj-nexus-3in1-wireless-charger";

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id title description handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 5) { edges { node { url altText } } }
      variants(first: 10) {
        edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } }
      }
      options { name values }
    }
  }
`;

const ShopPreview = () => {
  const { addItem, isLoading } = useCartStore();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const [adding, setAdding] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const gallery = [productMain, productAlt, folds];

  useEffect(() => {
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_QUERY, { handle: NEXUS_HANDLE });
        const node = data?.data?.productByHandle;
        if (node) {
          setProduct({ node });
          const v = node.variants?.edges?.[0]?.node;
          if (v) { setVariantId(v.id); setAvailable(v.availableForSale ?? true); }
        }
        const info = await fetchProductVariantInfo(NEXUS_HANDLE);
        if (info) { setVariantId(info.variantId); setAvailable(info.availableForSale); }
      } catch (e) { console.error("Failed to load NEXUS:", e); }
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
        product, variantId,
        variantTitle: variant?.title || "Default",
        price: variant?.price || { amount: "99.00", currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: variant?.selectedOptions || [],
      });
      const url = useCartStore.getState().getCheckoutUrl();
      if (url) window.open(url, "_blank");
    } finally { setAdding(false); }
  };

  const BuyButton = ({ size = "xl", className = "" }: { size?: "lg" | "xl"; className?: string }) => (
    <Button
      size={size}
      onClick={handleBuyNow}
      disabled={!variantId || !available || adding || isLoading}
      className={className}
    >
      {adding || isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : !available ? "Ausverkauft" : (
        <><ShoppingBag className="w-5 h-5 mr-2" />Jetzt kaufen — {priceLabel}</>
      )}
    </Button>
  );

  return (
    <>
      <Helmet>
        <title>RAJ NEXUS — Preview</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Brand mark */}
        <header className="border-b border-border/60">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-sm tracking-[0.3em] font-light">RAJ</span>
            <span className="text-xs text-muted-foreground tracking-wider">Designed in Switzerland</span>
          </div>
        </header>

        {/* HERO — Product + Buy side-by-side (Apple-style) */}
        <section className="max-w-7xl mx-auto px-6 pt-8 md:pt-16 pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Gallery */}
            <div className="md:sticky md:top-8">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="aspect-square rounded-2xl overflow-hidden bg-card flex items-center justify-center"
              >
                <img src={gallery[activeImg]} alt="RAJ NEXUS" className="w-full h-full object-contain" />
              </motion.div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden bg-card border-2 transition-colors ${
                      activeImg === i ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy column */}
            <div className="space-y-6">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">3-in-1 Wireless Charger</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mt-2">RAJ NEXUS</h1>
                <p className="text-lg text-muted-foreground mt-3 font-light">
                  iPhone, Apple Watch und AirPods — gleichzeitig laden. Qi2.2, 25 W, faltbar.
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-light">{priceLabel}</span>
                <span className="text-sm text-muted-foreground">inkl. MwSt.</span>
              </div>

              <ul className="space-y-2 text-sm">
                {[
                  "Qi2.2 zertifiziert · 25 W Schnellladung",
                  "Magnetische MagSafe-Ausrichtung",
                  "Faltbar — ideal für Reise & Schreibtisch",
                  "Aluminium-Gehäuse · Space Black",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-foreground/80">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-light">{f}</span>
                  </li>
                ))}
              </ul>

              <BuyButton className="w-full" />

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/60">
                {[
                  { icon: Truck, label: "Gratis Versand" },
                  { icon: RotateCcw, label: "30 Tage Rückgabe" },
                  { icon: ShieldCheck, label: "2 Jahre Garantie" },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center text-center gap-1.5">
                    <t.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">{t.label}</span>
                  </div>
                ))}
              </div>

              <PaymentIcons size="sm" />
            </div>
          </div>
        </section>

        {/* STORY — 3 kompakte Beweise (kein Fülltext) */}
        <section className="bg-card py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">

            {/* 1. Speed */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <motion.img
                src={fast}
                alt="100% in 1.5 Stunden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl w-full"
              />
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-primary">Geschwindigkeit</span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight mt-3">100 % in 1,5 Stunden.</h2>
                <p className="text-muted-foreground mt-3 font-light">Bis zu 3,3× schneller als Standard-Wireless-Charger.</p>
              </div>
            </div>

            {/* 2. Faltbar */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="md:order-2">
                <span className="text-xs tracking-[0.3em] uppercase text-primary">Form</span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight mt-3">Faltet sich. Passt überall hin.</h2>
                <p className="text-muted-foreground mt-3 font-light">Vom Nachttisch zum Koffer in einer Bewegung.</p>
              </div>
              <motion.img
                src={folds}
                alt="Faltbar"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl w-full md:order-1"
              />
            </div>

            {/* 3. Lifestyle */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <motion.img
                src={lifestyleDesk}
                alt="Auf dem Schreibtisch"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl w-full"
              />
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-primary">Alltag</span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight mt-3">Ein Platz. Drei Geräte.</h2>
                <p className="text-muted-foreground mt-3 font-light">Schluss mit Kabelsalat. Alles geladen — immer bereit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">Bereit für Klarheit?</h2>
            <p className="text-muted-foreground font-light">
              {priceLabel} · Gratis Versand · 30 Tage Rückgabe
            </p>
            <BuyButton className="min-w-[280px]" />
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} RAJ — Preview · Nicht öffentlich
          </div>
        </footer>

        {/* STICKY BUY BAR — immer sichtbar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-elegant-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={productMain} alt="" className="w-10 h-10 rounded-lg object-contain bg-card flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">RAJ NEXUS</div>
                <div className="text-xs text-muted-foreground">{priceLabel}</div>
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
              ) : !available ? "Ausverkauft" : (
                <><ShoppingBag className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Jetzt kaufen</span></>
              )}
            </Button>
          </div>
        </div>

        {/* Spacer for sticky bar */}
        <div className="h-20" />
      </div>
    </>
  );
};

export default ShopPreview;

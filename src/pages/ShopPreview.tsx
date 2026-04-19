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

import productMain from "@/assets/products/nexus-hero-1.jpg";
import productAlt from "@/assets/products/nexus-hero-2.jpg";
import productFolded from "@/assets/products/nexus-hero-3.jpg";
import storySpeed from "@/assets/products/nexus-story-speed.jpg";
import storyFolds from "@/assets/products/nexus-story-folds.jpg";
import storyLifestyle from "@/assets/products/nexus-story-lifestyle.jpg";

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

        {/* DETAILS — Specs, Versand, Garantie, FAQ, Dokumente */}
        <section className="py-20 md:py-28 px-6 border-t border-border/60">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-xs tracking-[0.3em] uppercase text-primary">Alle Details</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mt-3">Was du wissen musst.</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="specs" className="border-border/60">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Technische Spezifikationen</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    {[
                      ["Standard", "Qi2.2 zertifiziert"],
                      ["Leistung", "25 W Schnellladung"],
                      ["Eingang", "USB-C PD 30 W"],
                      ["Material", "Aluminium · Silikon"],
                      ["Farbe", "Space Black"],
                      ["Gewicht", "ca. 220 g"],
                      ["Masse (gefaltet)", "100 × 95 × 28 mm"],
                      ["Lieferumfang", "Charger · 1.5 m USB-C Kabel · Anleitung"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-border/40 pb-2">
                        <dt className="text-foreground/70">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="kompat" className="border-border/60">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Kompatibilität</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-2">
                  <p><span className="text-foreground/80">iPhone:</span> 12, 13, 14, 15, 16, 17 (alle Modelle, inkl. Pro/Max).</p>
                  <p><span className="text-foreground/80">Apple Watch:</span> Series 4 bis Ultra 2.</p>
                  <p><span className="text-foreground/80">AirPods:</span> Pro, Pro 2, 3 (mit Qi-Lade-Case).</p>
                  <p><span className="text-foreground/80">Android:</span> alle Qi/Qi2-fähigen Geräte (5–15 W).</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="versand" className="border-border/60">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Versand & Rückgabe</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-3">
                  <p><span className="text-foreground/80">Gratis Versand</span> in der ganzen Schweiz · Lieferung in 2–4 Werktagen via Schweizer Post.</p>
                  <p><span className="text-foreground/80">30 Tage Rückgaberecht</span> — kostenlos, ohne Wenn und Aber. Wir senden dir ein Retourenetikett zu.</p>
                  <p>Versand erfolgt klimaneutral. Verpackung ist plastikfrei.</p>
                  <Link to="/versand" className="inline-block text-primary hover:underline mt-2">Vollständige Versandbedingungen →</Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="garantie" className="border-border/60">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Garantie & Support</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-3">
                  <p><span className="text-foreground/80">2 Jahre Herstellergarantie</span> auf alle Funktionen und Materialien.</p>
                  <p>Defekt? Schreib uns an <a href="mailto:support@raj.ch" className="text-primary hover:underline">support@raj.ch</a> — wir antworten innerhalb von 24 h und schicken Ersatz oder reparieren kostenlos.</p>
                  <p>Support auf Deutsch, Französisch, Italienisch und Englisch.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq" className="border-border/60">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Häufige Fragen</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-4">
                  {[
                    ["Lädt es mein iPhone wirklich mit 25 W?", "Ja — sofern dein iPhone Qi2.2 unterstützt (iPhone 15 und neuer). Ältere Modelle laden mit 15 W (MagSafe-Geschwindigkeit)."],
                    ["Funktioniert es mit Hülle?", "Ja, mit MagSafe-kompatiblen Hüllen bis 3 mm Dicke."],
                    ["Wird es heiss?", "Nein. Aktive Temperatursteuerung hält das Gerät und dein iPhone im sicheren Bereich."],
                    ["Kann ich es im Auto/Flugzeug benutzen?", "Ja, der Eingang ist USB-C PD — funktioniert mit jedem 30 W+ Adapter."],
                    ["Ist ein Netzteil dabei?", "Nein, um Elektroschrott zu reduzieren. Jedes USB-C PD 30 W+ Netzteil funktioniert."],
                  ].map(([q, a]) => (
                    <div key={q}>
                      <p className="text-foreground/80 font-normal mb-1">{q}</p>
                      <p>{a}</p>
                    </div>
                  ))}
                  <Link to="/faq" className="inline-block text-primary hover:underline mt-2">Alle Fragen ansehen →</Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="docs" className="border-border/60">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Dokumente & Rechtliches</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 text-sm">
                  <ul className="space-y-2.5">
                    {[
                      ["AGB", "/agb"],
                      ["Datenschutzerklärung", "/datenschutz"],
                      ["Impressum", "/impressum"],
                      ["Über RAJ", "/ueber-raj"],
                      ["Qi2 erklärt", "/qi2-erklaert"],
                      ["Vergleich mit anderen Chargern", "/vergleich"],
                      ["Versandbedingungen", "/versand"],
                    ].map(([label, href]) => (
                      <li key={href}>
                        <Link to={href} className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                          <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brand" className="border-border/60 border-b">
                <AccordionTrigger className="text-base font-light hover:no-underline py-5">Über RAJ</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 text-sm space-y-3">
                  <p>RAJ ist ein Schweizer Unternehmen. Wir entwickeln Ladegeräte, die einfach funktionieren — ohne Kompromisse bei Qualität, Design und Nachhaltigkeit.</p>
                  <p>Designed in Switzerland. Hergestellt unter fairen Bedingungen.</p>
                  <Link to="/about" className="inline-block text-primary hover:underline">Mehr über uns →</Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

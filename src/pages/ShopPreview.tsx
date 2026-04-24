import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, Check, Truck, ShieldCheck, RotateCcw, FileText, Zap, Award } from "lucide-react";
import logoMark from "@/assets/logo-new.webp";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductVariantInfo, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import PaymentIcons from "@/components/PaymentIcons";

// Real RAJ NEXUS product photography
import productMain from "@/assets/products/nexus-hero-premium-stand.jpg";
import productAlt from "@/assets/products/nexus-real-3quarter-white.jpg";
import productTopView from "@/assets/products/nexus-real-topview-qi2-white.jpg";
import productFolds from "@/assets/products/nexus-real-folds-white.jpg";
import productFlat from "@/assets/products/nexus-flat-charging.jpg";
import storySpeed from "@/assets/products/nexus-real-features.jpg";
import storyFolds from "@/assets/products/nexus-real-folds-text.jpg";
import storyLifestyle from "@/assets/products/nexus-real-desk-office.jpg";
import storyNight from "@/assets/products/nexus-real-night-city.jpg";
import storySofa from "@/assets/products/nexus-real-lifestyle-sofa.jpg";
import storyWindow from "@/assets/products/nexus-real-window.jpg";

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

const FOUNDER_TOTAL = 100;
const FOUNDER_PRICE = "CHF 99.–";
const REGULAR_PRICE = "CHF 129.–";

const ShopPreview = () => {
  const { addItem, isLoading } = useCartStore();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const [inventory, setInventory] = useState<number>(FOUNDER_TOTAL);
  const [adding, setAdding] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const gallery = [productMain, productAlt, productTopView, productFolds, productFlat];

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
        if (info) {
          setVariantId(info.variantId);
          setAvailable(info.availableForSale);
          // Cap to FOUNDER_TOTAL so the counter never shows more than 100 left
          setInventory(Math.min(info.quantityAvailable, FOUNDER_TOTAL));
        }
      } catch (e) { console.error("Failed to load NEXUS:", e); }
    })();
  }, []);

  const sold = Math.max(0, FOUNDER_TOTAL - inventory);
  const progressPct = Math.min(100, Math.round((sold / FOUNDER_TOTAL) * 100));
  const priceLabel = FOUNDER_PRICE;

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
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
            <span className="text-[11px] tracking-[0.32em] font-light text-muted-foreground/80 uppercase">
              RAJ
            </span>
            <Link to="/" className="justify-self-center" aria-label="RAJ — Home">
              <img
                src={logoMark}
                alt="RAJ"
                className="h-5 md:h-6 w-auto opacity-90 select-none"
                draggable={false}
              />
            </Link>
            <span className="justify-self-end text-[11px] text-muted-foreground/80 tracking-[0.28em] uppercase font-light">
              Swiss Brand
            </span>
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
                className="aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center"
              >
                <img
                  src={gallery[activeImg]}
                  alt="RAJ NEXUS"
                  className="w-full h-full object-contain p-6 md:p-10"
                />
              </motion.div>
              <div className="grid grid-cols-5 gap-3 mt-4">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div
                      className={`aspect-square w-full rounded-lg overflow-hidden bg-white transition-opacity ${
                        activeImg === i ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <span
                      className={`h-px w-6 transition-all ${
                        activeImg === i ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy column */}
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] tracking-[0.25em] uppercase font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Founder Edition · Limitiert auf {FOUNDER_TOTAL}
                </span>
                <span className="block text-xs tracking-[0.3em] uppercase text-muted-foreground mt-4">3-in-1 Wireless Charger</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mt-2">RAJ NEXUS</h1>
                <p className="text-lg text-muted-foreground mt-3 font-light">
                  iPhone, Apple Watch und AirPods gleichzeitig laden. Qi2.2 · 25W · faltbar
                </p>
              </div>

              {/* Hero benefits — exklusive Founder-Privilegien */}
              <div className="flex flex-col gap-2 -mt-1">
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/25 bg-primary/[0.04] backdrop-blur-sm text-xs font-medium text-foreground/85 self-start">
                  <Zap className="w-3.5 h-3.5 text-primary" strokeWidth={2} fill="currentColor" />
                  Lebenslanger Early Access zu neuen RAJ Produkten
                </span>
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/25 bg-primary/[0.04] backdrop-blur-sm text-xs font-medium text-foreground/85 self-start">
                  <Award className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                  Founder Edition mit persönlicher Seriennummer
                </span>
              </div>

              {/* Price block */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-light">{FOUNDER_PRICE}</span>
                  <span className="text-xl text-muted-foreground line-through font-light">{REGULAR_PRICE}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium tracking-wider uppercase">
                    Spare CHF 30
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Founder-Preis · danach {REGULAR_PRICE} · inkl. MwSt.
                </p>
              </div>

              {/* Founder counter */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80 font-medium">
                    {sold} / {FOUNDER_TOTAL} Founder Editions verkauft
                  </span>
                  <span className="text-primary font-medium">
                    {inventory > 0 ? `Noch ${inventory}` : "Ausverkauft"}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sobald alle 100 vergeben sind, kostet der NEXUS regulär {REGULAR_PRICE}.
                </p>
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
                  { icon: ShieldCheck, label: "3 Jahre Garantie" },
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

        {/* STORY — Premium Zickzack: jede Sektion spricht einen anderen Menschen an */}
        <section className="bg-card py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-36">

            {[
              {
                img: storySpeed,
                alt: "100% in 1.5 Stunden",
                eyebrow: "Für die, die keine Zeit haben",
                title: "Vollgeladen, bevor der Kaffee fertig ist.",
                copy: "90 Minuten — und dein iPhone ist bei 100 %. Während du duschst, frühstückst, deine Mails checkst. Nie wieder mit 23 % aus dem Haus rennen.",
              },
              {
                img: storyFolds,
                alt: "Faltbar wie eine Brieftasche",
                eyebrow: "Für die Vielreisenden",
                title: "Faltet sich wie eine Brieftasche. Lädt wie eine Station.",
                copy: "Hotelzimmer in Mailand. Lounge in Zürich. Airbnb in Lissabon. Eine Bewegung — aufgeklappt. Dein iPhone, deine Watch, deine AirPods. Alle gleichzeitig.",
              },
              {
                img: storyLifestyle,
                alt: "Aufgeräumter Schreibtisch",
                eyebrow: "Für die, die Ordnung lieben",
                title: "Drei Kabel weg. Ein Objekt da.",
                copy: "Kein Kabelsalat mehr hinter dem Monitor. Kein Suchen nach dem Lightning-Stecker um Mitternacht. Ein einziger Ort — alles geladen, alles bereit.",
              },
              {
                img: storyNight,
                alt: "Nachts in der Stadt",
                eyebrow: "Für die späten Abende",
                title: "Hinlegen. Schlafen. Aufwachen mit 100 %.",
                copy: "Du fällst ins Bett. Telefon drauf — magnetisch klick. Kein Zielen, kein Augen-Aufmachen. Morgens: voll geladen, bereit für den Tag, der vor dir liegt.",
              },
              {
                img: storySofa,
                alt: "Entspannt auf dem Sofa",
                eyebrow: "Für die ruhigen Sonntage",
                title: "Lädt im Hintergrund. Wie es sein soll.",
                copy: "Film läuft. Tee dampft. Telefon liegt einfach drauf — leise, kühl, unsichtbar. Technik, die sich nicht in den Vordergrund drängt.",
              },
              {
                img: storyWindow,
                alt: "Material Detail im Licht",
                eyebrow: "Für die, die Qualität spüren",
                title: "Aluminium. Vegan-Leder. Gewicht in der Hand.",
                copy: "CNC-gefräst aus einem Block. Mattes Finish, das Fingerabdrücke ignoriert. Du nimmst es einmal in die Hand — und verstehst sofort, warum es CHF 99 kostet.",
              },
            ].map((s, i) => {
              const imageRight = i % 2 === 1;
              return (
                <div
                  key={s.eyebrow}
                  className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
                >
                  <motion.img
                    src={s.img}
                    alt={s.alt}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`rounded-2xl w-full aspect-[4/5] ${
                      i === 0 ? "object-contain bg-[hsl(var(--card))] p-2 md:p-4" : "object-cover"
                    } shadow-[0_30px_80px_-30px_hsl(var(--foreground)/0.25)] ${
                      imageRight ? "md:order-2" : ""
                    }`}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={imageRight ? "md:order-1" : ""}
                  >
                    <span className="text-[11px] tracking-[0.32em] uppercase text-primary font-medium">
                      {s.eyebrow}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15] mt-5 text-foreground">
                      {s.title}
                    </h2>
                    <div className="mt-6 h-px w-12 bg-primary/60" />
                    <p className="text-muted-foreground mt-6 font-light leading-relaxed text-lg max-w-md">
                      {s.copy}
                    </p>
                  </motion.div>
                </div>
              );
            })}
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
                  <p><span className="text-foreground/80">3 Jahre Herstellergarantie</span> auf alle Funktionen und Materialien.</p>
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

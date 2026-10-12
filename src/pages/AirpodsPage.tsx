import ProductFaqSection from "@/components/ProductFaqSection";
import { AIRPODS_FAQ } from "@/content/matrixFaq";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { shareImages, shareImageTags } from "@/lib/shareImages";
import { Link } from "react-router-dom";
import { Check, Loader2, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NexusTrustBar from "@/components/nexus/NexusTrustBar";
import { Button } from "@/components/ui/button";
import { createShopifyCart, addLineToShopifyCart } from "@/lib/shopify";
import type { CartItem } from "@/lib/shopify";
import { goToCheckout, openCheckoutTab } from "@/lib/checkout";
import { trackAddToCart, trackBeginCheckout, trackViewItem } from "@/lib/ga-ecommerce";
import { makeOrderReference, usePendingCheckout } from "@/hooks/usePendingCheckout";
import { handOffAirpodsShell } from "@/lib/airpodsShell";
import {
  AIRPODS_VARIANT_IDS,
  BUNDLE_DISCOUNT,
  BUNDLE_DISCOUNT_CODE,
  CASE_VARIANT_IDS,
  MATRIX_DELIVERY_TEXT,
  MATRIX_TRUST_DESKTOP,
  MATRIX_TRUST_MOBILE,
  PaymentMethodsBar,
} from "@/components/matrix/matrixCommerce";

import airpodsCherryAsset from "@/assets/matrix/schema/airpods-cherry-premium.webp.asset.json";
import airpodsOnyxAsset from "@/assets/matrix/schema/airpods-onyx-premium.webp.asset.json";
import BundleOfferImage, { bundlePhoneThumb, originalAirpodsThumbs } from "@/components/matrix/BundleOfferImage";
import cherryDesk from "@/assets/matrix/airpods-lifestyle/cherry-desk-full.webp.asset.json";
import cherryDeskMobile from "@/assets/matrix/airpods-lifestyle/cherry-desk-mobile.webp.asset.json";
import cherryDeskThumb from "@/assets/matrix/airpods-lifestyle/cherry-desk-thumb.webp.asset.json";
import cherryDeskSecond from "@/assets/matrix/airpods-lifestyle/cherry-desk-second-full.webp.asset.json";
import cherryDeskSecondMobile from "@/assets/matrix/airpods-lifestyle/cherry-desk-second-mobile.webp.asset.json";
import cherryDeskSecondThumb from "@/assets/matrix/airpods-lifestyle/cherry-desk-second-thumb.webp.asset.json";
import cherryBag from "@/assets/matrix/airpods-lifestyle/cherry-bag-full.webp.asset.json";
import cherryBagMobile from "@/assets/matrix/airpods-lifestyle/cherry-bag-mobile.webp.asset.json";
import cherryBagThumb from "@/assets/matrix/airpods-lifestyle/cherry-bag-thumb.webp.asset.json";
import cherryBedside from "@/assets/matrix/airpods-lifestyle/cherry-bedside-full.webp.asset.json";
import cherryBedsideMobile from "@/assets/matrix/airpods-lifestyle/cherry-bedside-mobile.webp.asset.json";
import cherryBedsideThumb from "@/assets/matrix/airpods-lifestyle/cherry-bedside-thumb.webp.asset.json";
import onyxDesk from "@/assets/matrix/airpods-lifestyle/onyx-desk-full.webp.asset.json";
import onyxDeskMobile from "@/assets/matrix/airpods-lifestyle/onyx-desk-mobile.webp.asset.json";
import onyxDeskThumb from "@/assets/matrix/airpods-lifestyle/onyx-desk-thumb.webp.asset.json";
import onyxBag from "@/assets/matrix/airpods-lifestyle/onyx-bag-full.webp.asset.json";
import onyxBagMobile from "@/assets/matrix/airpods-lifestyle/onyx-bag-mobile.webp.asset.json";
import onyxBagThumb from "@/assets/matrix/airpods-lifestyle/onyx-bag-thumb.webp.asset.json";
import onyxCafe from "@/assets/matrix/airpods-lifestyle/onyx-cafe-full.webp.asset.json";
import onyxCafeMobile from "@/assets/matrix/airpods-lifestyle/onyx-cafe-mobile.webp.asset.json";
import onyxCafeThumb from "@/assets/matrix/airpods-lifestyle/onyx-cafe-thumb.webp.asset.json";
import onyxCar from "@/assets/matrix/airpods-lifestyle/onyx-car-full.webp.asset.json";
import onyxCarMobile from "@/assets/matrix/airpods-lifestyle/onyx-car-mobile.webp.asset.json";
import onyxCarThumb from "@/assets/matrix/airpods-lifestyle/onyx-car-thumb.webp.asset.json";

const H = {
  bg: "#faf9f7",
  gold: "#9b6b3f",
  line: "rgba(43,39,37,0.10)",
  lineStrong: "rgba(43,39,37,0.22)",
  text: "#2b2725",
  textMuted: "rgba(43,39,37,0.55)",
};

type FinishId = "cherry" | "onyx";
type ModelId = "17pro" | "17promax" | "18pro" | "18promax";

interface Slide { src: string; alt: string; mobile?: string; thumb?: string }

interface Finish {
  id: FinishId;
  name: string;
  base: string;
  weave: string;
  edge: string;
  price: number;
  variantId: string;
  sku: string;
  /** Produktfoto zuerst, danach bis zu 4 Lifestyle-Fotos (feste CDN-Adressen). */
  slides: Slide[];
}

const AIRPODS_PRICE = 35;
const IPHONE_CASE_PRICE = 59;

const FINISHES: Finish[] = [
  {
    id: "cherry",
    name: "Cherry Carbon",
    base: "#7b4b60",
    weave: "#a66f83",
    edge: "#4f2b3a",
    price: AIRPODS_PRICE,
    variantId: AIRPODS_VARIANT_IDS.cherry,
    sku: "RAJ-MTX-AP4-CHY",
    slides: [
      { src: airpodsCherryAsset.url, alt: "RAJ MATRIX AirPods 4 & 5 Hülle in Cherry Carbon mit goldenem Blitz und Karabiner" },
      { src: cherryDesk.url, mobile: cherryDeskMobile.url, thumb: cherryDeskThumb.url, alt: "RAJ MATRIX AirPods Hülle in Cherry Carbon mit goldenem Karabiner auf einem Holzschreibtisch neben Laptop und Notizbuch" },
      { src: cherryBag.url, mobile: cherryBagMobile.url, thumb: cherryBagThumb.url, alt: "RAJ MATRIX AirPods Hülle in Cherry Carbon mit goldenem Blitz in einer geöffneten Handtasche" },
      { src: cherryDeskSecond.url, mobile: cherryDeskSecondMobile.url, thumb: cherryDeskSecondThumb.url, alt: "RAJ MATRIX AirPods Hülle in Cherry Carbon mit goldenem Blitz und Karabiner auf dem Holzschreibtisch neben einem Laptop" },
      { src: cherryBedside.url, mobile: cherryBedsideMobile.url, thumb: cherryBedsideThumb.url, alt: "RAJ MATRIX AirPods Hülle in Cherry Carbon mit goldenem Karabiner auf einem Marmortablett neben einer Nachttischlampe" },
    ],
  },
  {
    id: "onyx",
    name: "Onyx Carbon",
    base: "#16171a",
    weave: "#33363c",
    edge: "#08090a",
    price: AIRPODS_PRICE,
    variantId: AIRPODS_VARIANT_IDS.onyx,
    sku: "RAJ-MTX-AP4-ONX",
    slides: [
      { src: airpodsOnyxAsset.url, alt: "RAJ MATRIX AirPods 4 & 5 Hülle in Onyx Carbon mit goldenem Blitz und Karabiner" },
      { src: onyxDesk.url, mobile: onyxDeskMobile.url, thumb: onyxDeskThumb.url, alt: "RAJ MATRIX AirPods Hülle in Onyx Carbon mit goldenem Blitz und Karabiner auf einem Holzschreibtisch neben Sonnenbrille und Schlüssel" },
      { src: onyxBag.url, mobile: onyxBagMobile.url, thumb: onyxBagThumb.url, alt: "RAJ MATRIX AirPods Hülle in Onyx Carbon mit goldenem Karabiner in einer braunen Ledertasche neben Notizbuch und Stift" },
      { src: onyxCafe.url, mobile: onyxCafeMobile.url, thumb: onyxCafeThumb.url, alt: "RAJ MATRIX AirPods Hülle in Onyx Carbon mit goldenem Blitz auf einem Marmortisch neben einer Kaffeetasse" },
      { src: onyxCar.url, mobile: onyxCarMobile.url, thumb: onyxCarThumb.url, alt: "RAJ MATRIX AirPods Hülle in Onyx Carbon mit goldenem Karabiner auf der Mittelkonsole eines Autos" },
    ],
  },
];

const MODELS: { id: ModelId; short: string; name: string; status: string }[] = [
  { id: "17pro", short: "17 Pro", name: "iPhone 17 Pro", status: "Verfügbar" },
  { id: "17promax", short: "17 Pro Max", name: "iPhone 17 Pro Max", status: "Verfügbar" },
  { id: "18pro", short: "18 Pro", name: "iPhone 18 Pro", status: "Vorbestellung" },
  { id: "18promax", short: "18 Pro Max", name: "iPhone 18 Pro Max", status: "Vorbestellung" },
];

const BUNDLE_TOTAL = AIRPODS_PRICE + IPHONE_CASE_PRICE - BUNDLE_DISCOUNT;

/* ── Wischbare Galerie (Punkte ab 2 Bildern, Desktop zusätzlich Vorschaubilder) ── */
const Gallery = ({ finish }: { finish: Finish }) => {
  const slides = finish.slides;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prefetchThrough, setPrefetchThrough] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setActive(0);
    setPrefetchThrough(0);
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [finish.id]);

  const goTo = (i: number) => {
    setPrefetchThrough((current) => Math.max(current, i + 1));
    scrollerRef.current?.scrollTo({ left: i * (scrollerRef.current?.clientWidth ?? 0), behavior: "smooth" });
  };
  const preloadNext = () => setPrefetchThrough((current) => Math.max(current, active + 1));

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={() => {
          const el = scrollerRef.current;
          if (el) {
            const next = Math.max(0, Math.min(slides.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
            setActive(next);
            if (next > 0) setPrefetchThrough((current) => Math.max(current, next + 1));
          }
        }}
        onPointerDown={preloadNext}
        onTouchStart={preloadNext}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {slides.map((slide, i) => (
          <div key={slide.src} className="relative w-full shrink-0 snap-center [scroll-snap-stop:always]" style={{ aspectRatio: "1 / 1" }}>
            <img
              data-airpods-hero={i === 0 ? "" : undefined}
              src={slide.src}
               srcSet={slide.mobile ? `${slide.mobile} 480w, ${slide.src} 768w` : undefined}
               sizes="(max-width: 767px) calc(100vw - 32px), 480px"
              alt={slide.alt}
              width={1254}
              height={1254}
               loading={i <= prefetchThrough ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
               onLoad={() => setLoadedImages((current) => new Set(current).add(slide.src))}
               onError={() => setLoadedImages((current) => {
                 const next = new Set(current);
                 next.delete(slide.src);
                 return next;
               })}
               className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 motion-reduce:transition-none ${loadedImages.has(slide.src) ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <div className="flex justify-center gap-1.5 pb-2 pt-1 lg:hidden">
            {slides.map((_, i) => (
              <Button key={i} type="button" variant="ghost" aria-label={`Bild ${i + 1}`} aria-pressed={active === i} onClick={() => goTo(i)} className={`h-1.5 min-h-0 rounded-full p-0 transition-all ${i === active ? "w-[18px] bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <div className="mt-4 hidden flex-wrap justify-center gap-2 pb-3 lg:flex" aria-label="Produktbilder">
            {slides.map((slide, i) => (
              <Button key={slide.src} type="button" variant="outline" aria-label={`Bild ${i + 1}`} aria-pressed={active === i} onClick={() => goTo(i)} className="h-[68px] w-[68px] overflow-hidden rounded-lg p-0" style={{ borderColor: active === i ? H.gold : H.line, background: "#fff" }}>
                <img src={slide.thumb ?? slide.src} alt={`Vorschau: ${slide.alt}`} width={136} height={136} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AirpodsPage = () => {
  useEffect(() => {
    trackViewItem({ item_id: "RAJ-MTX-AP4", item_name: "RAJ MATRIX AirPods 4 & 5 Case", price: 35 });
  }, []);
  useEffect(() => handOffAirpodsShell(), []);
  const [finishId, setFinishId] = useState<FinishId>("cherry");
  const [bundleSelected, setBundleSelected] = useState(false);
  const [modelId, setModelId] = useState<ModelId>("18pro");
  const [isBuying, setIsBuying] = useState(false);
  const { pending, confirmed, track: trackCheckout, dismiss: dismissOrder, dismissPending } = usePendingCheckout();

  const finish = FINISHES.find((item) => item.id === finishId) ?? FINISHES[0];
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[2];
  const currentTotal = bundleSelected ? BUNDLE_TOTAL : finish.price;

  const handleBuy = useCallback(async () => {
    if (isBuying) return;
    setIsBuying(true);
    const checkoutTab = openCheckoutTab();
    const fail = (message: string) => {
      checkoutTab?.close();
      toast.error("Kauf konnte nicht gestartet werden", { description: message });
    };

    try {
      const reference = makeOrderReference();
      const airpodsProduct = {
        node: {
          id: "gid://shopify/Product/16139790549317",
          title: "RAJ MATRIX AirPods 4 & 5 Case",
          description: "Carbon Case für AirPods 4 und AirPods 5.",
          handle: "raj-matrix-airpods-4-case",
          priceRange: { minVariantPrice: { amount: String(finish.price), currencyCode: "CHF" } },
          images: { edges: [{ node: { url: finish.slides[0].src, altText: `${finish.name} AirPods Case` } }] },
          variants: { edges: [] },
          options: [{ name: "Finish", values: FINISHES.map((item) => item.name) }],
        },
      };
      const airpodsItem: CartItem = {
        lineId: null,
        product: airpodsProduct,
        variantId: finish.variantId,
        variantTitle: finish.name,
        price: { amount: String(finish.price), currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: [{ name: "Finish", value: finish.name }],
      };

      if (!bundleSelected) {
        trackAddToCart([{ item_id: finish.variantId, item_name: "RAJ MATRIX AirPods 4 & 5 Case", item_variant: finish.name, price: finish.price }]);
        const cart = await createShopifyCart(airpodsItem, undefined, [
          { key: "RAJ Referenz", value: reference },
          { key: "Quelle", value: "raj.ch/airpods-case" },
        ]);
        if (!cart) { fail("Der Warenkorb konnte nicht erstellt werden. Bitte versuche es erneut."); return; }
        trackCheckout({ cartId: cart.cartId, reference, summary: `MATRIX AirPods 4 & 5 Case · ${finish.name}`, total: `CHF ${finish.price}.–`, startedAt: Date.now() });
        goToCheckout(checkoutTab, cart.checkoutUrl);
        return;
      }

      // Bundle: gleiche Logik wie auf /matrix (iPhone-Hülle zuerst, dann AirPods, Code MATRIXBUNDLE).
      const caseVariantId = CASE_VARIANT_IDS[model.id]?.[finish.id];
      if (!caseVariantId) { fail("Diese Variante ist derzeit nicht verfügbar."); return; }
      const items = [
        { item_id: caseVariantId, item_name: "RAJ MATRIX Case", item_variant: `${model.name} / ${finish.name}`, price: IPHONE_CASE_PRICE },
        { item_id: finish.variantId, item_name: "RAJ MATRIX AirPods 4 & 5 Case", item_variant: `MATRIX AirPods 4 & 5 · ${finish.name}`, price: finish.price - BUNDLE_DISCOUNT },
      ];
      trackAddToCart(items);
      trackBeginCheckout(items);
      const caseProduct = { node: { id: "", title: "MATRIX Case", description: "", handle: "raj-matrix-case", priceRange: { minVariantPrice: { amount: String(IPHONE_CASE_PRICE), currencyCode: "CHF" } }, images: { edges: [] }, variants: { edges: [] }, options: [] } };
      const caseItem: CartItem = { lineId: null, product: caseProduct, variantId: caseVariantId, variantTitle: `${model.name} / ${finish.name}`, price: { amount: String(IPHONE_CASE_PRICE), currencyCode: "CHF" }, quantity: 1, selectedOptions: [{ name: "Modell", value: model.name }, { name: "Finish", value: finish.name }] };
      const cart = await createShopifyCart(caseItem, [BUNDLE_DISCOUNT_CODE], [
        { key: "RAJ Referenz", value: reference },
        { key: "Quelle", value: "raj.ch/airpods-case" },
      ]);
      if (!cart) { fail("Der Warenkorb konnte nicht erstellt werden. Bitte versuche es erneut."); return; }
      const added = await addLineToShopifyCart(cart.cartId, airpodsItem);
      if (!added.success) { fail("Das AirPods Case konnte nicht zum Bundle hinzugefügt werden. Bitte versuche es erneut."); return; }
      if (added.checkoutUrl) cart.checkoutUrl = added.checkoutUrl;
      trackCheckout({ cartId: cart.cartId, reference, summary: `MATRIX Case ${model.name} · ${finish.name} + AirPods 4 & 5 Case ${finish.name}`, total: `CHF ${BUNDLE_TOTAL}.–`, startedAt: Date.now() });
      goToCheckout(checkoutTab, cart.checkoutUrl);
    } catch (error) {
      console.error("AirPods Case purchase failed:", error);
      fail("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsBuying(false);
    }
  }, [finish, isBuying, trackCheckout, bundleSelected, model]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RAJ MATRIX Carbon Hülle für AirPods 4 & 5",
    brand: { "@type": "Brand", name: "RAJ" },
    description: "Carbon Case für AirPods 4 und AirPods 5 in Cherry Carbon oder Onyx Carbon mit goldenem RAJ Blitz.",
    sku: finish?.sku,
    image: ["https://raj.ch/__l5e/assets-v1/b8f774f2-944d-45b9-b88a-e8f79c2a6af0/raj-airpods-share.jpg", "https://raj.ch/__l5e/assets-v1/70f4701b-7082-4733-bd95-32c87cda3cf3/airpods-cherry-bolt.webp", "https://raj.ch/__l5e/assets-v1/85b897bc-20a7-43f1-b648-9423827acb9b/airpods-onyx-original-bolt.webp"],
    url: "https://raj.ch/airpods-case",
    offers: {
      "@type": "Offer",
      url: "https://raj.ch/airpods-case",
      priceCurrency: "CHF",
      price: 35,
      availability: "https://schema.org/InStock",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CH",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "CHF" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CH" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "d" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "d" },
        },
      },
    },
  };

  const optionStyle = (active: boolean) => ({
    border: `1px solid ${active ? H.gold : H.line}`,
    background: active ? "rgba(155,107,63,0.06)" : "transparent",
  });

  return (
    <>
      <Helmet>
        <title>MATRIX AirPods 4 &amp; 5 Case – Carbon | RAJ</title>
        <meta
          name="description"
          content="MATRIX Carbon Case für AirPods 4 & 5. Cherry Carbon oder Onyx Carbon mit goldenem Blitz. Kostenloser Versand in der Schweiz."
        />
        <link rel="canonical" href="https://raj.ch/airpods-case" />
        <meta property="og:title" content="MATRIX AirPods 4 & 5 Case – Carbon | RAJ" />
        <meta
          property="og:description"
          content="Carbon-Schutz für AirPods 4 & 5 in Cherry Carbon oder Onyx Carbon mit goldenem RAJ Blitz."
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://raj.ch/airpods-case" />
        {shareImageTags(shareImages.airpods)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: H.bg, color: H.text }} className="min-h-screen">
        <Header topSlot={<NexusTrustBar />} />

        <main className="pt-24 md:pt-28">
          <section>
            <div className="container mx-auto max-w-5xl px-4 pb-5 pt-2 md:px-6 md:pb-16 md:pt-8">
              <div className="grid items-start gap-3 md:grid-cols-12 md:gap-14">
                {/* Galerie */}
                <div className="md:sticky md:top-28 md:col-span-6">
                  <div
                    className="relative overflow-hidden rounded-md md:rounded-lg"
                    style={{
                      background:
                        finish.id === "cherry"
                          ? "linear-gradient(155deg, #fff 0%, #faf6f7 52%, #eee5e7 100%)"
                          : "linear-gradient(155deg, #fff 0%, #f7f6f4 52%, #e9e7e3 100%)",
                      border: `1px solid ${H.line}`,
                      boxShadow: "0 1px 0 rgba(255,255,255,0.95) inset, 0 28px 70px -36px rgba(43,39,37,0.34)",
                    }}
                  >
                    <div aria-hidden className="absolute left-0 right-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${H.gold}, transparent)`, opacity: 0.5 }} />
                    <div className="relative">
                      <Gallery finish={finish} />
                    </div>
                  </div>
                </div>

                {/* Auswahl */}
                <div className="flex flex-col gap-2 md:col-span-6 md:gap-3">
                  <div className="mb-0.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h1 className="text-[19px] font-light leading-[0.95] md:text-[clamp(30px,3vw,42px)]" style={{ letterSpacing: "-0.02em" }}>
                        <span style={{ color: H.gold }}>MATRIX</span>
                        <span className="sr-only"> AirPods Case – Carbon-Look Hülle für AirPods 4 &amp; 5</span>
                      </h1>
                      <span className="whitespace-nowrap text-xl font-light text-foreground md:text-[clamp(22px,2vw,28px)]">CHF {AIRPODS_PRICE}.–</span>
                    </div>
                    <p aria-hidden="true" className="mt-1 text-xs leading-4 text-foreground md:text-sm md:italic" style={{ color: undefined }}>
                      Carbon Hülle für AirPods 4 &amp; 5
                    </p>
                  </div>

                  {/* Kompatibel */}
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.28em] md:mb-3" style={{ color: H.textMuted }}>Kompatibel</p>
                    <div className="rounded-lg px-2.5 py-2 text-left md:px-4 md:py-2.5" style={optionStyle(true)}>
                      <span className="block text-xs font-medium md:text-sm">AirPods 4 &amp; 5</span>
                    </div>
                  </div>

                  {/* Farbe der Hülle */}
                  <div>
                    <p className="mb-1 text-[10px] md:mb-3" style={{ color: H.textMuted }}>Farbe der Hülle</p>
                    <div className="grid grid-cols-2 gap-2">
                      {FINISHES.map((c) => {
                        const active = c.id === finish.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setFinishId(c.id)}
                            aria-pressed={active}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 transition-all duration-300 md:gap-3 md:px-4 md:py-2.5"
                            style={optionStyle(active)}
                          >
                            <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full md:h-6 md:w-6" style={{ background: `linear-gradient(145deg, ${c.weave}, ${c.base} 55%, ${c.edge})`, boxShadow: `0 0 0 1px ${H.lineStrong}` }}>
                              <span aria-hidden className="absolute inset-0 opacity-35" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 2px, rgba(255,255,255,.35) 2px 3px, rgba(0,0,0,.18) 3px 4px)" }} />
                            </span>
                            <span className="min-w-0 flex-1 text-left text-xs font-medium md:text-sm">{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="border-t pt-1 md:pt-3" style={{ borderColor: H.line }}>
                    {confirmed && (
                      <div className="relative mb-5 rounded-xl p-4" style={{ background: "rgba(155,107,63,0.08)", boxShadow: `0 0 0 1px ${H.lineStrong}` }}>
                        <Button type="button" variant="ghost" size="icon" onClick={dismissOrder} aria-label="Bestätigung schliessen" className="absolute right-2 top-2 h-8 w-8 opacity-50 hover:opacity-100">
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: H.gold }} /><p className="text-sm font-semibold">Bestellung eingegangen</p></div>
                        <p className="mt-2 text-xs" style={{ color: H.textMuted }}>{confirmed.summary} · {confirmed.total}</p>
                      </div>
                    )}
                    {pending && !confirmed && (
                      <div className="relative mb-5 flex items-start gap-3 rounded-xl p-4" style={{ background: "rgba(43,39,37,0.04)", boxShadow: `0 0 0 1px ${H.line}` }}>
                        <Button type="button" variant="ghost" size="icon" onClick={dismissPending} aria-label="Hinweis schliessen" className="absolute right-2 top-2 h-8 w-8 opacity-50 hover:opacity-100"><X className="h-4 w-4" /></Button>
                        <Loader2 className="mt-0.5 h-4 w-4 animate-spin" style={{ color: H.gold }} />
                        <div className="pr-6"><p className="text-sm font-medium">Checkout läuft</p><p className="mt-1 text-xs" style={{ color: H.textMuted }}>Schliesse die Zahlung im Checkout ab.</p></div>
                      </div>
                    )}

                    <div role="radiogroup" aria-label="Paket wählen" className="mb-3 mt-2 flex flex-col gap-2">
                      {[
                        { bundle: false, label: "Nur die Hülle" },
                        { bundle: true, label: "Hülle + MATRIX iPhone Hülle" },
                      ].map((opt) => {
                        const active = bundleSelected === opt.bundle;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setBundleSelected(opt.bundle)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-300"
                            style={optionStyle(active)}
                          >
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: "#f1ede8", border: `1px solid ${H.line}` }}>
                              {opt.bundle ? (
                                <BundleOfferImage phoneSrc={bundlePhoneThumb(model.id, finish.id)} finishId={finish.id} finishName={finish.name} />
                              ) : <img
                                src={originalAirpodsThumbs[finish.id]}
                                width={160}
                                height={160}
                                loading="lazy"
                                decoding="async"
                                alt={opt.bundle ? `RAJ MATRIX AirPods Hülle und iPhone Hülle in ${finish.name}` : `RAJ MATRIX AirPods 4 & 5 Hülle in ${finish.name}`}
                                className="absolute inset-0 h-full w-full object-contain"
                              />}
                            </span>
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: active ? H.gold : H.lineStrong }}>
                              {active && <span className="h-2 w-2 rounded-full" style={{ background: H.gold }} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">{opt.label}</span>
                              {opt.bundle && (
                                <span className="mt-0.5 block text-[11px]" style={{ color: H.textMuted }}>
                                  {model.name} · {finish.name}
                                </span>
                              )}
                            </span>
                            <span className="flex shrink-0 flex-col items-end gap-0.5">
                              <span className="text-sm font-semibold">CHF {opt.bundle ? BUNDLE_TOTAL : AIRPODS_PRICE}.–</span>
                              {opt.bundle && (
                                <>
                                  <span className="text-[11px] line-through" style={{ color: H.textMuted }}>CHF {AIRPODS_PRICE + IPHONE_CASE_PRICE}.–</span>
                                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em]" style={{ background: H.gold, color: "#fff" }}>
                                    Spare CHF {BUNDLE_DISCOUNT}
                                  </span>
                                </>
                              )}
                            </span>
                          </button>
                        );
                      })}
                      {bundleSelected && (
                        <div className="rounded-lg px-3 py-3" style={{ border: `1px solid ${H.line}` }}>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>iPhone Modell</p>
                          <div className="grid grid-cols-2 gap-2">
                            {MODELS.map((m) => {
                              const on = m.id === model.id;
                              return (
                                <button key={m.id} type="button" aria-pressed={on} onClick={() => setModelId(m.id)} className="rounded-lg px-2.5 py-2 text-left transition-all duration-300 md:px-4 md:py-2.5" style={optionStyle(on)}>
                                  <span className="block text-xs font-medium md:text-sm">iPhone {m.short}</span>
                                  <span className="mt-0.5 hidden text-[11px] md:block" style={{ color: H.textMuted }}>{m.status}</span>
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-2 text-[11px]" style={{ color: H.textMuted }}>iPhone Hülle in {finish.name}, passend zur AirPods Hülle.</p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={handleBuy}
                      disabled={isBuying}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all active:scale-[0.98] md:h-auto md:py-3 md:text-sm md:tracking-[0.15em]"
                      style={{ background: H.gold, color: "#fff", opacity: isBuying ? 0.7 : 1 }}
                    >
                      {isBuying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>JETZT KAUFEN · CHF {currentTotal}.–</span>
                        </>
                      )}
                    </Button>
                    <p className="mt-2 text-center text-[12px]" style={{ color: H.text }}>🚚 {MATRIX_DELIVERY_TEXT}</p>
                    <p className="mt-1 text-center text-[11px] lg:hidden" style={{ color: H.textMuted }}>{MATRIX_TRUST_MOBILE}</p>
                    <p className="mt-1 hidden text-center text-[11px] lg:block" style={{ color: H.textMuted }}>{MATRIX_TRUST_DESKTOP}</p>
                    <PaymentMethodsBar />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ProductFaqSection title="Fragen zur MATRIX AirPods-Hülle" items={AIRPODS_FAQ} />
          <div className="container mx-auto max-w-3xl px-6 pb-10 text-[15px] font-light">
            <Link to="/matrix" className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary">MATRIX iPhone Hülle ansehen</Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AirpodsPage;

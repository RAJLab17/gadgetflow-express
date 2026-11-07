import { ProductCustomerPhotos } from "@/components/reviews/ProductReviewHighlights";
import { useProductReviews } from "@/hooks/useProductReviews";
import { holdReviewsUntilImage, releaseReviews } from "@/lib/reviewLoadGate";
import { reviewSchema } from "@/lib/reviewProducts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { shareImages, shareImageTags } from "@/lib/shareImages";
import { Link } from "react-router-dom";
import { Layers, Sparkles, Magnet, LockKeyhole, Loader2, X, Truck, RotateCcw, MapPin, PencilRuler } from "lucide-react";
import { toast } from "sonner";
import { createShopifyCart, addLineToShopifyCart } from "@/lib/shopify";
import type { CartItem } from "@/lib/shopify";
import { usePendingCheckout, makeOrderReference } from "@/hooks/usePendingCheckout";
import { goToCheckout, openCheckoutTab } from "@/lib/checkout";
import { trackAddToCart, trackBeginCheckout, trackViewItem } from "@/lib/ga-ecommerce";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import NexusTrustBar from "@/components/nexus/NexusTrustBar";
import Footer from "@/components/Footer";
import cherryOrangeAsset from "@/assets/matrix/uploaded-renders/17-cherry-orange-norm-full.webp.asset.json";
import cherryBlueAsset from "@/assets/matrix/uploaded-renders/17-cherry-blue-norm-full.webp.asset.json";
import cherrySilverAsset from "@/assets/matrix/uploaded-renders/17-cherry-silver-norm-full.webp.asset.json";
import matrixShareAsset from "@/assets/social/raj-matrix-share.jpg.asset.json";
import cherryDarkcherry18Asset from "@/assets/matrix/uploaded-renders/18-cherry-darkcherry-norm-full.webp.asset.json";
import cherryDarkgrey18Asset from "@/assets/matrix/uploaded-renders/18-cherry-darkgrey-norm-full.webp.asset.json";
import cherrySilver18Asset from "@/assets/matrix/uploaded-renders/18-cherry-silver-norm-full.webp.asset.json";
import cherrySkyblue18Asset from "@/assets/matrix/uploaded-renders/18-cherry-skyblue-norm-full.webp.asset.json";
import onyxOrange from "@/assets/matrix/uploaded-renders/17-onyx-orange-v2-full.webp.asset.json";
import onyxBlue from "@/assets/matrix/uploaded-renders/17-onyx-blue-v2-full.webp.asset.json";
import onyxSilver from "@/assets/matrix/uploaded-renders/onyx-silver-v2-full.webp.asset.json";
import onyxDarkcherry from "@/assets/matrix/uploaded-renders/18-onyx-darkcherry-v2-full.webp.asset.json";
import onyxDarkgrey18Asset from "@/assets/matrix/uploaded-renders/18-onyx-darkgrey-v2-full.webp.asset.json";
import onyxSkyblue18Asset from "@/assets/matrix/uploaded-renders/18-onyx-skyblue-v2-full.webp.asset.json";
import airpodsCherry from "@/assets/matrix/airpods-cherry-bolt.webp";
import airpodsOnyx from "@/assets/matrix/airpods-onyx-original-bolt.webp";
import {
  AIRPODS_VARIANT_IDS,
  BUNDLE_DISCOUNT,
  BUNDLE_DISCOUNT_CODE,
  CASE_VARIANT_IDS,
  MATRIX_DELIVERY_TEXT_NO_DATE,
} from "@/components/matrix/matrixCommerce";
import { airpodsThumbs, twoCaseThumbs, renderSizes, renderSrcSet, renderImageSizes } from "@/assets/matrix/responsiveRenders";
import MobileProductBuyBar from "@/components/product/MobileProductBuyBar";

import MatrixGallery from '@/components/matrix/MatrixGallery';
import MatrixEditorial from '@/components/matrix/MatrixEditorial';
import { MATRIX_FAQ } from '@/components/matrix/matrixFaq';
import { BLACK_FRIDAY_MODE, matrixUrlSelection, matrixTotal } from '@/components/matrix/matrixConfig';
import { verifiedMatrixReviews } from '@/components/matrix/MatrixReviews';
import StarRating from '@/components/reviews/StarRating';
import { Checkbox } from '@/components/ui/checkbox';
import '@/components/matrix/matrix-page.css';
type ModelId = "17pro" | "17promax" | "18pro" | "18promax";

interface Model {
  id: ModelId;
  short: string;
  name: string;
  gen: "17" | "18";
  status: string;
}

const MODELS: Model[] = [
  { id: "17pro", short: "17 Pro", name: "iPhone 17 Pro", gen: "17", status: "Sofort lieferbar" },
  { id: "17promax", short: "17 Pro Max", name: "iPhone 17 Pro Max", gen: "17", status: "Sofort lieferbar" },
  { id: "18pro", short: "18 Pro", name: "iPhone 18 Pro", gen: "18", status: "Sofort lieferbar" },
  { id: "18promax", short: "18 Pro Max", name: "iPhone 18 Pro Max", gen: "18", status: "Sofort lieferbar" },
];

interface DeviceFinish {
  id: string;
  name: string;
  body: string;
  bodyEdge: string;
  /** Glanzlicht des eloxierten Aluminium-Unibody */
  sheen: string;
  gens: ("17" | "18")[];
}

/** Gerätefarben nach Apple — sichtbar im Kameraplateau und in den Aussparungen. */
const DEVICE_FINISHES: DeviceFinish[] = [
  // iPhone 17 Pro
  { id: "orange", name: "Cosmic Orange", body: "#e3651f", bodyEdge: "#b8460f", sheen: "#f79b55", gens: ["17"] },
  { id: "blue", name: "Deep Blue", body: "#4a5a75", bodyEdge: "#2f3c53", sheen: "#8695ac", gens: ["17"] },
  { id: "silver", name: "Silver", body: "#e4e5e7", bodyEdge: "#b6b8bb", sheen: "#ffffff", gens: ["17", "18"] },
  // iPhone 18 Pro
  { id: "darkcherry", name: "Dark Cherry", body: "#64212c", bodyEdge: "#3d141b", sheen: "#8a2f3a", gens: ["18"] },
  { id: "darkgrey", name: "Dark Grey", body: "#3e4143", bodyEdge: "#27292b", sheen: "#5a5d60", gens: ["18"] },
  { id: "skyblue", name: "Sky Blue", body: "#a7c7e8", bodyEdge: "#7da5cc", sheen: "#c8ddf0", gens: ["18"] },
];

interface CaseFinish {
  id: string;
  name: string;
  material: string;
  /** Grundton des Carbon-Gewebes */
  base: string;
  weave: string;
  edge: string;
  price: number;
}

const CASE_FINISHES: CaseFinish[] = [
  {
    id: "cherry",
    name: "Cherry Carbon",
    material: "Carbon-Design, Cherry · Aluminium-Knöpfe in Gold",
    base: "#7b4b60",
    weave: "#a66f83",
    edge: "#4f2b3a",
    price: 59,
  },
  {
    id: "onyx",
    name: "Onyx Carbon",
    material: "Carbon-Design, Schwarz · Aluminium-Knöpfe in Gold",
    base: "#16171a",
    weave: "#33363c",
    edge: "#08090a",
    price: 59,
  },
];

/* ── AirPods 4 & 5 Cases — gleiche Finishes, gleicher Blitz ──────────── */
interface AirpodsCase {
  id: string;
  name: string;
  image: string;
  /** Kompaktes, quadratisches Vorschaubild für die Bundle-Karte. */
  thumb: string;
  price: number;
}

const AIRPODS_CASES: Record<string, AirpodsCase> = {
  cherry: { id: "cherry", name: "MATRIX AirPods 4 & 5 · Cherry Carbon", image: airpodsCherry, thumb: airpodsThumbs.cherry, price: 35 },
  onyx: { id: "onyx", name: "MATRIX AirPods 4 & 5 · Onyx Carbon", image: airpodsOnyx, thumb: airpodsThumbs.onyx, price: 35 },
};

/** Angezeigter Preis für zwei Hüllen; der Rabatt selbst kommt nur aus dem Shopify-Code. */
const TWO_CASES_TOTAL = 99;
const TWO_CASES_DISCOUNT_CODE = "MATRIX2";






/* ── Visual: Produktrender (Gerät in Hülle) ───────────────────────────── */
const RENDERS: Record<string, string> = {
  // Gen 17
  "17-cherry-orange": cherryOrangeAsset.url,
  "17-cherry-blue": cherryBlueAsset.url,
  "17-cherry-silver": cherrySilverAsset.url,
  "17-onyx-orange": onyxOrange.url,
  "17-onyx-blue": onyxBlue.url,
  "17-onyx-silver": onyxSilver.url,
  // Gen 18
  "18-cherry-darkcherry": cherryDarkcherry18Asset.url,
  "18-cherry-darkgrey": cherryDarkgrey18Asset.url,
  "18-cherry-skyblue": cherrySkyblue18Asset.url,
  "18-cherry-silver": cherrySilver18Asset.url,
  "18-onyx-darkcherry": onyxDarkcherry.url,
  "18-onyx-darkgrey": onyxDarkgrey18Asset.url,
  "18-onyx-skyblue": onyxSkyblue18Asset.url,
  "18-onyx-silver": onyxSilver.url,
};

let variantsWarming = false;
const warmVariantImages = () => {
  releaseReviews();
  if (variantsWarming) return;
  variantsWarming = true;
  const start = () => {
    const queue = Array.from(new Set(Object.values(RENDERS).map((src) => renderSizes.get(src)?.mobile).filter((src): src is string => Boolean(src))));
    const loadNext = () => {
      const src = queue.shift();
      if (!src) return;
      const image = new Image();
      image.fetchPriority = "low";
      image.decoding = "async";
      image.onload = image.onerror = loadNext;
      image.src = src;
    };
    // Only two low-priority downloads at once, after the initial page load.
    loadNext();
    loadNext();
  };
  const idle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(start);
    else setTimeout(start, 1500);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
};

const MatrixPage = () => {
  useState(() => { holdReviewsUntilImage(); return null; });
  const { reviews: productReviews } = useProductReviews("matrix");
  useEffect(() => {
    trackViewItem({ item_id: "RAJ-MTX", item_name: "RAJ MATRIX iPhone Case", price: 59 });
  }, []);
  const [initialSelection] = useState(() => matrixUrlSelection(window.location.search));
  const [modelError,setModelError] = useState(false);
  const modelPickerRef = useRef<HTMLDivElement>(null);
  const [modelId, setModelId] = useState<ModelId | null>(initialSelection.model);
  const [deviceId, setDeviceId] = useState("silver");
  const [caseId, setCaseId] = useState(initialSelection.color);
  const [airpodsSelected, setAirpodsSelected] = useState(false);
  const [airpodsColorId, setAirpodsColorId] = useState<string | null>(null);
  const [twoCasesSelected, setTwoCasesSelected] = useState(false);
  const [secondModelId, setSecondModelId] = useState<ModelId | null>(null);
  const [secondCaseId, setSecondCaseId] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  const mainBuyRef = useRef<HTMLButtonElement>(null);
  const { pending, confirmed, track: trackCheckout, dismiss: dismissOrder, dismissPending } = usePendingCheckout();

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const finishes = useMemo(
    () => DEVICE_FINISHES.filter((f) => f.gens.includes(model.gen)),
    [model.gen]
  );
  const device = finishes.find((f) => f.id === deviceId) ?? finishes[0];
  const caseFinish = CASE_FINISHES.find((c) => c.id === caseId) ?? CASE_FINISHES[0];
  const airpodsCase = AIRPODS_CASES[airpodsColorId ?? caseFinish.id];
  const bundleTotal = caseFinish.price + airpodsCase.price - BUNDLE_DISCOUNT;
  const secondModel = MODELS.find((m) => m.id === (secondModelId ?? modelId)) ?? model;
  const secondCaseFinish = CASE_FINISHES.find((c) => c.id === (secondCaseId ?? caseId)) ?? caseFinish;
  const currentTotal = matrixTotal(airpodsSelected, twoCasesSelected);
  const caseThumbSrc =
    RENDERS[`${model.gen}-${caseFinish.id}-${device.id}`] ??
    Object.entries(RENDERS).find(([key]) => key.startsWith(`${model.gen}-${caseFinish.id}-`))?.[1] ??
    Object.values(RENDERS)[0];

  const handleBuy = useCallback(async () => {
    if (isBuying) return;
    if (!modelId) { setModelError(true); modelPickerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    setIsBuying(true);
    // Open the tab synchronously inside the user gesture so popup blockers
    // (esp. mobile Safari) can't suppress it; we navigate it once we have the URL.
    const checkoutTab = openCheckoutTab();
    const fail = (message: string) => {
      checkoutTab?.close();
      toast.error("Kauf konnte nicht gestartet werden", { description: message });
    };
    try {
      const caseVariantId = CASE_VARIANT_IDS[modelId]?.[caseId];
      if (!caseVariantId) { fail("Diese Variante ist derzeit nicht verfügbar."); return; }

      if (twoCasesSelected) {
        const secondVariantId = CASE_VARIANT_IDS[secondModel.id]?.[secondCaseFinish.id];
        if (!secondVariantId) { fail("Die zweite Hülle ist derzeit nicht verfügbar."); return; }
        const items = [
          { item_id: caseVariantId, item_name: "RAJ MATRIX Case", item_variant: `${model.name} / ${caseFinish.name}`, price: TWO_CASES_TOTAL / 2 },
          { item_id: secondVariantId, item_name: "RAJ MATRIX Case", item_variant: `${secondModel.name} / ${secondCaseFinish.name}`, price: TWO_CASES_TOTAL / 2 },
        ];
        trackAddToCart(items);
        trackBeginCheckout(items);
        const reference = makeOrderReference();
        const product = { node: { id: "", title: "MATRIX Case", description: "", handle: "raj-matrix-case", priceRange: { minVariantPrice: { amount: String(caseFinish.price), currencyCode: "CHF" } }, images: { edges: [] }, variants: { edges: [] }, options: [] } };
        const identical = secondVariantId === caseVariantId;
        const first: CartItem = { lineId: null, product, variantId: caseVariantId, variantTitle: `${model.name} / ${caseFinish.name}`, price: { amount: String(caseFinish.price), currencyCode: "CHF" }, quantity: identical ? 2 : 1, selectedOptions: [{ name: "Modell", value: model.name }, { name: "Finish", value: caseFinish.name }] };
        const cart = await createShopifyCart(first, [TWO_CASES_DISCOUNT_CODE], [{ key: "RAJ Referenz", value: reference }, { key: "Quelle", value: "raj.ch/matrix" }]);
        if (!cart) { fail("Der Warenkorb konnte nicht erstellt werden. Bitte versuche es erneut."); return; }
        if (!identical) {
          const second: CartItem = { ...first, variantId: secondVariantId, variantTitle: `${secondModel.name} / ${secondCaseFinish.name}`, quantity: 1, selectedOptions: [{ name: "Modell", value: secondModel.name }, { name: "Finish", value: secondCaseFinish.name }] };
          const added = await addLineToShopifyCart(cart.cartId, second);
          if (!added.success) { fail("Die zweite Hülle konnte nicht hinzugefügt werden. Bitte versuche es erneut."); return; }
          if (added.checkoutUrl) cart.checkoutUrl = added.checkoutUrl;
        }
        trackCheckout({ cartId: cart.cartId, reference, summary: `2× MATRIX Case: ${model.name} · ${caseFinish.name} + ${secondModel.name} · ${secondCaseFinish.name}`, total: `CHF ${TWO_CASES_TOTAL}.–`, startedAt: Date.now() });
        goToCheckout(checkoutTab, cart.checkoutUrl);
        return;
      }

      const trackedItems = [
        { item_id: caseVariantId, item_name: "RAJ MATRIX Case", item_variant: `${model.name} / ${caseFinish.name}`, price: caseFinish.price },
        ...(airpodsSelected && AIRPODS_VARIANT_IDS[airpodsCase.id]
          ? [{ item_id: AIRPODS_VARIANT_IDS[airpodsCase.id], item_name: "RAJ MATRIX AirPods 4 & 5 Case", item_variant: airpodsCase.name, price: airpodsCase.price - BUNDLE_DISCOUNT }]
          : []),
      ];
      trackAddToCart(trackedItems);
      trackBeginCheckout(trackedItems);

      const reference = makeOrderReference();
      const dummyProduct = { node: { id: "", title: "MATRIX Case", description: "", handle: "raj-matrix-case", priceRange: { minVariantPrice: { amount: String(caseFinish.price), currencyCode: "CHF" } }, images: { edges: [] }, variants: { edges: [] }, options: [] } };
      const caseItem: CartItem = { lineId: null, product: dummyProduct, variantId: caseVariantId, variantTitle: `${model.name} / ${caseFinish.name}`, price: { amount: String(caseFinish.price), currencyCode: "CHF" }, quantity: 1, selectedOptions: [{ name: "Modell", value: model.name }, { name: "Finish", value: caseFinish.name }] };

      const cart = await createShopifyCart(
        caseItem,
        airpodsSelected ? [BUNDLE_DISCOUNT_CODE] : undefined,
        [{ key: "RAJ Referenz", value: reference }, { key: "Quelle", value: "raj.ch/matrix" }],
      );
      if (!cart) { fail("Der Warenkorb konnte nicht erstellt werden. Bitte versuche es erneut."); return; }

      if (airpodsSelected) {
        const apVariantId = AIRPODS_VARIANT_IDS[airpodsCase.id];
        if (!apVariantId) { fail("Das gewählte AirPods Case ist derzeit nicht verfügbar."); return; }
        const apItem: CartItem = { lineId: null, product: { ...dummyProduct, node: { ...dummyProduct.node, title: "MATRIX AirPods 4 & 5 Case", handle: "raj-matrix-airpods-4-case" } }, variantId: apVariantId, variantTitle: airpodsCase.name, price: { amount: String(airpodsCase.price), currencyCode: "CHF" }, quantity: 1, selectedOptions: [{ name: "Finish", value: airpodsCase.name }] };
        const added = await addLineToShopifyCart(cart.cartId, apItem);
        if (!added.success) { fail("Das AirPods Case konnte nicht zum Bundle hinzugefügt werden. Bitte versuche es erneut."); return; }
        if (added.checkoutUrl) cart.checkoutUrl = added.checkoutUrl;
      }

      trackCheckout({
        cartId: cart.cartId,
        reference,
        summary: airpodsSelected
          ? `MATRIX Case ${model.name} · ${caseFinish.name} + AirPods 4 & 5 Case ${airpodsCase.name}`
          : `MATRIX Case ${model.name} · ${caseFinish.name}`,
        total: `CHF ${airpodsSelected ? bundleTotal : caseFinish.price}.–`,
        startedAt: Date.now(),
      });

      goToCheckout(checkoutTab, cart.checkoutUrl);
    } catch (err) {
      console.error("Buy failed:", err);
      fail("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsBuying(false);
    }
  }, [isBuying, modelId, caseId, caseFinish, model, airpodsSelected, airpodsCase, bundleTotal, trackCheckout, twoCasesSelected, secondModel, secondCaseFinish]);


  const selectModel = (id: ModelId) => {
    const next = MODELS.find((m) => m.id === id);
    if (!next) return;
    setModelId(id);
    setModelError(false);
    if (!DEVICE_FINISHES.find((f) => f.id === deviceId)?.gens.includes(next.gen)) {
      const fallback = DEVICE_FINISHES.find((f) => f.gens.includes(next.gen));
      if (fallback) setDeviceId(fallback.id);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RAJ MATRIX Carbon Hülle MagSafe",
    brand: { "@type": "Brand", name: "RAJ" },
    description:
      "RAJ MATRIX, schlanke MagSafe-Hülle im Carbon-Design für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Cherry Carbon und Onyx Carbon mit goldenen Aluminium-Knöpfen, MagSafe- und Qi2.2-kompatibel, abgestimmt auf RAJ NEXUS.",
    image: [`https://raj.ch${matrixShareAsset.url}`, `https://raj.ch${cherryDarkcherry18Asset.url}`, `https://raj.ch${onyxDarkgrey18Asset.url}`],
    url: "https://raj.ch/matrix",
    ...reviewSchema("matrix", verifiedMatrixReviews(productReviews)),
    offers: {
      "@type": "Offer",
      url: "https://raj.ch/matrix",
      priceCurrency: "CHF",
      price: 59,
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
        description: MATRIX_DELIVERY_TEXT_NO_DATE,
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "CHF" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CH" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "d" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 3, unitCode: "d" },
        },
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>MagSafe Carbon-Hülle für iPhone 18 Pro & 17 Pro (Max) | RAJ MATRIX</title>
        <meta
          name="description"
          content="Schlanke MagSafe Carbon-Hülle für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Qi2.2 Laden durch die Hülle, goldfarbene Aluminium-Knöpfe. CHF 59, gratis Versand."
        />
        <link rel="canonical" href="https://raj.ch/matrix" />
        <meta property="og:title" content="MagSafe Carbon-Hülle für iPhone 18 Pro & 17 Pro (Max) | RAJ MATRIX" />
        <meta
          property="og:description"
          content="Schlanke MagSafe Carbon-Hülle für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Qi2.2 Laden durch die Hülle, goldfarbene Aluminium-Knöpfe. CHF 59, gratis Versand."
        />
        <meta name="twitter:title" content="MagSafe Carbon-Hülle für iPhone 18 Pro & 17 Pro (Max) | RAJ MATRIX" />
        <meta name="twitter:description" content="Schlanke MagSafe Carbon-Hülle für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Qi2.2 Laden durch die Hülle, goldfarbene Aluminium-Knöpfe. CHF 59, gratis Versand." />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://raj.ch/matrix" />
        {shareImageTags(shareImages.matrix)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:MATRIX_FAQ.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))})}</script>
      </Helmet>

      <div className="mx-page min-h-screen">
        <Header topSlot={<NexusTrustBar />} />
        <main>
          <section className="mx-purchase">
            <MatrixGallery src={caseThumbSrc} finish={caseId} alt={`RAJ MATRIX ${caseFinish.name} Hülle für ${model.name} in ${device.name}`} onFirstLoad={warmVariantImages}/>
            <div className="mx-options">
              <div><div className="mx-heading"><div><h1>MATRIX</h1><p className="mx-subtitle">MagSafe Hülle im Carbon-Design</p></div><div className="mx-price">CHF {currentTotal}.–{(airpodsSelected || twoCasesSelected) && <del>statt CHF {twoCasesSelected ? 118 : 94}.–</del>}</div></div>
                {verifiedMatrixReviews(productReviews).length > 0 && <Button asChild variant="link" className="mx-rating"><a href="#bewertungen"><StarRating readOnly size={14} value={Math.round(verifiedMatrixReviews(productReviews).reduce((s,r)=>s+r.rating,0)/verifiedMatrixReviews(productReviews).length)}/><span>{(verifiedMatrixReviews(productReviews).reduce((s,r)=>s+r.rating,0)/verifiedMatrixReviews(productReviews).length).toFixed(1)} · {verifiedMatrixReviews(productReviews).length} Bewertungen</span></a></Button>}
              </div>
              <div className="mx-photos"><ProductCustomerPhotos productId="matrix" /></div>
              <ul className="mx-points">{[{Icon:Layers,text:'Carbon-Design, matt und griffig'},{Icon:Sparkles,text:'Goldene Tasten und Kameraring aus eloxiertem Aluminium'},{Icon:Magnet,text:'Kompatibel mit MagSafe und Qi2.2, bis zu 25 W'}].map(({Icon,text})=><li key={text}><Icon strokeWidth={1.5}/><span>{text}</span></li>)}</ul>
              <div ref={modelPickerRef} className={`mx-models ${modelError ? 'is-invalid' : ''}`}><p className="mx-model-label">{modelId ? `Dein iPhone · ${model.name}` : 'Welches iPhone hast du?'}</p><div className="mx-model-grid">{MODELS.map(m=><Button key={m.id} variant="outline" className="mx-model-button" aria-pressed={modelId===m.id} onClick={()=>selectModel(m.id)}>{m.name}</Button>)}</div>{modelError && <p role="alert" className="mx-model-error">Bitte wähle zuerst dein iPhone-Modell</p>}</div>
              <div className="mx-colors"><div><p className="mx-color-label">Hülle · {caseFinish.name}</p><div className="mx-swatches">{CASE_FINISHES.map(c=><Button key={c.id} variant="ghost" className="mx-swatch" aria-label={c.name} aria-pressed={caseId===c.id} onClick={()=>{setCaseId(c.id);setAirpodsColorId(null);}}><span className={`mx-swatch-dot mx-swatch-${c.id}`}/></Button>)}</div></div><div><p className="mx-color-label">iPhone · {device.name}</p><div className="mx-swatches">{finishes.map(f=><Button key={f.id} variant="ghost" className="mx-swatch" aria-label={f.name} aria-pressed={device.id===f.id} onClick={()=>setDeviceId(f.id)}><span className={`mx-swatch-dot mx-swatch-${f.id}`}/></Button>)}</div></div></div>
              <div className="mx-bundles"><label className="mx-airpods"><Checkbox aria-label="Passendes AirPods Case dazu" checked={airpodsSelected} onCheckedChange={checked=>{setAirpodsSelected(checked===true);setTwoCasesSelected(false);setAirpodsColorId(null);}}/><img src={airpodsCase.thumb} alt={`AirPods Case ${caseFinish.name}`} width={40} height={48} loading="lazy"/><span className="mx-airpods-text"><strong>Passendes AirPods Case dazu</strong><small>AirPods 4 und 5 · {caseFinish.name}</small></span><span className="mx-addon-price">+ CHF 20.–<del>35.–</del></span></label>
                <Button variant={BLACK_FRIDAY_MODE ? 'outline' : 'link'} className={BLACK_FRIDAY_MODE ? 'mx-bf' : 'mx-two-link'} aria-pressed={twoCasesSelected} onClick={()=>{setTwoCasesSelected(!twoCasesSelected);setAirpodsSelected(false);if(!twoCasesSelected){setSecondModelId(modelId);setSecondCaseId(caseId);}}}>{BLACK_FRIDAY_MODE ? <><span><span className="mx-bf-badge">BLACK FRIDAY</span>2 Hüllen für CHF 99.–<small>Eine für dich, eine zum Verschenken</small></span><del>118.–</del></> : <span>Zwei Hüllen? CHF 99.– statt 118.– ›</span>}</Button>
                {twoCasesSelected && <div className="mx-second"><p className="mx-second-label">Zweite Hülle</p><div className="mx-model-grid">{MODELS.map(m=><Button key={m.id} variant="outline" className="mx-model-button" aria-pressed={secondModel.id===m.id} onClick={()=>setSecondModelId(m.id)}>{m.name}</Button>)}</div><div className="mx-second-colors">{CASE_FINISHES.map(c=><Button key={c.id} variant="outline" aria-pressed={secondCaseFinish.id===c.id} onClick={()=>setSecondCaseId(c.id)}>{c.name}</Button>)}</div></div>}
              </div>
              {confirmed && <div className="mx-notice"><Button variant="ghost" size="icon" aria-label="Bestätigung schliessen" onClick={dismissOrder}><X size={16}/></Button><p>Bestellung eingegangen</p><p>{confirmed.summary} · {confirmed.total}</p></div>}
              {pending && !confirmed && <div className="mx-notice"><Button variant="ghost" size="icon" aria-label="Hinweis schliessen" onClick={dismissPending}><X size={16}/></Button><p>Checkout läuft</p></div>}
              <Button ref={mainBuyRef} className="mx-buy" onClick={handleBuy} disabled={isBuying}>{isBuying ? <Loader2 className="animate-spin" size={18}/> : `Jetzt kaufen · CHF ${currentTotal}.–`}</Button>
              <div className="mx-payment"><span><LockKeyhole size={11}/> Sichere Zahlung</span>{['TWINT','Apple Pay','Visa','Mastercard'].map(p=><b key={p}>{p}</b>)}</div>
              <div className="mx-trust">{[{Icon:Truck,text:'Gratis Versand, 2 bis 3 Tage'},{Icon:RotateCcw,text:'30 Tage gratis Rückgabe'},{Icon:MapPin,text:'Support aus der Schweiz'},{Icon:PencilRuler,text:'Gestaltet in der Schweiz'}].map(({Icon,text})=><div key={text}><Icon strokeWidth={1.5}/><span>{text}</span></div>)}</div>
            </div>
          </section>
          <MatrixEditorial/>
        </main>
        <Footer/>
        <MobileProductBuyBar mainBuyRef={mainBuyRef} name={`MATRIX · ${modelId ? model.short : 'Modell wählen'} · ${caseFinish.name}${twoCasesSelected ? ' · 2 Hüllen' : airpodsSelected ? ' + AirPods' : ''}`} image={renderSizes.get(caseThumbSrc)?.thumb ?? caseThumbSrc} imageAlt={`MATRIX ${caseFinish.name} · ${model.name} · ${device.name}`} price={currentTotal} busy={isBuying}/>
      </div>
    </>
  );
};
export default MatrixPage;

import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Minus, ArrowUpRight, ShoppingBag, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createShopifyCart, addLineToShopifyCart } from "@/lib/shopify";
import type { CartItem } from "@/lib/shopify";
import { usePendingCheckout, makeOrderReference } from "@/hooks/usePendingCheckout";
import { goToCheckout, openCheckoutTab } from "@/lib/checkout";

import Header from "@/components/Header";
import NexusTrustBar from "@/components/nexus/NexusTrustBar";
import Footer from "@/components/Footer";
import cherryOrangeAsset from "@/assets/matrix/optimized-renders/17-cherry-cherry-cosmic-orange.webp.asset.json";
import cherryBlueAsset from "@/assets/matrix/optimized-renders/17-cherry-cherry-deep-blue.webp.asset.json";
import cherrySilverAsset from "@/assets/matrix/optimized-renders/17-cherry-cherry-silver.webp.asset.json";
import cherryDarkcherry18Asset from "@/assets/matrix/optimized-renders/18-cherry-cherry-darkcherry.webp.asset.json";
import cherryDarkgrey18Asset from "@/assets/matrix/optimized-renders/18-cherry-cherry-darkgrey.webp.asset.json";
import cherrySilver18Asset from "@/assets/matrix/optimized-renders/18-cherry-cherry-silver.webp.asset.json";
import cherrySkyblue18Asset from "@/assets/matrix/optimized-renders/18-cherry-cherry-skyblue.webp.asset.json";
import onyxOrange from "@/assets/matrix/hq-reference-webp/onyx-orange.webp";
import onyxBlue from "@/assets/matrix/hq-reference-webp/onyx-blue.webp";
import onyxSilver from "@/assets/matrix/hq-reference-webp/onyx-silver.webp";
import onyxDarkcherry from "@/assets/matrix/hq-reference-webp/onyx-darkcherry.webp";
import onyxDarkgrey18Asset from "@/assets/matrix/optimized-renders/18-onyx-onyx-darkgrey.webp.asset.json";
import onyxSkyblue18Asset from "@/assets/matrix/optimized-renders/18-onyx-onyx-skyblue.webp.asset.json";
import airpodsCherry from "@/assets/matrix/airpods-cherry.webp";
import airpodsOnyx from "@/assets/matrix/airpods-onyx.webp";
import rajBoltOriginal from "@/assets/matrix/raj-bolt-original.png";

/* ── Design tokens (aligned with /produkte editorial system) ─────────── */
const H = {
  bg: "#faf9f7",
  gold: "#9b6b3f",
  goldLight: "#e0bd79",
  cherry: "#7b4b60",
  line: "rgba(43,39,37,0.10)",
  lineStrong: "rgba(43,39,37,0.22)",
  text: "#2b2725",
  textMuted: "rgba(43,39,37,0.55)",
};

/* ── Data ─────────────────────────────────────────────────────────────── */
type ModelId = "17pro" | "17promax" | "18pro" | "18promax";

interface Model {
  id: ModelId;
  short: string;
  name: string;
  gen: "17" | "18";
  status: string;
}

const MODELS: Model[] = [
  { id: "17pro", short: "17 Pro", name: "iPhone 17 Pro", gen: "17", status: "Verfügbar" },
  { id: "17promax", short: "17 Pro Max", name: "iPhone 17 Pro Max", gen: "17", status: "Verfügbar" },
  { id: "18pro", short: "18 Pro", name: "iPhone 18 Pro", gen: "18", status: "Vorbestellung" },
  { id: "18promax", short: "18 Pro Max", name: "iPhone 18 Pro Max", gen: "18", status: "Vorbestellung" },
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
    material: "Carbon, Cherry · Titan-Knöpfe in Gold",
    base: "#7b4b60",
    weave: "#a66f83",
    edge: "#4f2b3a",
    price: 59,
  },
  {
    id: "onyx",
    name: "Onyx Carbon",
    material: "Carbon, Schwarz · Titan-Knöpfe in Gold",
    base: "#16171a",
    weave: "#33363c",
    edge: "#08090a",
    price: 59,
  },
];

/* ── AirPods 4 Cases — gleiche Finishes, gleicher Blitz ───────────────── */
interface AirpodsCase {
  id: string;
  name: string;
  image: string;
  price: number;
}

const AIRPODS_CASES: Record<string, AirpodsCase> = {
  cherry: { id: "cherry", name: "MATRIX AirPods 4 · Cherry Carbon", image: airpodsCherry, price: 35 },
  onyx: { id: "onyx", name: "MATRIX AirPods 4 · Onyx Carbon", image: airpodsOnyx, price: 35 },
};

/** Rabatt, wenn iPhone-Hülle und AirPods-Hülle zusammen gekauft werden. */
const BUNDLE_DISCOUNT = 15;
/** Shopify Rabattcode, der den Bundle-Rabatt im Checkout anwendet. */
const BUNDLE_DISCOUNT_CODE = "MATRIXBUNDLE";

/* ── Shopify Variant ID mapping ─────────────────────────────────────── */
const CASE_VARIANT_IDS: Record<string, Record<string, string>> = {
  // modelId → caseId → gid
  "17pro":    { cherry: "gid://shopify/ProductVariant/59116736545093", onyx: "gid://shopify/ProductVariant/59116736577861" },
  "17promax": { cherry: "gid://shopify/ProductVariant/59116736610629", onyx: "gid://shopify/ProductVariant/59116736643397" },
  "18pro":    { cherry: "gid://shopify/ProductVariant/59116736676165", onyx: "gid://shopify/ProductVariant/59116736708933" },
  "18promax": { cherry: "gid://shopify/ProductVariant/59116736741701", onyx: "gid://shopify/ProductVariant/59116736774469" },
};

const AIRPODS_VARIANT_IDS: Record<string, string> = {
  cherry: "gid://shopify/ProductVariant/59116737364293",
  onyx:   "gid://shopify/ProductVariant/59116737397061",
};






interface Row {
  label: string;
  values: Record<string, string | boolean>;
}

const MATRIX_ROWS: Row[] = [
  { label: "MagSafe Magnetring (N52)", values: { cherry: true, onyx: true } },
  { label: "Qi2.2 · 25 W ohne Verlust", values: { cherry: true, onyx: true } },
  { label: "RAJ NEXUS kompatibel", values: { cherry: true, onyx: true } },
  { label: "RAJ APEX kompatibel", values: { cherry: true, onyx: true } },
  { label: "Knöpfe", values: { cherry: "Titan, goldeloxiert", onyx: "Titan, goldeloxiert" } },
  { label: "Materialstärke", values: { cherry: "0,9 mm", onyx: "0,9 mm" } },
  { label: "Falltest", values: { cherry: "4 m", onyx: "4 m" } },
  { label: "Kameraring Metall", values: { cherry: true, onyx: true } },
  { label: "Gerätefarbe im Plateau sichtbar", values: { cherry: true, onyx: true } },
];

/* ── Visual: Produktrender (Gerät in Hülle) ───────────────────────────── */
const RENDERS: Record<string, string> = {
  // Gen 17
  "17-cherry-orange": cherryOrangeAsset.url,
  "17-cherry-blue": cherryBlueAsset.url,
  "17-cherry-silver": cherrySilverAsset.url,
  "17-onyx-orange": onyxOrange,
  "17-onyx-blue": onyxBlue,
  "17-onyx-silver": onyxSilver,
  // Gen 18
  "18-cherry-darkcherry": cherryDarkcherry18Asset.url,
  "18-cherry-darkgrey": cherryDarkgrey18Asset.url,
  "18-cherry-skyblue": cherrySkyblue18Asset.url,
  "18-cherry-silver": cherrySilver18Asset.url,
  "18-onyx-darkcherry": onyxDarkcherry,
  "18-onyx-darkgrey": onyxDarkgrey18Asset.url,
  "18-onyx-skyblue": onyxSkyblue18Asset.url,
  "18-onyx-silver": onyxSilver,
};

/* Originalkontur des goldenen MATRIX-Emblems, direkt aus dem Produktfoto. */
const GoldBolt = forwardRef<HTMLImageElement, { airpods?: boolean }>(({ airpods = false }, ref) => (
  <img
    ref={ref}
    aria-hidden="true"
    src={rajBoltOriginal}
    alt=""
    className="absolute pointer-events-none"
    style={{
      left: airpods ? "50%" : "34.5%",
      top: airpods ? "52%" : undefined,
      bottom: airpods ? undefined : "12.5%",
      width: airpods ? "5.2%" : "4.15%",
      height: "auto",
      transform: airpods ? "translate(-50%, -50%)" : undefined,
      opacity: 1,
      mixBlendMode: "normal",
      filter: "drop-shadow(0 0.5px 0 rgba(255,248,214,0.95)) drop-shadow(0 1px 1px rgba(92,53,16,0.3))",
    }}
  />
));
GoldBolt.displayName = "GoldBolt";


const DeviceMock = memo(({
  device,
  caseFinish,
  model,
}: {
  device: DeviceFinish;
  caseFinish: CaseFinish;
  model: Model;
}) => {
  const renderKey = `${model.gen}-${caseFinish.id}-${device.id}`;
  const generationRenders = useMemo(
    () => Object.entries(RENDERS).filter(([key]) => key.startsWith(`${model.gen}-`)),
    [model.gen],
  );
  const generationFallback = generationRenders[0]?.[1];
  const src = RENDERS[renderKey] ?? generationFallback ?? Object.values(RENDERS)[0];
  const preloadedSources = generationRenders.map(([, renderSrc]) => renderSrc).filter((renderSrc) => renderSrc !== src);

  return (
    <div
      className="relative mx-auto w-full max-w-[286px] md:max-w-none transition-[width] duration-500 ease-out"
      style={{ width: "min(100%, 380px)", aspectRatio: "1 / 1" }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-[3%] w-[58%] h-8 rounded-[50%] pointer-events-none"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(43,39,37,0.22), transparent 72%)", filter: "blur(3px)" }}
      />
      <img
        src={src}
        alt={`RAJ MATRIX ${caseFinish.name} Hülle für ${model.name} in ${device.name}`}
        width={928}
        height={1152}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ filter: "contrast(1.015) saturate(1.015)" }}
      />
      <div aria-hidden className="hidden">
        {preloadedSources.map((preloadSrc) => (
          <img key={preloadSrc} src={preloadSrc} alt="" decoding="async" />
        ))}
      </div>
    </div>

  );
});
DeviceMock.displayName = "DeviceMock";



/* ── Page ─────────────────────────────────────────────────────────────── */
const MatrixPage = () => {
  const [modelId, setModelId] = useState<ModelId>("17promax");
  const [deviceId, setDeviceId] = useState("orange");
  const [caseId, setCaseId] = useState("cherry");
  const [airpodsSelected, setAirpodsSelected] = useState(false);
  const [airpodsColorId, setAirpodsColorId] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [isBuyingAirpods, setIsBuyingAirpods] = useState(false);
  const { pending, confirmed, track: trackCheckout, dismiss: dismissOrder, dismissPending } = usePendingCheckout();


  const model = MODELS.find((m) => m.id === modelId)!;
  const finishes = useMemo(
    () => DEVICE_FINISHES.filter((f) => f.gens.includes(model.gen)),
    [model.gen]
  );
  const device = finishes.find((f) => f.id === deviceId) ?? finishes[0];
  const caseFinish = CASE_FINISHES.find((c) => c.id === caseId)!;
  const airpodsCase = AIRPODS_CASES[airpodsColorId ?? caseFinish.id];
  const bundleTotal = caseFinish.price + airpodsCase.price - BUNDLE_DISCOUNT;

  const handleBuy = useCallback(async () => {
    if (isBuying) return;
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
        const apItem: CartItem = { lineId: null, product: { ...dummyProduct, node: { ...dummyProduct.node, title: "MATRIX AirPods 4 Case", handle: "raj-matrix-airpods-4-case" } }, variantId: apVariantId, variantTitle: airpodsCase.name, price: { amount: String(airpodsCase.price), currencyCode: "CHF" }, quantity: 1, selectedOptions: [{ name: "Finish", value: airpodsCase.name }] };
        const added = await addLineToShopifyCart(cart.cartId, apItem);
        if (!added.success) { fail("Das AirPods Case konnte nicht zum Bundle hinzugefügt werden. Bitte versuche es erneut."); return; }
        if (added.checkoutUrl) cart.checkoutUrl = added.checkoutUrl;
      }

      trackCheckout({
        cartId: cart.cartId,
        reference,
        summary: airpodsSelected
          ? `MATRIX Case ${model.name} · ${caseFinish.name} + AirPods 4 Case ${airpodsCase.name}`
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
  }, [isBuying, modelId, caseId, caseFinish, model, airpodsSelected, airpodsCase, bundleTotal, trackCheckout]);

  const handleAirpodsBuy = useCallback(async () => {
    if (isBuyingAirpods) return;
    setIsBuyingAirpods(true);
    const checkoutTab = openCheckoutTab();
    const fail = (message: string) => {
      checkoutTab?.close();
      toast.error("Kauf konnte nicht gestartet werden", { description: message });
    };

    try {
      const variantId = AIRPODS_VARIANT_IDS[airpodsCase.id];
      if (!variantId) {
        fail("Dieses Finish ist derzeit nicht verfügbar.");
        return;
      }

      const reference = makeOrderReference();
      const product = {
        node: {
          id: "gid://shopify/Product/16139790549317",
          title: "RAJ MATRIX AirPods 4 Case",
          description: "Aramid-Carbon Case für AirPods 4.",
          handle: "raj-matrix-airpods-4-case",
          priceRange: { minVariantPrice: { amount: String(airpodsCase.price), currencyCode: "CHF" } },
          images: { edges: [] },
          variants: { edges: [] },
          options: [{ name: "Finish", values: Object.values(AIRPODS_CASES).map((item) => item.name) }],
        },
      };
      const item: CartItem = {
        lineId: null,
        product,
        variantId,
        variantTitle: airpodsCase.name,
        price: { amount: String(airpodsCase.price), currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: [{ name: "Finish", value: airpodsCase.name }],
      };
      const cart = await createShopifyCart(item, undefined, [
        { key: "RAJ Referenz", value: reference },
        { key: "Quelle", value: "raj.ch/matrix-airpods-einzelkauf" },
      ]);
      if (!cart) {
        fail("Der Warenkorb konnte nicht erstellt werden. Bitte versuche es erneut.");
        return;
      }

      trackCheckout({
        cartId: cart.cartId,
        reference,
        summary: airpodsCase.name,
        total: `CHF ${airpodsCase.price}.–`,
        startedAt: Date.now(),
      });

      goToCheckout(checkoutTab, cart.checkoutUrl);
    } catch (error) {
      console.error("AirPods Case purchase failed:", error);
      fail("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsBuyingAirpods(false);
    }
  }, [airpodsCase, isBuyingAirpods, trackCheckout]);


  const selectModel = (id: ModelId) => {
    setModelId(id);
    const next = MODELS.find((m) => m.id === id)!;
    if (!DEVICE_FINISHES.find((f) => f.id === deviceId)?.gens.includes(next.gen)) {
      setDeviceId(DEVICE_FINISHES.find((f) => f.gens.includes(next.gen))!.id);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RAJ MATRIX Case",
    brand: { "@type": "Brand", name: "RAJ" },
    description:
      "RAJ MATRIX — MagSafe-Cases für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Cherry Carbon und Onyx Carbon mit goldenen Titan-Knöpfen, Qi2.2-kompatibel, abgestimmt auf RAJ NEXUS und RAJ APEX.",
    url: "https://raj.ch/matrix",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CHF",
      lowPrice: 35,
      highPrice: 59,
      offerCount: CASE_FINISHES.length + Object.keys(AIRPODS_CASES).length,
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <Helmet>
        <title>RAJ MATRIX — MagSafe Cases für iPhone 17 & 18 Pro | RAJ</title>
        <meta
          name="description"
          content="RAJ MATRIX Cases für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Zwei Carbon-Finishes mit goldenen Knöpfen und Qi2.2 mit 25 W."
        />
        <link rel="canonical" href="https://raj.ch/matrix" />
        <meta property="og:title" content="RAJ MATRIX — MagSafe Cases für iPhone 17 & 18 Pro" />
        <meta
          property="og:description"
          content="Zwei Carbon-Finishes, vier Modelle, ein System. Qi2.2 mit 25 W, abgestimmt auf RAJ NEXUS und RAJ APEX."
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://raj.ch/matrix" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: H.bg, color: H.text }} className="min-h-screen">
        <Header topSlot={<NexusTrustBar />} />

        <main className="pt-24 md:pt-28">
          {/* Hero + Konfigurator */}
          <section>
            <div className="container mx-auto px-4 md:px-6 max-w-5xl pt-2 md:pt-8 pb-5 md:pb-16">
              <div className="grid md:grid-cols-12 gap-5 md:gap-14 items-start">
                {/* Bühne */}
                <div className="md:col-span-6 md:sticky md:top-28">
                  <div
                    className="relative overflow-hidden rounded-md md:rounded-lg"
                    style={{
                      background:
                        caseFinish.id === "cherry"
                          ? "linear-gradient(155deg, #fff 0%, #faf6f7 52%, #eee5e7 100%)"
                          : "linear-gradient(155deg, #fff 0%, #f7f6f4 52%, #e9e7e3 100%)",
                      border: `1px solid ${H.line}`,
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.95) inset, 0 28px 70px -36px rgba(43,39,37,0.34)",
                    }}
                  >
                    {/* Goldene Haarlinie oben */}
                    <div
                      aria-hidden
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${H.gold}, transparent)`,
                        opacity: 0.5,
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          caseFinish.id === "cherry"
                            ? "radial-gradient(60% 48% at 50% 43%, rgba(118,69,86,0.13) 0%, rgba(250,249,247,0) 72%)"
                            : "radial-gradient(60% 48% at 50% 43%, rgba(155,107,63,0.12) 0%, rgba(250,249,247,0) 72%)",
                      }}
                    />
                    <div className="relative flex items-center justify-center px-1 pt-0 pb-0 md:px-10 md:pt-14 md:pb-8">
                      <DeviceMock device={device} caseFinish={caseFinish} model={model} />
                    </div>
                    {/* Plakette */}
                    <div
                      className="relative border-t px-4 py-2.5 md:px-10 md:py-5 flex items-center justify-between gap-3 md:gap-4"
                      style={{ borderColor: H.line, background: "rgba(255,255,255,0.55)" }}
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: H.gold }}>
                          {caseFinish.name}
                        </p>
                        <p className="mt-1 text-xs font-light md:mt-1.5 md:text-sm" style={{ color: H.text }}>
                          {model.name} · {device.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auswahl */}
                <div className="md:col-span-6 space-y-5 md:space-y-10">

                  {/* Intro */}
                  <div className="mb-2 md:mb-4">
                    <div className="flex items-center gap-2.5 mb-2 md:gap-3 md:mb-3">
                      <span className="h-px w-8" style={{ background: H.gold }} />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: H.gold }}>
                        03 · Matrix
                      </span>
                    </div>
                    <h1
                      className="font-light leading-[0.95] tracking-tight text-[32px] md:text-[clamp(40px,4.2vw,60px)]"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      MATRIX
                    </h1>
                    <p className="italic mt-1.5 text-sm md:mt-2 md:text-lg" style={{ color: H.gold }}>
                      Die Hülle als Teil des Systems.
                    </p>
                    <p className="hidden md:block mt-3 max-w-md text-sm leading-relaxed" style={{ color: H.textMuted }}>
                      Vier Modelle, zwei Carbon-Finishes, ein Magnetring — magnetisch einrastend mit NEXUS und APEX.
                    </p>
                  </div>

                  {/* Modell */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] mb-2 md:mb-4" style={{ color: H.textMuted }}>
                      Modell
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {MODELS.map((m) => {
                        const active = m.id === modelId;
                        return (
                          <button
                            key={m.id}
                            onClick={() => selectModel(m.id)}
                            aria-pressed={active}
                            className="text-left px-2.5 py-2 rounded-lg transition-all duration-300 md:px-4 md:py-3"
                            style={{
                              border: `1px solid ${active ? H.gold : H.line}`,
                              background: active ? "rgba(155,107,63,0.06)" : "transparent",
                            }}
                          >
                            <span className="block text-xs font-medium md:text-sm">iPhone {m.short}</span>
                            <span className="hidden mt-0.5 text-[11px] md:block" style={{ color: H.textMuted }}>
                              {m.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gerätefarbe */}
                  <div>
                    <div className="flex items-baseline justify-between mb-2 md:mb-4">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        Gerätefarbe
                      </p>
                      <p className="text-xs" style={{ color: H.text }}>{device.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 md:gap-3">
                      {finishes.map((f) => {
                        const active = f.id === device.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setDeviceId(f.id)}
                            aria-label={f.name}
                            aria-pressed={active}
                            className="relative w-8 h-8 rounded-full transition-transform duration-300 hover:scale-105 md:w-9 md:h-9"
                            style={{
                              background: `linear-gradient(145deg, ${f.body}, ${f.bodyEdge})`,
                              boxShadow: active
                                ? `0 0 0 1.5px ${H.bg}, 0 0 0 3px ${H.gold}`
                                : `0 0 0 1px ${H.lineStrong}`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Hüllenfinish */}
                  <div>
                    <div className="flex items-baseline justify-between mb-2 md:mb-4">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        Finish
                      </p>
                      <p className="hidden text-xs md:block" style={{ color: H.text }}>
                        {caseFinish.material}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:block md:space-y-2">
                      {CASE_FINISHES.map((c) => {
                        const active = c.id === caseId;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setCaseId(c.id)}
                            aria-pressed={active}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-300 md:gap-4 md:px-4 md:py-3"
                            style={{
                              border: `1px solid ${active ? H.gold : H.line}`,
                              background: active ? "rgba(155,107,63,0.06)" : "transparent",
                            }}
                          >
                            <span
                              className="relative w-5 h-5 rounded-full shrink-0 overflow-hidden md:w-6 md:h-6"
                              style={{
                                background: `linear-gradient(145deg, ${c.weave}, ${c.base} 55%, ${c.edge})`,
                                boxShadow: `0 0 0 1px ${H.lineStrong}`,
                              }}
                            >
                              <span
                                aria-hidden
                                className="absolute inset-0 opacity-35"
                                style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 2px, rgba(255,255,255,.35) 2px 3px, rgba(0,0,0,.18) 3px 4px)" }}
                              />
                            </span>
                            <span className="min-w-0 flex-1 text-left text-xs font-medium md:text-sm">{c.name}</span>
                            <span className="hidden text-xs md:inline" style={{ color: H.textMuted }}>
                              CHF {c.price}.–
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-3 border-t md:pt-6" style={{ borderColor: H.line }}>
                    {confirmed && (
                      <div
                        className="relative mb-5 rounded-xl p-4"
                        style={{ background: "rgba(155,107,63,0.08)", boxShadow: `0 0 0 1px ${H.lineStrong}` }}
                      >
                        <button
                          type="button"
                          onClick={dismissOrder}
                          aria-label="Bestätigung schliessen"
                          className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" style={{ color: H.gold }} />
                          <p className="text-sm font-semibold">Bestellung eingegangen</p>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed" style={{ color: H.textMuted }}>
                          {confirmed.summary} · {confirmed.total}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: H.textMuted }}>
                          Referenz <span className="font-mono font-semibold" style={{ color: H.text }}>{confirmed.reference}</span> — dieselbe Referenz steht bei der Bestellung im Shopify Admin, die Bestellnummer und Bestätigung erhältst du per E-Mail.
                        </p>
                      </div>
                    )}
                    {pending && !confirmed && (
                      <div
                        className="relative mb-5 rounded-xl p-4 flex items-start gap-3"
                        style={{ background: "rgba(43,39,37,0.04)", boxShadow: `0 0 0 1px ${H.line}` }}
                      >
                        <button
                          type="button"
                          onClick={dismissPending}
                          aria-label="Hinweis schliessen"
                          className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <Loader2 className="w-4 h-4 mt-0.5 animate-spin" style={{ color: H.gold }} />
                        <div className="pr-6">
                          <p className="text-sm font-medium">Checkout läuft</p>
                          <p className="mt-1 text-xs leading-relaxed" style={{ color: H.textMuted }}>
                            Schliesse die Zahlung im Shopify-Tab ab. Sobald die Bestellung durch ist, erscheint hier die Bestätigung mit Referenz {pending.reference}.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between gap-4 mb-2.5 md:mb-4">
                      <span className="font-light" style={{ fontSize: "clamp(22px,2vw,28px)" }}>
                        {airpodsSelected ? `CHF ${bundleTotal}.–` : `CHF ${caseFinish.price}.–`}
                      </span>
                      {airpodsSelected && (
                        <span className="text-xs line-through" style={{ color: H.textMuted }}>
                          CHF {caseFinish.price + airpodsCase.price}.–
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleBuy}
                      disabled={isBuying}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-[0.12em] transition-all active:scale-[0.98] md:py-3.5 md:text-sm md:tracking-[0.15em]"
                      style={{
                        background: H.gold,
                        color: "#fff",
                        opacity: isBuying ? 0.7 : 1,
                      }}
                    >
                      {isBuying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          {airpodsSelected ? "Bundle jetzt kaufen" : "Jetzt kaufen"}
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-center text-[11px]" style={{ color: H.textMuted }}>
                      Sichere Bezahlung · Kostenloser Versand
                    </p>
                  </div>

                  {/* AirPods Ergänzung */}
                  <div
                    className="mt-5 border-t pt-5 md:mt-8 md:pt-8"
                    style={{ borderColor: H.line }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3 md:gap-4 md:mb-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.gold }}>
                          Ergänze dein Setup
                        </p>
                        <h3 className="mt-1 text-base font-light md:mt-2 md:text-lg">AirPods 4 Case</h3>
                        <p className="hidden mt-1 text-xs leading-relaxed md:block" style={{ color: H.textMuted }}>
                          {airpodsCase.name} · gleicher Carbon-Finish, gleicher goldener Blitz
                        </p>
                      </div>
                      <span className="shrink-0 text-xs" style={{ color: H.textMuted }}>
                        CHF {airpodsCase.price}.–
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAirpodsSelected((selected) => !selected)}
                      aria-pressed={airpodsSelected}
                       className="w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all duration-300 md:gap-4 md:p-3"
                      style={{
                        border: `1px solid ${airpodsSelected ? H.gold : H.line}`,
                        background: airpodsSelected ? "rgba(155,107,63,0.06)" : "transparent",
                      }}
                    >
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md bg-white md:w-24 md:h-24">
                        <img
                          src={airpodsCase.image}
                          alt={`${airpodsCase.name} für AirPods 4`}
                          width={1024}
                          height={1024}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                        />
                        {/* Exakt dieselbe schlanke Blitzform wie auf dem Originalprodukt. */}
                        <GoldBolt airpods />
                      </div>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{airpodsCase.name}</span>
                        <span className="block mt-1 text-xs" style={{ color: H.textMuted }}>
                          {airpodsSelected ? "Zum Bundle hinzugefügt" : "Zum iPhone Case hinzufügen"}
                        </span>
                      </span>
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border flex items-center justify-center"
                        style={{ borderColor: airpodsSelected ? H.gold : H.lineStrong }}
                      >
                        {airpodsSelected && <Check className="h-3 w-3" style={{ color: H.gold }} />}
                      </span>
                    </button>

                    {/* Finish-Wahl für das AirPods Case — unabhängig vom iPhone Case */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.24em] mr-1" style={{ color: H.textMuted }}>
                        Finish
                      </span>
                      {Object.values(AIRPODS_CASES).map((option) => {
                        const isActive = option.id === airpodsCase.id;
                        const label = option.id === "cherry" ? "Cherry Carbon" : "Onyx Carbon";
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setAirpodsColorId(option.id)}
                            aria-pressed={isActive}
                            className="px-3 py-1.5 rounded-full text-[11px] transition-all duration-300"
                            style={{
                              border: `1px solid ${isActive ? H.gold : H.line}`,
                              color: isActive ? H.gold : H.textMuted,
                              background: isActive ? "rgba(155,107,63,0.08)" : "transparent",
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 text-xs" style={{ color: H.textMuted }}>
                      {airpodsSelected
                        ? `✓ Im Bundle · Du sparst CHF ${BUNDLE_DISCOUNT}.–`
                        : `+ CHF ${airpodsCase.price}.– · zusammen CHF ${caseFinish.price + airpodsCase.price}.–`}
                    </div>
                    <button
                      type="button"
                      onClick={handleAirpodsBuy}
                      disabled={isBuyingAirpods}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all active:scale-[0.98] md:mt-4 md:py-3 md:text-xs"
                      style={{
                        borderColor: H.gold,
                        color: H.gold,
                        opacity: isBuyingAirpods ? 0.7 : 1,
                      }}
                    >
                      {isBuyingAirpods ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                      AirPods Case einzeln kaufen · CHF {airpodsCase.price}.–
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Matrix-Tabelle */}
          <section className="border-t" style={{ borderColor: H.line }}>
            <div className="container mx-auto px-6 max-w-5xl py-14 md:py-20">
              <h2 className="font-light tracking-tight mb-8" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
                Die Matrix
              </h2>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="text-left font-normal pb-4 pr-4 align-bottom" style={{ color: H.textMuted }}>
                        <span className="text-[10px] uppercase tracking-[0.28em]">Merkmal</span>
                      </th>
                      {CASE_FINISHES.map((c) => (
                        <th key={c.id} className="pb-4 px-3 align-bottom">
                          <span
                            className="mx-auto mb-2 block w-5 h-5 rounded-full"
                            style={{
                              background: `linear-gradient(145deg, ${c.weave}, ${c.base} 55%, ${c.edge})`,
                              boxShadow: `0 0 0 1px ${H.lineStrong}`,
                            }}
                          />
                          <span className="block text-xs font-medium">{c.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX_ROWS.map((row) => (
                      <tr key={row.label} className="border-t" style={{ borderColor: H.line }}>
                        <td className="py-4 pr-4" style={{ color: H.text }}>
                          {row.label}
                        </td>
                        {CASE_FINISHES.map((c) => {
                          const v = row.values[c.id];
                          return (
                            <td key={c.id} className="py-4 px-3 text-center">
                              {typeof v === "boolean" ? (
                                v ? (
                                  <Check className="w-4 h-4 mx-auto" style={{ color: H.gold }} />
                                ) : (
                                  <Minus className="w-4 h-4 mx-auto" style={{ color: H.line }} />
                                )
                              ) : (
                                <span style={{ color: H.textMuted }}>{v}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="border-t" style={{ borderColor: H.line }}>
                      <td className="py-4 pr-4">Preis</td>
                      {CASE_FINISHES.map((c) => (
                        <td key={c.id} className="py-4 px-3 text-center font-medium">
                          CHF {c.price}.–
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Systempassung */}
          <section className="border-t" style={{ borderColor: H.line }}>
            <div className="container mx-auto px-6 max-w-5xl py-14 md:py-20">
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    name: "RAJ NEXUS",
                    text: "Der Magnetring der MATRIX sitzt 0,2 mm tiefer als die Norm verlangt. Das iPhone rastet auf dem NEXUS in derselben Position ein — mit oder ohne Hülle.",
                    link: "/nexus",
                  },
                  {
                    name: "RAJ APEX",
                    text: "Im Auto zählt Haltekraft. Die MATRIX ist auf den N52-Ring des APEX abgestimmt und bleibt auch auf Kopfsteinpflaster dort, wo sie hingehört.",
                    link: "/apex",
                  },
                ].map((s) => (
                  <Link
                    key={s.name}
                    to={s.link}
                    className="group block p-8 rounded-xl transition-colors duration-300"
                    style={{ border: `1px solid ${H.line}`, background: "#ffffff" }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.gold }}>
                      Systempassung
                    </span>
                    <h3 className="mt-4 font-light" style={{ fontSize: "clamp(24px,2.4vw,32px)" }}>
                      {s.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: H.textMuted }}>
                      {s.text}
                    </p>
                    <span
                      className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
                      style={{ color: H.gold }}
                    >
                      Entdecken <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MatrixPage;

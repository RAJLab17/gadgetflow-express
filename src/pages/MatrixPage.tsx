import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Minus, ArrowUpRight, ShoppingBag, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createShopifyCart, addLineToShopifyCart } from "@/lib/shopify";
import type { CartItem } from "@/lib/shopify";
import { usePendingCheckout, makeOrderReference } from "@/hooks/usePendingCheckout";
import { goToCheckout, openCheckoutTab } from "@/lib/checkout";
import { trackAddToCart, trackViewItem } from "@/lib/ga-ecommerce";

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
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
import airpodsCherry from "@/assets/matrix/airpods-cherry-bolt.webp";
import airpodsOnyx from "@/assets/matrix/airpods-onyx-original-bolt.webp";
import rajBoltOriginal from "@/assets/matrix/raj-bolt-original.png";
import payVisa from "@/assets/payments/visa.svg";
import payMastercard from "@/assets/payments/mastercard.svg";
import payAmex from "@/assets/payments/amex.svg";
import payApplePay from "@/assets/payments/apple-pay.svg";
import payGooglePay from "@/assets/payments/google-pay.svg";
import payTwint from "@/assets/payments/twint.png";
import payKlarna from "@/assets/payments/klarna.svg";

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
  cherry: { id: "cherry", name: "MATRIX AirPods 4 & 5 · Cherry Carbon", image: airpodsCherry, thumb: airpodsCherry, price: 35 },
  onyx: { id: "onyx", name: "MATRIX AirPods 4 & 5 · Onyx Carbon", image: airpodsOnyx, thumb: airpodsOnyx, price: 35 },
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
  { label: "Knöpfe", values: { cherry: "Aluminium, goldeloxiert", onyx: "Aluminium, goldeloxiert" } },
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
      className="matrix-device relative mx-auto w-full max-w-[286px] md:max-w-none transition-[width] duration-500 ease-out"
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

/* ── Mobile: wischbare Galerie (aktuelles Bild zuerst, dann gleiche Hüllenfarbe) ── */
const MobileGallery = ({ device, caseFinish, model }: { device: DeviceFinish; caseFinish: CaseFinish; model: Model }) => {
  const slides = useMemo(() => {
    const prefix = `${model.gen}-${caseFinish.id}-`;
    const main = RENDERS[`${prefix}${device.id}`] ?? Object.entries(RENDERS).find(([k]) => k.startsWith(`${model.gen}-`))?.[1] ?? Object.values(RENDERS)[0];
    const rest = Object.entries(RENDERS)
      .filter(([k, v]) => k.startsWith(prefix) && v !== main)
      .map(([, v]) => v);
    return [main, ...Array.from(new Set(rest))];
  }, [model.gen, caseFinish.id, device.id]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [slides]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {slides.map((src, i) => (
          <div key={src} className="relative w-full shrink-0 snap-center" style={{ aspectRatio: "1 / 1" }}>
            <img
              src={src}
              alt={`RAJ MATRIX ${caseFinish.name} Hülle für ${model.name}${i === 0 ? ` in ${device.name}` : ""}`}
              width={928}
              height={1152}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
              className="absolute inset-0 mx-auto h-full w-full max-w-[286px] md:max-w-[380px] object-contain"
              style={{ filter: "contrast(1.015) saturate(1.015)", left: 0, right: 0 }}
            />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-2 pt-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Bild ${i + 1}`}
              onClick={() => scrollerRef.current?.scrollTo({ left: i * (scrollerRef.current?.clientWidth ?? 0), behavior: "smooth" })}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === active ? 18 : 6, background: i === active ? H.gold : H.line }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Mobile: Lieferzeile, Trust, FAQ, Bewertungen ── */
const getMatrixDeliveryText = () => {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return today <= "2026-10-13"
    ? "Versand ab Mi, 14. Oktober · Lieferung ca. 15.–16. Oktober"
    : "Lieferung in 2–3 Werktagen";
};

type MatrixReview = { id: string; customer_name: string; rating: number; title: string; comment: string; created_at: string };

const MatrixMobileInfo = () => {
  const delivery = getMatrixDeliveryText();
  const [reviews, setReviews] = useState<MatrixReview[]>([]);
  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, customer_name, rating, title, comment, created_at")
      .eq("product_id", "matrix")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setReviews((data as MatrixReview[]) ?? []));
  }, []);
  const faqs: [string, string][] = [
    ["Passt die Hülle zu meinem iPhone?", "Ja, MATRIX gibt es passgenau für iPhone 17 Pro, 17 Pro Max, 18 Pro und 18 Pro Max. Wähle oben dein Modell."],
    ["Hält MagSafe zuverlässig?", "Ja, der eingebaute N52-Magnetring hält dein iPhone sicher auf MagSafe-Ladegeräten, Haltern und im Auto."],
    ["Kann ich kabellos laden?", "Ja, Qi2.2 und MagSafe laden direkt durch die Hülle."],
    ["Wann kommt meine Bestellung?", delivery],
    ["Was, wenn sie mir nicht gefällt?", "Du hast 30 Tage Rückgaberecht. Gratis Versand innerhalb der Schweiz."],
  ];
  return (
    <div className="lg:hidden">
      <p className="mt-2 text-center text-[12px]" style={{ color: H.text }}>🚚 {delivery}</p>
      <p className="mt-1 text-center text-[11px]" style={{ color: H.textMuted }}>
        ↩︎ 30 Tage Rückgabe · 🇨🇭 Swiss Brand · Gratis Versand
      </p>
      <Accordion type="single" collapsible className="mt-3 w-full">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q} style={{ borderColor: H.line }}>
            <AccordionTrigger className="py-3 text-left text-[13px] font-normal hover:no-underline">{q}</AccordionTrigger>
            <AccordionContent className="pb-3 text-[12px] leading-relaxed" style={{ color: H.textMuted }}>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {reviews.length > 0 && (
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.28em] mb-2" style={{ color: H.textMuted }}>Bewertungen</p>
          <div className="space-y-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg p-3" style={{ border: `1px solid ${H.line}` }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium">{r.customer_name}</span>
                  <span className="text-[12px]" style={{ color: H.gold }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.title && <p className="mt-1 text-[12px] font-medium">{r.title}</p>}
                <p className="mt-1 text-[12px] leading-relaxed" style={{ color: H.textMuted }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



/* ── Page ─────────────────────────────────────────────────────────────── */
const MatrixPage = () => {
  useEffect(() => {
    trackViewItem({ item_id: "RAJ-MTX", item_name: "RAJ MATRIX iPhone Case", price: 59 });
  }, []);
  const [modelId, setModelId] = useState<ModelId>("18pro");
  const [deviceId, setDeviceId] = useState("darkcherry");
  const [caseId, setCaseId] = useState("cherry");
  const [airpodsSelected, setAirpodsSelected] = useState(false);
  const [airpodsColorId, setAirpodsColorId] = useState<string | null>(null);
  const [showAirpodsColor, setShowAirpodsColor] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isBuyingAirpods, setIsBuyingAirpods] = useState(false);
  const mainBuyRef = useRef<HTMLButtonElement>(null);
  const [showStickyBuy, setShowStickyBuy] = useState(false);
  const { pending, confirmed, track: trackCheckout, dismiss: dismissOrder, dismissPending } = usePendingCheckout();

  useEffect(() => {
    const button = mainBuyRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      // Stay hidden before the main button is reached; show only after it
      // has left through the top of the viewport, not while it is below it.
      setShowStickyBuy(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const model = MODELS.find((m) => m.id === modelId)!;
  const finishes = useMemo(
    () => DEVICE_FINISHES.filter((f) => f.gens.includes(model.gen)),
    [model.gen]
  );
  const device = finishes.find((f) => f.id === deviceId) ?? finishes[0];
  const caseFinish = CASE_FINISHES.find((c) => c.id === caseId)!;
  const airpodsCase = AIRPODS_CASES[airpodsColorId ?? caseFinish.id];
  const bundleTotal = caseFinish.price + airpodsCase.price - BUNDLE_DISCOUNT;
  const caseThumbSrc =
    RENDERS[`${model.gen}-${caseFinish.id}-${device.id}`] ??
    Object.entries(RENDERS).find(([key]) => key.startsWith(`${model.gen}-${caseFinish.id}-`))?.[1] ??
    Object.values(RENDERS)[0];

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

      trackAddToCart([
        { item_id: caseVariantId, item_name: "RAJ MATRIX Case", item_variant: `${model.name} / ${caseFinish.name}`, price: caseFinish.price },
        ...(airpodsSelected && AIRPODS_VARIANT_IDS[airpodsCase.id]
          ? [{ item_id: AIRPODS_VARIANT_IDS[airpodsCase.id], item_name: "RAJ MATRIX AirPods 4 & 5 Case", item_variant: airpodsCase.name, price: airpodsCase.price - BUNDLE_DISCOUNT }]
          : []),
      ]);

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

      trackAddToCart([{ item_id: variantId, item_name: "RAJ MATRIX AirPods 4 & 5 Case", item_variant: airpodsCase.name, price: airpodsCase.price }]);
      const reference = makeOrderReference();
      const product = {
        node: {
          id: "gid://shopify/Product/16139790549317",
          title: "RAJ MATRIX AirPods 4 & 5 Case",
          description: "Aramid-Carbon Case für AirPods 4 und AirPods 5.",
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

      <div style={{ background: H.bg, color: H.text }} className="matrix-page min-h-screen">
        <Header topSlot={<NexusTrustBar />} />

        <main className="pt-24 md:pt-28">
          {/* Hero + Konfigurator */}
          <section>
            <div className="container mx-auto px-4 md:px-6 max-w-5xl pt-2 md:pt-8 pb-5 md:pb-16">
              <div className="grid md:grid-cols-12 gap-3 md:gap-14 items-start">
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
                    <div className="relative hidden lg:flex items-center justify-center px-1 pt-0 pb-0 md:px-10 md:pt-14 md:pb-8">
                      <DeviceMock device={device} caseFinish={caseFinish} model={model} />
                    </div>
                    <div className="relative lg:hidden px-1 md:px-10 md:pt-14 md:pb-8">
                      <MobileGallery device={device} caseFinish={caseFinish} model={model} />
                    </div>
                    {/* Plakette */}
                    <div
                      className="relative border-t px-4 py-1.5 md:px-10 md:py-5 hidden md:flex items-center justify-between gap-3 md:gap-4"
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
                <div className="matrix-options md:col-span-6 flex flex-col gap-2 md:block md:space-y-3 md:gap-0">

                  {/* Intro */}
                  <div className="order-1 mb-0.5 md:mb-0.5">
                    <div className="flex items-baseline justify-between gap-4 md:block">
                    <h1
                      className="font-light leading-[0.95] text-[19px] md:text-[clamp(30px,3vw,42px)]"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      <span style={{ color: H.gold }}>MATRIX</span>{" "}
                      <span

                        className="mt-1 hidden text-sm italic md:block"
                        style={{ color: H.gold, fontWeight: 400, letterSpacing: "normal", lineHeight: 1.43 }}
                      >
                        <span className="block">Das Carbon-System mit MagSafe</span>
                        <span className="block">für iPhone 17 &amp; 18 Pro / Pro Max</span>
                      </span>
                      <span
                        className="mt-1 block text-xs leading-4 text-foreground md:hidden"
                        style={{ fontWeight: 400, letterSpacing: "normal" }}
                      >
                        <span className="block">Das Carbon-System mit MagSafe</span>
                        <span className="block">für iPhone 17 &amp; 18 Pro / Pro Max</span>
                      </span>
                    </h1>
                    <span className="text-xl font-light text-foreground whitespace-nowrap md:hidden">CHF {caseFinish.price}.–</span>
                    </div>
                  </div>


                  {/* Modell */}
                  <div className="order-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] mb-1 md:mb-3" style={{ color: H.textMuted }}>
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
                            className="text-left px-2.5 py-2 rounded-lg transition-all duration-300 md:px-4 md:py-2.5"
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

                  {/* Gerätefarbe — nur Bildvorschau */}
                  <div className="order-5 matrix-preview">
                    <div className="flex items-baseline justify-between mb-1 md:mb-3">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        <span className="hidden md:inline">Gerätefarbe</span>
                        <span className="md:hidden normal-case tracking-normal">Vorschau mit deiner iPhone-Farbe</span>
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
                  <div className="order-4">
                    <div className="flex items-baseline justify-between mb-1 md:mb-3">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        <span className="hidden md:inline">Finish</span>
                        <span className="md:hidden normal-case tracking-normal">Farbe der Hülle</span>
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
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-300 md:gap-4 md:px-4 md:py-2.5"
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
                  <div className="order-6 pt-1 border-t md:pt-3" style={{ borderColor: H.line }}>
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

                    <div role="radiogroup" aria-label="Paket wählen" className="mb-3 flex flex-col gap-2">
                      {[
                        { bundle: false, label: "Nur die Hülle" },
                        { bundle: true, label: "Hülle + AirPods Case" },
                      ].map((opt) => {
                        const active = airpodsSelected === opt.bundle;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setAirpodsSelected(opt.bundle);
                              if (!opt.bundle) setShowAirpodsColor(false);
                            }}
                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-300"
                            style={{
                              border: `1px solid ${active ? H.gold : H.line}`,
                              background: active ? "rgba(155,107,63,0.06)" : "transparent",
                            }}
                          >
                            <span
                              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg"
                              style={{ background: "#f1ede8", border: `1px solid ${H.line}` }}
                            >
                              <img
                                src={opt.bundle ? airpodsCase.thumb : caseThumbSrc}
                                alt=""
                                aria-hidden
                                className="absolute inset-0 h-full w-full object-contain"
                              />
                            </span>
                            <span
                              className="h-4 w-4 shrink-0 rounded-full border flex items-center justify-center"
                              style={{ borderColor: active ? H.gold : H.lineStrong }}
                            >
                              {active && <span className="h-2 w-2 rounded-full" style={{ background: H.gold }} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">{opt.label}</span>
                              {opt.bundle && (
                                <span className="block mt-0.5 text-[11px]" style={{ color: H.textMuted }}>
                                  AirPods 4 &amp; 5 · {airpodsCase.id === "cherry" ? "Cherry Carbon" : "Onyx Carbon"}
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 flex flex-col items-end gap-0.5">
                              <span className="text-sm font-semibold">
                                CHF {opt.bundle ? bundleTotal : caseFinish.price}.–
                              </span>
                              {opt.bundle && (
                                <span className="text-[11px] line-through" style={{ color: H.textMuted }}>
                                  CHF {caseFinish.price + airpodsCase.price}.–
                                </span>
                              )}
                              {opt.bundle && (
                                <span
                                  className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em]"
                                  style={{ background: H.gold, color: "#fff" }}
                                >
                                  Spare CHF {BUNDLE_DISCOUNT}
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                      {airpodsSelected && (
                        <div className="px-1">
                          <button
                            type="button"
                            onClick={() => setShowAirpodsColor((v) => !v)}
                            aria-expanded={showAirpodsColor}
                            className="text-[11px] underline underline-offset-2"
                            style={{ color: H.textMuted }}
                          >
                            Andere Farbe für AirPods
                          </button>
                          {showAirpodsColor && (
                            <div className="mt-2 flex items-center gap-2">
                              {Object.values(AIRPODS_CASES).map((option) => {
                                const isActive = option.id === airpodsCase.id;
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
                                    {option.id === "cherry" ? "Cherry Carbon" : "Onyx Carbon"}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      ref={mainBuyRef}
                      type="button"
                      onClick={handleBuy}
                      disabled={isBuying}
                      className="matrix-main-buy h-11 md:h-auto w-full inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-[0.12em] transition-all active:scale-[0.98] md:py-3 md:text-sm md:tracking-[0.15em]"
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
                          <span>JETZT KAUFEN · CHF {airpodsSelected ? bundleTotal : caseFinish.price}.–</span>
                        </>
                      )}
                    </Button>
                    <p className="hidden lg:block mt-1 md:mt-2 text-center text-[11px]" style={{ color: H.textMuted }}>
                      Sichere Bezahlung · 30 Tage Rückgabe
                    </p>
                    <MatrixMobileInfo />
                  </div>

                  <div className="order-7 mt-3 md:mt-6">
                    {/* Zahlungsmethoden */}
                    <div
                      className="mt-5 rounded-xl flex items-center gap-3 md:gap-4 flex-wrap justify-center"
                      style={{
                        background: "#0a0908",
                        border: "1px solid rgba(155,107,63,.20)",
                        padding: "10px 14px",
                      }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] w-full text-center md:w-auto md:text-left" style={{ color: H.gold }}>
                        Sichere Zahlungsmethoden
                      </p>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {[payVisa, payMastercard, payAmex, payApplePay, payGooglePay, payTwint, payKlarna].map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style={{
                              height: 22,
                              width: "auto",
                              objectFit: "contain",
                              background: "white",
                              borderRadius: 4,
                              padding: "2px 5px",
                              border: "1px solid rgba(255,255,255,.12)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
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
              {/* Mobile: kompakte Tabelle, passt auf 390 px */}
              <table className="w-full border-collapse text-[12px] lg:hidden">
                <thead>
                  <tr>
                    <th className="text-left font-normal pb-3 pr-2 align-bottom" style={{ color: H.textMuted }}>
                      <span className="text-[9px] uppercase tracking-[0.2em]">Merkmal</span>
                    </th>
                    {CASE_FINISHES.map((c) => (
                      <th key={c.id} className="pb-3 px-1 align-bottom w-[26%]">
                        <span
                          className="mx-auto mb-1.5 block w-4 h-4 rounded-full"
                          style={{ background: `linear-gradient(145deg, ${c.weave}, ${c.base} 55%, ${c.edge})`, boxShadow: `0 0 0 1px ${H.lineStrong}` }}
                        />
                        <span className="block text-[11px] font-medium leading-tight">{c.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_ROWS.map((row) => (
                    <tr key={row.label} className="border-t" style={{ borderColor: H.line }}>
                      <td className="py-3 pr-2 leading-snug" style={{ color: H.text }}>{row.label}</td>
                      {CASE_FINISHES.map((c) => {
                        const v = row.values[c.id];
                        return (
                          <td key={c.id} className="py-3 px-1 text-center leading-snug">
                            {typeof v === "boolean" ? (
                              v ? <Check className="w-4 h-4 mx-auto" style={{ color: H.gold }} /> : <Minus className="w-4 h-4 mx-auto" style={{ color: H.line }} />
                            ) : (
                              <span className="text-[11px]" style={{ color: H.textMuted }}>{v}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="border-t" style={{ borderColor: H.line }}>
                    <td className="py-3 pr-2">Preis</td>
                    {CASE_FINISHES.map((c) => (
                      <td key={c.id} className="py-3 px-1 text-center font-medium">CHF {c.price}.–</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="hidden lg:block overflow-x-auto -mx-6 px-6">
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
                    text: "Der Magnetring der MATRIX ist auf den NEXUS abgestimmt. Das iPhone rastet in derselben Position ein, mit oder ohne Hülle.",
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
          <div
            aria-hidden={!showStickyBuy}
            className={`matrix-mobile-buybar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 text-foreground backdrop-blur-xl md:hidden transition-[transform,visibility] duration-200 motion-reduce:transition-none ${showStickyBuy ? "translate-y-0 visible" : "translate-y-full invisible pointer-events-none"}`}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-medium">{model.name}</p>
                <p className="text-[11px] text-muted-foreground">{caseFinish.name}</p>
                <p className="mt-1 text-sm font-semibold">CHF {airpodsSelected ? bundleTotal : caseFinish.price}.–</p>
              </div>
              <Button onClick={handleBuy} disabled={isBuying} className="h-11 shrink-0 rounded-lg px-5">
                {isBuying ? <Loader2 className="animate-spin" /> : <ShoppingBag />}
                Kaufen
              </Button>
            </div>
          </div>
      </div>
    </>
  );
};

export default MatrixPage;

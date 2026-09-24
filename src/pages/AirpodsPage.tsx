import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Loader2, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NexusTrustBar from "@/components/nexus/NexusTrustBar";
import { Button } from "@/components/ui/button";
import { createShopifyCart } from "@/lib/shopify";
import type { CartItem } from "@/lib/shopify";
import { goToCheckout, openCheckoutTab } from "@/lib/checkout";
import { makeOrderReference, usePendingCheckout } from "@/hooks/usePendingCheckout";

import airpodsCherry from "@/assets/matrix/airpods-cherry.png";
import airpodsOnyx from "@/assets/matrix/airpods-onyx.png";
import matrixCaseCherry from "@/assets/matrix/optimized-renders/18-cherry-cherry-darkcherry.webp.asset.json";
import matrixCaseOnyx from "@/assets/matrix/optimized-renders/18-onyx-onyx-darkgrey.webp.asset.json";
import payVisa from "@/assets/payments/visa.svg";
import payMastercard from "@/assets/payments/mastercard.svg";
import payAmex from "@/assets/payments/amex.svg";
import payApplePay from "@/assets/payments/apple-pay.svg";
import payGooglePay from "@/assets/payments/google-pay.svg";
import payTwint from "@/assets/payments/twint.png";
import payKlarna from "@/assets/payments/klarna.svg";

const H = {
  bg: "#faf9f7",
  gold: "#9b6b3f",
  cherry: "#7b4b60",
  line: "rgba(43,39,37,0.10)",
  lineStrong: "rgba(43,39,37,0.22)",
  text: "#2b2725",
  textMuted: "rgba(43,39,37,0.55)",
};

type FinishId = "cherry" | "onyx";

interface Finish {
  id: FinishId;
  name: string;
  image: string;
  base: string;
  weave: string;
  edge: string;
  price: number;
  variantId: string;
  sku: string;
}

const FINISHES: Finish[] = [
  {
    id: "cherry",
    name: "Cherry Carbon",
    image: airpodsCherry,
    matrixImage: matrixCaseCherry.url,
    base: "#7b4b60",
    weave: "#a66f83",
    edge: "#4f2b3a",
    price: 35,
    variantId: "gid://shopify/ProductVariant/59116737364293",
    sku: "RAJ-MTX-AP4-CHY",
  },
  {
    id: "onyx",
    name: "Onyx Carbon",
    image: airpodsOnyx,
    matrixImage: matrixCaseOnyx.url,
    base: "#16171a",
    weave: "#33363c",
    edge: "#08090a",
    price: 35,
    variantId: "gid://shopify/ProductVariant/59116737397061",
    sku: "RAJ-MTX-AP4-ONX",
  },
];

const paymentMethods = [payVisa, payMastercard, payAmex, payApplePay, payGooglePay, payTwint, payKlarna];

const AirpodsPage = () => {
  const [finishId, setFinishId] = useState<FinishId>("cherry");
  const [matrixFinishId, setMatrixFinishId] = useState<FinishId>("cherry");
  const [isBuying, setIsBuying] = useState(false);
  const { pending, confirmed, track: trackCheckout, dismiss: dismissOrder, dismissPending } = usePendingCheckout();

  const finish = FINISHES.find((item) => item.id === finishId) ?? FINISHES[0];
  const matrixFinish = FINISHES.find((item) => item.id === matrixFinishId) ?? FINISHES[0];

  const handleBuy = useCallback(async () => {
    if (!finish || isBuying) return;
    setIsBuying(true);
    const checkoutTab = openCheckoutTab();
    const fail = (message: string) => {
      checkoutTab?.close();
      toast.error("Kauf konnte nicht gestartet werden", { description: message });
    };

    try {
      const reference = makeOrderReference();
      const product = {
        node: {
          id: "gid://shopify/Product/16139790549317",
          title: "RAJ MATRIX AirPods 4 & 5 Case",
          description: "Carbon Case für AirPods 4 und AirPods 5.",
          handle: "raj-matrix-airpods-4-case",
          priceRange: { minVariantPrice: { amount: String(finish.price), currencyCode: "CHF" } },
          images: { edges: [{ node: { url: finish.image, altText: `${finish.name} AirPods Case` } }] },
          variants: { edges: [] },
          options: [{ name: "Finish", values: FINISHES.map((item) => item.name) }],
        },
      };
      const item: CartItem = {
        lineId: null,
        product,
        variantId: finish.variantId,
        variantTitle: finish.name,
        price: { amount: String(finish.price), currencyCode: "CHF" },
        quantity: 1,
        selectedOptions: [{ name: "Finish", value: finish.name }],
      };
      const cart = await createShopifyCart(item, undefined, [
        { key: "RAJ Referenz", value: reference },
        { key: "Quelle", value: "raj.ch/airpods-case" },
      ]);
      if (!cart) {
        fail("Der Warenkorb konnte nicht erstellt werden. Bitte versuche es erneut.");
        return;
      }

      trackCheckout({
        cartId: cart.cartId,
        reference,
        summary: `MATRIX AirPods 4 & 5 Case · ${finish.name}`,
        total: `CHF ${finish.price}.–`,
        startedAt: Date.now(),
      });
      goToCheckout(checkoutTab, cart.checkoutUrl);
    } catch (error) {
      console.error("AirPods Case purchase failed:", error);
      fail("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsBuying(false);
    }
  }, [finish, isBuying, trackCheckout]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "MATRIX AirPods 4 & 5 Case",
    brand: { "@type": "Brand", name: "RAJ" },
    description: "Carbon Case für AirPods 4 und AirPods 5 in Cherry Carbon oder Onyx Carbon mit goldenem RAJ Blitz.",
    sku: finish?.sku,
    url: "https://raj.ch/airpods-case",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CHF",
      lowPrice: 35,
      highPrice: 35,
      offerCount: FINISHES.length,
      availability: "https://schema.org/InStock",
    },
  };

  if (!finish || !matrixFinish) return null;

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
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={{ background: H.bg, color: H.text }} className="min-h-screen">
        <Header topSlot={<NexusTrustBar />} />

        <main className="pt-24 md:pt-28">
          <section>
            <div className="container mx-auto max-w-5xl px-4 pb-10 pt-2 md:px-6 md:pb-16 md:pt-8">
              <div className="grid items-start gap-5 md:grid-cols-12 md:gap-14">
                <div className="md:sticky md:top-28 md:col-span-6">
                  <div
                    className="relative overflow-hidden rounded-md border md:rounded-lg"
                    style={{
                      borderColor: H.line,
                      background:
                        finish.id === "cherry"
                          ? "linear-gradient(155deg, #faf3eb 0%, #efe9e3 50%, #e4ddd7 100%)"
                          : "linear-gradient(155deg, #f9f2ea 0%, #efe8e2 50%, #e3ddd6 100%)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.95) inset, 0 28px 70px -36px rgba(43,39,37,0.34)",
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${H.gold}, transparent)`, opacity: 0.5 }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{ boxShadow: "inset 0 0 140px 20px rgba(43,39,37,0.12)" }}
                    />
                    <div className="relative aspect-[4/3]">
                      <img
                        src={finish.image}
                        alt={`MATRIX AirPods 4 & 5 Case in ${finish.name}`}
                        width={768}
                        height={576}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div
                      className="relative flex items-center justify-between gap-3 border-t px-4 py-2.5 md:gap-4 md:px-10 md:py-5"
                      style={{ borderColor: H.line, background: "rgba(255,255,255,0.55)" }}
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: H.gold }}>
                          {finish.name}
                        </p>
                        <p className="mt-1 text-xs font-light md:mt-1.5 md:text-sm">AirPods 4 &amp; 5 · Carbon Case</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-6 md:space-y-3">
                  <div className="mb-0.5">
                    <h1
                      className="bg-clip-text text-[32px] font-light leading-[0.95] text-transparent md:text-[clamp(30px,3vw,42px)]"
                      style={{ backgroundImage: `linear-gradient(100deg, ${H.text} 15%, ${H.gold} 88%)` }}
                    >
                      MATRIX AirPods Case
                    </h1>
                    <p className="mt-1 text-sm italic" style={{ color: H.gold }}>
                      Schutz als Teil des Systems.
                    </p>
                    <p className="mt-1 hidden max-w-md text-xs leading-relaxed md:block" style={{ color: H.textMuted }}>
                      Gleiches Carbon-Finish, gleicher goldener Blitz — passend zum MATRIX iPhone Case.
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.28em] md:mb-3" style={{ color: H.textMuted }}>
                      Kompatibel
                    </p>
                    <div
                      className="rounded-lg border px-4 py-3 text-sm font-medium"
                      style={{ borderColor: H.gold, background: "rgba(155,107,63,0.06)" }}
                    >
                      AirPods 4 &amp; 5
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-baseline justify-between md:mb-3">
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.textMuted }}>
                        Finish
                      </p>
                      <p className="hidden text-xs md:block">Carbon · goldener Karabiner</p>
                    </div>
                    <div className="space-y-2">
                      {FINISHES.map((item) => {
                        const active = item.id === finish.id;
                        return (
                          <Button
                            key={item.id}
                            type="button"
                            variant="outline"
                            onClick={() => setFinishId(item.id)}
                            aria-pressed={active}
                            className="h-auto w-full justify-start gap-4 rounded-lg px-4 py-3"
                            style={{
                              borderColor: active ? H.gold : H.line,
                              background: active ? "rgba(155,107,63,0.06)" : "transparent",
                            }}
                          >
                            <span
                              className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full"
                              style={{
                                background: `linear-gradient(145deg, ${item.weave}, ${item.base} 55%, ${item.edge})`,
                                boxShadow: `0 0 0 1px ${H.lineStrong}`,
                              }}
                            >
                              <span
                                aria-hidden
                                className="absolute inset-0 opacity-35"
                                style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 2px, rgba(255,255,255,.35) 2px 3px, rgba(0,0,0,.18) 3px 4px)" }}
                              />
                            </span>
                            <span className="min-w-0 flex-1 text-left text-sm">{item.name}</span>
                            <span className="text-xs font-normal" style={{ color: H.textMuted }}>CHF {item.price}.–</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-3" style={{ borderColor: H.line }}>
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

                    <p className="mb-2.5 text-[clamp(22px,2vw,28px)] font-light">CHF 35.–</p>
                    <Button
                      type="button"
                      onClick={handleBuy}
                      disabled={isBuying}
                      className="w-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground active:scale-[0.98]"
                    >
                      {isBuying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                      Jetzt kaufen
                    </Button>
                    <p className="mt-2 text-center text-[11px]" style={{ color: H.textMuted }}>Sichere Bezahlung · Kostenloser Versand</p>
                  </div>

                  <div className="mt-5 border-t pt-5 md:mt-8 md:pt-8" style={{ borderColor: H.line }}>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: H.gold }}>Ergänze dein Setup</p>
                        <h2 className="mt-1 text-base font-light md:mt-2 md:text-lg">MATRIX iPhone Case</h2>
                        <p className="mt-1 text-xs" style={{ color: H.textMuted }}>MagSafe-kompatibel · CHF 59.–</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {FINISHES.map((item) => {
                        const active = matrixFinish.id === item.id;
                        return (
                          <Button
                            key={item.id}
                            type="button"
                            variant="outline"
                            onClick={() => setMatrixFinishId(item.id)}
                            aria-pressed={active}
                            className="h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5"
                            style={{ borderColor: active ? H.gold : H.line, background: active ? "rgba(155,107,63,0.06)" : "transparent" }}
                          >
                            <span className="h-5 w-5 rounded-full" style={{ background: `linear-gradient(145deg, ${item.weave}, ${item.base} 55%, ${item.edge})`, boxShadow: `0 0 0 1px ${H.lineStrong}` }} />
                            <span className="flex-1 text-left text-xs">{item.name}</span>
                            <span className="text-xs font-normal" style={{ color: H.textMuted }}>CHF 59.–</span>
                          </Button>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs" style={{ color: H.textMuted }}>
                      Zusammen im Bundle — <span className="font-semibold" style={{ color: H.gold }}>CHF 15.– sparen</span>
                    </p>
                    <Button asChild variant="outline" className="mt-3 w-full border-primary text-xs uppercase tracking-[0.12em] text-primary md:mt-4">
                      <Link to="/matrix">MATRIX iPhone Case ansehen</Link>
                    </Button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-xl border bg-foreground px-3.5 py-2.5 md:gap-4" style={{ borderColor: "rgba(155,107,63,.20)" }}>
                    <p className="w-full text-center text-[10px] uppercase tracking-[0.22em] text-primary md:w-auto md:text-left">Sichere Zahlungsmethoden</p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {paymentMethods.map((src, index) => (
                        <img key={src} src={src} alt={index === 0 ? "Akzeptierte Zahlungsmethoden" : ""} loading="lazy" decoding="async" className="h-[22px] w-auto rounded bg-background object-contain px-[5px] py-0.5" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AirpodsPage;
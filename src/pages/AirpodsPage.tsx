import {useCallback,useEffect,useRef,useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Layers,Link as LinkIcon,Zap,Check,Loader2,X,LockKeyhole,Truck,RotateCcw,MapPin,PencilRuler} from 'lucide-react';
import {toast} from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NexusTrustBar from '@/components/nexus/NexusTrustBar';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {useProductReviews} from '@/hooks/useProductReviews';
import {reviewSchema} from '@/lib/reviewProducts';
import {shareImages,shareImageTags} from '@/lib/shareImages';
import {createShopifyCart,addLineToShopifyCart,type CartItem} from '@/lib/shopify';
import {goToCheckout,openCheckoutTab} from '@/lib/checkout';
import {trackAddToCart,trackBeginCheckout,trackViewItem} from '@/lib/ga-ecommerce';
import {makeOrderReference,usePendingCheckout} from '@/hooks/usePendingCheckout';
import {BUNDLE_DISCOUNT,BUNDLE_DISCOUNT_CODE,CASE_VARIANT_IDS} from '@/components/matrix/matrixCommerce';
import {bundlePhoneThumb} from '@/components/matrix/BundleOfferImage';
import MobileProductBuyBar from '@/components/product/MobileProductBuyBar';
import MobileSelectionPreview from '@/components/product/MobileSelectionPreview';
import AirpodsGallery from '@/components/airpods/AirpodsGallery';
import AirpodsEditorial from '@/components/airpods/AirpodsEditorial';
import {FINISHES,MODELS,AIRPODS_PRICE,IPHONE_CASE_PRICE,BUNDLE_TOTAL,AIRPODS_SCHEMA_LIFESTYLE,AIRPODS_FAQ,airpodsNeedsModel,type FinishId,type ModelId} from '@/components/airpods/airpodsContent';
import '@/components/airpods/airpods-page.css';
const PREVIEW_IMAGES = FINISHES.map(f => f.slides[0].thumb);
const AirpodsPage=()=>{
  const [previewRevision,setPreviewRevision]=useState(0);
  const previewChange=()=>setPreviewRevision(value=>value+1);
  const { reviews: productReviews } = useProductReviews("airpods-case");
  useEffect(() => {
    trackViewItem({ item_id: "RAJ-MTX-AP4", item_name: "RAJ MATRIX AirPods 4 & 5 Case", price: 35 });
  }, []);
  const [finishId, setFinishId] = useState<FinishId>("cherry");
  const [bundleSelected, setBundleSelected] = useState(false);
  const [modelId, setModelId] = useState<ModelId | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [modelError,setModelError]=useState(false);
  const modelPickerRef=useRef<HTMLDivElement>(null);
  const mainBuyRef = useRef<HTMLButtonElement>(null);
  const { pending, confirmed, track: trackCheckout, dismiss: dismissOrder, dismissPending } = usePendingCheckout();

  const finish = FINISHES.find((item) => item.id === finishId) ?? FINISHES[0];
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[2];
  const currentTotal = bundleSelected ? BUNDLE_TOTAL : finish.price;

  const handleBuy = useCallback(async () => {
    if (isBuying) return;
    if(airpodsNeedsModel(bundleSelected,modelId)){setModelError(true);modelPickerRef.current?.scrollIntoView({behavior:"smooth",block:"center"});return;}
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
          description: "Hülle im Carbon-Design für AirPods 4 und AirPods 5.",
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
  }, [finish, isBuying, trackCheckout, bundleSelected, model, modelId]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RAJ MATRIX Hülle im Carbon-Design für AirPods 4 & 5",
    brand: { "@type": "Brand", name: "RAJ" },
    description: "Hülle im Carbon-Design für AirPods 4 und AirPods 5 in Cherry Carbon oder Onyx Carbon mit goldenem RAJ Blitz.",
    sku: finish?.sku,
    image: [
      "https://raj.ch/__l5e/assets-v1/b8f774f2-944d-45b9-b88a-e8f79c2a6af0/raj-airpods-share.jpg",
      "https://raj.ch/__l5e/assets-v1/70f4701b-7082-4733-bd95-32c87cda3cf3/airpods-cherry-bolt.webp",
      "https://raj.ch/__l5e/assets-v1/85b897bc-20a7-43f1-b648-9423827acb9b/airpods-onyx-original-bolt.webp",
      ...AIRPODS_SCHEMA_LIFESTYLE,
    ],
    url: "https://raj.ch/airpods-case",
    ...reviewSchema("airpods-case", productReviews),
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
        description: "Gratis Versand, 2 bis 3 Tage",
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

return <><Helmet><title>MATRIX AirPods 4 &amp; 5 Case – Carbon-Design | RAJ</title><meta name="description" content="MATRIX Hülle im Carbon-Design für AirPods 4 & 5. Cherry Carbon oder Onyx Carbon mit goldenem Blitz. Kostenloser Versand in der Schweiz."/><link rel="canonical" href="https://raj.ch/airpods-case"/><meta property="og:title" content="MATRIX AirPods 4 & 5 Case – Carbon-Design | RAJ"/><meta property="og:description" content="Hülle im Carbon-Design für AirPods 4 & 5 in Cherry Carbon oder Onyx Carbon mit goldenem RAJ Blitz."/><meta property="og:type" content="product"/><meta property="og:url" content="https://raj.ch/airpods-case"/><meta name="twitter:title" content="MATRIX AirPods 4 & 5 Case – Carbon-Design | RAJ"/><meta name="twitter:description" content="Hülle im Carbon-Design für AirPods 4 & 5 in Cherry Carbon oder Onyx Carbon mit goldenem RAJ Blitz."/>{shareImageTags(shareImages.airpods)}<script type="application/ld+json">{JSON.stringify(jsonLd)}</script><script type="application/ld+json">{JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:AIRPODS_FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))})}</script></Helmet><div className="ap-page"><Header topSlot={<NexusTrustBar/>}/><main><section className="ap-purchase"><AirpodsGallery finish={finish}/><div className="ap-options"><div><div className="ap-heading"><h1>MATRIX AirPods Case</h1><span className="ap-price">CHF {currentTotal}.–{bundleSelected&&<del>statt CHF 94.–</del>}</span></div><p className="ap-subtitle">Hülle im Carbon-Design für AirPods 4 und 5</p></div><ul className="ap-points">{[{Icon:Layers,text:'Gleiches Carbon-Design wie die MATRIX iPhone Hülle'},{Icon:LinkIcon,text:'Goldener Karabiner aus eloxiertem Aluminium, abnehmbar'},{Icon:Zap,text:'Kabellos laden durch die Hülle*'}].map(({Icon,text})=><li key={text}><Icon strokeWidth={1.5}/><span>{text}</span></li>)}</ul><div className="ap-fit"><Check size={16} strokeWidth={1.5}/><p>Passt auf AirPods 4, AirPods 4 mit ANC und AirPods 5. Nicht für AirPods Pro.</p></div><div><p className="ap-color-label">Farbe · {finish.name}</p><div className="ap-swatches">{FINISHES.map(f=><Button key={f.id} variant="ghost" className="ap-swatch" aria-label={f.name} aria-pressed={finishId===f.id} onClick={()=>{if(finishId!==f.id)previewChange();setFinishId(f.id);}}><span className={`ap-swatch-${f.id}`}/></Button>)}</div></div><div className="ap-addon"><label className="ap-addon-row"><Checkbox aria-label="Passende MATRIX iPhone Hülle dazu" checked={bundleSelected} onCheckedChange={v=>{setBundleSelected(v===true);setModelError(false);}}/><img src={bundlePhoneThumb(modelId??'17pro',finish.id)} alt={`MATRIX iPhone Hülle in ${finish.name}`} width={36} height={48} loading="lazy"/><span className="ap-addon-text"><strong>Passende MATRIX iPhone Hülle dazu</strong><small>{finish.name} · als Set</small></span><span className="ap-addon-price">+ CHF 44.–<del>59.–</del></span></label>{bundleSelected&&<div ref={modelPickerRef} className={`ap-models ${modelError?'is-invalid':''}`}><p className="ap-model-label">Welches iPhone hast du?</p><div className="ap-model-grid">{MODELS.map(m=><Button key={m.id} variant="outline" className="ap-model-button" aria-pressed={modelId===m.id} onClick={()=>{if(modelId!==m.id)previewChange();setModelId(m.id);setModelError(false);}}>{m.name}</Button>)}</div>{modelError&&<p role="alert" className="ap-model-error">Bitte wähle dein iPhone-Modell für die Hülle</p>}</div>}</div>{confirmed&&<div className="ap-notice"><Button variant="ghost" size="icon" aria-label="Bestätigung schliessen" onClick={dismissOrder}><X size={16}/></Button><p>Bestellung eingegangen</p><p>{confirmed.summary} · {confirmed.total}</p></div>}{pending&&!confirmed&&<div className="ap-notice"><Button variant="ghost" size="icon" aria-label="Hinweis schliessen" onClick={dismissPending}><X size={16}/></Button><p>Checkout läuft</p></div>}<Button ref={mainBuyRef} className="ap-buy" onClick={handleBuy} disabled={isBuying}>{isBuying?<Loader2 className="animate-spin" size={18}/>: `Jetzt kaufen · CHF ${currentTotal}.–`}</Button><div className="ap-payment"><span><LockKeyhole size={12}/> Sichere Zahlung</span>{['TWINT','Klarna','Apple Pay','Visa','Mastercard'].map(p=><b key={p}>{p}</b>)}</div><div className="ap-trust">{[{Icon:Truck,text:'Gratis Versand, 2 bis 3 Tage'},{Icon:RotateCcw,text:'30 Tage gratis Rückgabe'},{Icon:MapPin,text:'Support aus der Schweiz'},{Icon:PencilRuler,text:'Gestaltet in der Schweiz'}].map(({Icon,text})=><div key={text}><Icon strokeWidth={1.5}/><span>{text}</span></div>)}</div><p className="ap-wireless">* wenn dein Ladecase kabelloses Laden unterstützt: AirPods 4 mit ANC und AirPods 5.</p></div></section><AirpodsEditorial/></main><Footer/><MobileSelectionPreview gallerySelector=".ap-gallery-frame" revision={previewRevision} image={finish.slides[0].thumb} label={finish.name} announcement={`AirPods Case in ${finish.name}${bundleSelected&&modelId ? ` · Set mit ${model.name}` : ""}`} preloadImages={PREVIEW_IMAGES}/><MobileProductBuyBar mainBuyRef={mainBuyRef} name={`MATRIX AIRPODS · ${finish.name}${bundleSelected?' + Hülle':''}`} image={finish.slides[0].thumb} imageAlt={`MATRIX AirPods Case · ${finish.name}`} price={currentTotal} busy={isBuying}/></div></>;
};export default AirpodsPage;

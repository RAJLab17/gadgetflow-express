import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, FoldVertical, ShieldCheck, Package, LockKeyhole, Truck, RotateCcw, MapPin, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useQuickBuy } from '@/hooks/useQuickBuy';
import { useViewContent } from '@/hooks/useViewContent';
import { useProductReviews } from '@/hooks/useProductReviews';
import { PRODUCT_NEXUS_JSON_LD, breadcrumbJsonLd } from '@/lib/schemas';
import { reviewSchema } from '@/lib/reviewProducts';
import { shareImageTags } from '@/lib/shareImages';
import { releaseReviews } from '@/lib/reviewLoadGate';
import StarRating from '@/components/reviews/StarRating';
import MobileProductBuyBar from '@/components/product/MobileProductBuyBar';
import NexusTrustBar from '@/components/nexus/NexusTrustBar';
import NexusGallery from '@/components/nexus/NexusGallery';
import NexusEditorial from '@/components/nexus/NexusEditorial';
import { NEXUS_PRICE, NEXUS_PACKAGE, NEXUS_FAQ, NEXUS_GALLERY } from '@/components/nexus/nexusContent';
import { nexusReviewData } from '@/components/nexus/nexusReviewData';
import logo from '@/assets/logo-transparent.webp';
import '@/components/nexus/nexus-page.css';
const NexusPage = () => {
 const { quickBuy: quickBuyRaw, isProcessing: buyProcessing } = useQuickBuy();
 const mainBuyRef = useRef<HTMLButtonElement>(null);
 useEffect(()=>releaseReviews(),[]);
 const {reviews}=useProductReviews('nexus');
 const {rated,average,marcel}=nexusReviewData(reviews);
  const trackAddToCart = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const value = NEXUS_PRICE;
      (window as any).gtag?.("event", "add_to_cart", {
        currency: "CHF",
        value,
        items: [{ item_id: "RAJ-NEX-T3-Q2-BLK", item_name: "RAJ NEXUS 3-in-1 Qi2.2 Wireless Charger", price: value, quantity: 1 }],
      });
      (window as any).fbq?.("track", "AddToCart", {
        value,
        currency: "CHF",
        content_ids: ["RAJ-NEX-T3-Q2-BLK"],
        content_type: "product",
      });
    } catch {}
  }, []);


  const quickBuy = useCallback(() => {
    trackAddToCart();
    quickBuyRaw();
  }, [trackAddToCart, quickBuyRaw]);

  const currentValue = NEXUS_PRICE;

  useViewContent({ content_name: "RAJ NEXUS", content_ids: ["RAJ-NEXUS-001"], content_type: "product", content_category: "Wireless Charger", value: currentValue, currency: "CHF" });


  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      (window as any).gtag?.("event", "view_item", {
        currency: "CHF",
        value: currentValue,
        items: [{ item_id: "RAJ-NEX-T3-Q2-BLK", item_name: "RAJ NEXUS 3-in-1 Qi2.2 Wireless Charger", price: currentValue, quantity: 1 }],
      });
    } catch {}
  }, [currentValue]);



 const productJsonLd={...PRODUCT_NEXUS_JSON_LD,description:'3-in-1 Qi2.2 Ladestation für iPhone, Apple Watch und AirPods. Bis zu 25 W, klappbar. Im Paket: NEXUS und USB-C Kabel, ohne Netzteil. USB-C PD ab 30 W erforderlich. RAJ GmbH aus Weinfelden TG.',material:'Aluminium',additionalProperty:PRODUCT_NEXUS_JSON_LD.additionalProperty.filter(p=>p.name!=='Country of Brand').map(p=>p.name==='Compatibility'?{...p,value:'iPhone 12 to iPhone 18 Series, Apple Watch, AirPods with wireless charging case'}:p),...reviewSchema('nexus',rated)};
 return <><Helmet><title>RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz</title><meta name="description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Bis zu 25W, faltbar. Jetzt CHF 99."/><link rel="canonical" href="https://raj.ch/nexus"/><meta name="robots" content="index, follow"/><meta property="og:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz"/><meta property="og:description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Jetzt CHF 99."/><meta property="og:type" content="product"/><meta property="og:url" content="https://raj.ch/nexus"/><meta property="og:site_name" content="RAJ"/><meta property="og:locale" content="de_CH"/><meta property="product:price:amount" content="99.00"/><meta property="product:price:currency" content="CHF"/>{shareImageTags()}<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:site" content="@raj_swiss_"/><meta name="twitter:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz"/><meta name="twitter:description" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Jetzt CHF 99."/><script type="application/ld+json">{JSON.stringify(productJsonLd)}</script><script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd([{name:'Home',url:'https://raj.ch/'},{name:'RAJ NEXUS',url:'https://raj.ch/nexus'}]))}</script><script type="application/ld+json">{JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:NEXUS_FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))})}</script></Helmet>
 <div className="nx-page"><Header topSlot={<NexusTrustBar/>}/><main><section className="nx-purchase"><NexusGallery/><div className="nx-options"><div><div className="nx-heading"><h1>NEXUS</h1><span className="nx-price">CHF {NEXUS_PRICE}.–</span></div><p className="nx-subtitle">3-in-1 Ladestation für iPhone, Apple Watch und AirPods</p>{rated.length>0&&<Button asChild variant="link" className="nx-rating"><a href="#bewertungen"><StarRating value={Math.round(average)} readOnly size={14}/><span>{average.toFixed(1)} · {rated.length} Bewertungen</span></a></Button>}</div>
 {marcel&&<blockquote className="nx-quote"><p>«Ich hatte vorher Belkin und Anker gehabt und muss sagen, obwohl RAJ eine neue Marke ist, spielen die schon jetzt vorne mit.»</p><small>Marcel · <ShieldCheck size={13}/> Verifizierter Kauf</small></blockquote>}
 <ul className="nx-points">{[{Icon:Zap,text:'Lädt dein iPhone mit bis zu 25 W (Qi2.2)'},{Icon:FoldVertical,text:'Klappbar: für Nachttisch, Büro und unterwegs'},{Icon:ShieldCheck,text:'Aluminium, mit 3 Jahren Garantie'}].map(({Icon,text})=><li key={text}><Icon strokeWidth={1.5}/><span>{text}</span></li>)}</ul><div className="nx-package"><Package strokeWidth={1.5}/><p>{NEXUS_PACKAGE}</p></div><Button ref={mainBuyRef} className="nx-buy" onClick={()=>{if(!buyProcessing)quickBuy();}} disabled={buyProcessing}>{buyProcessing?<Loader2 className="animate-spin" size={18}/>:`Jetzt kaufen · CHF ${NEXUS_PRICE}.–`}</Button><div className="nx-payment"><span><LockKeyhole size={12}/> Sichere Zahlung</span>{['TWINT','Apple Pay','Visa','Mastercard'].map(p=><b key={p}>{p}</b>)}</div><div className="nx-trust">{[{Icon:Truck,text:'Gratis Versand, 2 bis 3 Tage'},{Icon:RotateCcw,text:'30 Tage gratis Rückgabe'},{Icon:ShieldCheck,text:'3 Jahre Garantie'},{Icon:MapPin,text:'Support aus der Schweiz'}].map(({Icon,text})=><div key={text}><Icon strokeWidth={1.5}/><span>{text}</span></div>)}</div></div></section><NexusEditorial/></main><footer className="nx-footer"><Link to="/" aria-label="RAJ – Startseite"><img src={logo} width={120} height={40} alt="RAJ" loading="lazy"/></Link><p>Power. Always There.</p><p>© {new Date().getFullYear()} RAJ GmbH aus Weinfelden TG</p></footer><MobileProductBuyBar mainBuyRef={mainBuyRef} name="NEXUS · SPACE BLACK" image={NEXUS_GALLERY[0].thumb} imageAlt="RAJ NEXUS · Space Black" price={NEXUS_PRICE} busy={buyProcessing} nexus/></div></>;
};
export default NexusPage;

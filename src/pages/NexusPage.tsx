import {useBlackWeekCatalog,weekCartItem} from "@/hooks/useBlackWeekCatalog";
import {useCartStore} from "@/stores/cartStore";
import {storefrontApiRequest} from "@/lib/shopify";
import {toast} from "sonner";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, FoldVertical, ShieldCheck, LockKeyhole, Truck, RotateCcw, MapPin, Loader2 } from 'lucide-react';
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
import { NEXUS_FAQ, NEXUS_GALLERY } from '@/components/nexus/nexusContent';
import { chf, chfShort, amount, fillPrices } from '@/lib/livePrice';
import { nexusReviewData } from '@/components/nexus/nexusReviewData';
import logo from '@/assets/logo-transparent.webp';
import '@/components/nexus/nexus-page.css';
const NexusPage = () => {
 const {active:blackWeek,nexus}=useBlackWeekCatalog();
 const [quantity,setQuantity]=useState(1);
 const [pairTotal,setPairTotal]=useState<number|null>(null);
 const [weekBusy,setWeekBusy]=useState(false);
 useEffect(()=>{if(!blackWeek||!nexus)return;let cancelled=false;storefrontApiRequest(`mutation($input:CartInput!){cartCreate(input:$input){cart{cost{totalAmount{amount}}}userErrors{message}}}`,{input:{lines:[{merchandiseId:nexus.id,quantity:2}]}}).then(d=>{const amount=d?.data?.cartCreate?.cart?.cost?.totalAmount?.amount;if(!cancelled&&amount!=null)setPairTotal(Number(amount));}).catch(()=>{});return()=>{cancelled=true;};},[blackWeek,nexus?.id]);
 const nexusNum=amount(nexus?.price);
 const currentPrice=blackWeek&&quantity===2?pairTotal:nexusNum;
 const { quickBuy: quickBuyRaw, isProcessing: buyProcessing } = useQuickBuy();
 const mainBuyRef = useRef<HTMLButtonElement>(null);
 useEffect(()=>releaseReviews(),[]);
 const {reviews}=useProductReviews('nexus');
 const {rated,average}=nexusReviewData(reviews);
  const trackAddToCart = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const value = nexusNum ?? undefined;
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
  }, [nexusNum]);


  const quickBuy = useCallback(() => {
    if(blackWeek){if(!nexus||weekBusy)return;setWeekBusy(true);useCartStore.getState().addOffer([weekCartItem(nexus,quantity)]).catch(()=>toast.error("NEXUS konnte nicht hinzugefügt werden.")).finally(()=>setWeekBusy(false));return;}
    trackAddToCart();
    quickBuyRaw();
  }, [blackWeek,nexus,quantity,weekBusy,trackAddToCart, quickBuyRaw]);

  const currentValue = nexusNum ?? undefined;

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



 const productJsonLd={...PRODUCT_NEXUS_JSON_LD,offers:{...PRODUCT_NEXUS_JSON_LD.offers,price:nexus?nexus.price.amount:undefined},description:'3-in-1 Qi2.2 Ladestation für iPhone, Apple Watch und AirPods. Bis zu 25 W, klappbar. Im Paket: NEXUS und USB-C Kabel, ohne Netzteil. USB-C PD ab 30 W erforderlich. RAJ GmbH aus Weinfelden TG.',material:'Aluminium',additionalProperty:PRODUCT_NEXUS_JSON_LD.additionalProperty.filter(p=>p.name!=='Country of Brand').map(p=>p.name==='Compatibility'?{...p,value:'iPhone 12 to iPhone 18 Series, Apple Watch, AirPods with wireless charging case'}:p),...reviewSchema('nexus',rated)};
 return <><Helmet><title>RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz</title><meta name="description" content={`RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods. Bis zu 25W, faltbar.${nexusNum!=null?` Jetzt ${chf(nexusNum)}`:""}`}/><link rel="canonical" href="https://raj.ch/nexus"/><meta name="robots" content="index, follow"/><meta property="og:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz"/><meta property="og:description" content={`RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods.${nexusNum!=null?` Jetzt ${chf(nexusNum)}`:""}`}/><meta property="og:type" content="product"/><meta property="og:url" content="https://raj.ch/nexus"/><meta property="og:site_name" content="RAJ"/><meta property="og:locale" content="de_CH"/><meta property="product:price:amount" content={nexus?.price.amount??""}/><meta property="product:price:currency" content="CHF"/>{shareImageTags()}<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:site" content="@raj_swiss_"/><meta name="twitter:title" content="RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz"/><meta name="twitter:description" content={`RAJ NEXUS – 3-in-1 Qi2.2 Wireless Charger Schweiz für iPhone, Apple Watch und AirPods.${nexusNum!=null?` Jetzt ${chf(nexusNum)}`:""}`}/><script type="application/ld+json">{JSON.stringify(productJsonLd)}</script><script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd([{name:'Home',url:'https://raj.ch/'},{name:'RAJ NEXUS',url:'https://raj.ch/nexus'}]))}</script><script type="application/ld+json">{JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:NEXUS_FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:fillPrices(a,{NEXUS:nexusNum})}}))})}</script></Helmet>
 <div className="nx-page"><Header topSlot={<NexusTrustBar/>}/><main><section className="nx-purchase"><NexusGallery/><div className="nx-options"><div><div className="nx-heading"><h1>NEXUS</h1><span className="nx-price">{chf(currentPrice)}{!(blackWeek&&quantity===2)&&nexus?.compareAtPrice&&<span className="bw-price-note">statt <del>CHF {Number(nexus.compareAtPrice.amount)}.–</del></span>}</span></div><p className="nx-subtitle">3-in-1 Ladestation für iPhone, Apple Watch und AirPods</p>{rated.length>0&&<Button asChild variant="link" className="nx-rating"><a href="#bewertungen"><StarRating value={Math.round(average)} readOnly size={14}/><span>{average.toFixed(1)} · {rated.length} Bewertungen</span></a></Button>}</div>
 <ul className="nx-points">{[{Icon:Zap,text:'Lädt dein iPhone mit bis zu 25 W (Qi2.2)'},{Icon:FoldVertical,text:'Klappbar: für Nachttisch, Büro und unterwegs'},{Icon:ShieldCheck,text:'Aluminium, mit 3 Jahren Garantie'}].map(({Icon,text})=><li key={text}><Icon strokeWidth={1.5}/><span>{text}</span></li>)}</ul>{blackWeek&&<div className="bw-choice-grid"><Button variant="outline" className="bw-choice" aria-pressed={quantity===1} onClick={()=>setQuantity(1)}><strong>1 NEXUS</strong><span>{chf(nexus?.price.amount)}</span>{nexus?.compareAtPrice&&<del>{Number(nexus.compareAtPrice.amount)}.–</del>}</Button><Button variant="outline" className="bw-choice" aria-pressed={quantity===2} onClick={()=>setQuantity(2)}><strong>2 NEXUS</strong><span>{pairTotal!==null?`${chf(pairTotal)} · nur ${chf(pairTotal/2)} pro Stück`:"…"}</span><small>Eine für dich, eine zum Verschenken</small></Button></div>}<Button ref={mainBuyRef} className="nx-buy" onClick={()=>{if(!buyProcessing)quickBuy();}} disabled={buyProcessing||weekBusy||(blackWeek&&(!nexus||(quantity===2&&pairTotal===null)))}>{(buyProcessing||weekBusy)?<Loader2 className="animate-spin" size={18}/>:`Jetzt kaufen · ${chf(currentPrice)}`}</Button><div className="nx-payment"><span><LockKeyhole size={12}/> Sichere Zahlung</span>{['TWINT','Klarna','Apple Pay','Visa','Mastercard'].map(p=><b key={p}>{p}</b>)}</div><div className="nx-trust">{[{Icon:Truck,text:'Gratis Versand, 2 bis 3 Tage'},{Icon:RotateCcw,text:'30 Tage gratis Rückgabe'},{Icon:ShieldCheck,text:'3 Jahre Garantie'},{Icon:MapPin,text:'Support aus der Schweiz'}].map(({Icon,text})=><div key={text}><Icon strokeWidth={1.5}/><span>{text}</span></div>)}</div></div></section><NexusEditorial/></main><footer className="nx-footer"><Link to="/" aria-label="RAJ – Startseite"><img src={logo} width={120} height={40} alt="RAJ" loading="lazy"/></Link><p>Power. Always There.</p><p>© {new Date().getFullYear()} RAJ GmbH aus Weinfelden TG</p></footer><MobileProductBuyBar mainBuyRef={mainBuyRef} name={`NEXUS · SPACE BLACK${blackWeek&&quantity===2?" · 2 Stück":""}`} image={NEXUS_GALLERY[0].thumb} imageAlt="RAJ NEXUS · Space Black" price={currentPrice} busy={buyProcessing||weekBusy} nexus/></div></>;
};
export default NexusPage;

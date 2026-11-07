import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProductReviews } from '@/hooks/useProductReviews';
import ProductReviews from '@/components/reviews/ProductReviews';
import ReviewModal from '@/components/reviews/ReviewModal';
import ReviewPhotoLightbox from '@/components/reviews/ReviewPhotoLightbox';
import { scrollToReviewsWhenStable } from '@/components/reviews/reviewAnchor';
export default function AirpodsReviews(){
 const {reviews,isPending}=useProductReviews('airpods-case');const {reviews:matrix}=useProductReviews('matrix');const sabrina=matrix.find(r=>/^sabrina\b/i.test(r.customer_name)&&r.source!=='google');
 const [form,setForm]=useState(false);const [photo,setPhoto]=useState(false);
 useEffect(()=>{const wants=new URLSearchParams(location.search).get('bewertung')==='1';if(wants)setForm(true);if(wants||location.hash==='#bewertungen')return scrollToReviewsWhenStable('bewertungen');},[]);
 if(reviews.length)return <div className="ap-own-reviews"><ProductReviews productId="airpods-case"/></div>;
 return <section id="bewertungen" className="ap-section ap-reviews"><h2>Was Kundinnen sagen</h2>{sabrina&&<blockquote className="ap-sabrina"><div><p>«Die Handyhülle und das AirPods-Case sehen einfach super aus, fühlen sich hochwertig an und sind perfekt verarbeitet.»</p><small>Sabrina · Kauf von iPhone Hülle und AirPods Case</small></div>{sabrina.photo_url&&<Button variant="ghost" aria-label="Kundenfoto von Sabrina öffnen" onClick={()=>setPhoto(true)}><img src={sabrina.photo_url} alt="Sabrinas MATRIX iPhone Hülle und AirPods Case" width={64} height={64} loading="lazy"/></Button>}</blockquote>}{!isPending&&<p className="ap-new-review">Das AirPods Case ist neu und hat noch keine eigenen Bewertungen. Du hast es gekauft? Wir freuen uns über deine ehrliche Meinung.</p>}<Button variant="link" className="ap-review-link" onClick={()=>setForm(true)}>Bewertung schreiben</Button><ReviewModal open={form} productId="airpods-case" onOpenChange={setForm}/><ReviewPhotoLightbox review={photo?sabrina??null:null} onClose={()=>setPhoto(false)}/></section>;
}

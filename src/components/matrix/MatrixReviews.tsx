import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductReviews } from '@/hooks/useProductReviews';
import type { PublicReview } from '@/components/reviews/ReviewCard';
import StarRating from '@/components/reviews/StarRating';
import ReviewModal from '@/components/reviews/ReviewModal';
import ReviewPhotoLightbox from '@/components/reviews/ReviewPhotoLightbox';
import { scrollToReviewsWhenStable } from '@/components/reviews/reviewAnchor';
export const verifiedMatrixReviews = (reviews: PublicReview[]) => reviews.filter(r => r.product_id === 'matrix' && r.source !== 'google' && r.verified_purchase);
function MatrixReview({ review }: { review: PublicReview }) {
 const [expanded,setExpanded] = useState(false);
 const [photo,setPhoto] = useState(false);
 return <article className="mx-review"><div className="mx-review-copy"><div className="mx-review-author"><strong>{review.customer_name}</strong><ShieldCheck size={14}/></div><StarRating value={review.rating} readOnly size={14}/><h3>{review.title}</h3><p className={expanded ? '' : 'mx-review-clamp'}>{review.comment}</p>{review.comment.length > 140 && <Button variant="link" onClick={() => setExpanded(!expanded)} className="mx-read-more">{expanded ? 'Weniger lesen' : 'Mehr lesen'}</Button>}<small>{new Date(review.created_at).toLocaleDateString('de-CH')}</small>{review.founder_response && <p className="mx-founder">RAJ: {review.founder_response}</p>}</div>{review.photo_url && <Button variant="ghost" className="mx-review-photo" aria-label={`Foto von ${review.customer_name} vergrössern`} onClick={() => setPhoto(true)}><img src={review.photo_url} width={64} height={64} loading="lazy" alt={`Kundenfoto von ${review.customer_name}`}/></Button>}<ReviewPhotoLightbox review={photo ? review : null} onClose={() => setPhoto(false)}/></article>;
}
export default function MatrixReviews() {
 const { reviews: all, isPending,isError,refetch } = useProductReviews('matrix');
 const reviews = verifiedMatrixReviews(all).sort((a,b) => Number(Boolean(b.photo_url))-Number(Boolean(a.photo_url)) || +new Date(b.created_at)-+new Date(a.created_at));
 const [showAll,setShowAll]=useState(false); const [form,setForm]=useState(false);
 useEffect(() => { const wants=new URLSearchParams(location.search).get('bewertung')==='1'; if(wants) setForm(true); if(wants || location.hash==='#bewertungen') return scrollToReviewsWhenStable('bewertungen'); },[]);
 const average=reviews.length ? reviews.reduce((s,r)=>s+r.rating,0)/reviews.length : 0;
 const topics=[['Qualität',/qualität|hochwertig|wertig/i],['Verpackung',/verpack|packung/i],['Farbe',/farbe|cherry|onyx/i],['Passform',/passform|passt|passgenau/i]].filter(([,pattern])=>reviews.some(r=>(pattern as RegExp).test(r.title+' '+r.comment)));
 return <section id="bewertungen" className="mx-section mx-reviews"><div className="mx-section-heading"><h2>Bewertungen</h2><small>nur verifizierte Käufe</small></div>{isPending ? <p>Bewertungen werden geladen…</p> : isError ? <Button variant="outline" onClick={()=>refetch()}>Erneut laden</Button> : reviews.length ? <><div className="mx-review-summary"><div><strong>{average.toFixed(1)}</strong><StarRating value={Math.round(average)} readOnly size={18}/><p>{reviews.length} Bewertungen</p></div><div className="mx-distribution">{[5,4,3,2,1].map(rating=>{const count=reviews.filter(r=>r.rating===rating).length;return <div key={rating}><span>{rating}</span><div className="mx-bar"><progress max={reviews.length} value={count} aria-label={`${rating} Sterne: ${count} Bewertungen`}/></div><span>{count}</span></div>;})}</div></div><div className="mx-topics">{topics.map(([label])=><span key={String(label)}>{String(label)}</span>)}</div>{(showAll ? reviews : reviews.slice(0,3)).map(r=><MatrixReview key={r.id} review={r}/>)}{reviews.length>3 && <Button variant="outline" className="mx-all-reviews" onClick={()=>setShowAll(!showAll)}>{showAll ? 'Weniger Bewertungen anzeigen' : `Alle ${reviews.length} Bewertungen anzeigen`}</Button>}</> : <p>Noch keine verifizierten Bewertungen.</p>}<Button variant="link" className="mx-write-review" onClick={()=>setForm(true)}>Bewertung schreiben</Button><ReviewModal open={form} productId="matrix" onOpenChange={setForm}/></section>;
}

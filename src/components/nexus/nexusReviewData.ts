import type { PublicReview } from '@/components/reviews/ReviewCard';
import { isRajReview } from '@/lib/homeReviews';
export function nexusReviewData(all: PublicReview[]) {
 const reviews=all.filter(r=>r.product_id==='nexus'); const rated=reviews.filter(isRajReview);
 const priorities=[/christoph/i,/thomas\s*m/i,/chris\s*m/i];
 const ordered=[...reviews].sort((a,b)=>{const rank=(r:PublicReview)=>{const i=priorities.findIndex(p=>p.test(r.customer_name));return i<0?3:i;};return rank(a)-rank(b)||+new Date(b.created_at)-+new Date(a.created_at);});
 return {reviews,rated,ordered,average:rated.length?rated.reduce((s,r)=>s+r.rating,0)/rated.length:0,verified:rated.filter(r=>r.verified_purchase).length,google:reviews.filter(r=>r.source==='google').length,marcel:rated.find(r=>/^marcel\b/i.test(r.customer_name)&&r.verified_purchase)};
}

import type { PublicReview } from "@/components/reviews/ReviewCard";

export const isRajReview = (review: { source?: string }) => !review.source || review.source === "raj";
export function reviewSourceLabel(review: { source?: string; verified_purchase: boolean }) {
  return review.source === "google" ? "Google-Bewertung" : review.verified_purchase ? "Verifizierter Kauf" : "";
}
export function selectHomeReviews(reviews: PublicReview[]) {
  const selected = reviews.filter(r => r.rating === 5 && r.comment.length >= 40)
    .sort((a, b) => Number(Boolean(b.featured_home)) - Number(Boolean(a.featured_home)) || Number(Boolean(b.photo_url)) - Number(Boolean(a.photo_url)) || +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 6);
  return selected.length >= 3 ? selected : [];
}
/**
 * Texts over 140 characters: cut at the last sentence end (. ! ?) found after at
 * least 60 characters within the first 140, without an ellipsis. Otherwise cut at
 * the last word boundary, strip trailing punctuation/spaces and append «…».
 */
export function homeReviewExcerpt(text: string) {
  if (text.length <= 140) return text;
  const prefix = text.slice(0, 140);
  let sentenceEnd = -1;
  for (let i = prefix.length - 1; i >= 59; i--) {
    if (/[.!?]/.test(prefix[i]) && (i + 1 >= text.length || /\s/.test(text[i + 1]))) { sentenceEnd = i; break; }
  }
  if (sentenceEnd >= 59) return prefix.slice(0, sentenceEnd + 1);
  const boundary = prefix.search(/\s+\S*$/);
  const cut = boundary > 0 ? prefix.slice(0, boundary) : prefix;
  return `${cut.replace(/[\s.,;:!?…\-–—]+$/u, "")}…`;
}

import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { reviewsAllowed, subscribeReviewGate } from "@/lib/reviewLoadGate";
import { supabase } from "@/integrations/supabase/client";
import type { PublicReview } from "@/components/reviews/ReviewCard";
import type { ReviewProductId } from "@/lib/reviewProducts";
import { isRajReview } from "@/lib/homeReviews";

export function useProductReviews(productId?: ReviewProductId) {
  const allowed = useSyncExternalStore(subscribeReviewGate, reviewsAllowed, () => true);
  const query = useQuery({
    enabled: allowed,
    queryKey: ["approved-product-reviews"],
    queryFn: async () => {
      const reviews: PublicReview[] = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await supabase.from("reviews_public").select("*").order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
        if (error) throw error;
        reviews.push(...(data ?? []) as PublicReview[]);
        if (!data || data.length < 500) return reviews;
      }
    },
    staleTime: 30_000,
  });
  const reviews = (query.data ?? []).filter((review) => !productId || review.product_id === productId);
  const counted = reviews.filter(isRajReview);
  const stats = { total: counted.length, average: counted.length ? counted.reduce((sum, r) => sum + r.rating, 0) / counted.length : 0,
    c5: counted.filter(r => r.rating === 5).length, c4: counted.filter(r => r.rating === 4).length,
    c3: counted.filter(r => r.rating === 3).length, c2: counted.filter(r => r.rating === 2).length, c1: counted.filter(r => r.rating === 1).length };
  return { ...query, reviews, stats };
}
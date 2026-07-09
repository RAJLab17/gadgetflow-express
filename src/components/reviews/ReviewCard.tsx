import { useState, useEffect } from "react";
import { ShieldCheck, ThumbsUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "./StarRating";

export interface PublicReview {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  founder_response: string | null;
  founder_responded_at: string | null;
  created_at: string;
  photo_url?: string | null;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" });

const ReviewCard = ({ review }: { review: PublicReview }) => {
  const [count, setCount] = useState(review.helpful_count);
  const [voted, setVoted] = useState(() => localStorage.getItem(`rev-helpful-${review.id}`) === "1");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  const vote = async () => {
    if (voted) return;
    setVoted(true);
    setCount((c) => c + 1);
    localStorage.setItem(`rev-helpful-${review.id}`, "1");
    await supabase.rpc("increment_review_helpful", { _review_id: review.id });
  };

  return (
    <article className="border-b border-stone-200 py-8 last:border-b-0">
      <header className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-medium text-white">
          {initials(review.customer_name) || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-stone-900">{review.customer_name}</span>
            {review.verified_purchase && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <ShieldCheck size={12} strokeWidth={2} />
                Verifizierter Kauf
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <StarRating value={review.rating} readOnly size={14} />
            <span className="text-xs text-stone-500">{formatDate(review.created_at)}</span>
          </div>
        </div>
      </header>

      <div className="mt-4 pl-[60px]">
        <h3 className="font-medium text-stone-900">{review.title}</h3>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-stone-700">
          {review.comment}
        </p>

        {review.photo_url && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group mt-4 block overflow-hidden rounded-lg border border-stone-200 transition hover:border-stone-400"
            aria-label="Foto vergrössern"
          >
            <img
              src={review.photo_url}
              alt={`Foto zur Bewertung von ${review.customer_name}`}
              loading="lazy"
              className="h-32 w-32 object-cover transition group-hover:scale-105 sm:h-40 sm:w-40"
            />
          </button>
        )}

        {review.founder_response && (
          <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
              Antwort von Raj
            </div>
            <p className="text-[14px] leading-relaxed text-stone-700">{review.founder_response}</p>
          </div>
        )}

        <button
          type="button"
          onClick={vote}
          disabled={voted}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-stone-500 transition-colors hover:text-stone-900 disabled:opacity-60"
        >
          <ThumbsUp size={13} />
          Hilfreich {count > 0 && `(${count})`}
        </button>
      </div>
    </article>
  );
};

export default ReviewCard;

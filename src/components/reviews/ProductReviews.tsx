import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductReviews } from "@/hooks/useProductReviews";
import type { ReviewProductId } from "@/lib/reviewProducts";
import ReviewModal from "./ReviewModal";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";

export function ProductRating({ productId }: { productId: ReviewProductId }) {
  const { stats } = useProductReviews(productId);
  if (!stats.total) return null;
  return <a href="#bewertungen" aria-label={`${stats.average.toFixed(1)} von 5 Sternen, ${stats.total} Bewertungen`} className="mt-2 inline-flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
    <StarRating value={Math.round(stats.average)} readOnly size={14} />
    <span>{stats.average.toFixed(1)} · {stats.total} {stats.total === 1 ? "Bewertung" : "Bewertungen"}</span>
  </a>;
}

export default function ProductReviews({ productId }: { productId: ReviewProductId }) {
  const { reviews, stats, isPending, isError, refetch } = useProductReviews(productId);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState("newest");
  const filtered = useMemo(() => {
    const list = reviews.filter(r => rating === "all" || r.rating === Number(rating));
    return list.sort((a, b) => sort === "helpful" ? b.helpful_count - a.helpful_count : sort === "top" ? b.rating - a.rating : sort === "low" ? a.rating - b.rating : +new Date(b.created_at) - +new Date(a.created_at));
  }, [reviews, rating, sort]);
  return <section id="bewertungen" className="scroll-mt-28 border-t border-border">
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h2 className="text-3xl font-light text-foreground">Bewertungen</h2>
      {isPending ? <p className="mt-6 text-sm text-muted-foreground">Bewertungen werden geladen…</p> : isError ? <div className="mt-6"><p>Bewertungen konnten nicht geladen werden.</p><Button variant="outline" onClick={() => refetch()}>Erneut versuchen</Button></div> : stats.total ? <>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-4xl font-light">{stats.average.toFixed(1)}</p><StarRating value={Math.round(stats.average)} readOnly size={20} /><p className="mt-2 text-sm text-muted-foreground">Basierend auf {stats.total} {stats.total === 1 ? "Bewertung" : "Bewertungen"}</p></div>
          <Button onClick={() => setOpen(true)}><MessageSquare size={16} className="mr-2" />Bewertung schreiben</Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">{["all", "5", "4", "3", "2", "1"].map(value => <Button key={value} size="sm" variant={rating === value ? "default" : "outline"} aria-pressed={rating === value} onClick={() => setRating(value)}>{value === "all" ? "Alle" : `${value} ★`}</Button>)}</div>
          <select aria-label="Bewertungen sortieren" value={sort} onChange={e => setSort(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-xs"><option value="newest">Neueste zuerst</option><option value="helpful">Hilfreichste</option><option value="top">Höchste Bewertung</option><option value="low">Niedrigste Bewertung</option></select>
        </div>
        {filtered.map(review => <ReviewCard key={review.id} review={review} />)}
        {!filtered.length && <p className="py-8 text-muted-foreground">Keine Bewertungen mit dieser Sternezahl.</p>}
      </> : <div className="mt-6 text-center"><p className="text-foreground">Noch keine Bewertungen. Du hast die MATRIX gekauft? Wir freuen uns über deine Meinung.</p><Button className="mt-6" onClick={() => setOpen(true)}><MessageSquare size={16} className="mr-2" />Bewertung schreiben</Button></div>}
      <ReviewModal open={open} productId={productId} onOpenChange={setOpen} />
    </div>
  </section>;
}
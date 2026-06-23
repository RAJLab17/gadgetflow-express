import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "@/components/reviews/StarRating";
import ReviewCard, { type PublicReview } from "@/components/reviews/ReviewCard";
import ReviewModal from "@/components/reviews/ReviewModal";

type Stats = {
  total: number;
  average: number;
  c5: number;
  c4: number;
  c3: number;
  c2: number;
  c1: number;
};

const EMPTY_STATS: Stats = { total: 0, average: 0, c5: 0, c4: 0, c3: 0, c2: 0, c1: 0 };

type Filter = "all" | "5" | "4" | "3" | "2" | "1";
type Sort = "newest" | "helpful" | "top" | "low";

const ReviewsPage = () => {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [seedRating, setSeedRating] = useState(5);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.rpc("get_review_stats", { _product_id: "nexus" }),
      supabase
        .from("reviews_public")
        .select("*")
        .eq("product_id", "nexus")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (s && Array.isArray(s) && s.length > 0) {
      const row = s[0] as { total: number; average: number; c5: number; c4: number; c3: number; c2: number; c1: number };
      setStats({
        total: Number(row.total) || 0,
        average: Number(row.average) || 0,
        c5: Number(row.c5) || 0,
        c4: Number(row.c4) || 0,
        c3: Number(row.c3) || 0,
        c2: Number(row.c2) || 0,
        c1: Number(row.c1) || 0,
      });
    }
    setReviews((r ?? []) as PublicReview[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (filter !== "all") list = list.filter((r) => r.rating === Number(filter));
    switch (sort) {
      case "helpful":
        list.sort((a, b) => b.helpful_count - a.helpful_count);
        break;
      case "top":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "low":
        list.sort((a, b) => a.rating - b.rating);
        break;
      default:
        list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    return list;
  }, [reviews, filter, sort]);

  const openWithRating = (n: number) => {
    setSeedRating(n);
    setModalOpen(true);
  };

  const bars = [
    { n: 5, c: stats.c5 },
    { n: 4, c: stats.c4 },
    { n: 3, c: stats.c3 },
    { n: 2, c: stats.c2 },
    { n: 1, c: stats.c1 },
  ];

  const jsonLd =
    stats.total > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "RAJ NEXUS",
          description: "Qi2.2 zertifizierter 3-in-1 Wireless Charger – Swiss Brand.",
          brand: { "@type": "Brand", name: "RAJ" },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: stats.average,
            reviewCount: stats.total,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.slice(0, 10).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.customer_name },
            datePublished: r.created_at,
            reviewBody: r.comment,
            name: r.title,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Bewertungen RAJ NEXUS – Echte Kundenmeinungen | RAJ</title>
        <meta
          name="description"
          content="Lies, was Kunden über den RAJ NEXUS sagen – der Qi2.2 zertifizierte 3-in-1 Wireless Charger aus der Schweiz. Verifizierte Bewertungen, manuelle Prüfung."
        />
        <link rel="canonical" href="https://raj.ch/reviews" />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <Header />

      {/* HERO */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-20 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
              Kundenbewertungen
            </p>
            <h1 className="text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
              Was Kunden über den <span className="font-medium">RAJ NEXUS</span> sagen
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-stone-600">
              Echte Stimmen aus der Schweiz. Manuell geprüft, niemals gefiltert.
            </p>
          </motion.div>

          {/* AGGREGAT */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12 grid grid-cols-1 items-center gap-10 md:grid-cols-2"
          >
            <div className="text-center md:text-left">
              <div className="text-6xl font-light tracking-tight text-stone-900">
                {stats.average ? stats.average.toFixed(1) : "—"}
              </div>
              <div className="mt-2 flex justify-center md:justify-start">
                <StarRating value={Math.round(stats.average)} readOnly size={20} />
              </div>
              <p className="mt-2 text-sm text-stone-500">
                Basierend auf {stats.total} {stats.total === 1 ? "Bewertung" : "Bewertungen"}
              </p>
            </div>

            <div className="space-y-2">
              {bars.map(({ n, c }) => {
                const pct = stats.total ? Math.round((c / stats.total) * 100) : 0;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFilter(String(n) as Filter)}
                    className="group flex w-full items-center gap-3 text-left"
                  >
                    <span className="w-3 text-xs text-stone-600">{n}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                      <span
                        className="block h-full rounded-full bg-[#d4a574] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-10 text-right text-xs text-stone-500 group-hover:text-stone-900">
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* STERNE-WIDGET unter Hero — direkt klicken zum Bewerten */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <p className="text-sm font-medium text-stone-900">Hast du den RAJ NEXUS getestet?</p>
            <p className="mt-1 text-sm text-stone-600">
              Klick auf einen Stern, um deine Bewertung abzugeben.
            </p>
            <div className="mt-4 flex justify-center">
              <StarRating value={0} onChange={(n) => openWithRating(n)} size={40} />
            </div>
            <Button
              onClick={() => openWithRating(5)}
              className="mt-6 bg-stone-900 hover:bg-stone-800"
            >
              <MessageSquare className="mr-2" size={16} />
              Bewertung schreiben
            </Button>
          </motion.div>

          {/* Trust-Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              Verifizierte Käufe markiert
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Manuell geprüft
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Keine Filterung — auch kritische Stimmen
            </span>
          </div>
        </div>
      </section>

      {/* LISTE */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "5", "4", "3", "2", "1"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                }`}
              >
                {f === "all" ? "Alle" : `${f} ★`}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-700"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="helpful">Hilfreichste</option>
            <option value="top">Höchste Bewertung</option>
            <option value="low">Niedrigste Bewertung</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-stone-500">Bewertungen werden geladen…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center">
            <p className="text-stone-900">Noch keine Bewertungen.</p>
            <p className="mt-1 text-sm text-stone-500">
              Sei der oder die Erste, die ihre Erfahrung teilt.
            </p>
            <Button
              onClick={() => openWithRating(5)}
              className="mt-6 bg-stone-900 hover:bg-stone-800"
            >
              Bewertung schreiben
            </Button>
          </div>
        ) : (
          <div>
            {filtered.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <ReviewModal
        open={modalOpen}
        onOpenChange={(o) => {
          setModalOpen(o);
          if (!o) load();
        }}
        initialRating={seedRating}
        productId="nexus"
      />
    </div>
  );
};

export default ReviewsPage;

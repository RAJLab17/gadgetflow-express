import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  /** Sterne- & Textfarbe an Hintergrund anpassen */
  gold?: string;
  textColor?: string;
  align?: "left" | "center";
  size?: number;
}

/**
 * Mini-Bewertungs-Badge: ★★★★★ 4.8 (47 Bewertungen)
 * Lädt live aus der DB. Blendet sich aus wenn noch keine Bewertungen vorhanden.
 */
const NexusRatingBadge = ({ gold = "#c9a876", textColor = "#d9c9b0", align = "left", size = 14 }: Props) => {
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.rpc("get_review_stats", { _product_id: "nexus" }).then(({ data }) => {
      if (cancelled) return;
      if (Array.isArray(data) && data.length > 0) {
        const row = data[0] as { total: number; average: number };
        setAvg(Number(row.average) || 0);
        setTotal(Number(row.total) || 0);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready || total === 0) return null;

  const rounded = Math.round(avg);
  return (
    <Link
      to="/reviews"
      aria-label={`${avg.toFixed(1)} von 5 Sternen, ${total} Bewertungen lesen`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: align === "center" ? "center" : "flex-start",
        textDecoration: "none",
      }}
    >
      <span style={{ display: "inline-flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            strokeWidth={1.5}
            style={{
              color: gold,
              fill: n <= rounded ? gold : "transparent",
            }}
          />
        ))}
      </span>
      <span style={{ fontSize: size - 1, color: textColor, fontWeight: 400, letterSpacing: ".01em" }}>
        <strong style={{ color: gold, fontWeight: 500 }}>{avg.toFixed(1)}</strong>
        <span style={{ opacity: 0.7, marginLeft: 6 }}>
          ({total} {total === 1 ? "Bewertung" : "Bewertungen"})
        </span>
      </span>
    </Link>
  );
};

export default NexusRatingBadge;

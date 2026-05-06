import { useEffect, useState } from "react";

const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [showPlus, setShowPlus] = useState(false);

  useEffect(() => {
    let mounted = true;
    let cleanupChannel: (() => void) | null = null;

    // Lazy-load Supabase client only when this component runs.
    // Keeps the supabase-vendor chunk out of the initial bundle.
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      if (!mounted) return;

      const alreadyCounted = sessionStorage.getItem("counted");
      if (!alreadyCounted) {
        sessionStorage.setItem("counted", "true");
        const { data, error } = await supabase.rpc("increment_visitor_count_v2");
        if (!error && mounted && typeof data === "number") setCount(data);
      } else {
        const { data } = await supabase
          .from("visitor_count")
          .select("count")
          .eq("id", 1)
          .maybeSingle();
        if (mounted && data) setCount(data.count);
      }

      const channel = supabase
        .channel("visitor_count_changes")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "visitor_count" },
          (payload) => {
            const newCount = (payload.new as { count: number })?.count;
            if (typeof newCount === "number") {
              setCount((prev) => {
                if (prev !== null && newCount > prev) {
                  setShowPlus(true);
                  setTimeout(() => setShowPlus(false), 2000);
                }
                return newCount;
              });
            }
          }
        )
        .subscribe();

      cleanupChannel = () => {
        supabase.removeChannel(channel);
      };
    })();

    return () => {
      mounted = false;
      cleanupChannel?.();
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="w-full flex justify-center pt-6 pb-4 md:pt-8 md:pb-6">
      <p className="text-sm md:text-base text-muted-foreground font-light tracking-wide flex items-center gap-2">
        <span className="relative inline-flex items-baseline">
          <span
            key={count}
            className="raj-cross-fade font-semibold tabular-nums"
            style={{ color: "#9b6b3f", animationDuration: "500ms" }}
          >
            {count.toLocaleString("de-CH")}
          </span>
          {showPlus && (
            <span
              className="absolute -right-6 top-0 text-xs font-semibold"
              style={{
                color: "#9b6b3f",
                animation: "raj-plus-float 2s ease-out forwards",
              }}
            >
              +1
            </span>
          )}
        </span>
        <span>Menschen haben den RAJ NEXUS bereits entdeckt</span>
      </p>
      <style>{`
        @keyframes raj-plus-float {
          0%   { opacity: 0; transform: translateY(0); }
          15%  { opacity: 1; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
};

export default VisitorCounter;

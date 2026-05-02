import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [showPlus, setShowPlus] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const alreadyCounted = sessionStorage.getItem("counted");

      if (!alreadyCounted) {
        sessionStorage.setItem("counted", "true");
        const { data, error } = await supabase.rpc("increment_visitor_count_v2");
        if (!error && mounted && typeof data === "number") {
          setCount(data);
        }
      } else {
        const { data } = await supabase
          .from("visitor_count")
          .select("count")
          .eq("id", 1)
          .maybeSingle();
        if (mounted && data) setCount(data.count);
      }
    };

    init();

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

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="w-full flex justify-center pt-6 pb-4 md:pt-8 md:pb-6">
      <p className="text-sm md:text-base text-muted-foreground font-light tracking-wide flex items-center gap-2">
        <span className="relative inline-flex items-baseline">
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-semibold tabular-nums"
              style={{ color: "#9b6b3f" }}
            >
              {count.toLocaleString("de-CH")}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence>
            {showPlus && (
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -10 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute -right-6 top-0 text-xs font-semibold"
                style={{ color: "#9b6b3f" }}
              >
                +1
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span>Menschen haben den RAJ NEXUS bereits entdeckt</span>
      </p>
    </div>
  );
};

export default VisitorCounter;

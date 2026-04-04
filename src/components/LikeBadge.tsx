import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LikeBadgeProps {
  productId: string;
}

const getFingerprint = (): string => {
  const key = "raj_device_fp";
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(key, fp);
  }
  return fp;
};

const LikeBadge = ({ productId }: LikeBadgeProps) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [bouncing, setBouncing] = useState(false);

  const storageKey = `raj_product_liked_${productId}`;

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "true");

    const fetchCount = async () => {
      const { count: total, error } = await supabase
        .from("product_likes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);
      if (!error && total !== null) setCount(total);
    };
    fetchCount();
  }, [productId, storageKey]);

  const handleLike = async () => {
    if (liked) return;

    setLiked(true);
    setCount((c) => c + 1);
    setBouncing(true);
    localStorage.setItem(storageKey, "true");
    setTimeout(() => setBouncing(false), 600);

    const fingerprint = getFingerprint();
    await supabase
      .from("product_likes")
      .insert({ product_id: productId, fingerprint });
  };

  return (
    <motion.button
      onClick={handleLike}
      whileTap={!liked ? { scale: 0.95 } : {}}
      className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/60 cursor-pointer transition-colors hover:bg-white/70"
    >
      <motion.div
        animate={bouncing ? { scale: [1, 1.4, 0.9, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Heart
          className="w-5 h-5 transition-colors"
          fill={liked ? "#e74c3c" : "none"}
          stroke={liked ? "#e74c3c" : "#e74c3c"}
          strokeWidth={2}
        />
      </motion.div>
      <span className="text-sm font-medium text-[#2c2c2c]">
        {count} lieben es bereits
      </span>
    </motion.button>
  );
};

export default LikeBadge;

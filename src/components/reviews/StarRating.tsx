import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

const StarRating = ({ value, onChange, size = 28, readOnly = false, className }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={cn("flex items-center gap-1", className)} role="radiogroup" aria-label="Sterne-Bewertung">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className={cn(
              "transition-transform",
              !readOnly && "hover:scale-110 cursor-pointer",
              readOnly && "cursor-default"
            )}
            aria-label={`${n} ${n === 1 ? "Stern" : "Sterne"}`}
            aria-checked={value === n}
            role="radio"
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                active ? "fill-[#d4a574] text-[#d4a574]" : "fill-transparent text-stone-300"
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

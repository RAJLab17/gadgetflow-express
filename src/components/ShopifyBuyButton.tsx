import { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentIcons from "@/components/PaymentIcons";
import WaitlistForm from "@/components/WaitlistForm";
import { createShopifyCart } from "@/lib/shopify";
import type { CartItem } from "@/lib/shopify";

interface ShopifyBuyButtonProps {
  variantId?: string;
  shopifyHandle?: string;
  price: string;
  originalPrice?: string;
  discountLabel?: string;
  soldOut?: boolean;
}

const ShopifyBuyButton = ({
  variantId,
  price,
  originalPrice,
  discountLabel,
  soldOut = false,
}: ShopifyBuyButtonProps) => {
  const [isLoading] = useState(false);

  const handleBuyNow = () => {
    window.open("https://checkout.raj.ch", '_blank', 'noopener,noreferrer');
  };

  // Show waitlist form when sold out
  if (soldOut) {
    return <WaitlistForm />;
  }

  return (
    <div className="p-6 md:p-8 bg-card rounded-2xl border border-border space-y-5">
      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-bold text-primary">{price}</span>
        {originalPrice && (
          <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
        )}
        {discountLabel && (
          <span className="bg-primary/20 text-primary px-2 py-1 rounded-md text-sm font-semibold">
            {discountLabel}
          </span>
        )}
      </div>

      {/* Buy Button */}
      {variantId ? (
        <Button
          size="xl"
          variant="glow"
          className="w-full"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 mr-2" />
              Jetzt kaufen
            </>
          )}
        </Button>
      ) : (
        <Button size="xl" variant="glow" className="w-full" disabled>
          <ShoppingBag className="w-5 h-5 mr-2" />
          Bald im Shop verfügbar
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Sichere Bezahlung über Shopify · Kostenloser Versand
      </p>

      {/* Payment Methods */}
      <div className="pt-4 border-t border-border">
        <PaymentIcons size="sm" />
      </div>
    </div>
  );
};

export default ShopifyBuyButton;

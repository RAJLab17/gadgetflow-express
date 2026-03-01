import { ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentIcons from "@/components/PaymentIcons";

const SHOPIFY_STORE_DOMAIN = "kcvjif-10.myshopify.com";

interface ShopifyBuyButtonProps {
  shopifyHandle?: string;
  price: string;
  originalPrice?: string;
  discountLabel?: string;
}

const ShopifyBuyButton = ({
  shopifyHandle,
  price,
  originalPrice,
  discountLabel,
}: ShopifyBuyButtonProps) => {
  const productUrl = shopifyHandle
    ? `https://${SHOPIFY_STORE_DOMAIN}/products/${shopifyHandle}`
    : null;

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
      {productUrl ? (
        <Button
          size="xl"
          variant="glow"
          className="w-full"
          onClick={() => window.open(productUrl, "_blank")}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Jetzt kaufen
          <ExternalLink className="w-4 h-4 ml-2" />
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

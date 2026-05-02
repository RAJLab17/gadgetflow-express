import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";

interface ViewContentOptions {
  content_name: string;
  content_ids?: string[];
  content_category?: string;
  content_type?: "product" | "product_group";
  value?: number;
  currency?: string;
}

/**
 * Fires Meta Pixel + Conversions API `ViewContent` once per mount.
 * Use on every product / product-landing page so Meta gets retargeting data.
 */
export function useViewContent(options: ViewContentOptions) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      customData: {
        content_type: "product",
        currency: "CHF",
        ...options,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.content_name]);
}

/** SEO only: never turn an absent/invalid Shopify amount into a fallback price. */
export interface OfferVariant {
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
}

export function productOfferPricing(variant?: OfferVariant | null) {
  const raw = variant?.price.amount;
  if (!raw?.trim() || !variant || variant.price.currencyCode !== 'CHF') return null;
  const price = Number(raw);
  if (!Number.isFinite(price) || price < 0) return null;
  const comparisonRaw = variant.compareAtPrice?.amount;
  const comparison = comparisonRaw?.trim() ? Number(comparisonRaw) : NaN;
  return {
    price: price.toFixed(2),
    priceCurrency: 'CHF',
    ...(Number.isFinite(comparison) && comparison > price ? {
      priceValidUntil: '2026-11-30',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: comparison.toFixed(2),
        priceCurrency: 'CHF',
        priceType: 'https://schema.org/StrikethroughPrice',
      },
    } : {}),
  };
}
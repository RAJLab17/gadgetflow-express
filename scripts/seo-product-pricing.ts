import { SHOPIFY_STOREFRONT_URL, SHOPIFY_STOREFRONT_TOKEN } from '../src/lib/storefrontConfig';
import { productOfferPricing, type OfferVariant } from '../src/lib/productOffer';
import type { RouteSnapshot } from './prerender';

export const SEO_PRODUCT_HANDLES: Record<string, string> = {
  '/nexus': 'raj-3-in-1-wireless-charger',
  '/matrix': 'raj-matrix-case',
  '/airpods-case': 'raj-matrix-airpods-4-case',
};

/** No persisted price cache: publication fails rather than serving an old/missing offer. */
export async function fetchSeoPrices(): Promise<Record<string, OfferVariant>> {
  const query = `{ ${Object.entries(SEO_PRODUCT_HANDLES).map(([route, handle]) =>
    `${route.slice(1).replaceAll('-', '_')}: product(handle: ${JSON.stringify(handle)}) { variants(first: 100) { nodes { price { amount currencyCode } compareAtPrice { amount currencyCode } } } }`).join(' ')} }`;
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`SEO Shopify pricing unavailable (HTTP ${response.status})`);
  const result = await response.json() as { errors?: unknown; data?: Record<string, { variants: { nodes: OfferVariant[] } } | null> };
  if (result.errors) throw new Error('SEO Shopify pricing query failed');
  return Object.fromEntries(Object.keys(SEO_PRODUCT_HANDLES).map(route => {
    const variants: OfferVariant[] = result.data?.[route.slice(1).replaceAll('-', '_')]?.variants?.nodes ?? [];
    const variant = variants.filter(v => productOfferPricing(v)).sort((a,b) => Number(a.price.amount) - Number(b.price.amount))[0];
    if (!variant) throw new Error(`SEO Shopify price missing for ${route}`);
    return [route, variant];
  }));
}

/** Hydrate price-free source templates only with this build/request's Shopify response. */
export function refreshSnapshotPrices(snapshot: Record<string, RouteSnapshot>, prices: Record<string, OfferVariant>) {
  const out = structuredClone(snapshot);
  for (const snap of Object.values(out)) {
    snap.jsonLd = snap.jsonLd.map(raw => {
      const schema = JSON.parse(raw);
      if (schema['@type'] !== 'Product') return raw;
      if (Array.isArray(schema.offers)) return raw;
      const url = schema.url ?? schema.offers?.url;
      if (!url) return raw;
      const route = new URL(url).pathname;
      if (!SEO_PRODUCT_HANDLES[route]) return raw;
      const pricing = productOfferPricing(prices[route]);
      if (!pricing) throw new Error(`SEO Shopify price missing for ${route}`);
      const { price: _price, priceSpecification: _spec, priceValidUntil: _until, ...offer } = schema.offers ?? {};
      schema.offers = { ...offer, ...pricing };
      return JSON.stringify(schema);
    });
  }
  return out;
}
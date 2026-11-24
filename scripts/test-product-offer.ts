import assert from 'node:assert/strict';
import { productOfferPricing } from '../src/lib/productOffer';
import { fetchSeoPrices, refreshSnapshotPrices } from './seo-product-pricing';
import { loadSnapshot, renderRouteHtml } from './prerender';
const variant = (price: string, was?: string) => ({price: {amount: price, currencyCode: 'CHF'}, compareAtPrice: was ? {amount: was, currencyCode: 'CHF'} : null});
assert.equal(productOfferPricing(undefined), null, 'No Product until Shopify responds');
for (const price of ['', ' ', 'NaN', '-1', 'Infinity']) assert.equal(productOfferPricing(variant(price)), null);
assert.equal(productOfferPricing(variant('79.0', '99.0'))?.price, '79.00', 'NEXUS current price, never comparison');
assert.equal(productOfferPricing(variant('49.0', '59.0'))?.price, '49.00', 'MATRIX string with two decimals');
assert.equal(productOfferPricing(variant('35.0'))?.price, '35.00', 'AirPods single price');
const promotion = productOfferPricing(variant('79', '99'));
assert.equal(promotion?.priceCurrency, 'CHF');
assert.equal(promotion?.priceValidUntil, '2026-11-30');
assert.deepEqual(promotion?.priceSpecification, {'@type':'UnitPriceSpecification', price:'99.00', priceCurrency:'CHF', priceType:'https://schema.org/StrikethroughPrice'});
assert.equal(productOfferPricing(variant('49'))?.priceSpecification, undefined, 'Removing Shopify comparison removes strikethrough');
assert.equal(productOfferPricing(variant('49'))?.priceValidUntil, undefined, 'Removing comparison removes campaign validity');
const prices = await fetchSeoPrices();
const snapshot = loadSnapshot(process.cwd());
const refreshed = refreshSnapshotPrices(snapshot, prices);
for (const [route, expected] of Object.entries({'/nexus':'79.00','/matrix':'49.00','/airpods-case':'35.00'})) {
  const schema = refreshed[route].jsonLd.map(s=>JSON.parse(s)).find(s=>s['@type']==='Product');
  assert.equal(schema.offers.price, expected, route);
  assert.equal(schema.offers.priceCurrency, 'CHF');
  assert.ok(renderRouteHtml('<html><head><meta name="viewport" content="width=device-width"></head><body><noscript><div style="max-width:800px"></div></noscript></body></html>', refreshed[route]).includes(`CHF ${expected}`));
  assert.equal(snapshot[route].jsonLd.map(s=>JSON.parse(s)).find(s=>s['@type']==='Product').offers.price, undefined, 'Source snapshot contains no saved offer price');
}
assert.throws(()=>refreshSnapshotPrices(snapshot, {}), /price missing/, 'Publication cannot fall back to stale prices');
console.log('Product offer rules and live publication pricing passed (79.00 / 49.00 / 35.00)');
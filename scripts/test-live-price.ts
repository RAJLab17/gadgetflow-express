import assert from 'node:assert/strict';
import { chf, chfShort, fillPrices } from '../src/lib/livePrice';
// While Shopify loads there is no fixed fallback price.
assert.equal(chf(null), '…');
assert.equal(chf(undefined), '…');
// Black Week NEXUS price from Shopify (89, compare 99) is shown exactly.
assert.equal(chf('89.0'), 'CHF 89.–');
assert.equal(chfShort('99.0'), '99.–');
assert.equal(chf('59.50'), 'CHF 59.50');
assert.equal(fillPrices('Der RAJ NEXUS kostet {{NEXUS}}.', { NEXUS: 89 }), 'Der RAJ NEXUS kostet CHF 89.–.');
assert.equal(fillPrices('kostet {{NEXUS}}', {}), 'kostet …');
console.log('live price tests passed');

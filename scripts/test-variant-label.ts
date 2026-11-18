import { expect, test } from 'bun:test';
import { getVariantLabel } from '../src/lib/variantLabel';

test('NEXUS default variant has no customer-facing label', () => {
  expect(getVariantLabel({ variantTitle: 'Default Title', selectedOptions: [{ name: 'Title', value: 'Default Title' }] })).toBeNull();
});

test('MATRIX keeps the selected iPhone model and finish', () => {
  expect(getVariantLabel({ variantTitle: 'iPhone 18 Pro / Cherry Carbon', selectedOptions: [
    { name: 'Modell', value: 'iPhone 18 Pro' }, { name: 'Farbe', value: 'Cherry Carbon' },
  ] })).toBe('iPhone 18 Pro · Cherry Carbon');
});

test('the AirPods Case keeps its selected finish', () => {
  expect(getVariantLabel({ variantTitle: 'Cherry Carbon', selectedOptions: [{ name: 'Farbe', value: 'Cherry Carbon' }] })).toBe('Cherry Carbon');
});
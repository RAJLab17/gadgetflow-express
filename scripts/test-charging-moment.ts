import { test, expect } from 'bun:test';
import { chargingPercent, createMomentVisitGate } from '../src/components/brand/chargingMoment';

test('each NEXUS ring takes 900ms with 180ms stagger to reach 100 percent', () => {
  expect([0, 1, 2].map(i => chargingPercent(0, i))).toEqual([0, 0, 0]);
  expect(chargingPercent(450, 0)).toBe(50);
  expect(chargingPercent(900, 0)).toBe(100);
  expect(chargingPercent(900, 1)).toBe(80);
  expect(chargingPercent(1080, 1)).toBe(100);
  expect(chargingPercent(1260, 2)).toBe(100);
});
test('animation runs only once in a visit even across page reloads', () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const claim = createMomentVisitGate();
  expect(claim(storage)).toBe(true);
  expect(claim(storage)).toBe(false);
  expect(createMomentVisitGate()(storage)).toBe(false);
  values.clear();
  expect(createMomentVisitGate()(storage)).toBe(true);
});
test('blocked browser storage retains a once-only in-memory guard', () => {
  const storage = { getItem: () => { throw new Error('Blocked'); }, setItem: () => { throw new Error('Blocked'); } };
  const claim = createMomentVisitGate();
  expect(claim(storage)).toBe(true);
  expect(claim(storage)).toBe(false);
});
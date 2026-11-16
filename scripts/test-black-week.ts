import { describe, expect, test } from 'bun:test';
import { blackWeekActive, blackWeekDiscountCodes, BLACK_WEEK_START, BLACK_WEEK_END } from '../src/lib/blackWeek';
describe('Black Week rules', () => {
  test('starts at Zurich midnight on 18 November', () => {
    expect(BLACK_WEEK_START).toBe(Date.parse('2026-11-17T23:00:00Z'));
    expect(blackWeekActive(BLACK_WEEK_START - 1, null)).toBe(false);
    expect(blackWeekActive(BLACK_WEEK_START, null)).toBe(true);
  });
  test('ends at Zurich 23:59:59 on 30 November', () => {
    expect(BLACK_WEEK_END).toBe(Date.parse('2026-11-30T22:59:59Z'));
    expect(blackWeekActive(BLACK_WEEK_END, null)).toBe(true);
    expect(blackWeekActive(BLACK_WEEK_END + 1, null)).toBe(false);
  });
  test('preview overrides dates', () => expect(blackWeekActive(0, 'vorschau')).toBe(true));
  test('off overrides dates', () => expect(blackWeekActive(BLACK_WEEK_START, 'aus')).toBe(false));
  test('emergency overrides preview', () => expect(blackWeekActive(BLACK_WEEK_START, 'vorschau', true)).toBe(false));
  test('normal bundles retain exact codes', () => expect(blackWeekDiscountCodes(['MATRIXBUNDLE','MATRIX2'], false)).toEqual(['MATRIXBUNDLE','MATRIX2']));
  test('Black Week removes conflicting bundle codes', () => expect(blackWeekDiscountCodes(['MATRIXBUNDLE','MATRIX2'], true)).toEqual([]));
});
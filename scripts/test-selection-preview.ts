import { describe, expect, test } from 'bun:test';
import { SELECTION_PREVIEW_DURATION_MS, selectionPreviewAllowed } from '../src/components/product/selectionPreviewPolicy';
describe('mobile selection preview rules', () => {
  test('expires after three seconds', () => expect(SELECTION_PREVIEW_DURATION_MS).toBe(3000));
  test('appears for user changes when mobile gallery is off screen', () => expect(selectionPreviewAllowed(true, false, true)).toBe(true));
  test('never appears while gallery is visible', () => expect(selectionPreviewAllowed(true, true, true)).toBe(false));
  test('never appears on desktop', () => expect(selectionPreviewAllowed(false, false, true)).toBe(false));
  test('does not appear on initial render or unchanged selection', () => expect(selectionPreviewAllowed(true, false, false)).toBe(false));
});
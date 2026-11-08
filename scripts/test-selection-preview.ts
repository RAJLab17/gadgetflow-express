import { describe, expect, test } from 'bun:test';
import { SELECTION_PREVIEW_DURATION_MS, SELECTION_PREVIEW_VISIBLE_RATIO, selectionPreviewAllowed, selectionPreviewSide } from '../src/components/product/selectionPreviewPolicy';
describe('mobile selection preview rules', () => {
  test('expires after four seconds', () => expect(SELECTION_PREVIEW_DURATION_MS).toBe(4000));
  test('gallery counts as visible from 60 percent', () => expect(SELECTION_PREVIEW_VISIBLE_RATIO).toBe(0.6));
  test('moves left when tap is under the preview', () => expect(selectionPreviewSide({ x: 330, y: 150 }, 390, 100)).toBe('left'));
  test('stays right for taps elsewhere', () => expect(selectionPreviewSide({ x: 100, y: 150 }, 390, 100)).toBe('right'));
  test('appears for user changes when mobile gallery is off screen', () => expect(selectionPreviewAllowed(true, false, true)).toBe(true));
  test('never appears while gallery is visible', () => expect(selectionPreviewAllowed(true, true, true)).toBe(false));
  test('never appears on desktop', () => expect(selectionPreviewAllowed(false, false, true)).toBe(false));
  test('does not appear on initial render or unchanged selection', () => expect(selectionPreviewAllowed(true, false, false)).toBe(false));
});
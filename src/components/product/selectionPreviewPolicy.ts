export const SELECTION_PREVIEW_DURATION_MS = 4000;
export const SELECTION_PREVIEW_VISIBLE_RATIO = 0.6;
export const SELECTION_PREVIEW_SIZE = { width: 120, height: 156, inset: 12 };
export const selectionPreviewAllowed = (mobile: boolean, galleryVisible: boolean, changed: boolean) => mobile && !galleryVisible && changed;
/** Flip to the left when the tapped point would sit under the right-hand preview. */
export const selectionPreviewSide = (tap: { x: number; y: number } | null, viewportWidth: number, top: number): 'right' | 'left' => {
  if (!tap) return 'right';
  const { width, height, inset } = SELECTION_PREVIEW_SIZE;
  const left = viewportWidth - inset - width;
  return tap.x >= left - 8 && tap.x <= viewportWidth && tap.y >= top - 8 && tap.y <= top + height + 8 ? 'left' : 'right';
};

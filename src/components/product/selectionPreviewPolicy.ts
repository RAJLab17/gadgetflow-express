export const SELECTION_PREVIEW_DURATION_MS = 3000;
export const selectionPreviewAllowed = (mobile: boolean, galleryVisible: boolean, changed: boolean) => mobile && !galleryVisible && changed;
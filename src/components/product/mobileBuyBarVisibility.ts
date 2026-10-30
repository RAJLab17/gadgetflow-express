/** Hidden on the untouched first view and while the main purchase control is on screen. */
export function mobileBuyBarVisible(mobile: boolean, intersects: boolean, hasScrolled: boolean, overlayOpen: boolean) {
  return mobile && hasScrolled && !intersects && !overlayOpen;
}

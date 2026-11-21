/** Never show before reaching the original control; only after it exits above the header. */
export function mobileBuyBarVisible(mobile: boolean, intersects: boolean, buttonBottom: number, overlayOpen: boolean, headerHeight = 0) {
  return mobile && !intersects && buttonBottom <= headerHeight && !overlayOpen;
}

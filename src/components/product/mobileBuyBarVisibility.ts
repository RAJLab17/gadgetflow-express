/** Never cover the first view or duplicate a visible main purchase control. */
export function mobileBuyBarVisible(mobile: boolean, intersects: boolean, buttonBottom: number, overlayOpen: boolean) {
  return mobile && !intersects && buttonBottom <= 0 && !overlayOpen;
}
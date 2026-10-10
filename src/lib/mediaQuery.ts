/** Older Safari/WebViews support addListener instead of EventTarget methods. */
export function observeMediaQuery(query: MediaQueryList, onChange: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }
  query.addListener(onChange);
  return () => query.removeListener(onChange);
}
// Lets a page postpone the shared review query until its first product image has loaded.
let held = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function holdReviewsUntilImage(maxWaitMs = 4000) {
  if (held || typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  if (window.location.hash === "#bewertungen" || window.location.hash === "#alle-bewertungen" || p.get("bewertung") === "1") return;
  held = true;
  timer = setTimeout(releaseReviews, maxWaitMs);
}

export function releaseReviews() {
  if (!held) return;
  held = false;
  if (timer) clearTimeout(timer);
  // let the browser paint the image before the network request starts
  requestAnimationFrame(() => setTimeout(emit, 0));
}

export const subscribeReviewGate = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
export const reviewsAllowed = () => !held;

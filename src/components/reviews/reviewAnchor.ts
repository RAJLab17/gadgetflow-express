/** Scroll to a section after images above it settle; keep correcting until ~2s after window load unless the user scrolls. */
let activeStop: (() => void) | null = null;

export function scrollToReviewsWhenStable(requestedId: string): () => void {
  activeStop?.();
  // A target hidden at this breakpoint (e.g. a desktop-only showcase) falls back to the full list.
  const visible = (el: HTMLElement | null) => !!el && el.getClientRects().length > 0;
  const resolve = () => !visible(document.getElementById(requestedId)) && visible(document.getElementById("alle-bewertungen")) ? "alle-bewertungen" : requestedId;
  let stopped = false;
  let loadedAt = 0;
  let timer = 0;
  const offset = () => {
    const header = document.querySelector("header");
    const rect = header?.getBoundingClientRect();
    const fixed = header && getComputedStyle(header).position !== "static" && rect && rect.bottom > 0;
    return (fixed ? rect!.bottom : 0) + 16;
  };
  const align = (smooth: boolean) => {
    if (stopped) return;
    const el = document.getElementById(resolve());
    if (!el) return;
    const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset());
    if (Math.abs(window.scrollY - target) < 4) return;
    window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
  };
  const stop = () => {
    stopped = true;
    try { history.scrollRestoration = "auto"; } catch { /* ignore */ }
    window.clearInterval(timer);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    window.removeEventListener("load", onLoad);
  };
  const imagesAbove = () => {
    const el = document.getElementById(resolve());
    if (!el) return Promise.resolve();
    const top = el.getBoundingClientRect().top + window.scrollY;
    const pending = Array.from(document.images).filter((img) => !img.complete && img.getBoundingClientRect().top + window.scrollY < top);
    return Promise.race([
      Promise.all(pending.map((img) => new Promise((r) => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); }))),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  };
  const onLoad = () => { loadedAt = Date.now(); };
  if (document.readyState === "complete") loadedAt = Date.now();
  else window.addEventListener("load", onLoad, { once: true });
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  // Disable browser's own restoration so Safari/new tabs don't fight our position.
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch { /* ignore */ }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    imagesAbove().then(() => {
      align(true);
      const smoothUntil = Date.now() + 900;
      timer = window.setInterval(() => {
        if (loadedAt && Date.now() - loadedAt > 2000) return stop();
        if (!loadedAt && Date.now() - start > 8000) return stop();
        if (Date.now() > smoothUntil) align(false);
      }, 250);
    });
  }));
  const start = Date.now();
  activeStop = stop;
  return stop;
}

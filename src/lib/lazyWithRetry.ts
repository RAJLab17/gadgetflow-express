import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "raj:chunk-reloaded";

/**
 * React.lazy wrapper that recovers from stale chunk references after a new
 * deploy ("Failed to fetch dynamically imported module"). It retries once,
 * then does a single hard reload to pick up the fresh index.html.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (err) {
      // one silent retry (transient network / CDN hiccup)
      try {
        const mod = await factory();
        sessionStorage.removeItem(RELOAD_KEY);
        return mod;
      } catch (err2) {
        const alreadyReloaded = sessionStorage.getItem(RELOAD_KEY) === "1";
        if (!alreadyReloaded) {
          sessionStorage.setItem(RELOAD_KEY, "1");
          window.location.reload();
          // never resolves — page is reloading
          return new Promise<{ default: T }>(() => {});
        }
        throw err2;
      }
    }
  });
}

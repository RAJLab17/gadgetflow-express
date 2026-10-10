import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "raj:chunk-reloaded";
const IMPORT_TIMEOUT_MS = 15000;

/** Reject a stalled import so it can be retried instead of hanging forever. */
function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Chunk load timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * React.lazy wrapper that recovers from stale chunk references after a new
 * deploy ("Failed to fetch dynamically imported module") and from imports that
 * never settle. It retries once, then does a single hard reload to pick up the
 * fresh index.html. If recovery is exhausted the error is rethrown and caught
 * by the ErrorBoundary, which shows a recovery card instead of a blank page.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await withTimeout(factory(), IMPORT_TIMEOUT_MS);
      sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (err) {
      // one silent retry (transient network / CDN hiccup)
      try {
        const mod = await withTimeout(factory(), IMPORT_TIMEOUT_MS);
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

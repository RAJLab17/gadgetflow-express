import { useCallback, useEffect, useRef, useState } from "react";
import { storefrontApiRequest, CART_QUERY } from "@/lib/shopify";

const STORAGE_KEY = "raj-pending-checkout";
const CONFIRMED_KEY = "raj-last-order";
const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6h

export interface PendingCheckout {
  cartId: string;
  reference: string;
  summary: string;
  total: string;
  startedAt: number;
}

export interface ConfirmedOrder {
  reference: string;
  summary: string;
  total: string;
  confirmedAt: number;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function makeOrderReference(): string {
  const n = Math.floor(Math.random() * 46656).toString(36).toUpperCase().padStart(3, "0");
  const t = Date.now().toString(36).slice(-4).toUpperCase();
  return `RAJ-${t}${n}`;
}

/**
 * Tracks a started Shopify checkout. Shopify deletes the cart once the order is
 * placed, so a cart that no longer resolves means the purchase went through.
 */
export function usePendingCheckout() {
  const [pending, setPending] = useState<PendingCheckout | null>(() => {
    const stored = read<PendingCheckout>(STORAGE_KEY);
    if (stored && Date.now() - stored.startedAt < MAX_AGE_MS) return stored;
    return null;
  });
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(() => read<ConfirmedOrder>(CONFIRMED_KEY));
  const checking = useRef(false);

  const track = useCallback((checkout: PendingCheckout) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkout));
    localStorage.removeItem(CONFIRMED_KEY);
    setConfirmed(null);
    setPending(checkout);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.removeItem(CONFIRMED_KEY);
    setConfirmed(null);
  }, []);

  const check = useCallback(async () => {
    const current = read<PendingCheckout>(STORAGE_KEY);
    if (!current || checking.current) return;
    if (Date.now() - current.startedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      setPending(null);
      return;
    }
    checking.current = true;
    try {
      const data = await storefrontApiRequest(CART_QUERY, { id: current.cartId });
      if (!data) return; // API error – keep waiting
      const cart = data?.data?.cart;
      // Cart gone (or emptied) => checkout completed
      if (cart === null || cart?.totalQuantity === 0) {
        const order: ConfirmedOrder = {
          reference: current.reference,
          summary: current.summary,
          total: current.total,
          confirmedAt: Date.now(),
        };
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(CONFIRMED_KEY, JSON.stringify(order));
        setPending(null);
        setConfirmed(order);
      }
    } catch (error) {
      console.error("Order status check failed:", error);
    } finally {
      checking.current = false;
    }
  }, []);

  useEffect(() => {
    if (!pending) return;
    check();
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    const interval = window.setInterval(check, 20000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
      window.clearInterval(interval);
    };
  }, [pending, check]);

  return { pending, confirmed, track, dismiss, check };
}

import { useEffect, useState } from 'react';
import { storefrontApiRequest } from '@/lib/shopify';
const cache = new Map<string, Promise<number | null>>();
/** Shopify-calculated total (incl. automatic discounts) for the given lines, without touching the visitor's cart. */
export function useCartTotal(lines: { id: string; quantity: number }[] | null) {
  const key = lines ? lines.map(l => `${l.id}x${l.quantity}`).join('|') : '';
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    setTotal(null);
    if (!key || !lines) return;
    let cancelled = false;
    if (!cache.has(key)) cache.set(key, storefrontApiRequest(`mutation($input:CartInput!){cartCreate(input:$input){cart{cost{totalAmount{amount}}}}}`, { input: { lines: lines.map(l => ({ merchandiseId: l.id, quantity: l.quantity })) } })
      .then(d => { const a = d?.data?.cartCreate?.cart?.cost?.totalAmount?.amount; return a != null ? Number(a) : null; })
      .catch(() => { cache.delete(key); return null; }));
    cache.get(key)!.then(v => { if (!cancelled) setTotal(v); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return total;
}

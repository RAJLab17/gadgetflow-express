import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest } from '@/lib/shopify';

type QuoteLine = { id: string; quantity: number };
const CART_QUOTE = `mutation($input:CartInput!){cartCreate(input:$input){cart{cost{totalAmount{amount}}}userErrors{message}}}`;

/** Shopify-calculated total (incl. automatic discounts) for the given lines, without touching the visitor's cart. */
export function useCartTotal(lines: QuoteLine[] | null, discountCode?: string) {
  const { data } = useQuery({
    queryKey: ['shopify-cart-quote', lines, discountCode],
    enabled: Boolean(lines?.length),
    staleTime: 60_000,
    queryFn: async () => {
      if (!lines?.length) return null;
      const result = await storefrontApiRequest(CART_QUOTE, { input: {
        lines: lines.map(({ id, quantity }) => ({ merchandiseId: id, quantity })),
        ...(discountCode ? { discountCodes: [discountCode] } : {}),
      } });
      const quote = result?.data?.cartCreate;
      const total = quote?.cart?.cost?.totalAmount?.amount;
      if (quote?.userErrors?.length || total == null || !Number.isFinite(Number(total))) throw new Error('Shopify cart quote unavailable');
      return Number(total);
    },
  });
  return data ?? null;
}

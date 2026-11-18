import { chf, chfShort, comparisonAmount } from '@/lib/livePrice';

export function PriceComparison({ product, format = chf }: {
  product?: Parameters<typeof comparisonAmount>[0];
  format?: typeof chfShort;
}) {
  const comparison = comparisonAmount(product);
  return comparison === null ? null : <>{' statt '}<del>{format(comparison)}</del></>;
}
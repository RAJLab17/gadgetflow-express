import { discountPercent } from '@/lib/livePrice';
import './discount-badge.css';

export function DiscountBadge({ product }: { product?: Parameters<typeof discountPercent>[0] }) {
  const percent = discountPercent(product);
  return percent === null ? null : <span className="discount-badge">−{percent} %</span>;
}
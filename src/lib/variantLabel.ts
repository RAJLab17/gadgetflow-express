import type { CartItem } from './shopify';

const isDefaultTitle = (value: string) => value.trim().toLowerCase() === 'default title';

export function getVariantLabel({ variantTitle, selectedOptions }: Pick<CartItem, 'variantTitle' | 'selectedOptions'>) {
  if (isDefaultTitle(variantTitle)) return null;

  const label = selectedOptions
    .map(({ value }) => value.trim())
    .filter(value => value && !isDefaultTitle(value))
    .join(' · ');

  return label || null;
}
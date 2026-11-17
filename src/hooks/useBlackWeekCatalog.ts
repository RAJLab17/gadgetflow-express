import { useEffect, useState } from 'react';
import { storefrontApiRequest, type CartItem } from '@/lib/shopify';
import { useBlackWeek } from './useBlackWeek';
export interface WeekVariant { id: string; title: string; availableForSale: boolean; image?:{url:string;altText:string|null}|null; price: {amount:string;currencyCode:string}; compareAtPrice: {amount:string;currencyCode:string}|null; selectedOptions: {name:string;value:string}[]; product: {id:string;title:string;handle:string;description:string;featuredImage:{url:string;altText:string|null}|null}; }
let pending: Promise<WeekVariant[]> | null = null;
let cache: { at: number; data: WeekVariant[] } | null = null;
const CACHE_MS = 5 * 60 * 1000;
export function fetchBlackWeekCatalog() {
  if (cache && Date.now() - cache.at < CACHE_MS) return Promise.resolve(cache.data);
  if (!pending) pending = storefrontApiRequest(`{ products(first: 20) { nodes { id title handle description featuredImage { url altText } variants(first: 100) { nodes { id title availableForSale image {url altText} price { amount currencyCode } compareAtPrice { amount currencyCode } selectedOptions { name value } } } } } }`).then(result => {
    const products = result?.data?.products?.nodes ?? [];
    const list: WeekVariant[] = products.flatMap((product: WeekVariant['product'] & {variants:{nodes:WeekVariant[]}}) => product.variants.nodes.map(variant => ({...variant,product})));
    if (list.length) cache = { at: Date.now(), data: list };
    return list;
  }).finally(() => { pending = null; });
  return pending;
}
export function weekCartItem(variant: WeekVariant, quantity = 1): CartItem {
  const product = variant.product;
  const image=variant.image??product.featuredImage;
  return {lineId:null, variantId:variant.id,variantTitle:variant.title,price:variant.price,quantity,selectedOptions:variant.selectedOptions,product:{node:{...product,priceRange:{minVariantPrice:variant.price},images:{edges:image?[{node:image}]:[]},variants:{edges:[]},options:[]}}};
}
export function useBlackWeekCatalog() {
  const active = useBlackWeek();
  const [variants,setVariants] = useState<WeekVariant[]>([]);
  // Live Shopify prices are always loaded (not only in Black Week), so page and checkout never differ.
  useEffect(() => { let cancelled=false; fetchBlackWeekCatalog().then(data=>{if(!cancelled)setVariants(data);}).catch(()=>{});return()=>{cancelled=true;}; },[]);
  const cheapest=(handle:string)=>variants.filter(v=>v.product.handle===handle).sort((a,b)=>Number(a.price.amount)-Number(b.price.amount))[0];
  return {active,variants,nexus:variants.find(v=>v.product.handle==='raj-3-in-1-wireless-charger'),matrix:cheapest('raj-matrix-case'),airpods:cheapest('raj-matrix-airpods-4-case')};
}

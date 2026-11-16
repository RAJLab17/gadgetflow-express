import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CartItem,
  ShopifyProduct,
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  storefrontApiRequest,
  CART_QUERY,
  normalizeCheckoutUrl,
  clearBlackWeekBundleCodes,
} from '@/lib/shopify';

export type { CartItem, ShopifyProduct };
import { isBlackWeek } from '@/lib/blackWeek';
export interface CartDiscount {title?:string;code?:string;discountedAmount:{amount:string;currencyCode:string};}
export interface CartLineCost {id:string;quantity:number;cost:{totalAmount:{amount:string;currencyCode:string}};discountAllocations:CartDiscount[];merchandise:{id:string};}

interface CartStore {
  items: CartItem[];
  shopifyTotal: string | null;
  lineCosts: CartLineCost[];
  discounts: CartDiscount[];
  addOffer: (items: CartItem[]) => Promise<void>;
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shopifyTotal: null, lineCosts: [], discounts: [],
      addOffer: async (items) => {
        const existing = get().cartId;
        if(existing) await clearBlackWeekBundleCodes(existing);
        for(const item of items) {
          await get().addItem(item);
          if(!get().items.some(i=>i.variantId===item.variantId)) throw new Error("Artikel konnte nicht hinzugefügt werden");
        }
        await get().syncCart();
        window.dispatchEvent(new Event("raj:open-cart"));
      },
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
              });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) return;
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              set({
                items: get().items.map(i => i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i),
                checkoutUrl: result.checkoutUrl ?? get().checkoutUrl,
              });
            } else if (result.cartNotFound) { clearCart(); }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              set({
                items: [...get().items, { ...item, lineId: result.lineId ?? null }],
                checkoutUrl: result.checkoutUrl ?? get().checkoutUrl,
              });
            } else if (result.cartNotFound) { clearCart(); }
          }
        } catch (error) {
          console.error('Failed to add item:', error);
        } finally {
          set({ isLoading: false });
          if(isBlackWeek()) await get().syncCart();
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) { await get().removeItem(variantId); return; }
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            set({
              items: get().items.map(i => i.variantId === variantId ? { ...i, quantity } : i),
              checkoutUrl: result.checkoutUrl ?? get().checkoutUrl,
            });
          } else if (result.cartNotFound) { clearCart(); }
        } catch (error) { console.error('Failed to update quantity:', error); }
        finally { set({ isLoading: false });
          if(isBlackWeek()) await get().syncCart(); }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const newItems = get().items.filter(i => i.variantId !== variantId);
            newItems.length === 0
              ? clearCart()
              : set({ items: newItems, checkoutUrl: result.checkoutUrl ?? get().checkoutUrl });
          } else if (result.cartNotFound) { clearCart(); }
        } catch (error) { console.error('Failed to remove item:', error); }
        finally { set({ isLoading: false });
          if(isBlackWeek()) await get().syncCart(); }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null, shopifyTotal:null,lineCosts:[],discounts:[] }),
      getCheckoutUrl: () => {
        const url = get().checkoutUrl;
        return url ? normalizeCheckoutUrl(url) : null;
      },

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          if(isBlackWeek()) await clearBlackWeekBundleCodes(cartId);
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) {
            clearCart();
          } else {
            set({ checkoutUrl: cart.checkoutUrl ? normalizeCheckoutUrl(cart.checkoutUrl) : get().checkoutUrl, shopifyTotal: cart.cost?.totalAmount?.amount ?? null, lineCosts:cart.lines?.edges?.map((e: {node:CartLineCost})=>e.node)??[], discounts:cart.discountAllocations??[] });
          }
        } catch (error) { console.error('Failed to sync cart:', error); }
        finally { set({ isSyncing: false }); }
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, cartId: state.cartId, checkoutUrl: state.checkoutUrl }),
    }
  )
);

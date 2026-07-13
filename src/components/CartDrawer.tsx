import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { OPEN_CART_EVENT } from "@/hooks/useQuickBuy";

export const CartDrawer = ({ triggerClassName }: { triggerClassName?: string } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_CART_EVENT, open);
    return () => window.removeEventListener(OPEN_CART_EVENT, open);
  }, []);

  const lastClick = useRef(0);

  const handleCheckout = () => {
    const now = Date.now();
    if (now - lastClick.current < 1000) return;
    lastClick.current = now;
    setIsOpen(false);
    window.location.href = "https://checkout.raj.ch/cart/57169031823685:1";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative ${triggerClassName ?? ""}`}
          style={{ backgroundColor: "#ffffff", borderColor: "#111111" }}
          aria-label="Warenkorb öffnen"
        >
          <ShoppingCart
            ref={(el) => el?.style.setProperty("color", "#111111", "important")}
            className="h-5 w-5"
          />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#9b6b3f] text-white border border-[#9b6b3f]/40">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full z-[80] bg-[#0a0908] border-l border-[#2b2725] text-[#f5f3ee] shadow-2xl">
        <SheetHeader className="flex-shrink-0 border-b border-[#2b2725] pb-5">
          <SheetTitle className="text-[#f5f3ee] text-xl font-medium tracking-wide">Warenkorb</SheetTitle>
          <SheetDescription className="text-[#c9b99a] text-sm">
            {totalItems === 0 ? "Dein Warenkorb ist leer" : `${totalItems} Artikel im Warenkorb`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 pb-20 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border border-[#2b2725] bg-[#141210] flex items-center justify-center mx-auto mb-5">
                  <ShoppingCart className="h-7 w-7 text-[#9b6b3f]" />
                </div>
                <p className="text-[#f5f3ee]/80 text-sm">Dein Warenkorb ist leer</p>
                <p className="text-[#9b6b3f] text-xs mt-2 tracking-wide">Entdecke das RAJ NEXUS</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 rounded-xl border border-[#2b2725] bg-[#141210]/60">
                      <div className="w-20 h-20 bg-[#1a1815] rounded-lg overflow-hidden flex-shrink-0 border border-[#2b2725]/50">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-medium text-[#f5f3ee] text-sm leading-tight">{item.product.node.title}</h4>
                          <p className="text-xs text-[#c9b99a]/80 mt-1">{item.selectedOptions.map(o => o.value).join(' • ')}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#9b6b3f]">{item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between flex-shrink-0 gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-[#c9b99a]/70 hover:text-[#f5f3ee] hover:bg-[#2b2725]/50" onClick={() => removeItem(item.variantId)} aria-label="Artikel entfernen">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-[#2b2725] bg-[#141210] hover:bg-[#2b2725] hover:text-[#f5f3ee] text-[#c9b99a]" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Menge verringern">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm text-[#f5f3ee]">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-[#2b2725] bg-[#141210] hover:bg-[#2b2725] hover:text-[#f5f3ee] text-[#c9b99a]" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Menge erhöhen">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-5 border-t border-[#2b2725] bg-[#0a0908]">
                <div className="flex justify-between items-center">
                  <span className="text-[#c9b99a] text-sm">Gesamt</span>
                  <span className="text-2xl font-semibold text-[#f5f3ee]">{items[0]?.price.currencyCode || 'CHF'} {totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full h-12 text-sm tracking-widest uppercase font-medium bg-[#9b6b3f] hover:bg-[#7c5230] text-white border border-[#9b6b3f]/50 rounded-full transition-colors" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Zur Kasse</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
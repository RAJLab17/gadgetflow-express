import { useEffect, useState, type RefObject } from "react";
import { chf } from "@/lib/livePrice";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { observeMediaQuery } from "@/lib/mediaQuery";
import { mobileBuyBarVisible } from "./mobileBuyBarVisibility";

interface Props {
  mainBuyRef: RefObject<HTMLElement>;
  name: string;
  image: string;
  imageAlt: string;
  price: number | null;
  busy: boolean;
  nexus?: boolean;
}

/** Delegates the purchase to the actual page control, never a separate checkout. */
export default function MobileProductBuyBar({ mainBuyRef, name, image, imageAlt, price, busy, nexus = false }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const button = mainBuyRef.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const update = () => {
      const rect = button.getBoundingClientRect();
      const headerHeight = document.querySelector('[data-site-header]')?.getBoundingClientRect().bottom ?? 0;
      const intersects = rect.bottom > headerHeight && rect.top < window.innerHeight;
      const overlayOpen = document.body.style.overflow === "hidden" ||
        Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-cookie-banner]'))
          .some((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden" && element.getAttribute("data-state") !== "closed");
      setVisible(mobileBuyBarVisible(media.matches, intersects, rect.bottom, overlayOpen, headerHeight));
    };
    const intersection = new IntersectionObserver(update);
    intersection.observe(button);
    const mutations = new MutationObserver(update);
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "data-state", "aria-hidden"] });
    const onScroll = update;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    const stopMedia = observeMediaQuery(media, update);
    update();
    return () => { intersection.disconnect(); mutations.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); stopMedia(); };
  }, [mainBuyRef]);

  return (
    <>
      <div className="mobile-product-buybar-spacer" aria-hidden="true" />
      <aside
        aria-label="Produkt kaufen"
        aria-hidden={!visible}
        className={`mobile-product-buybar ${visible ? "is-visible" : ""} ${nexus ? "mobile-product-buybar-nexus" : ""}`}
      >
        <img src={image} alt={imageAlt} width={40} height={40} loading="lazy" decoding="async" className="h-10 w-10 shrink-0 rounded-lg object-contain" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="mobile-product-buybar-name font-semibold uppercase">{name}</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-primary">{chf(price)}</p>
        </div>
        <Button
          type="button"
          onClick={() => mainBuyRef.current?.click()}
          disabled={busy}
          tabIndex={visible ? 0 : -1}
          aria-busy={busy}
          className="mobile-product-buybar-button h-11 shrink-0 gap-1.5 rounded-full px-3 text-[11px] font-semibold active:scale-[0.97] motion-reduce:transform-none"
        >
          {busy ? <Loader2 className="animate-spin" /> : <ShoppingBag />}
          Jetzt kaufen
        </Button>
      </aside>
    </>
  );
}
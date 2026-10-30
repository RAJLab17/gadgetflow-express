import { useEffect, useState, type RefObject } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { observeMediaQuery } from "@/lib/mediaQuery";
import { mobileBuyBarVisible } from "./mobileBuyBarVisibility";

interface Props {
  mainBuyRef: RefObject<HTMLElement>;
  name: string;
  image: string;
  imageAlt: string;
  price: number;
  busy: boolean;
  nexus?: boolean;
}

/** Delegates the purchase to the actual page control, never a separate checkout. */
export default function MobileProductBuyBar({ mainBuyRef, name, image, imageAlt, price, busy, nexus = false }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    let intersects = true;
    let bottom = Infinity;
    const update = () => {
      const overlayOpen = document.body.style.overflow === "hidden" ||
        Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-cookie-banner]'))
          .some((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden" && element.getAttribute("data-state") !== "closed");
      setVisible(mobileBuyBarVisible(media.matches, intersects, bottom, overlayOpen));
    };
    const button = mainBuyRef.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const intersection = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      intersects = entry.isIntersecting;
      bottom = entry.boundingClientRect.bottom;
      update();
    });
    intersection.observe(button);
    const mutations = new MutationObserver(update);
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "data-state", "aria-hidden"] });
    const stopMedia = observeMediaQuery(media, update);
    update();
    return () => { intersection.disconnect(); mutations.disconnect(); stopMedia(); };
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
          <p className="mt-1 text-sm font-semibold tabular-nums text-primary">CHF {price}.–</p>
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
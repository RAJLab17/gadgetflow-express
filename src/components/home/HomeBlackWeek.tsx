import { DiscountBadge } from "@/components/product/DiscountBadge";
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useBlackWeekCatalog } from '@/hooks/useBlackWeekCatalog';
import { useCartTotal } from '@/hooks/useCartTotal';
import { PriceComparison } from '@/components/product/PriceComparison';
import { chf, chfShort, pricePerUnit, regularPriceTotal } from '@/lib/livePrice';
import { Button } from '@/components/ui/button';
import matrixCherry from '@/assets/matrix/uploaded-renders/18-cherry-darkcherry-norm-full.webp.asset.json';
import airpodsCherry from '@/assets/home/black-week-airpods-cherry.webp.asset.json';
import nexusStudio from '@/assets/home/black-week-nexus-clean.webp.asset.json';
import '@/styles/black-week.css';

const NEXUS_PAIR_QUANTITY = 2;

function OfferProducts({ selection }: { selection: 'matrix' | 'nexus' | 'trio' }) {
  const decorative = selection === 'trio';
  return <>
    {selection !== 'matrix' && (
      <img className="bw-charger" src={nexusStudio.url} alt={decorative ? '' : 'RAJ NEXUS mit iPhone mit grünem Ladering, Apple Watch und AirPods'} width={444} height={510} loading="lazy" decoding="async" />
    )}
    {selection !== 'nexus' && <>
      <img className="bw-phone" src={matrixCherry.url} alt={decorative ? '' : 'RAJ MATRIX Hülle in Cherry Carbon'} width={1122} height={1402} loading="lazy" decoding="async" />
      <img className="bw-pods" src={airpodsCherry.url} alt={decorative ? '' : 'RAJ AirPods Case in Cherry Carbon'} width={560} height={458} loading="lazy" decoding="async" />
    </>}
  </>;
}

function OfferLink({ selection }: { selection: 'matrix' | 'nexus' }) {
  return <Button asChild className="bw-buy"><Link to={`/${selection}`}>{selection === 'matrix' ? 'Zur MATRIX' : 'Zur NEXUS'}</Link></Button>;
}

function OfferCard({ selection, title, badge, product, detail }: {
  selection: 'matrix' | 'nexus';
  title: string;
  badge: string;
  product?: Parameters<typeof PriceComparison>[0]['product'];
  detail: ReactNode;
}) {
  return (
    <article className="bw-card">
      <div className="bw-card-stage">
        <OfferProducts selection={selection} />
        <span className="bw-offer-badge">{badge}</span>
      </div>
      <div className="bw-card-copy">
        <h3>{title}</h3>
        <p className="bw-offer-price"><strong className="discount-price">{chf(product?.price.amount)}<DiscountBadge product={product}/></strong><span><PriceComparison product={product} format={chfShort} /></span></p>
        <p className="bw-offer-detail">{detail}</p>
        <OfferLink selection={selection} />
      </div>
    </article>
  );
}

export default function HomeBlackWeek() {
  const { active, nexus, matrix, airpods } = useBlackWeekCatalog();
  const pair = useCartTotal(active && nexus ? [{ id: nexus.id, quantity: NEXUS_PAIR_QUANTITY }] : null);
  const trio = useCartTotal(active && nexus && matrix && airpods ? [
    { id: nexus.id, quantity: 1 }, { id: matrix.id, quantity: 1 }, { id: airpods.id, quantity: 1 },
  ] : null);

  useEffect(() => {
    if (!active || window.location.hash !== '#black-week') return;
    const timer = window.setTimeout(() => {
      const section = document.getElementById('black-week');
      if (!section) return;
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 134;
      window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top - headerHeight - 8, behavior: 'instant' });
    }, 200);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  return (
    <section id="black-week" className="bw-home" aria-labelledby="bw-home-title">
      <div className="bw-home-inner">
        <div className="bw-home-heading">
          <p className="bw-eyebrow">BLACK WEEK · BIS 30. NOVEMBER</p>
          <h2 id="bw-home-title">Dein Apple-Setup. Zusammen.</h2>
        </div>
        <div className="bw-home-grid">
          <OfferCard selection="matrix" title="MATRIX + AirPods Case" badge="+ AirPods Case gratis" product={matrix}
            detail={`AirPods Case im Wert von ${chf(airpods?.price.amount)} gratis dazu`} />
          <OfferCard selection="nexus" title="NEXUS 3-in-1 Qi2.2" badge={`2 Stück ${chf(pair)}`} product={nexus}
            detail={`2 Stück ${chf(pair)} · nur ${chf(pricePerUnit(pair, NEXUS_PAIR_QUANTITY))} pro Stück`} />
        </div>
        <article className="bw-set">
          <div className="bw-set-stage" aria-hidden="true"><OfferProducts selection="trio" /></div>
          <div className="bw-set-copy">
            <h3>Alles im gleichen Look</h3>
            <p className="bw-set-line">NEXUS + MATRIX + AirPods Case zusammen <strong>{chf(trio)}</strong></p>
            <small>Einzelpreise zusammen {chf(regularPriceTotal([nexus, matrix, airpods]))}</small>
          </div>
          <OfferLink selection="matrix" />
        </article>
        <p className="bw-delivery">Bis 18.12. bestellt, vor Weihnachten bei dir · <span>30 Tage Rückgabe</span> · <span>Gratis Versand</span></p>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductLightbox, ZoomFrame } from '@/components/product/ProductZoom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_CAROUSEL_SLIDES, HeroSwipeImage } from './NexusHeroCarousel';
import NexusHeroChipsMobile from './NexusChargeCardsMobile';
import Qi2CertifiedBadge from './Qi2CertifiedBadge';
import { useIsMobile } from '@/hooks/use-mobile';
const zoomImages = HERO_CAROUSEL_SLIDES.map(s => ({ src: s.srcSet.split(',').pop()?.trim().split(/\s+/)[0] || s.src, alt: s.alt }));
const gallerySlides = HERO_CAROUSEL_SLIDES.map((s, i) => ({
 ...s, fit: 'contain' as const, position: 'center',
 mobileFit: 'contain' as const, mobilePosition: 'center', mobileZoom: undefined,
 mobileBg: i === 1 || i === 3 ? 'var(--nx-dark)' : s.mobileBg,
}));
export default function NexusGallery() {
 const [index,setIndex]=useState(0); const [open,setOpen]=useState(false);
 const mobile = useIsMobile();
 const slide = gallerySlides[index];
 if (!slide) return null;
 const light = index === 1 || index === 3;
 return <div className="nx-gallery nx-gallery-original"><div className="nx-gallery-frame">
 <ZoomFrame zoomSrc={zoomImages[index]?.src || slide.src} objectFit="contain" onOpen={()=>setOpen(true)} iconStyle={{right:'auto',left:12,bottom:12}}>
 <HeroSwipeImage slides={gallerySlides} index={index} onChange={setIndex} sizes="(max-width: 768px) 266px, 700px" priority/>
 </ZoomFrame>
 {slide.showChips !== false && <div className={`nx-original-chips ${index === 0 ? 'nx-original-chips-first' : ''}`}><NexusHeroChipsMobile desktop={!mobile}/></div>}
 <div className={`nx-original-certified ${light ? 'nx-original-certified-light' : ''}`}><Qi2CertifiedBadge size={34} compact variant={light?'light':'dark'}/><span>Zertifiziert</span></div>
 {[-1,1].map(dir=><Button variant="outline" className={`nx-gallery-arrow ${dir<0?'nx-gallery-prev':'nx-gallery-next'}`} aria-label={dir<0?'Vorheriges Bild':'Nächstes Bild'} key={dir} onClick={()=>setIndex((index+dir+HERO_CAROUSEL_SLIDES.length)%HERO_CAROUSEL_SLIDES.length)}>{dir<0?<ChevronLeft size={18}/>:<ChevronRight size={18}/>}</Button>)}
 </div><div className="nx-thumbnails" role="tablist" aria-label="Produktbilder">{HERO_CAROUSEL_SLIDES.map((s,i)=><Button variant="outline" role="tab" className="nx-thumb" aria-label={`Bild ${i+1} anzeigen`} aria-selected={i===index} key={s.src} onClick={()=>setIndex(i)}><img src={s.thumb} alt={`Vorschau: ${s.alt}`} width={48} height={48} loading="lazy" decoding="async"/></Button>)}</div><ProductLightbox open={open} images={zoomImages} index={index} onIndexChange={setIndex} onClose={()=>setOpen(false)}/></div>;
}

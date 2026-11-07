import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductLightbox, ZoomFrame } from '@/components/product/ProductZoom';
import MatrixSwapImage from './MatrixSwapImage';
import { renderSizes,renderSrcSet,renderImageSizes } from '@/assets/matrix/responsiveRenders';
import { matrixRealPhotos,realPhotoSrcSet } from './matrixRealPhotos';
import duoCherry from '@/assets/matrix/uploaded-renders/18-cherry-darkcherry-norm-full.webp.asset.json';
import duoOnyx from '@/assets/matrix/uploaded-renders/18-onyx-darkgrey-v2-full.webp.asset.json';
const DUO_ALT='RAJ MATRIX Hüllen in Cherry Carbon und Onyx Carbon nebeneinander';
const Duo = () => <div role="img" aria-label={DUO_ALT} className="mx-page mx-duo"><img src={renderSizes.get(duoCherry.url)?.mobile ?? duoCherry.url} alt="" width={1200} height={1500} loading="lazy" className="mx-duo-cherry"/><img src={renderSizes.get(duoOnyx.url)?.mobile ?? duoOnyx.url} alt="" width={1200} height={1500} loading="lazy" className="mx-duo-onyx"/></div>;
export default function MatrixGallery({src,finish,alt,onFirstLoad}:{src:string;finish:string;alt:string;onFirstLoad:()=>void}) {
 const scroller=useRef<HTMLDivElement>(null); const [active,setActive]=useState(0); const [lightbox,setLightbox]=useState<number|null>(null);
 const photos=[finish==='cherry' ? matrixRealPhotos.cherryHand : matrixRealPhotos.onyxHand,matrixRealPhotos.rock,matrixRealPhotos.set];
 const slides=[{src,alt}, {src:'duo',alt:DUO_ALT},...photos.map(p=>({src:p.full,alt:p.alt}))];
 useEffect(()=>{setActive(0);scroller.current?.scrollTo({left:0});},[src,finish]);
 const go=(i:number)=>{setActive(i);scroller.current?.scrollTo({left:i*(scroller.current?.clientWidth ?? 0),behavior:'smooth'});};
 return <div className="mx-gallery"><div className="mx-gallery-frame"><div ref={scroller} className="mx-gallery-track" onScroll={()=>{const el=scroller.current;if(el)setActive(Math.round(el.scrollLeft/el.clientWidth));}} aria-roledescription="carousel">{slides.map((slide,i)=><div className="mx-gallery-slide" key={i}><ZoomFrame zoomSrc={slide.src} label={`Bild ${i+1} vergrössern`} onOpen={()=>setLightbox(i)} hoverZoom={i!==1}>{i===1 ? <Duo/> : i===0 ? <MatrixSwapImage src={renderSizes.get(src)?.mobile ?? src} srcSet={renderSrcSet(src)} sizes={renderImageSizes} width={1200} height={1500} alt={alt} fetchPriority="high" loading="eager" decoding="async" onLoad={onFirstLoad} className="mx-gallery-main"/> : <img src={photos[i-2].mobile} srcSet={realPhotoSrcSet(photos[i-2])} sizes="(max-width: 767px) calc(100vw - 32px), 500px" width={1200} height={1500} loading="lazy" decoding="async" alt={slide.alt} className="mx-gallery-real"/>}</ZoomFrame></div>)}</div><span className="mx-gallery-count">{Math.min(active+1,5)} / 5</span></div><div className="mx-thumbnails" aria-label="Produktbilder">{slides.map((slide,i)=><Button key={i} variant="outline" className="mx-thumb" aria-label={`Bild ${i+1}`} aria-pressed={active===i} onClick={()=>go(i)}>{i===1 ? <Duo/> : <img src={i===0 ? renderSizes.get(src)?.thumb ?? src : photos[i-2].small} width={64} height={80} loading="lazy" alt={`Vorschau: ${slide.alt}`}/>}</Button>)}</div><ProductLightbox open={lightbox!==null} images={slides.map((s,i)=>({...s,...(i===1 ? {node:<Duo/>}: {})}))} index={lightbox ?? 0} onIndexChange={setLightbox} onClose={()=>setLightbox(null)}/></div>;
}

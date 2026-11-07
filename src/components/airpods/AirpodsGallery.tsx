import {useRef,useState,useEffect} from "react";
import {Button} from "@/components/ui/button";
import {ZoomFrame,ProductLightbox} from "@/components/product/ProductZoom";
import {type Finish,GALLERY_SIZES,slideSrcSet} from "./airpodsContent";
const Gallery = ({ finish }: { finish: Finish }) => {
  const slides = finish.slides;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prefetchThrough, setPrefetchThrough] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setActive(0);
    setPrefetchThrough(0);
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [finish.id]);

  const goTo = (i: number) => {
    setPrefetchThrough((current) => Math.max(current, i + 1));
    scrollerRef.current?.scrollTo({ left: i * (scrollerRef.current?.clientWidth ?? 0), behavior: "smooth" });
  };
  const preloadNext = () => setPrefetchThrough((current) => Math.max(current, active + 1));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  useEffect(() => {
    // Nächstes Bild vorladen, während alle Nicht-Erstbilder loading="lazy" bleiben.
    for (let i = 1; i <= Math.min(prefetchThrough, slides.length - 1); i++) {
      const img = new Image();
      img.sizes = GALLERY_SIZES;
      img.srcset = slideSrcSet(slides[i]);
    }
  }, [prefetchThrough, slides]);

  return <div className="ap-gallery"><div className="ap-gallery-frame"><div ref={scrollerRef} className="ap-gallery-track" onPointerDown={preloadNext} onScroll={()=>{const el=scrollerRef.current;if(el?.clientWidth)setActive(Math.round(el.scrollLeft/el.clientWidth));}}>{slides.map((slide,i)=><div key={slide.src} className="ap-gallery-slide"><ZoomFrame zoomSrc={slide.src} objectFit={slide.fit??'cover'} onOpen={()=>setLightboxIndex(i)}><img data-airpods-hero={i===0?'':undefined} src={slide.src} srcSet={slideSrcSet(slide)} sizes={GALLERY_SIZES} alt={slide.alt} width={1200} height={1500} loading={i===0?'eager':'lazy'} fetchPriority={i===0?'high':'auto'} decoding="async" className={slide.fit==='contain'?'ap-gallery-studio':'ap-gallery-photo'}/></ZoomFrame></div>)}</div><span className="ap-gallery-count">{active+1} / {slides.length}</span></div><div className="ap-thumbnails">{slides.map((s,i)=><Button key={s.src} variant="outline" className="ap-thumb" aria-label={`Bild ${i+1} anzeigen`} aria-pressed={active===i} onClick={()=>goTo(i)}><img src={s.thumb} width={44} height={44} alt={s.alt} loading="lazy"/></Button>)}</div><ProductLightbox open={lightboxIndex!==null} images={slides.map(s=>({src:s.src,alt:s.alt}))} index={lightboxIndex??0} onIndexChange={i=>{setLightboxIndex(i);goTo(i);}} onClose={()=>setLightboxIndex(null)}/></div>;
};
export default Gallery;

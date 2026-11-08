import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { observeMediaQuery } from '@/lib/mediaQuery';
import { SELECTION_PREVIEW_DURATION_MS, SELECTION_PREVIEW_VISIBLE_RATIO, selectionPreviewAllowed, selectionPreviewSide } from './selectionPreviewPolicy';
import './selection-preview.css';

interface Props {
  gallerySelector: string;
  revision: number;
  image: string;
  label: string;
  announcement: string;
  preloadImages: string[];
}

/** Presentation only: user changes trigger previews, never purchases or automatic scrolling. */
export default function MobileSelectionPreview({ gallerySelector, revision, image, label, announcement, preloadImages }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const galleryVisible = useRef(true);
  const previousRevision = useRef(revision);
  const [visible, setVisible] = useState(false);
  const [side, setSide] = useState<'right' | 'left'>('right');
  const lastTap = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const remember = (e: PointerEvent) => { lastTap.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener('pointerdown', remember, { capture: true, passive: true });
    return () => document.removeEventListener('pointerdown', remember, { capture: true });
  }, []);

  useEffect(() => {
    const gallery = document.querySelector(gallerySelector);
    const header = document.querySelector('header');
    if (!gallery || typeof IntersectionObserver === 'undefined') return;
    let observer: IntersectionObserver | undefined;
    const updateHeader = () => {
      const bottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 100);
      buttonRef.current?.style.setProperty('--preview-top', `${bottom + 8}px`);
      observer?.disconnect();
      observer = new IntersectionObserver(([entry]) => {
        galleryVisible.current = entry ? entry.isIntersecting && entry.intersectionRatio >= SELECTION_PREVIEW_VISIBLE_RATIO : true;
        if (galleryVisible.current) setVisible(false);
      }, { rootMargin: `-${bottom}px 0px 0px 0px`, threshold: [0, 0.2, 0.4, SELECTION_PREVIEW_VISIBLE_RATIO, 0.8, 1] });
      observer.observe(gallery);
    };
    updateHeader();
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeader) : null;
    if (header) resize?.observe(header);
    window.addEventListener('resize', updateHeader);
    const stopMedia = observeMediaQuery(window.matchMedia('(max-width: 767px)'), () => setVisible(false));
    const hideForOverlay = () => { if (document.body.style.overflow === 'hidden') setVisible(false); };
    const mutations = new MutationObserver(hideForOverlay);
    mutations.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => { observer?.disconnect(); resize?.disconnect(); mutations.disconnect(); stopMedia(); window.removeEventListener('resize', updateHeader); };
  }, [gallerySelector]);

  useEffect(() => {
    const warm = () => {
      if (!window.matchMedia('(max-width: 767px)').matches) return;
      preloadImages.forEach(src => { const img = new Image(); img.fetchPriority = 'low'; img.src = src; });
    };
    if (document.readyState === 'complete') warm();
    else window.addEventListener('load', warm, { once: true });
    return () => window.removeEventListener('load', warm);
  }, [preloadImages]);

  useEffect(() => {
    const changed = previousRevision.current !== revision;
    previousRevision.current = revision;
    if (!selectionPreviewAllowed(window.matchMedia('(max-width: 767px)').matches, galleryVisible.current, changed)) return;
    let cancelled = false;
    setVisible(false);
    const top = parseFloat(buttonRef.current?.style.getPropertyValue('--preview-top') || '108');
    setSide(selectionPreviewSide(lastTap.current, window.innerWidth, top));
    const timer = window.setTimeout(() => { cancelled = true; setVisible(false); }, SELECTION_PREVIEW_DURATION_MS);
    const img = new Image();
    img.src = image;
    const reveal = () => { if (!cancelled && !galleryVisible.current && document.body.style.overflow !== 'hidden') setVisible(true); };
    img.decode().then(reveal).catch(() => { /* Never show a broken preview. */ });
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [revision, image]);

  const returnToGallery = () => {
    const gallery = document.querySelector<HTMLElement>(gallerySelector);
    if (!gallery) return;
    gallery.querySelector<HTMLButtonElement>('.mx-thumbnails button, .ap-thumbnails button')?.click();
    const headerBottom = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom ?? 100);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: window.scrollY + gallery.getBoundingClientRect().top - headerBottom - 8, behavior: reduced ? 'instant' : 'smooth' });
    setVisible(false);
  };

  return <><div className="sr-only" aria-live="polite" aria-atomic="true">{visible ? `Vorschau: ${announcement}` : ''}</div><Button ref={buttonRef} variant="outline" className={`selection-preview ${visible ? 'is-visible' : ''} ${side === 'left' ? 'is-left' : ''}`} aria-label={`Vorschau: ${announcement}. Zur Galerie`} aria-hidden={!visible} tabIndex={visible ? 0 : -1} onClick={returnToGallery}><img src={image} width={108} height={120} alt="" decoding="async"/><span>{label}</span></Button></>;
}
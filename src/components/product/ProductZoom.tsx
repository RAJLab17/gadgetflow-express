import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const HOVER_SCALE = 2.5;

export type ZoomImage = { src: string; alt: string };

/**
 * Wraps a main product image: mouse hover shows a 2.5x magnifier inside the
 * same frame (loading the full-resolution file), a click/tap opens the
 * lightbox. No touch handlers, so page scrolling on mobile stays untouched.
 */
export const ZoomFrame = ({
  zoomSrc,
  onOpen,
  children,
  overlayClassName = "absolute inset-0 h-full w-full",
  overlayStyle,
  objectFit = "contain",
  objectPosition = "50% 50%",
  iconStyle,
  label = "Bild vergrössern",
}: {
  zoomSrc: string;
  onOpen: () => void;
  children: ReactNode;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  objectFit?: "contain" | "cover";
  objectPosition?: string;
  iconStyle?: CSSProperties;
  label?: string;
}) => {
  const [origin, setOrigin] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  const overlayReady = origin !== null && loadedSrc === zoomSrc;

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    setOrigin(`${x}% ${y}%`);
  };

  const zoomStyle: CSSProperties = origin
    ? { transform: `scale(${HOVER_SCALE})`, transformOrigin: origin }
    : { transform: "scale(1)" };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ cursor: "zoom-in" }}
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerMove={track}
      onPointerEnter={track}
      onPointerLeave={() => setOrigin(null)}
      onPointerDown={(e) => { down.current = { x: e.clientX, y: e.clientY }; }}
      onClick={(e) => {
        const d = down.current;
        if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return;
        setOrigin(null);
        onOpen();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); }
      }}
    >
      <div className="absolute inset-0" style={{ ...zoomStyle, opacity: overlayReady ? 0 : 1 }}>
        {children}
      </div>
      {origin !== null && (
        <img
          src={zoomSrc}
          alt=""
          aria-hidden
          decoding="async"
          draggable={false}
          onLoad={() => setLoadedSrc(zoomSrc)}
          className={`pointer-events-none ${overlayClassName}`}
          style={{ ...overlayStyle, objectFit, objectPosition, ...zoomStyle, opacity: overlayReady ? 1 : 0 }}
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground opacity-90 shadow-sm"
        style={{ right: 10, bottom: 10, zIndex: 5, ...iconStyle }}
      >
        <Search size={15} strokeWidth={2} />
      </span>
    </div>
  );
};

/** Full-screen lightbox with pinch / double-tap zoom and swipe between images. */
export const ProductLightbox = ({
  open,
  images,
  index,
  onIndexChange,
  onClose,
}: {
  open: boolean;
  images: ZoomImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) => {
  const [scale, setScale] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number; multi: boolean } | null>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;
  const safeIndex = Math.min(Math.max(index, 0), Math.max(count - 1, 0));
  const go = (dir: number) => {
    if (count < 2) return;
    setScale(1);
    onIndexChange((safeIndex + dir + count) % count);
  };
  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goRef.current(1);
      if (e.key === "ArrowLeft") goRef.current(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => setScale(1), [safeIndex, open]);

  if (!open || count === 0) return null;
  const image = images[safeIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[200]"
      style={{ background: "hsl(var(--foreground) / 0.92)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Produktbild vergrössert"
      onPointerDown={(e) => { down.current = { x: e.clientX, y: e.clientY }; }}
      onClick={(e) => {
        const d = down.current;
        if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return;
        if ((e.target as HTMLElement).closest("img,button")) return;
        onClose();
      }}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, multi: e.touches.length > 1 };
      }}
      onTouchMove={(e) => {
        if (touch.current && e.touches.length > 1) touch.current.multi = true;
      }}
      onTouchEnd={(e) => {
        const t = touch.current;
        if (!t || t.multi || scale > 1.01 || e.touches.length > 0) return;
        const dx = e.changedTouches[0].clientX - t.x;
        const dy = e.changedTouches[0].clientY - t.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <TransformWrapper
        key={`${safeIndex}-${image.src}`}
        minScale={1}
        maxScale={5}
        centerOnInit
        doubleClick={{ mode: "toggle", step: 1 }}
        wheel={{ step: 0.2 }}
        panning={{ disabled: scale <= 1.01, velocityDisabled: true }}
        onTransformed={(_, state) => setScale(state.scale)}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={image.src}
            alt={image.alt}
            decoding="async"
            draggable={false}
            className="block select-none object-contain"
            style={{ maxWidth: "100vw", maxHeight: "100svh", width: "auto", height: "auto" }}
          />
        </TransformComponent>
      </TransformWrapper>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Schliessen"
        style={{ background: "hsl(var(--background) / 0.15)" }}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-background transition-opacity hover:opacity-80"
      >
        <X size={26} />
      </button>

      {count > 1 && (
        <>
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              aria-label={dir < 0 ? "Vorheriges Bild" : "Nächstes Bild"}
              className="absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-background transition-opacity hover:opacity-80 md:flex"
              style={{ [dir < 0 ? "left" : "right"]: 24, background: "hsl(var(--background) / 0.15)" }}
            >
              {dir < 0 ? <ChevronLeft size={26} /> : <ChevronRight size={26} />}
            </button>
          ))}
          <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <span key={img.src + i} className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-[18px] bg-background" : "w-1.5 bg-background opacity-40"}`} />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
};

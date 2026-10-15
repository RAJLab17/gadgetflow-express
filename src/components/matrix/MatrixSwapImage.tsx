import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
const identity = (image: ImageProps) => `${image.src}|${image.srcSet ?? ""}|${image.sizes ?? ""}`;

/** Keep the decoded previous image mounted until its replacement is ready. */
export default function MatrixSwapImage(props: ImageProps) {
  const [shown, setShown] = useState(props);
  const [next, setNext] = useState<ImageProps | null>(null);
  const [ready, setReady] = useState(false);
  const latest = useRef(props);
  latest.current = props;
  const wanted = identity(props);
  const current = wanted === identity(shown) ? props : shown;

  useEffect(() => {
    if (wanted === identity(shown)) {
      setNext(null);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    setNext(null);
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "low";
    if (props.sizes) image.sizes = props.sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.onload = async () => {
      try { await image.decode(); } catch { return; }
      if (cancelled || !image.naturalWidth) return;
      const replacement = latest.current;
      setNext(replacement);
      timer = setTimeout(() => {
        if (cancelled) return;
        setShown(replacement);
        setNext(null);
      }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150);
    };
    image.src = props.src ?? "";
    return () => {
      cancelled = true;
      image.onload = null;
      if (timer) clearTimeout(timer);
    };
  }, [wanted, shown]);

  return <>
    <img key={identity(shown)} {...current} data-matrix-swap="shown"
      ref={(image) => { if (image?.complete && image.naturalWidth > 0 && !ready) setReady(true); }}
      onLoad={(event) => { setReady(true); current.onLoad?.(event); }}
      style={{ ...current.style, visibility: ready ? "visible" : "hidden" }} />
    {next && <img key={identity(next)} {...next} loading="eager" aria-hidden="true" alt="" data-matrix-swap="incoming"
      className={`${next.className ?? ""} animate-in fade-in duration-150 motion-reduce:animate-none`}
      style={{ ...next.style, position: "absolute" }} />}
  </>;
}
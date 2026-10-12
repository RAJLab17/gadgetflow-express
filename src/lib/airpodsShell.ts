/** Keep the outside-root instant view until the real first gallery image is decoded and visible. */
export function handOffAirpodsShell(): () => void {
  const shell = document.getElementById("__airpods_shell");
  if (!shell) return () => {};
  let cancelled = false;
  let frame = 0;
  const check = async () => {
    if (cancelled) return;
    const hero = document.querySelector<HTMLImageElement>("#root img[data-airpods-hero]");
    if (!hero || !hero.complete || hero.getBoundingClientRect().width === 0) {
      frame = requestAnimationFrame(check);
      return;
    }
    // A failed image must not leave the instant view covering the real page.
    if (!hero.naturalWidth) { shell.remove(); return; }
    try { await hero.decode(); } catch { /* older engines may reject decode for loaded images */ }
    if (cancelled) return;
    // React fades the image in after onLoad; keep the shell until it is fully opaque.
    if (Number(getComputedStyle(hero).opacity) < 1) { frame = requestAnimationFrame(check); return; }
    frame = requestAnimationFrame(() => { if (!cancelled) shell.remove(); });
  };
  frame = requestAnimationFrame(check);
  return () => { cancelled = true; cancelAnimationFrame(frame); shell.remove(); };
}

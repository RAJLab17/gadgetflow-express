/** Keep the outside-root image painted until the real, visible hero is decoded and opaque. */
export function handOffNexusShell(): () => void {
  const shell = document.getElementById("__nexus_shell");
  if (!shell) return () => {};
  let cancelled = false;
  let frame = 0;
  const check = async () => {
    if (cancelled) return;
    const images = document.querySelectorAll<HTMLImageElement>("#mockup-signup img");
    const hero = Array.from(images).find((image) =>
      image.fetchPriority === "high" && image.getBoundingClientRect().width > 0
    );
    if (!hero || !hero.complete || !hero.naturalWidth) {
      frame = requestAnimationFrame(check);
      return;
    }
    try { await hero.decode(); } catch { /* Loaded images on older engines may reject decode. */ }
    if (cancelled) return;
    if (Number(getComputedStyle(hero).opacity) < 1) {
      frame = requestAnimationFrame(check);
      return;
    }
    // A second frame lets header measurement and the responsive title settle first.
    frame = requestAnimationFrame(() => {
      if (!cancelled) shell.remove();
    });
  };
  frame = requestAnimationFrame(check);
  return () => { cancelled = true; cancelAnimationFrame(frame); shell.remove(); };
}
# Architecture rules
- Deduplicate React/ReactDOM and prebundle app-shell providers together in Vite so lazy navigation cannot mix React hook dispatchers from separate dependency generations.
- Product share images use the shared shareImages metadata helper and CDN asset pointers; capture image dimensions, MIME type and alt text in the SEO snapshot so runtime and crawler tags stay identical.
- MATRIX render images share responsive asset mappings between the instant view and React, with route-gated preloads and separate small purchase thumbnails; this prevents duplicate initial downloads and loading full non-selected finishes.

- MATRIX mobile and desktop share selection state and the existing purchase handler; an IntersectionObserver shows the mobile buy bar only after the main button exits above the viewport, avoiding duplicate checkout or tracking logic and first-view obstruction.
- Keep the MATRIX delivery message in a named constant so shipping copy can change independently of the layout.
- Gate MATRIX lifestyle galleries by exact model, case finish and device color on both layouts so photos cannot leak into other selections.
- Serve MATRIX lifestyle photos as optimised WebP with separate thumbnail and mobile sizes; mount only the current viewport gallery, give mobile slides real native-lazy image sources hidden until loaded, and eagerly load the next slide on touch or activation; mandatory snapping with always-stop prevents partial slides and hidden unloaded images prevent broken-image text.
- Subscribe to media-query changes through the shared legacy-compatible observer so older Safari/WebViews cannot crash viewport-dependent rendering.
- Language preferences must remain usable in memory when browser storage is blocked; persistence failures must never prevent the app shell from mounting.
- Never fabricate webkit.messageHandlers or native bridge handlers; third-party scripts must detect real browser capabilities, since fake bridges trigger invalid native Promise calls.
- Load every page module through lazyWithRetry and keep the app shell wrapped in an ErrorBoundary with a non-empty Suspense fallback; storage restrictions must not fail successful imports, and reload recovery requires a persistable guard to prevent loops.
- /matrix paints an interactive static shell before the JS bundle loads; capture model and purchase intent in memory, initialise React selection from it, then replay purchase once through the existing handler and remove the shell on mount, so slow downloads cannot lose taps or duplicate checkout/tracking.
- Generate the MATRIX instant view separately at HTML transform time with the original header logo embedded; this keeps the pre-bundle view independent of React and prevents a delayed logo replacement.
- Insert MATRIX critical CSS immediately after the early viewport meta in the HTML head and keep shell typography/reset rules self-contained; this prevents first-paint scaling and late stylesheet layout shifts.
- Crawler HTML per sitemap route (plus listed non-sitemap duplicates like /dokumente, /auto, /launch, /shop) comes from src/content/prerender-snapshot.json baked in by the raj-prerender Vite plugin (dev + build, <noscript> body, data-rh head tags); re-run scripts/capture-seo-snapshot.py after changing page SEO text, because non-JS crawlers otherwise see stale copy.

- Responsive NEXUS title variants select the sole H1 using the shared media-query observer and render inactive titles as divs; this preserves all breakpoint layouts without duplicate DOM headings.

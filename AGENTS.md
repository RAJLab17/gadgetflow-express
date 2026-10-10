# Architecture rules

- MATRIX mobile and desktop share selection state and the existing purchase handler; an IntersectionObserver shows the mobile buy bar only after the main button exits above the viewport, avoiding duplicate checkout or tracking logic and first-view obstruction.
- Keep the MATRIX delivery message in a named constant so shipping copy can change independently of the layout.
- Gate MATRIX lifestyle galleries by exact model, case finish and device color on both layouts so photos cannot leak into other selections.
- Load every page module through lazyWithRetry and keep the app shell wrapped in an ErrorBoundary with a non-empty Suspense fallback; storage restrictions must not fail successful imports, and reload recovery requires a persistable guard to prevent loops.
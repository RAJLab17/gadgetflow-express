# Architecture rules

- MATRIX mobile and desktop share selection state and the existing purchase handler; an IntersectionObserver shows the mobile buy bar only after the main button exits above the viewport, avoiding duplicate checkout or tracking logic and first-view obstruction.
- Keep the MATRIX delivery message in a named constant so shipping copy can change independently of the layout.
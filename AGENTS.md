# Architecture rules

- MATRIX mobile and desktop share selection state and the existing purchase handler; responsive ordering and a button observer avoid duplicate checkout or tracking logic.
- Keep the MATRIX delivery message in a named constant so shipping copy can change independently of the layout.
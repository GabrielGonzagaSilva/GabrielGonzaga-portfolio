# Portfolio Design Contract

Source of truth: Figma `Portifolio-2` (`zXO8NQEP325ucJ2hVvcOCE`).

## Visual identity
- Dark-only base: `#171412` with near-black depth.
- Primary text: `#F5F2EF`; secondary text: `#B6AAA2`.
- Copper atmosphere: `#D95832`, `#A63B26`, `#6A2019`, selective `#FF7A3D`.
- Albert Sans is the sole type family.
- Atmospheric gradients are background material, not foreground decoration.
- Glass is reserved for navigation, metadata and insight callouts.

## Layout
- Maximum content width: `1296px`.
- Reference gutters: Compact 16, Mobile 20, Tablet 48, Desktop 72, Wide 96.
- Web implementation is fluid between those references; do not hard-switch between fixed mockups.
- Desktop grids collapse naturally on mobile rather than being scaled down.

## Typography
- Display: 80px desktop, 40px compact, fluid with `clamp()`.
- Case H1: 64px desktop, 38px compact.
- Section H2: 40px desktop, 28px compact.
- Body remains at least 16px on mobile.
- Weight usage: Regular 400, Medium 500; italic Medium for editorial statements.

## Interaction and accessibility
- Mobile navigation collapses to a MENU trigger below 768px.
- Interactive targets are at least 44px high on touch layouts.
- All focusable elements must have a visible `:focus-visible` treatment.
- `prefers-reduced-motion` disables non-essential motion.
- Filters use buttons + `aria-pressed` and never rely on color alone for meaning.

## Content status
Some projects and copy are intentionally provisional. Do not invent metrics or public URLs. Replace only when confirmed.

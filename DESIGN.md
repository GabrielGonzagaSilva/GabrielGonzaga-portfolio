# Portfolio Design Contract

Source of truth: Figma `Portifolio-2` (`zXO8NQEP325ucJ2hVvcOCE`). The web implementation must preserve the Figma hierarchy and atmosphere rather than reinterpret it as a generic dark landing page.

## Visual identity
- Dark-only base: near-black `#0D0B0A` / `#171412` depth.
- Primary text: `#F5F2EF`; secondary text: `#B6AAA2`.
- Copper atmosphere: `#D95832`, `#A63B26`, `#6A2019`, selective `#FF7A3D`.
- Albert Sans is the sole type family.
- Atmospheric gradients are page material: asymmetric, organic and restrained, with a dark visual center and copper light entering from edges.
- Grain is subtle and global; it must never compete with content.
- Glass is reserved for navigation, case metadata, filters and insight callouts. Standard content should not be over-carded.

## Layout
- Maximum content width: `1296px`.
- Reference gutters: Compact 16, Mobile 20, Tablet 48, Desktop 72, Wide 96.
- Header, sections and footer share the same content axes.
- Web implementation is fluid between references; do not scale fixed desktop mockups down.
- Desktop grids collapse structurally on mobile rather than becoming compressed miniatures.
- Section separators remain thin and full-width while content stays inside the central container.

## Portrait
- One canonical portrait asset is shared by Home and About.
- Desktop portrait width is capped around `320px`; Tablet around `300px`; Mobile can fill the content column up to `350px`.
- Frame ratio is `6 / 7`, `object-fit: cover`, approximately `42%` vertical focal point, `12px` radius.
- Black-and-white treatment is non-destructive in CSS with grayscale; the source image remains color.

## Typography
- Display: 80px Desktop, 56px Tablet, 40px Mobile/Compact.
- Case H1: 64px Desktop, ~52px Tablet, 38px Mobile.
- Statement: 56px Desktop, 40px Tablet, 30px Mobile.
- Section H2: 40px Desktop, 34px Tablet, 28px Mobile.
- Body remains at least 16px for primary reading copy on Mobile.
- Weight usage: Regular 400 and Medium 500; italic Medium is reserved for editorial statements.
- Large type is used sparingly. Section hierarchy must never compete with the hero.

## Surfaces and components
- Project cards use a quiet surface with 12px radius and minimal border; no decorative shadow stack.
- Internal project media uses 8px radius.
- Filter chips use 44px touch height, 52px minimum width on Mobile and content-driven width otherwise.
- Capability and principle panels are segmented surfaces only where grouping helps comprehension.
- Hover states are subtle and must not move the layout materially.

## Responsive behavior
- Mobile navigation collapses to a MENU trigger below 768px.
- Profile content stacks vertically on Mobile.
- Project grids collapse from 2 columns to 1.
- Process rows become vertical reading blocks rather than compressed tables.
- Case metadata becomes one segmented vertical container on Mobile.
- Case product visual and insight callouts reflow into a vertical composition.
- No horizontal scrolling is required for primary content at 320px.

## Interaction and accessibility
- Interactive targets are at least 44px high on touch layouts.
- All focusable elements have visible `:focus-visible` treatment.
- `prefers-reduced-motion` disables non-essential motion.
- Filters use buttons + `aria-pressed` and never rely on color alone for meaning.
- Images reserve geometry through intrinsic dimensions/aspect ratio.

## Content status
Some projects and copy are intentionally provisional. Do not invent metrics or public URLs. Replace only when confirmed.

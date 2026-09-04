# Portfolio Design Contract

Source of truth: Figma `Portifolio-2` (`zXO8NQEP325ucJ2hVvcOCE`). The web implementation must preserve the Figma hierarchy, spacing logic, surfaces and atmosphere rather than reinterpret it as a generic dark landing page.

The user has approved two explicit implementation refinements relative to the current Figma frames: display titles should be slightly quieter, and prominent full-width section divider rules should not appear in the website. These are deliberate product decisions, not permission to redesign other elements.

## Visual identity
- Dark-only base: `#171412` with near-black depth around `#0B0A09`.
- Primary text: `#F5F2EF`; secondary text: `#B6AAA2`.
- Copper atmosphere: `#D95832`, `#A63B26`, `#6A2019`, selective `#FF7A3D`.
- Albert Sans is the sole type family.
- Atmospheric light is page material: asymmetric, organic and restrained, with a dark visual center and copper light entering from edges.
- Grain is subtle and global; it must never compete with content.
- Glass is reserved for navigation, case metadata, filters and insight callouts. Standard content must not be over-carded.
- Do not add decorative gradients, glows, cards or pseudo-elements that are absent from the approved composition.

## Layout
- Maximum content width: `1296px`.
- Reference gutters: Mobile 20, Tablet 48, Desktop 72, Wide 96.
- Header, sections and footer share the same content axes on every route.
- Desktop header height: 76px. Mobile: 68px.
- Desktop footer height: 88px. Tablet: 80px. Mobile: 72px.
- Web implementation is fluid between references; do not scale fixed desktop mockups down.
- Desktop grids collapse structurally on Mobile rather than becoming compressed miniatures.
- Do not use full-width section divider rules in the website. Hierarchy comes from spacing, atmosphere, typography and grouped surfaces. Thin internal separators are allowed only inside scan-heavy structures such as process, timeline and tabular metadata.

## Portrait
- The user-supplied `foto.svg` is the canonical portrait source. Do not replace it with a WebP/JPG substitute or a recreated illustration.
- The same canonical asset must be used anywhere Gabriel's portrait appears.
- Home Desktop reference: 320 × 382px, radius 12px.
- Home Mobile reference: full content width, 350 × 420px at 390px viewport, radius 12px.
- About Desktop reference: 480 × 560px, radius 12px.
- About Mobile: full content column with the same visual proportion and controlled crop.
- The portrait-to-copy gap must stay intentionally compact; avoid empty half-column space between the media and text.
- Any monochrome treatment must be non-destructive and must not alter the source SVG.

## Typography
- User-approved web display cap: approximately 66px Desktop rather than the current 80px Figma display size.
- Page H1: up to ~66px Desktop, ~50px Tablet, 36px Mobile.
- Case H1: up to ~56px Desktop, ~46px Tablet, 34px Mobile.
- Home identity subtitle: approximately 26–32px Desktop and ~21px Mobile.
- Home editorial statement: approximately 40–50px Desktop; 30px Mobile.
- Section H2 generally sits around 30–36px Desktop and ~25–26px Mobile.
- Body remains at least 16px for primary reading copy on Mobile.
- Weight usage: Regular 400 and Medium 500; italic is reserved for editorial statements.
- Large type is used sparingly. Section hierarchy must never compete with the hero.

## Shared shell
- Header, navigation, MENU trigger and footer are one visual system, not page-specific variants in code.
- Desktop nav: 14/18 Albert Sans Medium, 24px item gap, 16px horizontal / 8px vertical padding, 20px radius, subtle glass fill and 24px backdrop blur.
- Mobile MENU: 48px height, 16px horizontal / 12px vertical padding, 20px radius, 14/20 type.
- Brand is 14/18 Desktop and 14/20 Mobile.
- A route may change content and atmospheric distribution, but must not change shared shell dimensions.

## Surfaces and components
- Project cards use a quiet surface with 12px radius and no decorative shadow stack.
- Internal project media uses 8px radius.
- Filter chips use 44px touch height and 52px minimum width on Mobile; Desktop is content-driven.
- Principles remain one segmented grouped panel where the Figma groups them.
- Experience capabilities remain one grouped surface where the Figma groups them.
- Case metadata remains one segmented glass bar on Desktop and one segmented vertical container on Mobile.
- CTAs must not be converted into invented gradient cards.
- Hover states are subtle and must not move the layout materially.

## Responsive behavior
- Mobile navigation collapses to a MENU trigger below 768px.
- Profile content stacks vertically on Mobile.
- Project grids collapse from 2 columns to 1.
- Process rows become vertical reading blocks rather than compressed tables.
- Case metadata becomes one segmented vertical container on Mobile.
- Case product visual and insight callouts reflow into a vertical composition.
- No horizontal scrolling is required for primary content at 320px.
- Desktop, Tablet and Mobile are behavioral references, not three fixed canvases.

## Interaction and accessibility
- Interactive targets are at least 44px high on touch layouts.
- All focusable elements have visible `:focus-visible` treatment.
- `prefers-reduced-motion` disables non-essential motion.
- Filters use buttons + `aria-pressed` and never rely on color alone for meaning.
- Images reserve geometry through CSS/intrinsic dimensions to avoid layout shift.
- Active route state is exposed with `aria-current="page"`.

## Implementation discipline
- Figma is reference, not inspiration. Do not make unsolicited visual changes while implementing.
- When an approved design element exists, reproduce it before abstracting it.
- Shared rules belong in shared CSS/JS. Page-specific CSS may only express genuinely page-specific composition.
- `assets/polish.css` is restricted to explicitly approved exceptions and cross-route normalization. It must not become a second independent design system.
- Before release, compare Home, Work, About, Experience and Case Study against their Figma references at Desktop, Tablet and Mobile widths.

## Content status
Some projects and copy are intentionally provisional. Do not invent metrics or public URLs. Replace only when confirmed.

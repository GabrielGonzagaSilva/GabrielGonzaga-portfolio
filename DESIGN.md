# Gabriel Gonzaga Portfolio — Blue Master Design Contract

This document is the canonical design-system source for the portfolio implementation and its Figma file. It replaces the previous warm/copper visual contract.

## North star

A Product Designer portfolio with editorial art direction, product precision and a sophisticated technological atmosphere.

The experience must communicate **clarity + product + systems + craft**. It should feel dark, moody, precise, restrained, cinematic and systems-oriented without becoming a generic SaaS, AI, Web3, cyberpunk, agency or template aesthetic.

The existing product remains the structural source of truth: real content, routes, cases, assets, behavior and validated UX are preserved. The Blue Master system defines visual language, atmosphere, hierarchy, type, depth, motion and component craft.

## Experience modes

- **Homepage — Experience mode:** expressive, atmospheric and memorable. Its jobs are positioning, craft signal, selected work and case entry.
- **Cases — Editorial mode:** evidence-first, documentary and reading-oriented. Atmospheric treatment recedes around real artifacts and long-form content.
- **About / Experience / Work index — Utility-editorial mode:** clear scanning, strong typographic hierarchy and restrained atmosphere.

Never apply the same intensity of effects to every route.

## Palette

### Core surfaces
- `background/obsidian` — `#05070B`
- `background/soft` — `#080B11`
- `surface/panel` — `#0D1118`
- `surface/elevated` — `#111824`
- `surface/deep` — `#0A121D`
- `surface/deep-blue` — `#0B2D50`
- `surface/cobalt` — `#0C4E8C`

### Text and information
- `text/primary` — `#F4F7FB`
- `text/secondary` — `#9AA9B9`
- `text/tertiary` — `#718398`
- `brand/signature-blue` — `#6F9FFF`
- `brand/sky` — `#83D2FF`
- `brand/ice` — `#CFE8FF`
- `state/success` — `#80D47A`
- `state/focus` — `#A9DCFF`

### Lines
- `line/default` — `rgba(207,226,255,.16)`
- `line/subtle` — `rgba(207,226,255,.09)`

Blue is primarily **light, depth, information, interaction and orientation**, not a flat accent fill. Large solid-blue areas require an explicit information or composition purpose.

## Typography

### Primary
`"Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif`

### Utility / metadata only
`"SFMono-Regular", Consolas, "Liberation Mono", monospace`

Rules:
- Headings: Avenir Next, 400–500 weight, controlled line-height, tracking down to approximately `-0.04em`.
- Display type is used sparingly and should not cause mobile compression.
- Body: 16–18px desktop reference, line-height 1.45–1.65, controlled reading measure.
- Monospace is reserved for dates, categories, technical labels, metadata and compact system indicators. It is never decorative “tech typography”.
- Avoid excessive bold. Hierarchy comes from scale, rhythm, whitespace and contrast.

## Layout and grid

- Maximum content width: `1540px`.
- Canonical gutter: `clamp(20px, 4.5vw, 72px)`.
- Header and footer align to the same content axes as page content.
- Compositions may be asymmetrical, but alignment must remain deliberate.
- Related elements stay close; unrelated groups receive materially more space.
- Do not create automatic heading → paragraph → card stacks for every section.
- Use negative space as a first-class structural device.

### Responsive references
- Wide desktop: `1440px+`
- Laptop: around `1280px`
- Tablet: `768–1024px`
- Mobile: `320–430px`

Responsive behavior is compositional, not scaled-down desktop. Mobile reduces atmospheric intensity, reorganizes grids, controls display type and preserves touch/readability.

## Spacing

Canonical spacing scale:
- `space/1` — 4px
- `space/2` — 8px
- `space/3` — 12px
- `space/4` — 16px
- `space/5` — 20px
- `space/6` — 24px
- `space/8` — 32px
- `space/10` — 40px
- `space/12` — 48px
- `space/16` — 64px
- `space/20` — 80px
- `space/24` — 96px
- `space/30` — 120px
- `space/32` — 128px

Use the scale relationally; do not force every layout into uniform spacing.

## Radius

- `radius/sm` — 12px
- `radius/md` — 16px
- `radius/lg` — 24px
- `radius/pill` — 999px, only for genuine compact tags/status controls.

Do not round every surface. A container exists only when content benefits from grouping.

## Lighting

Lighting is a central identity layer.

Allowed:
- broad radial gradients;
- diffuse blue environmental light;
- restrained halos and bloom;
- smooth transitions across black, navy and blue;
- occasional reflected blue on dark material.

Rules:
- Prefer **light → atmosphere → content** over object → glow.
- No neon aura, gamer glow, button glow or arbitrary colored shadow.
- Lighting must not reduce text contrast or compete with case evidence.
- Cases use substantially less atmospheric intensity than the homepage.

## Depth

Depth should feel physical and restrained:
- broad soft black shadows;
- subtle inner highlights;
- tonal surface separation;
- borders only where needed;
- occasional reflected blue.

Avoid automatic combinations of border + blur + gradient + shadow. Use the minimum mechanism required for hierarchy.

## Motion

- One authored entrance moment: **Hero Load**.
- After the hero, use only local interaction feedback and subtle ambient movement.
- Allowed: opacity, transform, controlled blur/clip, ambient light shift and hover depth.
- Avoid repeated scroll reveal choreography.
- Avoid layout-affecting animation.
- `prefers-reduced-motion: reduce` disables non-essential motion and smooth scrolling.
- Primary easing: `cubic-bezier(.16,1,.3,1)`.

## Shared shell

### Header
- Height reference: 64–72px desktop; 60–64px mobile.
- Dark translucent surface with functional, restrained blur.
- 1px subtle lower line when needed for separation.
- Gabriel Gonzaga is the primary identity.
- Navigation: Work/Projects, About, Résumé and Contact according to the route language/content already in use.
- Availability may appear as metadata/status, never as the dominant CTA.
- Mobile receives its own navigation composition; desktop navigation is not simply squeezed.

### Footer
- Uses the same grid/gutter as the header and content.
- Editorial and low-noise; no decorative icon-card treatment.

## Component rules

Reusable masters should cover:
- Header
- Footer
- Featured Project Preview
- Secondary Project Preview
- Metadata
- Tags/Pills
- Buttons
- Text Links
- Media Frame
- Case Navigation
- Case Metadata
- Editorial Section Header

Every interactive component must define default, hover, focus-visible, active and touch behavior. Critical information cannot depend on hover.

### Project previews
- Homepage previews are entry points, not mini case studies.
- Use project name, context/type, year, one concise line, essential categories, one real/relevant artifact and case CTA.
- Do not use three identical cards when hierarchy differs.
- A full route receives featured treatment; summary-only work must not visually imply an unavailable full case.

### Case pages
Cases are editorial documents, not SaaS landing pages. Adapt the sequence to the evidence available:
Case Hero → Context → Problem → Role/Responsibility → Discovery/Process → Key Decisions → Explorations → Solution → Validation → Outcome/Current State → Learnings → Next Case.

Do not invent missing stages.

## Evidence rules

Evidence outranks decoration. Prefer real:
- screens and prototypes;
- Figma artifacts;
- wireframes and flows;
- architecture and diagrams;
- components, tokens, variants and documentation;
- research, iterations and discarded directions.

Never invent metrics, results, users, tests, screenshots, dashboards or data. Confidential evidence may be cropped, anonymized, selectively blurred or structurally reconstructed without fabricating outcomes.

## Accessibility

Target: **WCAG 2.2 AA**.

Mandatory:
- semantic HTML and logical heading hierarchy;
- real alt text;
- visible `:focus-visible`;
- skip link;
- keyboard-complete navigation;
- minimum 44px touch targets where applicable;
- reduced motion;
- zoom/reflow support;
- accessible labels;
- ARIA only where semantics do not already provide the behavior;
- no information communicated only through color or hover.

## Performance

- Prefer transforms/opacity over layout animation.
- Use broad gradients sparingly instead of stacking many blur filters.
- Reserve image geometry to avoid CLS.
- Lazy-load below-the-fold media where appropriate.
- Use responsive image assets and WebP/AVIF where the source pipeline supports them.
- Keep font loading controlled; local/system fallbacks must remain usable.

## SEO and professional portfolio rules

Each public route should have:
- specific `<title>`;
- meta description;
- canonical URL;
- Open Graph metadata when available;
- shareable individual case URLs;
- semantic `<article>` structure for case studies where appropriate;
- favicon/social preview/sitemap when supported by the static site.

## Anti-patterns

Do not use as a default:
- glassmorphism;
- generic bento grids;
- gradient text;
- purple gradients;
- neon or button glow;
- AI blobs or orbit animations;
- floating cards;
- excessive pills;
- fake dashboards or fake metrics;
- generic icon cards;
- huge radius everywhere;
- nested cards;
- decorative grids without information purpose;
- Web3/cyberpunk/AI-SaaS aesthetics;
- identical reveal animation on every section;
- Unicode/emoji as visual icons;
- visual elements with no communicative role.

## Implementation discipline

- Figma, CSS, components and this document must use the same values and semantics.
- Shared design rules belong in shared CSS/components, not route-specific overrides.
- Page CSS only expresses genuine page composition.
- Eliminate legacy visual values after migration; do not leave copper/Albert-Sans tokens active alongside Blue Master tokens.
- `polish.css` must be removed once its valid behavior is consolidated; it must not remain a second design system.
- Existing routes, content, functionality, accessibility behavior and real assets are preserved unless a change is explicitly documented.
- Before release, compare Figma and implementation at desktop, tablet, mobile and 320px and verify keyboard, focus, reduced motion, overflow, images, fonts, routes and interactive states.

## Current content status

The current portfolio contains two fully navigable case studies (Aureum Hub and QuantoLab) plus real summary-level work for Design System and AI Governance. The redesign must preserve that evidence hierarchy. Summary-only work must not be presented as a fabricated full case until real case content exists.

# Gabriel Gonzaga — Product Design Portfolio

Blue Master implementation of Gabriel Gonzaga's Product Design portfolio.

## Public routes
- `/` — Home
- `/work/` — Work index
- `/work/aureum-hub/` — Aureum Hub case study
- `/work/quantolab/` — QuantoLab case study
- `/about/` — About
- `/experience/` — Experience

## Stack
Zero-build static HTML, CSS and JavaScript deployed through GitHub Pages. The implementation intentionally avoids a framework while the portfolio remains content-led and relatively small.

## Design system
`DESIGN.md` is the canonical implementation contract. The visual direction is **Blue Master**: obsidian/navy surfaces, controlled blue environmental light, Avenir Next in production with system fallbacks, editorial hierarchy and restrained motion.

The Figma file mirrors the same system through Blue Master color, spacing and radius variables plus responsive masters for navigation, header, footer, project cards and case metadata. Avenir Next is not available in the connected Figma environment, so Inter is documented as the design-file proxy only.

## Evidence rules
- Aureum Hub is documented through product context, decisions, process, safeguards and current state. Confidential operational screens are not replaced with fictional UI.
- QuantoLab uses real captures from the live product.
- Tourism Design System and AI Governance are presented as summary-level systems work until full public case evidence exists.
- No adoption, conversion or business-impact metrics are invented.

## Local preview
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173/`.

## QA
Browser QA lives in `qa/` and covers responsive geometry, overflow and critical portfolio routes through Playwright. The GitHub workflow runs the same checks on pull requests and the main branch.

## GitHub Pages
The repository is static and Pages-ready. Production is published from the repository's configured Pages workflow.

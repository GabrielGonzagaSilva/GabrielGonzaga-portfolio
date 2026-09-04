# Gabriel Gonzaga — Portfolio V1

First coded version of the portfolio translated from the current Figma design.

## Routes
- `/` — Home
- `/work/` — Work
- `/work/aureum-hub/` — Aureum Hub case study
- `/about/` — About
- `/experience/` — Experience

## Stack
Zero-build static HTML/CSS/JavaScript. This keeps the first version easy to publish on GitHub Pages and avoids adding framework dependencies before the content and asset set are final.

## Local preview
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173/`.

## Design implementation
The interface is driven by CSS custom properties and fluid layout rules rather than fixed 390/1024/1440 screenshots. See `DESIGN.md`.

## V1 known content/asset gaps
- Email, LinkedIn and résumé URLs are not yet confirmed, so the visual labels are present without fake links.
- Additional case-study imagery is still placeholder content.
- The included portrait is a high-resolution 1254×1254 web export of the user-provided source and is rendered in grayscale non-destructively through CSS.
- EN/PT is visually retained but localization is not active yet.

## GitHub Pages
This repository is static and Pages-ready. In repository Settings → Pages, select deployment from the `main` branch and `/ (root)` folder if Pages is not already enabled.

# Future Archive

**Code, cast in chrome.** A React gallery of MichaelWave369's first 18 retrofuturist repository art prints, preserved across three six-print volumes.

**GitHub Pages destination:** https://michaelwave369.github.io/FutureArchive/ — publication requires the one-time Pages setup below and a successful deployment.

## Explore

- All 18 full-size artworks, with 320px and 640px browsing images included in this repository.
- Project descriptions, GitHub links, and GitHub Pages links where available.
- React search, category and volume filters, and an accessible native-dialog artwork viewer.
- Previous/next and arrow-key navigation, image downloads, and shareable print links.
- Static pre-rendering: the whole collection and its direct links remain visible before JavaScript loads.
- Responsive layouts, descriptive alternatives, reduced-motion support, and keyboard focus handling.
- Dustin's original GLO concept credit is preserved in the print, gallery card, and viewer.
- BrainC and PhiCade are local applications, with setup links instead of invented Pages destinations.

This GitHub edition is separate from the existing Sites edition. Its source and all artwork bytes live here; it does not depend on a private Site to deliver images.

## Run locally

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open the printed local address, including `/FutureArchive/`.

```sh
npm test
npm run build
node scripts/verify-dist.mjs
npm run preview
```

Optional browser checks:

```sh
npx playwright install chromium
npm run test:e2e
```

## Publish on GitHub Pages

1. Open **Settings → Pages**: https://github.com/MichaelWave369/FutureArchive/settings/pages
2. Under **Build and deployment**, choose **Source: GitHub Actions**.
3. Open **Actions → Build and deploy Future Archive → Run workflow**, using `main`.

The workflow runs catalog tests, builds and pre-renders React, checks all 54 image assets, and runs six browser scenarios before publication. It needs no custom secrets or paid hosting. If Pages has not been configured, deployment waits with a setup notice; a green build alone is not a claim that the site is live.

Vite's base is explicitly `/FutureArchive/`. Artwork, download URLs, and share links use the same path, including its capitalization. There is no SPA history router or required server rewrite.

## Add or edit a print

Edit `src/catalog.json`, then add the matching artwork to `public/artworks/` in three sizes: `NN-project.webp` at 1024×1536, `NN-project-320.webp` at 320×480, and `NN-project-640.webp` at 640×960. Keep collection numbering and contributor credits consistent. Update collection-wide copy and validation expectations when expanding beyond the first 18 prints.

`artwork-provenance.json` records the original generated PNG filenames and SHA-256 hashes. The original PNGs remain unchanged in the preserved artwork collection; this repository contains their WebP derivatives. Creative direction: Michael “Mikey” Hughes. Artwork created with AI image-generation tools on 16 October 2026. The prints imagine project themes; descriptions are grounded in repository content.

Project destinations are recorded in `project-link-sources.json`; external availability may change. No additional artwork license is asserted.

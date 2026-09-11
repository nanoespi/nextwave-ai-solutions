# Naerix portfolio website

An independent Astro application for the Naerix parent brand, created with Mason's web design skill. [Design direction, seed, and content decisions](DESIGN_DIRECTION.md).

The original site remains in the repository root with its files unchanged. This folder is the complete new application; work is isolated on `design/naerix-portfolio`. The existing site's hosting, repository main branch, DNS, and deployment are untouched.

## Run locally

From this `naerix/` folder, using Node 24.19 (the tested version):

```powershell
npm.cmd ci
npm.cmd run dev
```

Open **http://127.0.0.1:4322**. The original root app retains its original commands. To use the new app from the repository root, run `npm.cmd --prefix naerix run dev`.

## Routes

| Route | Content |
| --- | --- |
| `/` | Parent-company homepage, businesses, approach, and values |
| `/about/` | Company story, values, and clearly labeled founder placeholders |
| `/contact/` | Proposed contact addresses, labeled as coming soon |
| `/catherine-ai/` | Sage-green coming-soon announcement |
| `/brickwise/` | Copper facilities-management coming-soon announcement |
| Unknown paths | Branded 404 recovery page |

Jonesboro Sage links to its public domain in a new tab. Its design reference is the approved public-data library preview; its deployment is independent of this app.

## Structure

```text
src/
  components/
    layout/     BaseLayout, Header, Footer
    sections/   Hero, Businesses, Approach, Values, ComingSoon
    ui/         Arrow, Logo, BusinessArt
    motion/     Sculpture
  data/         businesses.json, nav.json
  lib/          Shared sculpture projection and geometry
  pages/        index, about, contact, catherine-ai, brickwise, 404
  styles/       tokens.css, global.css
public/
  fonts/        Existing licensed fonts and compressed WOFF2 copies
  images/       Unmodified source logo assets
tests/          Playwright flow, accessibility, navigation, and motion checks
```

Astro static output, TypeScript, Tailwind CSS v4, scoped CSS, and JSON content follow the original project conventions. Native semantic HTML handles the simple UI. No product backend, email collection, authentication, or paid service is included.

The hero sculpture visibly rotates and includes Pause/Resume controls. Reduced-motion preferences keep it static initially, with a Play control available for an explicit choice. Rendering stops when paused, offscreen, or in a hidden tab. Without JavaScript, the server-rendered artwork remains visible and static.

## Verification

```powershell
npm.cmd run check
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd test
```

Tests serve the built site on loopback port **4323**, separately from the development preview. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an already-installed Chromium executable; it is not required on a normal Playwright installation.

The suite checks all five pages at **1440, 768, 390, and 320px**, including axe WCAG A/AA rules, horizontal overflow, console errors, internal routes and anchors, coming-soon scope, explicit placeholders, 404 recovery, keyboard navigation, pause/resume, reduced motion, and operation without JavaScript. Automated accessibility checks do not replace a screen-reader or real-device review.

Verified September 10, 2026: `astro check` reported zero errors, warnings, or hints; the static build generated six pages; **all 17 Playwright tests passed** in Chromium, with zero axe violations at the four tested widths. The original app's tracked files remain unchanged.

## Later content and launch work

Replace the three illustrative founder slots with approved content. Confirm and activate the proposed contact mailboxes. Extend the two product pages when their content is ready. Canonical metadata already targets `naerix.com`; search indexing remains disabled during this preview. The domain, social sharing artwork, indexability, email links, and hosting configuration can be completed for launch after visual review. Build output is `naerix/dist/`.

No changes to the original site's deployment are needed to review this local app.

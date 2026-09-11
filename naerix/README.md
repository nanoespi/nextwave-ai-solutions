# Naerix portfolio website — version 2

An independent Astro application for the Naerix parent brand, created with Mason's web design skill. [Design direction, seed, and content decisions](DESIGN_DIRECTION.md).

The original site remains in the repository root with its files unchanged. This folder is the complete version 2 application on the `v2` branch. The repository's `main` branch retains the original site at `ab3dd0ab3e8c7e5207afe8a162899b90c7cfe156`; the `v1.0.0` tag preserves that source revision. Version 2 is released as `v2.0.1` and targets **https://nextwaveaisolutions.com**. The initial launch revision is also retained as `v2.0.0`.

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

## Deployment and rollback

Cloudflare Pages project: `nextwave-ai-solutions`. This is an existing Direct Upload project; GitHub pushes alone do not deploy it. Its production branch is `v2`. Build and deploy **from this `naerix/` directory** so the original root application's Functions are not included:

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd run build
npm.cmd test
npx.cmd wrangler pages deploy dist --project-name nextwave-ai-solutions --branch v2
```

Authenticate Wrangler through Cloudflare or a scoped local `CLOUDFLARE_API_TOKEN`. Never commit credentials. A different branch name creates a preview deployment. Both the apex and `www` domains remain attached to the existing Pages project and serve the site. Canonicals, Open Graph URLs, and the sitemap use `nextwaveaisolutions.com`. Production crawling is enabled; Cloudflare marks preview deployments with its `X-Robots-Tag: noindex` header.

The original app's `_redirects` file contains an absolute-host source rule that Cloudflare Pages does not support. Version 2 omits that ineffective rule. A future server-side `www` redirect should use a Cloudflare zone redirect rule; current deployment credentials do not grant access to this domain's zone rules. Both hostnames were verified serving the new site.

The previous live site remains available at **https://df03b93c.nextwave-ai-solutions.pages.dev** (deployment `df03b93c-da68-4602-9d7c-90c76b0e8bbe`). To restore it, open this Pages project's Deployments in Cloudflare and select **Rollback to this deployment** for that deployment. Rollback restores the deployed site without changing Git history. Keep that deployment; do not delete it. To resume version 1 development, use `main` and the original root app. The previous upload was marked dirty, so its immutable deployment is the exact live reference; the Git tag preserves the committed source baseline.

## Later content

Replace the three illustrative founder slots with approved content. Confirm and activate the proposed contact mailboxes. Extend the two product pages when their content is ready. Custom social sharing artwork and any future move to `naerix.com` remain separate work. Build output is `naerix/dist/`.

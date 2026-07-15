# NextWave AI Solutions — CLAUDE.md

This file is the persistent project brief for Claude Code. Read it completely at the start of every session before touching any file.

---

## What this project is

The marketing website for **NextWave AI Solutions, LLC** — an AI automation firm serving local service businesses, built in Jonesboro, AR. The site is a single-page landing page (index.astro) built on Astro with Tailwind CSS. It is now complete enough to deploy.

**Current state of the codebase:**
- All 10 sections of index.astro are built (Header, Hero, Features, How It Works, Testimonials, Pricing, FAQ, Final CTA, Footer, Chat Widget)
- EmergentOrder particle system is implemented in src/components/motion/EmergentOrder.astro
- Brand tokens are in src/styles/tokens.css
- Content data lives in src/data/ (nav.json, features.json, pricing.json, testimonials.json, faq.json)
- Astro content collections are scaffolded in src/content/ (blog, case-studies, services) but pages do not yet exist

**Deployment target: Cloudflare Pages.** Not Vercel.

**Current phase: Launch Prep.** The goal of this phase is to get the site live on a real URL with working CTAs and basic analytics. Nothing else.

---

## Brand system

The full brand design system is at `NextWave_AI_Solutions_Brand_Design.json` in the project root. Read it before making any visual decision. Key rules that must never be violated:

- Primary surface: `#F4F1EA` (bone). Hero and final CTA sections: `#0A0E1A` (ink).
- Accent color: `#D4FF3D` (Voltage). Appears exactly three times per page as a primary element. Never as a background surface except a single card.
- Font: General Sans (Fontshare CDN) throughout. No serif. No system-default sans fallback in rendered output.
- No electric blue, purple, neon glows, or decorative gradients. Ever.
- No em dashes in any copy. Use periods, colons, semicolons, or parentheses.
- No hype language. See the `voiceAndTone.avoid` list in the brand JSON.
- Buttons: `buttonVoltage` for the single primary CTA per section. `buttonPrimary` (ink) for secondary actions. `buttonGhost` for tertiary.
- Motion: all transitions use `cubic-bezier(0.16, 1, 0.3, 1)`. Standard duration 0.6s. Slow 1.2s. Fast 0.25s. Respect `prefers-reduced-motion` everywhere.

---

## Phase 2 tasks: Launch Prep

Complete these tasks in order. Do not move to a later task until the current one is verified working.

---

### Task 1: Cloudflare Pages deployment configuration

**Goal:** The site deploys cleanly to Cloudflare Pages on every push to main.

**Steps:**

1. Confirm `astro.config.mjs` has the correct output mode. For a fully static site with no server-side rendering, use:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  site: 'https://nextwaveaisolutions.com',
});
```

If the domain is not yet connected, use a placeholder: `https://nextwave-ai.pages.dev`. Update it once the custom domain is live.

2. Create `_headers` at the project root (Cloudflare Pages uses this file for response headers, not a JSON config):

```
/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

3. Create `_redirects` at the project root. For a static Astro site this is minimal, but include it for future-proofing:

```
# Redirect www to apex (configure apex in Cloudflare DNS)
https://www.nextwaveaisolutions.com/* https://nextwaveaisolutions.com/:splat 301
```

4. Confirm `package.json` has the correct scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

5. In the Cloudflare Pages dashboard (done manually by the developer, not by Claude Code):
   - Connect the GitHub repo
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: set to 18 or 20 in environment variables (`NODE_VERSION=20`)

6. Confirm `.gitignore` includes `dist/` and `node_modules/`.

7. Move the `_headers` and `_redirects` files into the `public/` directory. Astro copies everything in `public/` to `dist/` at build time, which is where Cloudflare Pages expects them.

8. Add a `README.md` at the project root with:
   - Project name and purpose
   - Local dev command (`npm run dev`)
   - Build command (`npm run build`)
   - Deployment: Cloudflare Pages, connected to main branch
   - Note that `NextWave_AI_Solutions_Brand_Design.json` is the design system source of truth
   - Note that `CLAUDE.md` is the AI session brief

**Verification:** `npm run build` completes with zero errors. The `dist/` directory exists and contains `index.html`, `_headers`, and `_redirects`.

---

### Task 2: Sitemap generation

**Goal:** `/sitemap-index.xml` and `/sitemap-0.xml` are generated at build time and accessible in production.

**Steps:**

1. Install the Astro sitemap integration:

```bash
npx astro add sitemap
```

2. Confirm `astro.config.mjs` is updated automatically by the add command to include the sitemap integration. It should look like:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  integrations: [tailwind(), sitemap()],
  site: 'https://nextwaveaisolutions.com',
});
```

The `site` property is required for sitemap generation. If the custom domain is not live yet, use the Cloudflare Pages preview URL (e.g. `https://nextwave-ai.pages.dev`).

3. After build, verify that `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist.

4. Add a `<link rel="sitemap" href="/sitemap-index.xml" />` tag inside the `<head>` of `src/components/layout/BaseLayout.astro`.

**Verification:** After `npm run build`, open `dist/sitemap-0.xml` and confirm it contains the index page URL.

---

### Task 3: Analytics integration

**Goal:** Plausible Analytics is tracking pageviews in production. Plausible is chosen over GA4 because it is privacy-first (no cookies, no GDPR banner required), lightweight (< 1KB script), and aligns with the brand's peer-level positioning.

**Steps:**

1. In `src/components/layout/BaseLayout.astro`, add the Plausible script inside `<head>`. Use an environment variable for the domain so it only fires in production:

```astro
---
const isProd = import.meta.env.PROD;
const plausibleDomain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN;
---

{isProd && plausibleDomain && (
  <script
    defer
    data-domain={plausibleDomain}
    src="https://plausible.io/js/script.js"
  />
)}
```

2. Create `.env.local` at the project root (this file must be in `.gitignore`):

```
PUBLIC_PLAUSIBLE_DOMAIN=nextwaveaisolutions.com
```

3. Create `.env.example` at the project root (this IS committed to git):

```
PUBLIC_PLAUSIBLE_DOMAIN=your-domain-here.com
PUBLIC_CAL_LINK=your-cal-link-here
```

4. In Cloudflare Pages dashboard (done manually by the developer, not by Claude Code): go to Settings > Environment variables and add `PUBLIC_PLAUSIBLE_DOMAIN` set to the production domain. Set it for the Production environment only so analytics do not fire on preview deployments.

5. Add a custom event helper to `src/lib/analytics.ts` for tracking CTA clicks:

```ts
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  if (!(window as any).plausible) return;
  (window as any).plausible(name, { props });
}
```

6. In `ChatWidget.astro`, import and call `trackEvent('Chat Widget Opened')` when the widget opens.

7. On every CTA button that links to the booking tool, add a `data-track` attribute and wire up a click handler via a small inline script in BaseLayout that reads all `[data-track]` elements and calls `trackEvent`.

**Verification:** In local dev (`npm run dev`), the Plausible script does NOT load (because `import.meta.env.PROD` is false in dev). In a production build served locally (`npm run preview`), the script tag is present in the HTML source. No console errors.

---

### Task 4: CTA booking integration (Cal.com)

**Goal:** Every "Book a Diagnostic Call" and "Book a Free Diagnostic Call" CTA button on the page opens a Cal.com booking modal inline, without redirecting away from the site. Cal.com is chosen over Calendly because it has a generous free tier, an open-source embed SDK, and cleaner visual integration.

**Steps:**

1. Install the Cal.com embed SDK by adding it to `BaseLayout.astro` inside `<head>`:

```html
<script async src="https://app.cal.com/embed/embed.js"></script>
```

2. Add a `PUBLIC_CAL_LINK` environment variable to `.env.local`:

```
PUBLIC_CAL_LINK=nextwave-ai/diagnostic
```

This value should match the Cal.com username and event slug once the Cal.com account is created. Use a placeholder until then.

3. In `BaseLayout.astro`, add a global init script after the embed script:

```html
<script>
  window.addEventListener('load', function () {
    if (!window.Cal) return;
    Cal("init", { origin: "https://app.cal.com" });
    Cal("ui", {
      theme: "dark",
      styles: {
        branding: {
          brandColor: "#D4FF3D"
        }
      },
      hideEventTypeDetails: false
    });
  });
</script>
```

4. Update every primary CTA button that currently links to `#` or `/contact` to use the Cal.com data attributes:

```html
<button
  data-cal-link="nextwave-ai/diagnostic"
  data-cal-config='{"layout":"modal"}'
  data-track="CTA Clicked"
  class="btn-voltage"
>
  Book a Free Diagnostic Call
</button>
```

Apply this to: the hero CTA ("Start a Diagnostic"), the pricing tier CTAs ("Start a Diagnostic"), and the final CTA section button ("Book a Free Diagnostic Call"). The nav "Book a Call" button also gets this treatment.

5. The chat widget's fallback link ("Book a Diagnostic Call" in the response tree) should also open the Cal modal. Add a click handler to that link that calls `Cal('modal', { calLink: 'nextwave-ai/diagnostic' })` instead of navigating.

6. Do NOT add a separate `/contact` page in this phase. The Cal.com modal is the contact mechanism for now.

**Verification:** Clicking any CTA button triggers the Cal.com modal overlay. The modal uses dark theme with Voltage (`#D4FF3D`) as the brand color. No full-page redirects occur.

---

### Task 5: robots.txt and basic meta

**Goal:** The site has correct robots.txt, a canonical meta tag, OG meta tags, and a page title that matches the brand.

**Steps:**

1. Update `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://nextwaveaisolutions.com/sitemap-index.xml
# Update the above URL to your Cloudflare Pages domain if the custom domain is not yet live
```

2. In `BaseLayout.astro`, ensure the `<head>` contains:

```astro
---
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'NextWave AI Solutions — Serious AI. Built locally.',
  description = 'We build AI automation systems for local service businesses. Missed revenue recovered. Processes systematized. Built in Jonesboro, AR.',
  ogImage = '/images/og/og-default.png',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />

  <!-- OG -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, Astro.site)} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="NextWave AI Solutions" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(ogImage, Astro.site)} />

  <!-- Fonts -->
  <link rel="preconnect" href="https://api.fontshare.com" />
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" />

  <!-- Sitemap -->
  <link rel="sitemap" href="/sitemap-index.xml" />
</head>
```

3. Create a placeholder OG image at `public/images/og/og-default.png`. For now, this can be a 1200x630 solid ink rectangle with the wordmark centered in bone text -- generate it programmatically with a simple Node script, or use Figma. It does not need to be elaborate for launch.

**Verification:** Running `npm run build` and checking the generated `dist/index.html` source shows correct title, description, canonical, and OG tags.

---

## What is explicitly out of scope for this phase

Do not build any of the following until all five tasks above are verified:

- /about, /services, /contact, /blog pages
- Claude API integration for the chat widget
- Contact form backend
- Structured data / LocalBusiness schema
- OG image generation pipeline
- Core Web Vitals audit
- Case study pages

These are Phase 3 (Additional Pages) and Phase 4 (Real Integrations). They have their own CLAUDE.md briefs.

---

## File locations to know

| File | Purpose |
|---|---|
| `NextWave_AI_Solutions_Brand_Design.json` | Design system source of truth. Read before any visual decision. |
| `src/styles/tokens.css` | CSS custom properties derived from brand JSON |
| `src/styles/global.css` | Global resets and base styles |
| `src/components/layout/BaseLayout.astro` | `<head>`, fonts, scripts, global wrappers |
| `src/components/layout/Header.astro` | Fixed nav with CTA |
| `src/components/motion/EmergentOrder.astro` | Canvas particle system |
| `src/data/*.json` | Section content (features, pricing, FAQs, testimonials) |
| `.env.local` | Local environment variables (not committed) |
| `.env.example` | Env variable template (committed) |
| `public/_headers` | Cloudflare Pages response headers (cache, security) |
| `public/_redirects` | Cloudflare Pages redirect rules |

---

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build to dist/
npm run preview    # serve dist/ locally to verify production build
npx astro check   # TypeScript and Astro type checking
```

---

## Non-negotiable rules for every session

1. Run `npx astro check` before declaring any task complete. Zero type errors.
2. Run `npm run build` before declaring any task complete. Zero build errors.
3. Never hardcode the Cal.com link as a string literal in component files. Always use `import.meta.env.PUBLIC_CAL_LINK`.
4. Never load the Plausible script in development. Check `import.meta.env.PROD`.
5. Never use em dashes in any copy you write or modify.
6. Never add a color, gradient, or animation that is not traceable to a token in `tokens.css` or a spec in the brand JSON.
7. If you are unsure whether a visual decision matches the brand, read the brand JSON again before proceeding.

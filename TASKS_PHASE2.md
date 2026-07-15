# NextWave AI Solutions - Phase 2 Task List (Launch Prep)

This is the single source of execution truth for launching the site. It is a thin index: each
task points back to the relevant "Phase 2 tasks: Launch Prep" section of `CLAUDE.md` and to keys
in `NextWave_AI_Solutions_Brand_Design.json`. Those two files remain the design and spec source of
truth. This file only tells you what to ship next, in what order, and how to verify it.

Phase 1 (building the 10 page sections) is complete. Its execution log is archived in `TASKS.md`
(T01 through T24). Do not edit `TASKS.md`. All Phase 2 work is tracked here.

---

## Session Protocol (read this first, every session)

You may be a fresh model with no memory of prior work. Follow these steps exactly:

1. Read `CLAUDE.md` (already loaded into context), specifically the "Phase 2 tasks: Launch Prep"
   section and the "Non-negotiable rules for every session" list. Open
   `NextWave_AI_Solutions_Brand_Design.json` before any visual decision.
2. Scan the Task Table below. Pick the lowest-numbered task that is not done (`[ ]`) and whose
   dependencies are all done (`[x]`). That is your task. Do only that one.
3. Build only the files listed under that task's `Deliverables`. Do not scope-creep into later
   tasks. The "What is explicitly out of scope for this phase" list in `CLAUDE.md` is gating.
4. Run the gates: `npm run build` exits 0 and `npm run check` (astro check) reports 0 errors.
   All acceptance criteria in the task's `Tests` must hold.
5. Only if everything passes: flip the task's status from `[ ]` to `[x]` and fill the `Done note`
   with the files you touched. Then stop.
6. Never mark a task done if build or check fails.
7. Voice rule for any prose you write into files or copy: sentence case, no em dashes, no emoji,
   no hype language (see the brand JSON `voiceAndTone.avoid` list). Use periods, colons,
   semicolons, or parentheses in place of em dashes.

Batching note: build one task per turn by default. Only build multiple tasks in a single pass if
the user explicitly tells you to.

### Two spec drifts in CLAUDE.md (do not copy its snippets verbatim)

The `CLAUDE.md` Phase 2 snippets were written against an earlier setup. The repo has since moved
on. Honor the repo, not the snippet, in these two cases:

1. Tailwind. CLAUDE.md Task 1 and Task 2 show `import tailwind from '@astrojs/tailwind'`. The repo
   runs Tailwind v4 through the Vite plugin `@tailwindcss/vite` (see `astro.config.mjs`:
   `vite: { plugins: [tailwindcss()] }`). Any task that edits `astro.config.mjs` must preserve
   that Vite plugin block and only add integrations alongside it. Never downgrade to
   `@astrojs/tailwind`.
2. Deployment target. `README.md` currently says "Deployment: Vercel". The real target is
   Cloudflare Pages. Task L1 corrects this.

---

## Dependency Graph

```
L1 (Cloudflare config) ──> L2 (Sitemap) ──> L5 (robots + meta)
        │
        └──> L3 (Analytics) ──> L4 (Cal.com CTAs)
```

Rationale: L1 lands the deploy config and the `.env.local` / `.env.example` convention that L3 and
L4 both read from. L2 precedes L5 because robots.txt references the sitemap URL and BaseLayout gains
the sitemap link. L3 precedes L4 because both edit the BaseLayout `<head>` and both attach
attributes to the same CTA buttons; sequencing avoids churn.

---

## Task Table (status at a glance)

| ID  | Task                          | Deps | Status |
|-----|-------------------------------|------|--------|
| L1  | Cloudflare Pages config       | none | [ ]    |
| L2  | Sitemap generation            | L1   | [ ]    |
| L3  | Plausible analytics           | L1   | [ ]    |
| L4  | Cal.com booking CTAs          | L3   | [ ]    |
| L5  | robots.txt and launch meta    | L2   | [ ]    |

---

## Tasks

### L1 - Cloudflare Pages deployment config                     Status: [ ]
Deps: none
Spec: `CLAUDE.md` Phase 2 "Task 1: Cloudflare Pages deployment configuration".
Deliverables:
- `public/_headers` (cache and security headers, exact contents from CLAUDE.md Task 1 step 2)
- `public/_redirects` (www to apex, exact contents from CLAUDE.md Task 1 step 3)
- `README.md` (deployment section fix)
Do:
- Confirm `astro.config.mjs` already has `output: 'static'` and `site` set (it does). Keep the
  existing `vite: { plugins: [tailwindcss()] }` block untouched. See spec-drift note 1.
- Create `_headers` and `_redirects` inside `public/` (Astro copies `public/` into `dist/` at
  build, which is where Cloudflare Pages reads them). Do not place them at the repo root.
- Update `README.md`: change "Deployment: Vercel" to Cloudflare Pages connected to the main
  branch, build command `npm run build`, output directory `dist`, `NODE_VERSION=20`.
- Verify `.gitignore` already covers `dist/`, `node_modules/`, and `.env*` (it does). No change
  needed unless something is missing.
Tests:
- `npm run build` exits 0; `npm run check` reports 0 errors.
- After build, `dist/_headers` and `dist/_redirects` both exist.
Done note: ____

### L2 - Sitemap generation                                     Status: [ ]
Deps: L1
Spec: `CLAUDE.md` Phase 2 "Task 2: Sitemap generation".
Deliverables:
- `astro.config.mjs` (add sitemap integration), `package.json` / lockfile (new dependency)
- `src/components/layout/BaseLayout.astro` (sitemap link in head)
Do:
- Run `npx astro add sitemap`. Confirm the resulting config keeps
  `vite: { plugins: [tailwindcss()] }` and adds `sitemap()` to `integrations`. See spec-drift
  note 1. The existing `site` value is what the sitemap uses.
- Add `<link rel="sitemap" href="/sitemap-index.xml" />` to the BaseLayout `<head>` (it is not
  there yet).
Tests:
- After `npm run build`, `dist/sitemap-index.xml` and `dist/sitemap-0.xml` both exist, and
  `dist/sitemap-0.xml` contains the index page URL.
- build and check clean.
Done note: ____

### L3 - Plausible analytics                                    Status: [ ]
Deps: L1
Spec: `CLAUDE.md` Phase 2 "Task 3: Analytics integration".
Deliverables:
- `src/lib/analytics.ts` (`trackEvent` helper, exact shape from CLAUDE.md Task 3 step 5)
- `.env.local` (gitignored, `PUBLIC_PLAUSIBLE_DOMAIN`), `.env.example` (committed template)
- `src/components/layout/BaseLayout.astro` (PROD-guarded Plausible script plus a `[data-track]`
  click delegation script)
- `src/components/ui/ChatWidget.astro` (call `trackEvent('Chat Widget Opened')` on open)
Do:
- Head script must be gated on `import.meta.env.PROD` and the presence of
  `import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN` so it never loads in dev.
- The delegation script reads every `[data-track]` element and calls `trackEvent` with the
  attribute value on click.
Tests:
- In `npm run dev` the Plausible script does not appear in the page source.
- In a `npm run preview` build the script tag is present. No console errors.
- build and check clean.
Done note: ____

### L4 - Cal.com booking CTAs                                    Status: [ ]
Deps: L3
Spec: `CLAUDE.md` Phase 2 "Task 4: CTA booking integration (Cal.com)". Brand JSON:
`colorTokens.voltagePrimary` (`#D4FF3D` is the modal brand color).
Deliverables:
- `src/components/layout/BaseLayout.astro` (Cal embed script plus `Cal("init")` / `Cal("ui")`
  init with dark theme and brandColor `#D4FF3D`)
- `.env.local` / `.env.example` (add `PUBLIC_CAL_LINK`)
- Every CTA that currently points at `#contact` or a raw Cal URL, converted to the Cal modal
Do:
- Drive the link from `import.meta.env.PUBLIC_CAL_LINK`. Never hardcode the Cal link as a string
  literal in a component (CLAUDE.md non-negotiable rule 3).
- Convert these CTAs: `Header.astro` lines 19 and 42 (`Book a Call`), `Hero.astro` line 25
  (`Start a Diagnostic`), `Pricing.astro` line 58 (per-tier CTA, `href="#contact"`),
  `FinalCTA.astro` line 21 (`Book a Free Diagnostic Call`, currently `href="https://cal.com"`),
  and `Footer.astro` line 35 (`Book a Diagnostic`).
- For the `ChatWidget.astro` fallback link (line 366, `Book a Diagnostic Call`), attach a click
  handler that calls `Cal('modal', { calLink: ... })` instead of navigating.
- The `FinalCTA` section keeps `id="contact"` so any in-page anchors still resolve; only the CTA
  behavior changes.
- Do not add a `/contact` page. The modal is the contact mechanism for this phase.
Tests:
- Clicking any converted CTA opens the Cal modal overlay (dark theme, voltage brand color) with
  no full-page redirect.
- build and check clean.
Done note: ____

### L5 - robots.txt and launch meta                             Status: [ ]
Deps: L2
Spec: `CLAUDE.md` Phase 2 "Task 5: robots.txt and basic meta".
Deliverables:
- `public/robots.txt` (add Allow and `Sitemap:` line)
- `src/components/layout/BaseLayout.astro` (complete the OG and Twitter meta set)
- `public/images/og/og-default.png` (placeholder, 1200x630)
Do:
- robots.txt: keep `User-agent: * / Allow: /` and add
  `Sitemap: https://nextwaveaisolutions.com/sitemap-index.xml` (comment that the host updates if
  the custom domain is not yet live).
- BaseLayout head currently has `og:title`, `og:description`, `og:image` (relative), `og:type`,
  and `twitter:card` only. Add `og:url`, `og:site_name`, and `twitter:title`,
  `twitter:description`, `twitter:image`. Switch `og:image` and `twitter:image` to
  `new URL(ogImage, Astro.site)` so they are absolute. Align the default `title` with the brand
  wordmark line in CLAUDE.md Task 5.
- Create a placeholder OG image (ink `#0A0E1A` field, bone `#F4F1EA` wordmark centered). Generate
  it programmatically or by hand; it does not need to be elaborate for launch.
Tests:
- After `npm run build`, `dist/index.html` source shows correct title, description, canonical, and
  the full OG and Twitter set with absolute image URLs.
- build and check clean.
Done note: ____

---

## Verification Appendix

Commands every task relies on:

- `npm run build` - production build to `dist/`, must exit 0.
- `npm run check` - astro check, must report 0 errors.
- `npm run preview` - serve `dist/` locally to confirm the production build (used to verify that
  the Plausible script and Cal embed appear only in the built output).
- `npm run dev` - local dev server; used to confirm the Plausible script does not load in dev.

Launch smoke checks (run after L5, before declaring the phase done):

- `dist/` contains `index.html`, `_headers`, `_redirects`, `sitemap-index.xml`, `sitemap-0.xml`,
  and `images/og/og-default.png`.
- No CTA on the page links to `#contact` or a raw Cal URL; every one opens the modal.
- The Plausible script is absent from the dev page source and present in the built output.
- Brand gates from `CLAUDE.md` "Non-negotiable rules" still hold: no color, gradient, or animation
  that is not traceable to `tokens.css` or the brand JSON; no em dashes, banned words, or emoji in
  any file changed this phase.

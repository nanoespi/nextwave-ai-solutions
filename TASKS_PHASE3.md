# TASKS — Phase 3: Additional Pages

Working task list for Phase 3 of the NextWave AI Solutions website. Source of
truth for scope and copy is `CLAUDE.md` and `NextWave_AI_Solutions_Brand_Design.json`.
This file is the execution checklist and records the deltas between the CLAUDE.md
spec and the **actual Astro 7 codebase**.

## How to use this file

- Build in strict order: **A → B → C → D → E**. Do not start a page until the
  previous group passes its **Acceptance criteria**.
- Every page uses `BaseLayout.astro` (pass `title` + `description`), includes
  `Header.astro` and `Footer.astro`, opens with an ink-surface hero, and reuses
  `sections/FinalCTA.astro` (do not recreate it).
- Apply `data-reveal` (and optional `data-reveal-delay` in ms) to section
  headlines and card grids. The global observer in `src/lib/scrollReveal.ts` is
  already wired; `SectionHeader.astro` emits these automatically.

### Global brand rules (apply to every task)

- [ ] Voltage (`#D4FF3D`) appears **at most 3 times per page** as a primary element. Count before placing.
- [ ] No em dashes anywhere in copy. Use commas, periods, or "and".
- [ ] No purple, electric blue, neon glow, or decorative gradients.
- [ ] Card radius 8px max. Never 12px/16px.
- [ ] All transitions use `var(--ease-brand)` (`cubic-bezier(0.16, 1, 0.3, 1)`); respect `prefers-reduced-motion`.
- [ ] Fonts: General Sans / JetBrains Mono only (already loaded in BaseLayout). No serif.
- [ ] No horizontal scroll at 375px width.

---

## Task 0 — Component & API mapping reference (read first)

`CLAUDE.md` uses shorthand names (`buttonVoltage`, `cardVoltage`, etc). The real
components take a `variant` prop. Use the **Actual usage** column everywhere.

| CLAUDE.md name        | Actual usage                                   | Source file                          |
|-----------------------|------------------------------------------------|--------------------------------------|
| `buttonPrimary`       | `<Button variant="primary">`                   | `src/components/ui/Button.astro`     |
| `buttonVoltage`       | `<Button variant="voltage">`                   | `src/components/ui/Button.astro`     |
| `buttonGhost`         | `<Button variant="ghost">`                     | `src/components/ui/Button.astro`     |
| (inverse ghost)       | `<Button variant="inverse-ghost">`             | `src/components/ui/Button.astro`     |
| `card` (default)      | `<Card variant="default">`                     | `src/components/ui/Card.astro`       |
| `cardVoltage`         | `<Card variant="voltage">`                     | `src/components/ui/Card.astro`       |
| default Tag           | `<Tag variant="default">`                      | `src/components/ui/Tag.astro`        |
| `tagVoltage`          | `<Tag variant="voltage">`                      | `src/components/ui/Tag.astro`        |
| inverse eyebrow tag   | `<Tag variant="inverse">`                      | `src/components/ui/Tag.astro`        |

Confirmed component APIs:

- **Button.astro** — `variant`: `'primary' | 'voltage' | 'ghost' | 'inverse-ghost'`,
  `size`: `'sm' | 'md'`, `href?`, `class?`, `aria-label?`. Spreads `{...rest}`, so
  Cal.com `data-cal-link` / `data-cal-config` attributes pass straight through.
- **Card.astro** — `variant`: `'default' | 'ink' | 'voltage' | 'outlined'`, `class?`.
- **Tag.astro** — `variant`: `'default' | 'voltage' | 'inverse' | 'artifact'`,
  `artifactType?`: `'DIAGNOSTIC' | 'CHARTER' | 'BRIEF' | 'DASHBOARD' | 'PLAYBOOK' | 'SCALE_KIT'`.
- **SectionHeader.astro** — `eyebrow?`, `headline` (required), `subhead?`,
  `align?`: `'left' | 'center'`, `onDark?`: boolean. Emits `data-reveal` internally.
- **BaseLayout.astro** — `title?`, `description?`, `ogImage?`.

Design tokens available in `src/styles/tokens.css` (used below): `--bg-ink`,
`--bg-bone`, `--bg-bone-warm`, `--ink-on-dark`, `--ink-on-dark-dim`, `--ink-primary`,
`--ink-secondary`, `--ink-tertiary`, `--signal-dim`, `--voltage`, `--voltage-deep`,
`--rule-mid`, `--rule-hairline`, `--max-width-reading` (680px), `--font-sans`, `--font-mono`.

- [ ] Read this table before writing any page. When a task says "voltage button", it means `<Button variant="voltage">`.

---

## Task group A — /about

**File:** `src/pages/about.astro`
**BaseLayout props:** `title="About — NextWave AI Solutions"`,
`description="We're an AI automation firm built in Jonesboro, AR. Local operators, serious systems, straight answers."`

- [ ] **A1. Hero (ink).** Surface `var(--bg-ink)`. Eyebrow `<Tag variant="inverse">Who we are</Tag>`.
  H1 `Built here. Built for this.` in `var(--ink-on-dark)`. Subhead (max-width 560px,
  `var(--ink-on-dark-dim)`): `We are not a software company that discovered local business. We are operators who built the system we wished existed.`
- [ ] **A2. Origin (bone, reading section).** Surface `var(--bg-bone)`. Eyebrow `The story`,
  H2 `Why Jonesboro.`. Single centered column at `var(--max-width-reading)` (680px), **no card, no grid**.
  Use the two paragraphs **verbatim** from CLAUDE.md ("Most AI firms are built in cities..." and
  "Jonesboro has plumbers, roofers...").
- [ ] **A3. Team (bone-warm).** Surface `var(--bg-bone-warm)`. Eyebrow `The team`, H2 `Two builders. One system.`.
  2-col `<Card variant="default">` grid on desktop, 1-col mobile. **No photos.**
  - Card 1: name `Luis 'Nano' Espinoza`, role `<Tag variant="default">Architecture + Systems</Tag>`,
    bio verbatim, caption `Jonesboro, AR` in `var(--ink-tertiary)`.
  - Card 2: name `Jeremy [Last Name]` (placeholder — flag to confirm with client before launch),
    role `<Tag variant="default">Sales + Relationships</Tag>`, bio verbatim, caption `Jonesboro, AR`.
- [ ] **A4. Values (bone).** Surface `var(--bg-bone)`. Eyebrow `How we work`,
  H2 `The things we won't negotiate on.`. 3-col `<Card variant="default">` grid.
  Three cards verbatim: `DIAGNOSTIC FIRST` / `YOU OWN IT` / `PLAIN TERMS`.
- [ ] **A5. Final CTA.** Import and render `sections/FinalCTA.astro`. Do not recreate.

**Acceptance — A**
- [ ] Page renders; no horizontal scroll at 375px.
- [ ] `data-reveal` present on each section headline and both card grids.
- [ ] Voltage element count ≤ 3 (likely only inside FinalCTA — verify).
- [ ] No em dashes in any rendered copy.

---

## Task group B — /services

**File:** `src/pages/services.astro`
**BaseLayout props:** `title="Services — NextWave AI Solutions"`,
`description="AI automation systems for local service businesses. Voice agents, follow-up sequences, intake automation, and more."`

- [ ] **B1. Hero (ink).** Eyebrow `<Tag variant="inverse">What we build</Tag>`,
  H1 `Six systems. One outcome.`, subhead `Every engagement is scoped to the specific leak. These are the systems we build most.`
- [ ] **B2. Services detail (bone).** Alternating two-column rows on desktop (visual/text,
  flipping each row), single column mobile. Visual side = geometric SVG placeholder:
  solid `var(--signal-dim)` rectangle, 8px radius (brand card-radius max), aspect ratio 4:3.
  Each row has: category `<Tag>`, H3 headline,
  two-paragraph body (`var(--ink-secondary)`), a **What you get** list (3–4 plain-text bullets,
  no icons, left-border rule `var(--rule-mid)`), and a `<Button variant="ghost">` CTA
  `Start with a Diagnostic →` wired to the Cal.com modal (`data-cal-link` attribute).
  - Services 1–6 copy verbatim from CLAUDE.md (`LEAD RECOVERY` / `FOLLOW-UP` / `INTAKE` /
    `REPORTING` / `SYSTEMATIZATION` / `SCALE KIT`).
  - Service 6 (`Scale Kit`): use `<Tag variant="voltage">` for the tag **and**
    `<Card variant="voltage">` (thin Voltage border) on the placeholder block only.
- [ ] **B3. Engagement overview (bone-warm).** Eyebrow `How it's scoped`,
  H2 `Every engagement starts with a Diagnostic.`, body verbatim (max-width 680px, centered),
  then `<Button variant="voltage">Book a Free Diagnostic</Button>` (Cal.com modal).
  This is a deliberate Voltage element — count it.
- [ ] **B4. Pricing callout (bone).** Single centered callout, no full pricing table.
  H3 `Pricing starts at $1,500 setup + $500/mo.`, body verbatim (`var(--ink-secondary)`),
  plain text link `See full pricing →` (`var(--ink-primary)`, underline on hover) → `/#pricing`.
- [ ] **B5. Final CTA.** Reuse `sections/FinalCTA.astro`.

**Acceptance — B**
- [ ] All 6 service rows render and alternate correctly on desktop; stack on mobile.
- [ ] Voltage primary elements ≤ 3 total on the page (Service 6 tag/border, the B3 voltage button,
  and whatever FinalCTA uses — count carefully; drop a Voltage use if over 3).
- [ ] Every service CTA opens the Cal.com modal.
- [ ] No em dashes; no horizontal scroll at 375px.

---

## Task group C — /contact

**File:** `src/pages/contact.astro` + backend function.
**BaseLayout props:** `title="Contact — NextWave AI Solutions"`,
`description="Book a free diagnostic call or send us a message. We respond within one business day."`

### Frontend
- [ ] **C1. Hero (ink).** Eyebrow `<Tag variant="inverse">Get in touch</Tag>`,
  H1 `Start with a conversation.`, subhead `Book a 20-minute Diagnostic Call or send a message below. We respond within one business day.`
- [ ] **C2. Two-column layout (bone).** Left = Cal.com **inline** embed (`#cal-embed`,
  `calLink: "nextwave-ai/diagnostic"`, `layout: "month_view"`) with label above
  `BOOK A DIAGNOSTIC CALL` (uppercase, `var(--ink-tertiary)`). Right = contact form with
  label `SEND A MESSAGE`. Single column on mobile (embed first, form below).
- [ ] **C3. Form.** Use a `<div role="form">` (NOT `<form action=...>`). Fields per CLAUDE.md:
  Name (required), Business name (required), Email (required), Phone (optional),
  Message (textarea, 5 rows, required). Submit `<Button variant="primary">Send Message</Button>`
  (ink, NOT voltage — Cal.com is the primary action).
- [ ] **C4. Submit handler.** JS `POST /api/contact` with JSON payload
  `{ name, businessName, email, phone, message }`. On success replace form with
  `Message received. We will respond within one business day.` (no reload). On failure show
  `Something went wrong. Email us directly at hello@nextwaveaisolutions.com` (`var(--ink-secondary)`).
  Handler pattern is in CLAUDE.md (`handleSubmit`).

### Backend (Cloudflare Pages Function)
- [ ] **C5. Create `functions/api/contact.ts`.** `functions/` does not exist yet — create it.
  Use the `onRequestPost` + `onRequestOptions` handlers from CLAUDE.md (Resend API, CORS
  headers, required-field validation, email regex). Env: `RESEND_API_KEY`, `CONTACT_EMAIL`.
- [ ] **C6. Install types.** `npm install --save-dev @cloudflare/workers-types`
  (not currently installed).
- [ ] **C7. tsconfig.** Add `"types": ["@cloudflare/workers-types"]` to `compilerOptions`
  in `tsconfig.json` (no `types` array today).
- [ ] **C8. `.env.example`.** Append `RESEND_API_KEY=re_your_key_here` and
  `CONTACT_EMAIL=hello@nextwaveaisolutions.com` (currently only has Plausible/Cal/Node vars).
- [ ] **C9. (Manual, not code — track only)** Set `RESEND_API_KEY` and `CONTACT_EMAIL` in the
  Cloudflare Pages dashboard, and verify the `noreply@nextwaveaisolutions.com` sender domain in Resend.

**Acceptance — C**
- [ ] `npx wrangler pages dev dist` — submitting the form delivers an email to `CONTACT_EMAIL`.
- [ ] Success state replaces the form without a page reload.
- [ ] Non-200 from the Worker triggers the error state.
- [ ] Cal.com inline embed loads and displays.
- [ ] No em dashes; no horizontal scroll at 375px.

---

## Task group D — /blog (adapted to Astro 7)

> **API note:** The `CLAUDE.md` blog snippets use the legacy Astro content API
> (`type: 'content'`, `post.slug`, `post.render()`), which is **outdated for this
> project's Astro 7**. Use the Content Layer API below instead: the **glob loader**,
> `post.id`, and `render(post)` imported from `astro:content`.

- [ ] **D1. Define the collection in `src/content.config.ts`** (real file location; currently
  `export const collections = {}`). Use the glob loader + the CLAUDE.md Zod schema:

  ```ts
  import { defineCollection, z } from 'astro:content';
  import { glob } from 'astro/loaders';

  const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('NextWave AI Solutions'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
  });

  export const collections = { blog };
  ```

- [ ] **D2. Placeholder post.** Create `src/content/blog/getting-started.md` (folder does not
  exist yet) with the frontmatter from CLAUDE.md (`draft: true`, `featured: false`,
  title "What a missed call actually costs a local service business", author "Luis Espinoza",
  body "This post is coming soon.").
- [ ] **D3. `src/styles/prose.css`.** Create it (missing). Copy the `.prose`-scoped styles
  verbatim from CLAUDE.md.
- [ ] **D4. Blog index `src/pages/blog/index.astro`.**
  BaseLayout `title="Blog — NextWave AI Solutions"`,
  `description="Practical writing on AI automation, local business operations, and building systems that run without you."`.
  Hero (ink): eyebrow `The field notes`, H1 `Practical writing. No filler.`,
  subhead per CLAUDE.md. Body surface `var(--bg-bone)`.
  Fetch: `const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());`.
  If `posts.length === 0` render the empty state (`Posts are coming. Check back soon.`).
  Otherwise 2-col `<Card variant="default">` grid: first tag, date formatted `Jul 1, 2026`
  (`var(--ink-tertiary)`), H3 title, bodySmall description, `Read more →` link.
- [ ] **D5. Blog post `src/pages/blog/[slug].astro`.** Use the Astro 7 API:

  ```astro
  ---
  import { getCollection, render } from 'astro:content';
  import BaseLayout from '../../components/layout/BaseLayout.astro';
  import Header from '../../components/layout/Header.astro';
  import Footer from '../../components/layout/Footer.astro';

  export async function getStaticPaths() {
    const posts = await getCollection('blog', ({ data }) => !data.draft);
    return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
  }

  const { post } = Astro.props;
  const { Content } = await render(post);
  ---
  ```

  Layout: max-width `var(--max-width-reading)` (680px), centered, surface `var(--bg-bone)`.
  Post header: tag(s), H1 title, description (`var(--ink-secondary)`), byline
  `By {author}, {date}` (no em dash, per brand rules).
  Hairline rule, then `<article class="prose"><Content /></article>`. End with a hairline
  rule and a footnote CTA (Cal.com modal): `Want to talk through what this means for your business? Book a free Diagnostic Call.`
- [ ] **D6. Import `prose.css`** into the blog post page (or BaseLayout scoped to blog).
- [ ] **D7. Nav.** Do **not** add `/blog` to `src/data/nav.json` until a non-draft post exists.

**Acceptance — D**
- [ ] `/blog` renders the empty state (only the draft post exists).
- [ ] `/blog/[slug]` 404s cleanly (no non-draft posts → no generated paths).
- [ ] `getEntry`/`render` compile with no legacy-API type errors.
- [ ] `npm run build` succeeds.

---

## Task group E — Nav + cross-cutting

- [ ] **E1. Update `src/data/nav.json`** from hash anchors to full routes per CLAUDE.md:

  ```json
  [
    { "label": "Services", "href": "/services" },
    { "label": "How It Works", "href": "/#how-it-works" },
    { "label": "Pricing", "href": "/#pricing" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ]
  ```

- [ ] **E2. Header active states.** Confirm `Header.astro` highlights the active nav item for
  the new full-route pages (`/about`, `/services`, `/contact`). Adjust its active-link logic
  if it only matched hash anchors before.

**Acceptance — E**
- [ ] All nav links route to the new pages; active state shows on the current page.

---

## Final verification checklist (before declaring Phase 3 complete)

- [ ] `/about` renders correctly, no horizontal scroll at 375px.
- [ ] `/services` renders all 6 service rows; Voltage appears no more than 3 times.
- [ ] `/contact` form submits successfully and shows success state (tested via Wrangler).
- [ ] `/contact` Cal.com inline embed loads and displays.
- [ ] `/blog` renders the empty state when no non-draft posts exist.
- [ ] `/blog/[slug]` 404s cleanly when no posts exist.
- [ ] All new pages have correct `<title>` and `<meta name="description">`.
- [ ] Nav links updated and active states work.
- [ ] `npx astro check` passes with zero errors.
- [ ] `npm run build` completes with zero errors.
- [ ] No purple, electric blue, or gradient colors on any new page.
- [ ] No em dashes in any copy (including the blog byline — see D5).

---

## Out of scope for Phase 3 (do not build)

- Claude API integration for the chat widget (Phase 4).
- Structured data / LocalBusiness schema (Phase 4).
- OG image generation pipeline (Phase 4).
- Core Web Vitals audit (Phase 4).
- Case study pages (Phase 4).
- `/services/[slug]` detail sub-pages (Phase 4 or later).

---

## Open items to confirm with client before launch

- [ ] Jeremy's real last name (About team card placeholder).
- [ ] Resend sender domain `noreply@nextwaveaisolutions.com` verified.
- [ ] Cal.com link slug is `nextwave-ai/diagnostic` (used in the contact inline embed).

# NextWave AI Solutions — CLAUDE.md (Phase 3: Additional Pages)

This file is the persistent project brief for Claude Code. Read it completely at the start of every session before touching any file. Replace the previous CLAUDE.md with this file at the project root.

---

## What this project is

The marketing website for **NextWave AI Solutions, LLC** — an AI automation firm serving local service businesses in Jonesboro, AR. Built on Astro 7 (static output, Content Layer API) + Tailwind 4, deployed to Cloudflare Pages.

**State of the codebase entering Phase 3:**
- `src/pages/index.astro` is complete and live (all 10 sections)
- Cloudflare Pages deployment is configured and live
- Sitemap, Plausible analytics, and Cal.com CTA integration are all working
- `_headers` and `_redirects` are in `public/`
- Brand tokens are in `src/styles/tokens.css`
- Content collections use the Astro 7 Content Layer API: config is at `src/content.config.ts` and currently exports `export const collections = {}` (nothing defined yet)
- `src/data/nav.json` currently uses hash anchors (`#services`, `#about`, `#contact`); Phase 3 replaces these with full-page routes
- No additional pages exist beyond index.astro

**Current phase: Additional Pages.** Build four new pages in order: /about, /services, /contact, /blog. Do not start a later page until the current one passes verification.

---

## Brand system (non-negotiable — read before every visual decision)

Full spec: `NextWave_AI_Solutions_Brand_Design.json` at the project root.

Quick rules:
- Surfaces: bone (`#F4F1EA`) for standard sections, ink (`#0A0E1A`) for hero/emphasis sections on any page
- Voltage (`#D4FF3D`) appears a maximum of three times per page as a primary element. Count before placing it.
- Font: General Sans (Fontshare CDN) throughout. No serif. No em dashes in any copy.
- No electric blue, purple, neon glows, or decorative gradients. Ever.
- No hype language. See `voiceAndTone.avoid` in the brand JSON.
- All transitions use `cubic-bezier(0.16, 1, 0.3, 1)`. Respect `prefers-reduced-motion` everywhere.
- Rounded corners: 8px max on cards. Never 12px or 16px.

---

## Shared layout rules for all new pages

Every new page must:

1. Use `BaseLayout.astro` as the wrapper (inherits head, fonts, analytics, Cal.com SDK)
2. Include `Header.astro` (fixed nav) and `Footer.astro`
3. Begin with a page hero section using `var(--bg-ink)` surface, consistent with the index hero visual language (eyebrow tag, h1 headline, optional subhead)
4. Apply `data-reveal` scroll animation attributes to section headlines and card grids (the `scrollReveal.ts` observer is already wired globally)
5. Use existing UI components from `src/components/ui/` (Button, Card, Tag, SectionHeader) -- do not create new variants unless the brand JSON explicitly supports them
6. Pass a unique `title` and `description` prop to `BaseLayout.astro` for per-page meta tags
7. Be added to `src/data/nav.json` so the header nav link activates

### Component API reference (verified — use these exact props)

The UI components take a `variant` prop. Some instructions below use shorthand names like `buttonVoltage` or `cardVoltage`; those are not real component names. Map them as follows:

| Shorthand used below | Actual usage |
|---|---|
| `buttonPrimary` | `<Button variant="primary">` |
| `buttonVoltage` | `<Button variant="voltage">` |
| `buttonGhost` | `<Button variant="ghost">` |
| inverse ghost button | `<Button variant="inverse-ghost">` |
| `card` / default card | `<Card variant="default">` |
| `cardVoltage` | `<Card variant="voltage">` |
| default Tag | `<Tag variant="default">` |
| `tagVoltage` | `<Tag variant="voltage">` |
| inverse eyebrow tag | `<Tag variant="inverse">` |

Confirmed props:
- **Button.astro** — `variant`: `'primary' | 'voltage' | 'ghost' | 'inverse-ghost'`, `size`: `'sm' | 'md'`, `href?`, `class?`, `aria-label?`. Spreads `{...rest}`, so Cal.com `data-cal-link` / `data-cal-config` attributes pass straight through.
- **Card.astro** — `variant`: `'default' | 'ink' | 'voltage' | 'outlined'`.
- **Tag.astro** — `variant`: `'default' | 'voltage' | 'inverse' | 'artifact'` (`artifactType` for artifact chips).
- **SectionHeader.astro** — `eyebrow?`, `headline` (required), `subhead?`, `align?`, `onDark?`. Emits `data-reveal` automatically.
- **BaseLayout.astro** — `title?`, `description?`, `ogImage?`.

The global scroll observer is `src/lib/scrollReveal.ts` (reads `[data-reveal]` + `[data-reveal-delay]`).

### Known conflicts flagged during sync (resolve before launch)

- **Em dashes in copy: resolved.** The verbatim body copy for /about and /services, the blog byline template, and the placeholder radius have all been corrected in this brief. Remaining em dashes in the file are annotation syntax (`"..." — h2 scale`), page-title separators (`About — NextWave AI Solutions`, matching the existing index page), and one internal email subject line, none of which are website body copy. Keep new copy em-dash free.
- **`@cloudflare/workers-types` is not installed** and `tsconfig.json` has no `types` array yet. Both are handled in the /contact backend steps.
- **`src/styles/prose.css` and the `functions/` directory do not exist yet** and are created in this phase.

---

## Page 1: /about

**File:** `src/pages/about.astro`
**Nav label:** `About`
**Page title:** `About — NextWave AI Solutions`
**Description:** `We're an AI automation firm built in Jonesboro, AR. Local operators, serious systems, straight answers.`

---

### Hero section

Surface: `var(--bg-ink)`

Eyebrow tag: `"Who we are"` — inverse tag style

Headline: `"Built here. Built for this."` — h1 scale, `var(--ink-on-dark)`

Subhead: `"We are not a software company that discovered local business. We are operators who built the system we wished existed."` — body scale, `var(--ink-on-dark-dim)`, max-width 560px

---

### Origin section

Surface: `var(--bg-bone)`

Section eyebrow: `"The story"`

Section headline: `"Why Jonesboro."` — h2 scale

Body copy (two paragraphs, use these verbatim):

Paragraph 1: `"Most AI firms are built in cities, for cities, and priced for companies that can absorb the overhead. We built NextWave AI Solutions because local service businesses in mid-size markets are the ones getting left behind, not for lack of need, but for lack of access."`

Paragraph 2: `"Jonesboro has plumbers, roofers, HVAC contractors, and med spas running on the same broken intake loop: phone rings, voicemail picks up, lead goes cold. We fix that loop. We do it here, with operators we can sit across from, and we build it to run without us in the room."`

Layout: Single column, max-width `var(--max-width-reading)` (680px), centered. No card, no grid. This is a reading section.

---

### Team section

Surface: `var(--bg-bone-warm)`

Section eyebrow: `"The team"`

Section headline: `"Two builders. One system."` — h2 scale

Layout: 2-column card grid on desktop, 1-column on mobile. Use `card` component (default variant).

**Card 1 — Nano:**
- Name: `"Luis 'Nano' Espinoza"`
- Role tag: `"Architecture + Systems"` — default Tag variant
- Bio: `"Seven years of call center operations analytics at scale. Graduate-level AI engineering. The person who designs the system, writes the spec, and makes sure the automation does what it promises."`
- Detail line (caption style, `var(--ink-tertiary)`): `"Jonesboro, AR"`

**Card 2 — Jeremy:**
- Name: `"Jeremy [Last Name]"` — use placeholder, confirm with client before launch
- Role tag: `"Sales + Relationships"` — default Tag variant
- Bio: `"The person local operators actually talk to. Handles discovery, scopes the engagement, and stays in the relationship. Knows the market, knows the people."`
- Detail line: `"Jonesboro, AR"`

No photos. No headshots. The brand spec does not include photography treatment at this stage. Names and roles only.

---

### Values section

Surface: `var(--bg-bone)`

Section eyebrow: `"How we work"`

Section headline: `"The things we won't negotiate on."` — h2 scale

Layout: 3-column card grid, `card` component default variant

Three cards:

1. Tag: `"DIAGNOSTIC FIRST"` / Headline: `"We measure before we propose."` / Body: `"Every engagement starts with a Diagnostic. We identify what you are losing before we ask for anything. If we cannot find recoverable revenue, we say so."`

2. Tag: `"YOU OWN IT"` / Headline: `"The system belongs to you."` / Body: `"Every integration, every playbook, every artifact we produce is yours. We build for your independence. The engagement ends. The system stays."`

3. Tag: `"PLAIN TERMS"` / Headline: `"No jargon, no upsell loop."` / Body: `"We explain every decision in plain language. We scope what is needed. We do not add complexity to justify a higher retainer."`

---

### Final CTA section

Reuse the `FinalCTA.astro` component from the index page. It is already built and correct. Do not recreate it.

---

## Page 2: /services

**File:** `src/pages/services.astro`  
**Nav label:** `Services`  
**Page title:** `Services — NextWave AI Solutions`  
**Description:** `AI automation systems for local service businesses. Voice agents, follow-up sequences, intake automation, and more.`

---

### Hero section

Surface: `var(--bg-ink)`

Eyebrow: `"What we build"`

Headline: `"Six systems. One outcome."` — h1 scale, `var(--ink-on-dark)`

Subhead: `"Every engagement is scoped to the specific leak. These are the systems we build most."` — body scale, `var(--ink-on-dark-dim)`

---

### Services detail section

Surface: `var(--bg-bone)`

Layout: Alternating two-column rows on desktop (image/icon left, text right, then flips). Single column on mobile. No images at this stage -- use a simple geometric SVG placeholder block (solid `var(--signal-dim)` rectangle, 8px radius to respect the brand card-radius max, aspect ratio 4:3) on the visual side of each row.

Six service rows. Each has:
- Tag (capability category)
- Headline (h3 scale)
- Two-paragraph body (bodySmall scale, `var(--ink-secondary)`)
- A `"What you get"` list (three to four bullet points, plain text, no icons, left-border rule in `var(--rule-mid)`)
- A `buttonGhost` CTA: `"Start with a Diagnostic →"`  linking to the Cal.com modal (`data-cal-link` attribute)

**Service 1**
Tag: `"LEAD RECOVERY"` / Headline: `"AI Voice Agent"` /
Body P1: `"An AI voice agent answers every inbound call, qualifies the lead against your criteria, and books the appointment directly into your calendar. After-hours, weekends, high-volume days. It does not miss a call."` /
Body P2: `"Most local service businesses lose between 20 and 40 percent of inbound leads to voicemail or slow response. The voice agent closes that gap in the first week."` /
What you get: `"24/7 inbound call coverage"`, `"Lead qualification against your criteria"`, `"Direct calendar booking"`, `"Call summary and transcript per lead"`

**Service 2**
Tag: `"FOLLOW-UP"` / Headline: `"Automated Follow-Up Sequences"` /
Body P1: `"Sequences that go out in minutes, not days. Text, email, or both. Triggered the moment a lead comes in, stopped the moment they respond. No lead sits cold."` /
Body P2: `"The follow-up sequence is calibrated to your average sales cycle. A roofing estimate follow-up runs differently from an HVAC maintenance reminder. We build it to match."` /
What you get: `"Multi-channel sequences (SMS + email)"`, `"Trigger-based automation (no manual send)"`, `"Auto-stop on response"`, `"Response rate reporting"`

**Service 3**
Tag: `"INTAKE"` / Headline: `"Client Intake Automation"` /
Body P1: `"New clients get a structured intake flow from the moment they book. Forms, documents, pre-appointment instructions, delivered automatically, completed before arrival."` /
Body P2: `"No back-and-forth. No missed paperwork. No front desk chasing signatures the morning of the appointment."` /
What you get: `"Automated intake form delivery"`, `"Document collection and storage"`, `"Pre-appointment instruction sequences"`, `"Completion confirmation to your team"`

**Service 4**
Tag: `"REPORTING"` / Headline: `"Live Performance Dashboard"` /
Body P1: `"A dashboard built for owners, not analysts. Recovered revenue, response rates, call volume, sequence performance, visible at a glance, updated in real time."` /
Body P2: `"We set it up against your baseline in the first week. You know within 30 days exactly what the system recovered."` /
What you get: `"Real-time revenue recovery tracking"`, `"Lead response rate metrics"`, `"System uptime and performance indicators"`, `"Monthly summary delivered to your inbox"`

**Service 5**
Tag: `"SYSTEMATIZATION"` / Headline: `"Process Documentation + Playbook"` /
Body P1: `"We document every decision tree, integration, and workflow the system runs on. Your team gets a Playbook. The system runs without us in the room."` /
Body P2: `"This is the deliverable that makes everything transferable. New hire, new location, new operator. The Playbook makes the system replicable."` /
What you get: `"Full process documentation"`, `"Team training and handoff"`, `"Decision tree maps"`, `"Playbook artifact (yours to keep)"`

**Service 6**
Tag: `"SCALE KIT"` (use `tagVoltage` variant) / Headline: `"Scale Kit"` /
Body P1: `"The final deliverable of an Authority engagement. Every integration documented, every automation packaged, every process mapped for replication. One new location, one new hire, one new operator."` /
Body P2: `"The Scale Kit is not a report. It is a transfer of operational infrastructure."` /
What you get: `"Complete automation stack documentation"`, `"Multi-location readiness assessment"`, `"Operator handoff package"`, `"Replication checklist"`

Use `cardVoltage` treatment on the visual placeholder block for Service 6 only (a thin Voltage border on the geometric placeholder, not the whole row).

---

### Engagement overview section

Surface: `var(--bg-bone-warm)`

Section eyebrow: `"How it's scoped"`

Section headline: `"Every engagement starts with a Diagnostic."` — h2 scale

Body: `"We do not propose a system until we know what you are losing. The Diagnostic is free, takes less than 48 hours, and ends with a straight answer: here is the leak, here is what it costs you, here is what a system would recover."` — body scale, max-width 680px, centered

Button below body: `"Book a Free Diagnostic"` — `buttonVoltage`. This is one of the three Voltage elements on this page. Place it deliberately.

---

### Pricing callout section

Surface: `var(--bg-bone)`

Do not reproduce the full pricing section here. Instead, a single centered callout:

Section headline: `"Pricing starts at $1,500 setup + $500/mo."` — h3 scale

Body: `"Three tiers based on scope. All engagements include a Diagnostic and a Charter before any build work begins."` — bodySmall, `var(--ink-secondary)`

Link: `"See full pricing →"` — plain text link, `var(--ink-primary)`, underline on hover, routes to `/#pricing` (anchor link back to the index page pricing section)

---

### Final CTA

Reuse `FinalCTA.astro`. Do not recreate it.

---

## Page 3: /contact

**File:** `src/pages/contact.astro`  
**Nav label:** `Contact`  
**Page title:** `Contact — NextWave AI Solutions`  
**Description:** `Book a free diagnostic call or send us a message. We respond within one business day.`

---

### Hero section

Surface: `var(--bg-ink)`

Eyebrow: `"Get in touch"`

Headline: `"Start with a conversation."` — h1 scale, `var(--ink-on-dark)`

Subhead: `"Book a 20-minute Diagnostic Call or send a message below. We respond within one business day."` — body scale, `var(--ink-on-dark-dim)`

---

### Contact layout

Surface: `var(--bg-bone)`

Two-column layout on desktop. Left column: Cal.com embed. Right column: contact form. Single column on mobile (Cal.com embed first, form below).

**Left column — Cal.com inline embed:**

Use the Cal.com inline embed (not the modal) here, since this is the dedicated contact page and the full embed is appropriate:

```html
<div id="cal-embed" style="width:100%;min-height:600px;"></div>
<script>
  window.addEventListener('load', function () {
    if (!window.Cal) return;
    Cal("inline", {
      elementOrSelector: "#cal-embed",
      calLink: "nextwave-ai/diagnostic",
      layout: "month_view"
    });
  });
</script>
```

Column label above embed (labelSmall, uppercase, `var(--ink-tertiary)`): `"BOOK A DIAGNOSTIC CALL"`

**Right column — contact form:**

Column label above form: `"SEND A MESSAGE"`

Form fields (use the `input` component spec from the brand JSON throughout):
- Name (text, required, placeholder: `"Your name"`)
- Business name (text, required, placeholder: `"Business name"`)
- Email (email, required, placeholder: `"your@email.com"`)
- Phone (tel, optional, placeholder: `"(870) 000-0000"`)
- Message (textarea, required, 5 rows, placeholder: `"What's costing you the most right now?"`)
- Submit button: `"Send Message"` — `buttonPrimary` (ink). Not Voltage. The Cal.com booking is the primary action; the form is secondary.

Do not use an HTML `<form>` tag with an action attribute. Use a `<div>` with `role="form"` and handle submission via the Cloudflare Worker API endpoint (see backend spec below).

**Success state:** On successful submission, replace the form with: `"Message received. We will respond within one business day."` in body scale, `var(--ink-primary)`. No page reload.

**Error state:** On failure, show: `"Something went wrong. Email us directly at hello@nextwaveaisolutions.com"` in bodySmall, `var(--ink-secondary)`.

---

### Contact form backend: Cloudflare Worker + Resend

**Why this stack:** The site is already on Cloudflare. A Worker handles the form POST at the edge with zero cold starts, zero separate infrastructure, and stays within the same Cloudflare dashboard. Resend handles transactional email delivery with a clean API and 3,000 free emails per month.

**Steps:**

1. Create `functions/api/contact.ts` at the project root. Cloudflare Pages Functions use the `functions/` directory automatically -- no separate Worker deployment needed.

```ts
interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
}

interface ContactPayload {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const payload: ContactPayload = await context.request.json();

    // Basic validation
    if (!payload.name || !payload.businessName || !payload.email || !payload.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NextWave AI Website <noreply@nextwaveaisolutions.com>',
        to: [context.env.CONTACT_EMAIL],
        reply_to: payload.email,
        subject: `New message from ${payload.name} — ${payload.businessName}`,
        text: `
Name: ${payload.name}
Business: ${payload.businessName}
Email: ${payload.email}
Phone: ${payload.phone || 'Not provided'}

Message:
${payload.message}
        `.trim(),
        html: `
<p><strong>Name:</strong> ${payload.name}</p>
<p><strong>Business:</strong> ${payload.businessName}</p>
<p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
<p><strong>Phone:</strong> ${payload.phone || 'Not provided'}</p>
<hr>
<p><strong>Message:</strong></p>
<p>${payload.message.replace(/\n/g, '<br>')}</p>
        `.trim(),
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Email delivery failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('Worker error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
```

2. Add environment variables to Cloudflare Pages dashboard (done manually, not by Claude Code):
   - `RESEND_API_KEY` — from the Resend dashboard after creating an account at resend.com
   - `CONTACT_EMAIL` — the inbox where form submissions should land (e.g. `hello@nextwaveaisolutions.com`)

3. Add to `.env.example`:
```
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=hello@nextwaveaisolutions.com
```

4. In `contact.astro`, wire the form submit handler:

```js
async function handleSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const payload = {
    name: document.getElementById('name').value,
    businessName: document.getElementById('business-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value,
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      document.getElementById('contact-form').innerHTML =
        '<p style="font-size:1rem;color:var(--ink-primary)">Message received. We will respond within one business day.</p>';
    } else {
      throw new Error('Failed');
    }
  } catch {
    document.getElementById('form-error').style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
}

document.getElementById('contact-form').addEventListener('submit', handleSubmit);
```

5. Install the Cloudflare Pages type definitions for local development:

```bash
npm install --save-dev @cloudflare/workers-types
```

Add to `tsconfig.json` compilerOptions:
```json
"types": ["@cloudflare/workers-types"]
```

**Verification:** Submit the contact form in a local Wrangler dev session (`npx wrangler pages dev dist`) and confirm the email arrives at `CONTACT_EMAIL`. Confirm the success state replaces the form without a page reload. Confirm the form shows the error state if the Worker returns a non-200.

---

## Page 4: /blog

**File:** `src/pages/blog/index.astro` and `src/pages/blog/[slug].astro`  
**Nav label:** `Blog` (add to nav only after at least one post exists -- leave out of nav for now)  
**Page title:** `Blog — NextWave AI Solutions`  
**Description:** `Practical writing on AI automation, local business operations, and building systems that run without you.`

---

### Content collection setup

The content config exists at `src/content.config.ts` and currently exports `export const collections = {}`. Astro 7 uses the Content Layer API, so define the blog collection with the `glob` loader (not the legacy `type: 'content'` API):

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

Create a placeholder draft post at `src/content/blog/getting-started.md`:

```markdown
---
title: "What a missed call actually costs a local service business"
description: "Most operators guess at the number. We measured it. Here is the math."
publishDate: 2026-07-01
author: "Luis Espinoza"
tags: ["lead recovery", "local business", "diagnostics"]
draft: true
featured: false
---

This post is coming soon.
```

Setting `draft: true` means it will not appear in production listings. It exists to confirm the content collection compiles correctly.

---

### Blog index page (`/blog`)

Surface: `var(--bg-bone)`

**Page hero:**
Surface: `var(--bg-ink)`
Eyebrow: `"The field notes"`
Headline: `"Practical writing. No filler."` — h1 scale, `var(--ink-on-dark)`
Subhead: `"AI automation, local business operations, and building systems that run without you."` — body scale, `var(--ink-on-dark-dim)`

**Post listing:**

```astro
---
import { getCollection } from 'astro:content';
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
---
```

If `posts.length === 0`, render an empty state:

```html
<div style="text-align:center; padding: 80px 0; color: var(--ink-tertiary);">
  <p style="font-size:1rem;">Posts are coming. Check back soon.</p>
</div>
```

When posts exist, render a 2-column card grid using the `card` component. Each card shows:
- Tag (first tag from the post's tags array, default Tag variant)
- Publish date (caption style, `var(--ink-tertiary)`, formatted as `"Jul 1, 2026"`)
- Post title (h3 scale, `var(--ink-primary)`)
- Description (bodySmall, `var(--ink-secondary)`)
- `"Read more →"` plain text link

---

### Blog post page (`/blog/[slug]`)

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../components/layout/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
// Astro 7 Content Layer: use render(post) and post.id, not post.render() / post.slug
const { Content } = await render(post);
---
```

Post layout:
- Max-width: `var(--max-width-reading)` (680px), centered
- Surface: `var(--bg-bone)`
- Post header: tag(s), title (h1 scale), description (body scale, `var(--ink-secondary)`), byline (caption: `"By {author}, {date}"`, `var(--ink-tertiary)`; no em dash, per brand rules)
- Hairline rule below header
- Body content styled via `src/styles/prose.css` (create this file -- see prose styles below)
- End of post: hairline rule, then a `calloutFootnote` component: `"Want to talk through what this means for your business? Book a free Diagnostic Call."` with a Cal.com modal trigger link

**Create `src/styles/prose.css`** for blog post body content. All selectors scoped under `.prose`:

```css
.prose {
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--ink-primary);
}

.prose h2 {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink-primary);
  margin: 2.5em 0 0.75em;
}

.prose h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--ink-primary);
  margin: 2em 0 0.5em;
}

.prose p {
  margin: 0 0 1.5em;
  color: var(--ink-secondary);
}

.prose strong {
  font-weight: 600;
  color: var(--ink-primary);
}

.prose a {
  color: var(--ink-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose a:hover {
  color: var(--voltage-deep);
}

.prose ul, .prose ol {
  margin: 0 0 1.5em 1.25em;
  color: var(--ink-secondary);
}

.prose li {
  margin-bottom: 0.4em;
}

.prose blockquote {
  border-left: 2px solid var(--voltage);
  margin: 2em 0;
  padding: 0.5em 0 0.5em 1.5em;
  color: var(--ink-secondary);
  font-size: 1.0625rem;
}

.prose hr {
  border: none;
  border-top: 1px solid var(--rule-hairline);
  margin: 2.5em 0;
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--bg-bone-warm);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  color: var(--ink-primary);
}

.prose pre {
  background: var(--bg-ink);
  color: var(--ink-on-dark);
  padding: 1.25em 1.5em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0 0 1.5em;
}

.prose pre code {
  background: transparent;
  padding: 0;
  font-size: 0.875rem;
  color: inherit;
}
```

---

## Nav updates

`src/data/nav.json` currently uses hash anchors (`#services`, `#about`, `#contact`). After completing each page, replace it with the full-route version below:

```json
[
  { "label": "Services", "href": "/services" },
  { "label": "How It Works", "href": "/#how-it-works" },
  { "label": "Pricing", "href": "/#pricing" },
  { "label": "About", "href": "/about" },
  { "label": "Contact", "href": "/contact" }
]
```

Do not add `/blog` to the nav until at least one non-draft post exists.

---

## Out of scope for Phase 3

Do not build any of the following:

- Claude API integration for the chat widget (Phase 4)
- Structured data / LocalBusiness schema (Phase 4)
- OG image generation pipeline (Phase 4)
- Core Web Vitals audit (Phase 4)
- Case study pages (Phase 4)
- /services/[slug] detail sub-pages (Phase 4 or later)

---

## File locations entering Phase 3

| File | Purpose |
|---|---|
| `NextWave_AI_Solutions_Brand_Design.json` | Design system source of truth |
| `src/styles/tokens.css` | CSS custom properties |
| `src/styles/global.css` | Global resets |
| `src/styles/prose.css` | Blog post body styles (create in this phase) |
| `src/components/layout/BaseLayout.astro` | Head, fonts, scripts, Cal.com SDK |
| `src/components/layout/Header.astro` | Fixed nav |
| `src/components/layout/Footer.astro` | Footer |
| `src/components/sections/FinalCTA.astro` | Reused on every page |
| `src/components/ui/` | Button, Card, Tag, SectionHeader |
| `src/content.config.ts` | Content collection schemas (Astro 7 Content Layer) |
| `src/content/blog/` | Blog post markdown files |
| `src/data/nav.json` | Nav links |
| `functions/api/contact.ts` | Cloudflare Pages Function (create in this phase) |
| `public/_headers` | Cloudflare response headers |
| `public/_redirects` | Cloudflare redirect rules |
| `.env.local` | Local env vars (not committed) |
| `.env.example` | Env var template (committed) |

---

## Commands

```bash
npm run dev                          # local dev server
npm run build                        # production build
npm run preview                      # serve dist/ locally
npx astro check                      # TypeScript + Astro type checking
npx wrangler pages dev dist          # test Cloudflare Functions locally
```

---

## Verification checklist before declaring Phase 3 complete

- [ ] `/about` renders correctly, no horizontal scroll at 375px
- [ ] `/services` renders all 6 service rows, Voltage appears no more than 3 times
- [ ] `/contact` form submits successfully and shows success state (test with Wrangler locally)
- [ ] `/contact` Cal.com inline embed loads and displays correctly
- [ ] `/blog` renders the empty state when no non-draft posts exist
- [ ] `/blog/[slug]` 404s cleanly when no posts exist (Astro handles this automatically for dynamic routes with no paths)
- [ ] All new pages include correct `<title>` and `<meta name="description">` tags
- [ ] Nav links are updated and active states work correctly
- [ ] `npx astro check` passes with zero errors
- [ ] `npm run build` completes with zero errors
- [ ] No purple, electric blue, or gradient colors appear on any new page
- [ ] No em dashes appear in any copy

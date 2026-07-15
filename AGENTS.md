## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Build Continuation Protocol

This site is built incrementally by following `TASKS.md` at the project root. Whenever a
prompt asks you to continue, resume, or complete the build (or any wording to that effect):

1. Read `TASKS.md` first. It is the single source of execution truth.
2. Pick the lowest-numbered task whose dependencies are all done and that is not yet done.
3. Build only that task's deliverables, run its tests, then mark it done in `TASKS.md`.
4. Do not skip ahead or batch multiple tasks unless explicitly told to.

`TASKS.md` is a thin index. Each task points back to the relevant section of this file and to
the keys in `NextWave_AI_Solutions_Brand_Design.json`. Those two files remain the design and
spec source of truth.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# Claude Code Build Prompt: NextWave AI Solutions Website

---

## Context

You are building the marketing website for **NextWave AI Solutions, LLC** from scratch. This is a full Astro project. The brand design system is fully specified in `NextWave_AI_Solutions_Brand_Design.json` at the root of this codebase. Read it completely before writing a single line of code. Every visual decision you make must trace back to that file.

---

## Stack

- **Framework:** Astro (latest stable)
- **Styling:** Tailwind CSS v4 with CSS custom properties for brand tokens
- **Interactivity:** Vanilla JS for the particle system and scroll animations; no React unless explicitly required
- **Fonts:** General Sans (free fallback for Söhne) via Fontshare CDN — `https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap`. Söhne Mono fallback: JetBrains Mono via Google Fonts.
- **Icons:** Lucide (via `@lucide/astro`)
- **Deployment target:** Vercel (static output)

---

## Project Structure

Scaffold exactly this structure:

```
nextwave-ai-solutions/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── og/
│   │   └── team/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── Features.astro
│   │   │   ├── HowItWorks.astro
│   │   │   ├── Testimonials.astro
│   │   │   ├── Pricing.astro
│   │   │   ├── FAQ.astro
│   │   │   └── FinalCTA.astro
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Tag.astro
│   │   │   ├── SectionHeader.astro
│   │   │   └── ChatWidget.astro
│   │   └── motion/
│   │       └── EmergentOrder.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── testimonials/
│   │   └── faq/
│   ├── data/
│   │   ├── nav.json
│   │   ├── features.json
│   │   ├── pricing.json
│   │   ├── testimonials.json
│   │   └── faq.json
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       ├── tokens.css
│       └── global.css
├── NextWave_AI_Solutions_Brand_Design.json
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Design Token Setup

Create `src/styles/tokens.css` by translating every value from the `colorTokens`, `typography`, and `componentStyles` sections of the brand JSON into CSS custom properties. Use these exact variable names:

```css
:root {
  /* Surfaces */
  --bg-bone: #F4F1EA;
  --bg-bone-warm: #EDE9DF;
  --bg-bone-cool: #F8F5EF;
  --bg-card: #EDE9DF;
  --bg-ink: #0A0E1A;
  --bg-ink-deep: #05070F;
  --bg-ink-soft: #12162A;

  /* Ink (text) */
  --ink-primary: #0A0E1A;
  --ink-secondary: #3E4152;
  --ink-tertiary: #6E7080;
  --ink-on-dark: #F4F1EA;
  --ink-on-dark-dim: rgba(244,241,234,0.68);
  --ink-on-dark-soft: rgba(244,241,234,0.42);

  /* Voltage (accent) */
  --voltage: #D4FF3D;
  --voltage-deep: #A8CC24;
  --voltage-bright: #E1FF6B;
  --voltage-dim: rgba(212,255,61,0.15);
  --voltage-glow: rgba(212,255,61,0.06);
  --voltage-ink: #1A2005;

  /* Signal (neutral structural) */
  --signal: #8A8A85;
  --signal-light: #B5B5B0;
  --signal-deep: #4E4E48;
  --signal-dim: rgba(138,138,133,0.14);

  /* Rules */
  --rule-hairline: rgba(10,14,26,0.10);
  --rule-mid: rgba(10,14,26,0.20);
  --rule-strong: rgba(10,14,26,0.36);
  --rule-voltage: rgba(212,255,61,0.40);
  --rule-on-dark: rgba(244,241,234,0.14);
  --rule-on-dark-strong: rgba(244,241,234,0.28);

  /* Shadows */
  --shadow-soft: 0 1px 2px rgba(10,14,26,0.02), 0 4px 12px rgba(10,14,26,0.04);
  --shadow-raised: 0 2px 4px rgba(10,14,26,0.04), 0 12px 32px rgba(10,14,26,0.08);
  --shadow-hero: 0 4px 32px rgba(10,14,26,0.20);
  --shadow-voltage: 0 8px 32px rgba(168,204,36,0.24);

  /* Typography */
  --font-sans: 'General Sans', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Transitions */
  --ease-brand: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 0.25s;
  --dur-standard: 0.6s;
  --dur-slow: 1.2s;

  /* Layout */
  --max-width: 1200px;
  --max-width-reading: 680px;
  --max-width-display: 1440px;
}
```

---

## Global Styles

`src/styles/global.css` must establish:

- `box-sizing: border-box` reset
- `background-color: var(--bg-bone)` on `html`
- `color: var(--ink-primary)` on `body`
- Font stack applied globally from `--font-sans`
- `-webkit-font-smoothing: antialiased`
- `a { color: inherit; text-decoration: none; }`
- Scroll behavior: `scroll-behavior: smooth`
- `@media (prefers-reduced-motion: reduce)` block that sets all animation durations to `0.01ms` and disables the particle system

---

## Page Sections: Build Order and Specs

Build `src/pages/index.astro` composing all sections in this order:

### 1. Header / Navigation

Component: `src/components/layout/Header.astro`

- Fixed to top, full width
- Background: `var(--bg-ink)` at 96% opacity with `backdrop-filter: blur(12px)`
- Logo: wordmark only, text-based. "NextWave" in `var(--ink-on-dark)` weight 500, "AI Solutions" in `var(--ink-tertiary)` same weight, same size (20px). No icon, no SVG mark.
- Nav links from `src/data/nav.json`: Services, How It Works, Pricing, About, Contact
- Nav link style: `var(--ink-on-dark-dim)` default, `var(--ink-on-dark)` on hover. Underline slides in from left on hover over 0.3s.
- Single CTA button: "Book a Call" using `buttonVoltage` spec from the brand JSON
- Mobile: hamburger menu, full-screen drawer on ink background
- Hairline rule at bottom: `var(--rule-on-dark)`

---

### 2. Hero Section

Component: `src/components/sections/Hero.astro` + `src/components/motion/EmergentOrder.astro`

**Layout:** Full viewport height, ink background (`var(--bg-ink)`), content centered, particle canvas behind text.

**Eyebrow label:** `"AI Systems for Local Business"` — Söhne Mono style, 12px, uppercase, 0.12em tracking, `var(--ink-on-dark-soft)` color, hairline outline tag (inverse variant from brand JSON).

**Headline:** Two lines.
- Line 1: `"Serious AI."` — display hero scale (`clamp(56px, 8vw, 112px)`), weight 500, `var(--ink-on-dark)`, letter-spacing `-0.03em`
- Line 2: `"Built locally."` — same scale, color `var(--voltage)` — this is the one Voltage headline moment.

**Subheadline:** `"We build the systems that will be running your business in five years. We start next month."` — body scale (`clamp(17px, 1.5vw, 19px)`), `var(--ink-on-dark-dim)`, max-width 560px, line-height 1.65.

**CTA row:** Two buttons side by side.
- Primary: `"Start a Diagnostic"` — `buttonVoltage` spec
- Secondary: `"See How It Works"` — `buttonInverseGhost` spec

**Stats row:** Three stats below the CTA, separated by hairline vertical rules.
- `"< 48 hrs"` / `"Time to first diagnostic"`
- `"100%"` / `"Clarity before you commit"`
- `"$0"` / `"Upfront to start"`
- Stats number: `stats` scale from typography (clamp 64px, 9vw, 128px), weight 500, `var(--ink-on-dark)`
- Stats label: 13px, `var(--ink-on-dark-soft)`, uppercase, tracked

**Particle System (EmergentOrder.astro):**

Implement a Canvas 2D particle animation exactly per the `signatureMotion.heroMoment` spec in the brand JSON:

- 200 to 400 particles (adaptive: `Math.floor(Math.min(400, (viewport.width * viewport.height) / 4000))`)
- Particle base color: `rgba(244,241,234,0.6)` (bone)
- Organized particle color: `rgba(212,255,61,0.9)` (voltage)
- Background: transparent (ink section provides the bg)
- Canvas fills full hero section, z-index behind text
- Cycle: chaos (Brownian walk, 6-8s) → organize (particles ease to target, 3-4s, staggered start, voltage color activates on arrival) → hold (2-3s, 0.98-1.02 breathing scale) → dissolve (2-3s, voltage fades to bone) → repeat with next pattern from library
- Pattern library: grid, radial rings, wave (sine), directed graph, vertical bars, diagonal cascade
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` throughout
- `prefers-reduced-motion`: replace canvas with a single static grid pattern at 40% opacity, no animation
- Performance: `requestAnimationFrame`, skip frames if below 30fps target, total JS under 20KB gzipped
- Canvas must resize correctly on viewport change (debounced resize observer)

---

### 3. Features / Capabilities

Component: `src/components/sections/Features.astro`

**Surface:** `var(--bg-bone)` (light section after the dark hero)

**Section eyebrow:** `"What We Build"` — labelSmall typography spec, `var(--ink-tertiary)`

**Section headline:** `"Systems that run without you in the room."` — h2 scale, weight 500, `var(--ink-primary)`

**Layout:** 3-column card grid on desktop, 1-column on mobile

**Cards:** Use `card` component spec (bgCard background, hairline border, 8px radius, 36px padding, hover lifts 2px with shadow-raised over 0.6s)

**Six feature cards. Each has:**
- A small tag (Tag component, default hairline outline style) with the capability category
- A headline (h3 scale)
- Two to three sentences of body text (bodySmall scale, `var(--ink-secondary)`)

**Card content:**

1. Tag: `"LEAD RECOVERY"` / Headline: `"No more missed calls."` / Body: `"An AI voice agent answers every call, qualifies the lead, and books the appointment. Your phone rings. We handle the rest."`

2. Tag: `"FOLLOW-UP"` / Headline: `"Every lead followed up. Automatically."` / Body: `"Sequences that go out in minutes, not days. Text, email, or both. Stops when they respond."`

3. Tag: `"INTAKE"` / Headline: `"Onboarding that runs itself."` / Body: `"New clients get a structured intake flow from the moment they book. No back-and-forth, no missed paperwork."`

4. Tag: `"REPORTING"` / Headline: `"Know your numbers without pulling a report."` / Body: `"A live dashboard shows recovered revenue, response rates, and system uptime. Built for owners, not analysts."`

5. Tag: `"SYSTEMATIZATION"` / Headline: `"Processes that don't depend on you."` / Body: `"We document, automate, and hand off. The system runs. Your team executes against a playbook."`

6. Tag: `"SCALE KIT"` / Headline: `"Ready to grow when you are."` / Body: `"Every engagement ends with a transferable package. Add a location, hire a team, or pass it to a new operator. Built to replicate."` — Use `tagVoltage` variant for the tag on this card only.

---

### 4. How It Works

Component: `src/components/sections/HowItWorks.astro`

**Surface:** `var(--bg-bone-warm)` (slightly warmer, creates section separation without color contrast)

**Section eyebrow:** `"The Process"`

**Section headline:** `"Six stages. One outcome: a system that runs."` — h2 scale

**Layout:** Horizontal stage progression on desktop (scrollable on mobile). A thin gradient bar runs across the top of the stages, visually encoding the engagement lifecycle using `stageGradientRamp` from the brand JSON.

**Six stages.** Each stage card has:
- Stage number (mono, small, `var(--ink-tertiary)`)
- Stage name using `engagementStagePill` component spec (exact variant per stage: DISCOVERY, ARCHITECTURE, BUILD, RUNTIME, SYSTEMATIZATION, SCALE_READY)
- One sentence describing what happens
- The artifact produced (use `artifactTag` component spec with exact variant)

**Stage content:**

1. Stage: DISCOVERY / Name: `"Discovery"` / Description: `"We audit your incoming lead flow, identify where revenue is leaking, and document what you actually want the system to do."` / Artifact tag: `DIAGNOSTIC`

2. Stage: ARCHITECTURE / Name: `"Architecture"` / Description: `"We map the system before we build it. You approve the scope, timeline, and terms before any work begins."` / Artifact tag: `CHARTER`

3. Stage: BUILD / Name: `"Build"` / Description: `"We build and integrate the automation stack. You see it running in a staging environment before it touches a live lead."` / Artifact tag: `BRIEF`

4. Stage: RUNTIME / Name: `"Runtime"` / Description: `"The system goes live. We monitor performance, tune responses, and track recovered revenue against your baseline."` / Artifact tag: `DASHBOARD`

5. Stage: SYSTEMATIZATION / Name: `"Systematization"` / Description: `"We document every process, decision tree, and integration. Your team gets a playbook. The system runs without us in the room."` / Artifact tag: `PLAYBOOK`

6. Stage: SCALE_READY / Name: `"Scale Ready"` / Description: `"The engagement closes with a transferable package. One new location, one new hire, one new operator. The system replicates."` / Artifact tag: `SCALE_KIT`

---

### 5. Testimonials

Component: `src/components/sections/Testimonials.astro`

**Surface:** `var(--bg-ink)` (dark section for emphasis)

**Section eyebrow:** `"Results"` — inverse tag style (`tagInkInverse`)

**Section headline:** `"What local operators are saying."` — h2 scale, `var(--ink-on-dark)`

**Layout:** 3-column card grid using `cardInk` spec

**Data source:** `src/data/testimonials.json` — seed with three placeholder testimonials:

```json
[
  {
    "quote": "We were losing 30% of our after-hours calls to voicemail. That stopped in week one. The system paid for itself in the first month.",
    "name": "M. Thompson",
    "title": "Owner",
    "company": "Thompson HVAC",
    "industry": "HVAC"
  },
  {
    "quote": "I handed it off to my front desk. They follow the playbook. I stopped worrying about follow-up entirely.",
    "name": "R. Castillo",
    "title": "Owner",
    "company": "Castillo Plumbing",
    "industry": "Plumbing"
  },
  {
    "quote": "No sales pitch, no fluff. They showed me what I was losing before they asked for anything. That was enough.",
    "name": "D. Warren",
    "title": "Owner",
    "company": "Warren Roofing",
    "industry": "Roofing"
  }
]
```

**Card layout:** Quote in blockquote style (per brand JSON blockquote spec, scaled down to 20-24px for card context), attribution below in caption style. No star ratings, no photos.

---

### 6. Pricing

Component: `src/components/sections/Pricing.astro`

**Surface:** `var(--bg-bone)`

**Section eyebrow:** `"Pricing"`

**Section headline:** `"One engagement. One system. Priced for local business."` — h2 scale

**Layout:** 3-column card grid

**Data source:** `src/data/pricing.json`

**Three tiers:**

```json
[
  {
    "name": "Foundation",
    "tag": "STARTER",
    "price": "$1,500",
    "cadence": "setup + $500/mo",
    "description": "One core automation. A single missed-revenue leak patched. Voice answering or follow-up sequence. Includes Diagnostic, Charter, and Dashboard.",
    "features": [
      "AI voice agent or follow-up sequence (one system)",
      "Live performance dashboard",
      "30-day monitoring and tuning",
      "Diagnostic and Charter artifacts"
    ],
    "cta": "Start a Diagnostic",
    "highlighted": false
  },
  {
    "name": "Growth",
    "tag": "MOST POPULAR",
    "price": "$4,500",
    "cadence": "setup + $1,200/mo",
    "description": "Voice answering, follow-up, and intake automation running together. Includes full artifact suite through Playbook.",
    "features": [
      "AI voice agent",
      "Lead follow-up sequences",
      "Client intake automation",
      "Live dashboard",
      "60-day monitoring",
      "Full artifact suite through Playbook"
    ],
    "cta": "Start a Diagnostic",
    "highlighted": true
  },
  {
    "name": "Authority",
    "tag": "SCALE KIT",
    "price": "Custom",
    "cadence": "engagement-based",
    "description": "Full-stack automation architecture for operators ready to systematize and replicate. Includes Scale Kit artifact.",
    "features": [
      "Complete automation stack",
      "Systematization and documentation",
      "Team training and handoff",
      "Scale Kit artifact",
      "Multi-location readiness"
    ],
    "cta": "Book a Strategy Call",
    "highlighted": false
  }
]
```

**Card styling:**
- Foundation and Authority: `card` spec (warm bone)
- Growth (highlighted): `card` spec with an additional `border: 1px solid rgba(212,255,61,0.40)` (voltage rule border) and a `tagVoltage` variant tag for "MOST POPULAR"
- Scale Kit row on Authority tier: use `cardVoltage` treatment for the Scale Kit mention specifically (inline, not the whole card)
- CTAs: Foundation and Growth use `buttonPrimary` (ink). Authority uses `buttonGhost`.

---

### 7. FAQ

Component: `src/components/sections/FAQ.astro`

**Surface:** `var(--bg-bone-warm)`

**Section eyebrow:** `"FAQ"`

**Section headline:** `"Questions we actually get asked."` — h2 scale

**Layout:** Single-column accordion. Max-width 680px (reading width), centered.

**Data source:** `src/data/faq.json`

**Seed with these questions:**

```json
[
  {
    "question": "Do I need to understand AI to work with you?",
    "answer": "No. You need to know what problems cost you money. We handle the rest and explain every decision in plain terms."
  },
  {
    "question": "How long does it take to see results?",
    "answer": "The Diagnostic is complete within 48 hours of our first call. Most clients see the automation running within two to three weeks of signing a Charter."
  },
  {
    "question": "What does the Diagnostic cost?",
    "answer": "Nothing. We measure what you are losing before we propose anything. If we can't identify recoverable revenue, we say so."
  },
  {
    "question": "What happens if I want to cancel?",
    "answer": "You own everything we build. The playbook, the integrations, the system. We build for your independence, not your dependency."
  },
  {
    "question": "Do you only work with businesses in Jonesboro?",
    "answer": "We're built in Jonesboro and we know the market. We work with local service businesses anywhere, but we prioritize operators we can meet in person."
  },
  {
    "question": "What kind of businesses do you work with?",
    "answer": "Local service businesses where the phone is the primary intake channel: HVAC, plumbing, roofing, electrical, landscaping, med spas, and similar trades. If you have a phone that rings and leads that don't always get followed up, we can help."
  }
]
```

**Accordion behavior:** Click to expand/collapse. One open at a time. Animated height transition at 0.4s ease. Hairline rule between items. Plus/minus icon using Lucide, transitions between states.

---

### 8. Final CTA Section

Component: `src/components/sections/FinalCTA.astro`

**Surface:** `var(--bg-ink)` full-bleed

**Layout:** Single centered column, max-width 680px

**Eyebrow:** `"Ready to start"` — inverse tag style

**Headline:** `"The Diagnostic is free. The delay is not."` — h1 scale, `var(--ink-on-dark)`

**Subhead:** `"We measure what you are losing before we propose anything. Book a 20-minute call and we will tell you exactly what a system would recover for your business."` — body scale, `var(--ink-on-dark-dim)`

**Button:** `"Book a Free Diagnostic Call"` — `buttonVoltage` spec. This is the third and final Voltage button on the page.

**Below button:** A `calloutFootnote` component: `"No pitch. No retainer. A diagnostic instrument and a straight answer."` — uses the Voltage left-border rule from the brand JSON.

---

### 9. Footer

Component: `src/components/layout/Footer.astro`

**Surface:** `var(--bg-ink-deep)` — deepest ink, anchors the page

**Layout:** 4-column grid on desktop

- **Col 1:** Wordmark (same as header). Tagline below: `"Serious AI. Built locally."` in `var(--ink-on-dark-soft)` at 14px. A single Voltage dot (4px circle, `var(--voltage)`) after the wordmark — the identity-anchor voltage accent per brand spec.
- **Col 2:** Label `"Services"` (labelSmall, uppercase, `var(--ink-on-dark-soft)`), links below in `var(--ink-on-dark-dim)`
- **Col 3:** Label `"Company"` — About, Contact, Blog
- **Col 4:** Label `"Get Started"` — Book a Diagnostic (voltage-colored link, not a button)

**Bottom bar:** Hairline rule (`var(--rule-on-dark)`), then `"© 2026 NextWave AI Solutions, LLC"` left, `"Built in Jonesboro, AR"` right — both in `var(--ink-on-dark-soft)` at 13px.

---

### 10. Floating Chat Widget

Component: `src/components/ui/ChatWidget.astro`

**Position:** Fixed, bottom-right, `z-index: 9999`, 24px from edges

**Trigger button:**
- Circle, 56px diameter
- Background: `var(--voltage)`
- Icon: Lucide `MessageCircle`, 24px, `var(--voltage-ink)` color
- On hover: scale to 1.05, shadow-voltage
- Transition: 0.25s ease

**Chat panel:**
- Appears above the button on click, width 360px, max-height 520px
- Background: `var(--bg-ink)`
- Border: `1px solid var(--rule-on-dark-strong)`
- Border-radius: 12px
- Box shadow: `var(--shadow-hero)`
- Header: `"NextWave AI"` in `var(--ink-on-dark)` at 15px weight 500, `"Ask us anything"` in `var(--ink-on-dark-soft)` at 13px. Close button (Lucide X) top-right.

**Message area:**
- Scrollable, padding 16px
- User messages: right-aligned, background `var(--voltage-dim)`, border `1px solid var(--rule-voltage)`, color `var(--ink-primary)`, border-radius 8px 8px 2px 8px
- Bot messages: left-aligned, background `var(--bg-ink-soft)`, color `var(--ink-on-dark)`, border-radius 8px 8px 8px 2px
- Font: 14px, line-height 1.55

**Input row:**
- Text input using `input` component spec (adapted for dark context: background `var(--bg-ink-soft)`, border `var(--rule-on-dark)`, color `var(--ink-on-dark)`)
- Send button: small, `var(--voltage)` background, `var(--voltage-ink)` icon

**Behavior:** Implement with vanilla JS. On open, send a greeting message: `"Hi. What's costing you the most right now?"`. Use a simple predefined response tree for common questions (missed calls, pricing, how it works). For anything else: `"Good question. Let's talk it through on a call — Book a Diagnostic Call"` with a hyperlink.

**Mobile:** Full-screen panel on viewports under 480px.

---

## Scroll Animation System

Implement in a single `src/lib/scrollReveal.ts` using `IntersectionObserver`:

- All `[data-reveal]` elements animate in on scroll
- Start state: `opacity: 0`, `transform: translateY(20px)`
- End state: `opacity: 1`, `transform: translateY(0)`
- Duration: 800ms, easing: `var(--ease-brand)`
- Stagger: apply `data-reveal-delay="0|60|120|180"` attributes in templates for 60ms staggered groups
- Apply only to: section headlines, eyebrow labels, card grids (not body text)
- Full `prefers-reduced-motion` respect: if reduced-motion, skip all transforms and set opacity to 1 immediately

---

## Reusable UI Components

### Button.astro

Props: `variant` (`primary` | `voltage` | `ghost` | `inverse-ghost`), `href` (optional, renders `<a>` if present), `size` (`sm` | `md`), `class`

Implement all four variants exactly per `componentStyles` button specs in the brand JSON.

### Card.astro

Props: `variant` (`default` | `ink` | `voltage` | `outlined`), `class`

Implement all four variants exactly per `componentStyles` card specs.

### Tag.astro

Props: `variant` (`default` | `voltage` | `inverse` | `artifact`), `artifactType` (for artifact variant: `DIAGNOSTIC` | `CHARTER` | `BRIEF` | `DASHBOARD` | `PLAYBOOK` | `SCALE_KIT`), `class`

### SectionHeader.astro

Props: `eyebrow`, `headline`, `subhead` (optional), `align` (`left` | `center`), `onDark` (boolean)

Applies labelSmall to eyebrow, h2 to headline, body to subhead. Adds `data-reveal` attributes automatically.

---

## Typography Rules

- Never use a serif font. The brand JSON explicitly bans serif fallbacks.
- Font weights used: 400, 500, 600 only (700 exists in the scale but is reserved for data/stats).
- All letter-spacing values come directly from the typography scales in the brand JSON.
- Sentence case everywhere. No Title Case, no ALL CAPS except labelSmall and tag components.
- No em dashes. Use periods, colons, semicolons, or parentheses.

---

## Prohibited Patterns

Read the `designPrinciples`, `effects`, and `voiceAndTone` sections of the brand JSON carefully. The following are explicitly banned:

- Electric blue, purple, or holographic gradients anywhere
- Neon glows or colored halos on any element
- Decorative color gradients (structural mask gradients for reveals are permitted)
- More than three Voltage-colored elements on any single page (the hero headline, the hero CTA button, and the final CTA button are the three)
- More than one Voltage card per page
- More than two Voltage tags per page
- Rounded corners over 8px radius on cards (use 8px, not 12px or 16px)
- Star ratings on testimonials
- Any copy using the words: revolutionary, game-changing, cutting-edge, next-generation, unleash, transform (as a verb), AI-powered, AI-driven, harness the power of, the future of, reimagining, or left behind
- Em dashes in any copy
- Emoji anywhere

---

## Copy Voice

All placeholder or seeded copy must match the voice spec from the brand JSON:

- Confident, plain-spoken, no hype
- Specific over general ("recovers $47,200 for a Jonesboro roofer" not "saves money for local businesses")
- Concrete verbs: we build, we run, we hand off, we measure
- No fear-based framing. Forward motion only.
- Peer-level tone for both a local business owner and a sophisticated buyer reading the same page.

---

## Accessibility

- All interactive elements keyboard-accessible
- Focus rings using Voltage: `box-shadow: 0 0 0 3px rgba(212,255,61,0.30)` (from brand JSON input focusShadow spec)
- Semantic HTML throughout: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<header>`
- `aria-label` on icon-only buttons
- `prefers-reduced-motion` respected for all animations (as specified above)
- Color contrast: `var(--ink-on-dark)` on `var(--bg-ink)` passes WCAG AA. Verify `var(--voltage-ink)` on `var(--voltage)` as well before finalizing.

---

## Final Checklist Before Declaring Done

- [ ] `npm run build` completes with zero errors
- [ ] `npm run dev` runs and all sections render correctly
- [ ] Particle system cycles through at least 3 patterns without errors in console
- [ ] Chat widget opens, closes, and sends/receives messages
- [ ] All four button variants render correctly across sections
- [ ] Mobile breakpoint (375px) is fully usable — no horizontal scroll, no clipped text
- [ ] All `data-reveal` animations fire on scroll, skip correctly under `prefers-reduced-motion`
- [ ] No purple, electric blue, or gradient colors appear anywhere on the page
- [ ] Voltage appears exactly three times as a primary element (hero headline, hero CTA, final CTA button)
- [ ] Brand JSON is present at project root and referenced in `README.md` as the design system source of truth

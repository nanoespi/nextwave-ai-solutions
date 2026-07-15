# NextWave AI Solutions - Build Task List

This is the single source of execution truth for building the site. It is a thin index:
each task points back to the relevant section of `CLAUDE.md` and to keys in
`NextWave_AI_Solutions_Brand_Design.json`. Those two files remain the design and spec source
of truth. This file only tells you what to build next, in what order, and how to verify it.

---

## Session Protocol (read this first, every session)

You may be a fresh model with no memory of prior work. Follow these steps exactly:

1. Read `CLAUDE.md` (already loaded into context) and open
   `NextWave_AI_Solutions_Brand_Design.json`. These define every visual and copy decision.
2. Scan the Task Table below. Pick the **lowest-numbered task that is not done (`[ ]`) and
   whose dependencies are all done (`[x]`)**. That is your task. Do only that one.
3. Build only the files listed under that task's `Deliverables`. Do not scope-creep into
   later tasks, and do not modify files owned by other tasks unless a task says to.
4. Run the task's tests: `npm run build` and `npm run check` must pass, all acceptance
   criteria must hold, and if the task is marked interactive its Playwright spec must pass.
5. Only if everything passes: flip the task's status from `[ ]` to `[x]` and fill the
   `Done note` with the files you touched. Then stop.
6. Never mark a task done if build or check fails. The "Prohibited Patterns" section of
   `CLAUDE.md` is gating: a violation (wrong color, extra voltage element, banned word, em
   dash, emoji, over-radius corner) is a failed task, not a stylistic note.
7. Voice rule for any prose you write into files: sentence case, no em dashes, no emoji, no
   banned words. See `CLAUDE.md` "Copy Voice" and "Prohibited Patterns".

Batching note: build one task per turn by default. Only build multiple tasks in a single
pass if the user explicitly tells you to.

---

## Dependency Graph

```
T01 (setup) ──┬─> T02 (tokens) ──> T03 (global) ──┬─> T04 (BaseLayout) ─┐
              │                                    ├─> T06 Button       │
              │                                    ├─> T07 Card         │
              │                                    ├─> T08 Tag          │
              │                                    ├─> T09 SectionHeader │
              │                                    ├─> T10 scrollReveal  │
              │                                    └─> T11 EmergentOrder │
              ├─> T05 (data + content)                                   │
              └─> T24 (README)                                           │
                                                                         │
  Layout chrome:   T04,T05,T06 ─> T12 Header      T04,T05 ─> T13 Footer  │
                                                                         │
  Sections:  T06,T08,T10,T11 ─> T14 Hero                                 │
             T07,T08,T09,T05 ─> T15 Features                             │
             T08,T09         ─> T16 HowItWorks                           │
             T07,T09,T05     ─> T17 Testimonials                         │
             T07,T06,T08,T05 ─> T18 Pricing                              │
             T05,T09         ─> T19 FAQ                                  │
             T06             ─> T20 FinalCTA                             │
             T04             ─> T21 ChatWidget                           │
                                                                         │
  Assembly:  T12..T21 ─> T22 index.astro ─> T23 Final QA <──────────────┘
```

Rule of thumb: finish Phase 0 (T01-T05) before anything else. Primitives (T06-T09) and libs
(T10-T11) come next. Then chrome, then sections, then the widget, then assembly and QA.

---

## Task Table (status at a glance)

| ID  | Task                     | Interactive | Deps                       | Status |
|-----|--------------------------|-------------|----------------------------|--------|
| T01 | Project setup & harness  |             | none                       | [x]    |
| T02 | Design tokens            |             | T01                        | [x]    |
| T03 | Global styles            |             | T02                        | [x]    |
| T04 | BaseLayout               |             | T02, T03                   | [x]    |
| T05 | Data + content config    |             | T01                        | [x]    |
| T06 | Button                   |             | T02, T03                   | [x]    |
| T07 | Card                     |             | T02, T03                   | [x]    |
| T08 | Tag                      |             | T02, T03                   | [x]    |
| T09 | SectionHeader            |             | T02, T03                   | [x]    |
| T10 | scrollReveal.ts          |             | T03                        | [x]    |
| T11 | EmergentOrder (particles)| yes         | T02, T03                   | [x]    |
| T12 | Header                   | yes         | T04, T05, T06              | [x]    |
| T13 | Footer                   |             | T04, T05                   | [x]    |
| T14 | Hero                     |             | T04, T06, T08, T10, T11    | [x]    |
| T15 | Features                 |             | T04, T05, T07, T08, T09    | [x]    |
| T16 | HowItWorks               |             | T04, T08, T09              | [x]    |
| T17 | Testimonials             |             | T04, T05, T07, T09         | [x]    |
| T18 | Pricing                  |             | T04, T05, T06, T07, T08    | [x]    |
| T19 | FAQ                      | yes         | T04, T05, T09              | [x]    |
| T20 | FinalCTA                 |             | T04, T06                   | [x]    |
| T21 | ChatWidget               | yes         | T04                        | [x]    |
| T22 | Compose index.astro      |             | T12-T21                    | [x]    |
| T23 | Final QA pass            | yes         | T22                        | [x]    |
| T24 | README source-of-truth   |             | T01                        | [x]    |

---

## Phase 0 - Foundation & tooling

### T01 - Project setup & test harness                          Status: [x]
Deps: none
Spec: `CLAUDE.md` §"Stack", §"Project Structure"; brand JSON: `typography.fontFamilies`.
Deliverables:
- `package.json` (add deps + scripts), `astro.config.mjs`, `tailwind.config.mjs`,
  `tsconfig.json` (leave Astro strict base), `playwright.config.ts`, `public/robots.txt`
- Scaffold empty dirs per `CLAUDE.md` structure so later tasks drop files in cleanly:
  `src/components/{layout,sections,ui,motion}`, `src/content`, `src/data`, `src/lib`,
  `src/styles`, `public/{fonts,images/og,images/team}`, `tests/`
Do:
- Install: `@tailwindcss/vite` + `tailwindcss` (v4), `@lucide/astro`, `@astrojs/check`,
  `typescript`, `@playwright/test`.
- `astro.config.mjs`: static output, add the Tailwind Vite plugin.
- `playwright.config.ts`: `webServer` runs `npm run preview` (or dev) on the Astro port,
  `baseURL` set to it, single chromium project is enough.
- Scripts: `dev`, `build`, `preview`, `check` (= `astro check`), `test` (= `playwright test`).
- Delete the scaffold boilerplate (`src/components/Welcome.astro`, `src/assets/*`) once
  `index.astro` no longer imports them. If `index.astro` still imports Welcome, leave a
  minimal placeholder page so build stays green until T22.
Tests:
- `npm install` clean; `npm run build` exits 0; `npm run check` exits 0.
- `npx playwright --version` resolves (harness installed).
Done note: package.json, astro.config.mjs, tailwind.config.mjs, playwright.config.ts, public/robots.txt, src/* scaffolded, scaffold boilerplate removed.

### T02 - Design tokens                                         Status: [x]
Deps: T01
Spec: `CLAUDE.md` §"Design Token Setup" (use the exact variable names listed there); brand
JSON: `colorTokens`, `typography`, `componentStyles`.
Deliverables: `src/styles/tokens.css`
Tests:
- Every variable named in the CLAUDE.md token block exists with the exact value.
- Stage ramp and shadow tokens present. `npm run build`/`check` clean once imported by T03/T04.
Done note: ____

### T03 - Global styles                                         Status: [x]
Deps: T02
Spec: `CLAUDE.md` §"Global Styles"; brand JSON: `layoutAndMotion.reducedMotion`,
`effects.surface`.
Deliverables: `src/styles/global.css` (imports/relies on tokens.css)
Tests:
- `box-sizing` reset, bone bg on html, ink text on body, `--font-sans` applied globally,
  antialiasing, smooth scroll, `a { color: inherit; text-decoration: none }`.
- `@media (prefers-reduced-motion: reduce)` sets durations to `0.01ms` and disables particles.
- build/check clean.
Done note: ____

### T04 - BaseLayout                                            Status: [x]
Deps: T02, T03
Spec: `CLAUDE.md` §"Stack" (font CDNs), §"Accessibility" (semantic HTML), §"10. Floating Chat
Widget" (widget is mounted here later, leave a slot/mount point comment).
Deliverables: `src/components/layout/BaseLayout.astro`
Do:
- Head: charset, viewport, title/description props with sensible defaults, OG tags,
  Fontshare link (General Sans) and Google Fonts link (JetBrains Mono), import tokens.css +
  global.css.
- Body: semantic `<slot />`; leave a clearly commented spot where `ChatWidget` mounts (T21/T22).
Tests: build/check clean; fonts requested in head; a page using BaseLayout renders.
Done note: ____

### T05 - Data + content config                                Status: [x]
Deps: T01
Spec: `CLAUDE.md` §"Project Structure", and the seeded JSON in §3/§5/§6/§7 (features,
testimonials, pricing, faq). Nav items from §1.
Deliverables:
- `src/data/nav.json` (Services, How It Works, Pricing, About, Contact)
- `src/data/features.json` (6 cards from §3, incl. tag + `voltage` flag on Scale Kit)
- `src/data/pricing.json` (3 tiers, copy exactly as in §6)
- `src/data/testimonials.json` (3 entries exactly as in §5)
- `src/data/faq.json` (6 Q/A exactly as in §7)
- `src/content/config.ts` (collections for testimonials + faq if used; otherwise minimal valid
  config), `src/lib/utils.ts` (small helpers: `cn`/class join, etc.)
Tests: all JSON parses; content config type-checks under `npm run check`; build clean.
Done note: ____

---

## Phase 1 - UI primitives

### T06 - Button.astro                                          Status: [ ]
Deps: T02, T03
Spec: `CLAUDE.md` §"Button.astro"; brand JSON: `componentStyles.{buttonPrimary,buttonVoltage,
buttonGhost,buttonInverseGhost}`, `signatureMotion.microInteractions.buttonHover`.
Deliverables: `src/components/ui/Button.astro`
Do: props `variant` (primary|voltage|ghost|inverse-ghost), `href` (renders `<a>` if set,
else `<button>`), `size` (sm|md), `class`. Match each spec exactly (padding, radius 6px,
weights, hover background + hover shadow, active translateY on primary).
Tests: build/check clean; all four variants render; icon-only usage supports `aria-label`.
Done note: ____

### T07 - Card.astro                                            Status: [ ]
Deps: T02, T03
Spec: `CLAUDE.md` §"Card.astro"; brand JSON: `componentStyles.{card,cardInk,cardVoltage,
cardOutlined}`, `signatureMotion.microInteractions.cardHover`.
Deliverables: `src/components/ui/Card.astro`
Do: props `variant` (default|ink|voltage|outlined), `class`. Radius 8px (never higher),
36px padding, hover lift -2px with raised shadow over 0.6s on `default`.
Tests: build/check clean; four variants render; corner radius is 8px.
Done note: ____

### T08 - Tag.astro                                             Status: [ ]
Deps: T02, T03
Spec: `CLAUDE.md` §"Tag.astro"; brand JSON: `componentStyles.{tag,tagVoltage,tagInkInverse,
artifactTag}` (+ `engagementStagePill` if you fold stage pills here; otherwise T16 handles
pills inline).
Deliverables: `src/components/ui/Tag.astro`
Do: props `variant` (default|voltage|inverse|artifact), `artifactType`
(DIAGNOSTIC|CHARTER|BRIEF|DASHBOARD|PLAYBOOK|SCALE_KIT), `class`. Mono type, 3px radius.
Tests: build/check clean; artifact variants map to the correct per-type colors from the JSON.
Done note: ____

### T09 - SectionHeader.astro                                   Status: [ ]
Deps: T02, T03
Spec: `CLAUDE.md` §"SectionHeader.astro"; brand JSON: `typography.scales.{labelSmall,h2,body}`,
`signatureMotion.textReveal`.
Deliverables: `src/components/ui/SectionHeader.astro`
Do: props `eyebrow`, `headline`, `subhead?`, `align` (left|center), `onDark` (bool). Applies
labelSmall/h2/body and adds `data-reveal` (+ stagger delays) automatically.
Tests: build/check clean; renders eyebrow/headline/subhead; `onDark` switches text colors.
Done note: ____

---

## Phase 2 - Motion / JS libs

### T10 - scrollReveal.ts                                       Status: [ ]
Deps: T03
Spec: `CLAUDE.md` §"Scroll Animation System"; brand JSON: `signatureMotion.textReveal`.
Deliverables: `src/lib/scrollReveal.ts`
Do: IntersectionObserver on `[data-reveal]`; start opacity 0 / translateY 20px, end 1 / 0;
800ms `--ease-brand`; honor `data-reveal-delay`; under `prefers-reduced-motion` set opacity 1
immediately with no transform.
Tests: build/check clean; module imports without error; reduced-motion path is present.
Done note: ____

### T11 - EmergentOrder.astro (particle system)   [interactive] Status: [ ]
Deps: T02, T03
Spec: `CLAUDE.md` §"2. Hero Section" > Particle System; brand JSON:
`signatureMotion.heroMoment` (particleSpec, motionSpec, patternLibrary, performanceRequirements).
Deliverables: `src/components/motion/EmergentOrder.astro`, `tests/particle.spec.ts`
Do: Canvas 2D + requestAnimationFrame. Adaptive count
`Math.floor(Math.min(400,(w*h)/4000))`. Cycle chaos -> organize -> hold -> dissolve across the
6 patterns. Base color bone 0.6, organized voltage 0.9. Debounced resize. Under
`prefers-reduced-motion`, render one static grid at 40% opacity, no rAF loop. Keep JS under
20KB gzipped.
Tests (particle.spec.ts):
- canvas element present and sized to its container.
- over a short window, patterns change at least 3 times with zero console errors.
- with `prefers-reduced-motion: reduce` emulated, no animation loop runs (static pattern shown).
Plus build/check clean.
Done note: ____

---

## Phase 3 - Layout chrome

### T12 - Header.astro                              [interactive] Status: [ ]
Deps: T04, T05, T06
Spec: `CLAUDE.md` §"1. Header / Navigation"; brand JSON: `logoSpec.primary`,
`componentStyles.buttonVoltage`, `signatureMotion.microInteractions.linkHover`.
Deliverables: `src/components/layout/Header.astro`, `tests/header.spec.ts`
Do: fixed full-width, ink bg 96% + blur 12px, two-tone wordmark, nav from `nav.json`,
left-slide underline on hover, single "Book a Call" voltage button, mobile hamburger +
full-screen ink drawer, bottom hairline rule.
Tests (header.spec.ts): at mobile width the hamburger opens and closes the drawer; nav links
present. Plus build/check clean.
Note: this "Book a Call" voltage button is a header CTA. The three page-level voltage moments
(hero headline, hero CTA, final CTA button) are tracked in T23; keep header usage consistent
with the JSON `buttonVoltage` intent and flag any conflict there.
Done note: ____

### T13 - Footer.astro                                          Status: [x]
Deps: T04, T05
Spec: `CLAUDE.md` §"9. Footer"; brand JSON: `logoSpec.{primary,voltageAccent}`,
`colorTokens.{bgInkDeep,voltagePrimary}`.
Deliverables: `src/components/layout/Footer.astro`
Do: bgInkDeep, 4-col grid, wordmark + tagline + single 4px voltage dot, Services/Company/Get
Started columns, bottom bar with copyright left and "Built in Jonesboro, AR" right.
Tests: build/check clean; four columns; one voltage dot only.
Done note: src/components/layout/Footer.astro

---

## Phase 4 - Sections

### T14 - Hero.astro                                            Status: [x]
Deps: T04, T06, T08, T10, T11
Spec: `CLAUDE.md` §"2. Hero Section"; brand JSON: `typography.scales.{displayHero,stats,body,
labelSmall}`, `componentStyles.{buttonVoltage,buttonInverseGhost}`, `colorTokens.voltagePrimary`.
Deliverables: `src/components/sections/Hero.astro`
Do: 100vh ink section, EmergentOrder canvas behind text, eyebrow tag (inverse), two-line
headline with "Built locally." in voltage, subhead (max 560px), two CTAs (voltage primary +
inverse-ghost secondary), three stats separated by hairline rules.
Tests: build/check clean; 100vh ink bg; line 2 uses `--voltage`; canvas mounts behind text;
0 console errors. (Canvas behavior itself is covered by T11.)
Done note: src/components/sections/Hero.astro

### T15 - Features.astro                                        Status: [x]
Deps: T04, T05, T07, T08, T09
Spec: `CLAUDE.md` §"3. Features / Capabilities"; brand JSON: `componentStyles.{card,tag,
tagVoltage}`.
Deliverables: `src/components/sections/Features.astro`
Do: bone surface, SectionHeader, 3-col card grid (1-col mobile), 6 cards from `features.json`;
Scale Kit card uses `tagVoltage` (the only voltage tag in this section).
Tests: build/check clean; 6 cards; exactly one voltage tag here; 8px card radius.
Done note: src/components/sections/Features.astro

### T16 - HowItWorks.astro                                      Status: [x]
Deps: T04, T08, T09
Spec: `CLAUDE.md` §"4. How It Works"; brand JSON: `colorTokens.stageGradientRamp`,
`componentStyles.{engagementStagePill,artifactTag}`.
Deliverables: `src/components/sections/HowItWorks.astro`
Do: bgBoneWarm surface, SectionHeader, thin `stageGradientRamp` bar across the top, 6 stage
cards (number + stage pill variant + one sentence + artifact tag variant). Horizontal on
desktop, scrollable on mobile.
Tests: build/check clean; 6 stages in order DISCOVERY..SCALE_READY; ramp bar present; each
stage shows the correct pill + artifact variant.
Done note: src/components/sections/HowItWorks.astro

### T17 - Testimonials.astro                                    Status: [x]
Deps: T04, T05, T07, T09
Spec: `CLAUDE.md` §"5. Testimonials"; brand JSON: `componentStyles.{cardInk,blockquote,
tagInkInverse}`.
Deliverables: `src/components/sections/Testimonials.astro`
Do: ink surface, inverse eyebrow tag, 3-col `cardInk` grid from `testimonials.json`,
blockquote scaled to 20-24px, attribution below. No star ratings, no photos.
Tests: build/check clean; 3 cards; no star ratings present.
Done note: src/components/sections/Testimonials.astro

### T18 - Pricing.astro                                         Status: [x]
Deps: T04, T05, T06, T07, T08
Spec: `CLAUDE.md` §"6. Pricing"; brand JSON: `componentStyles.{card,cardVoltage,tagVoltage,
buttonPrimary,buttonGhost,rule}`.
Deliverables: `src/components/sections/Pricing.astro`
Do: bone surface, 3-col grid from `pricing.json`. Growth tier gets a voltage rule border +
`tagVoltage` "MOST POPULAR". Authority uses an inline `cardVoltage` treatment for the Scale Kit
mention only. Foundation/Growth CTAs use buttonPrimary; Authority uses buttonGhost.
Tests: build/check clean; 3 tiers; at most one voltage card treatment; Growth border is the
voltage rule.
Done note: src/components/sections/Pricing.astro

### T19 - FAQ.astro                                [interactive] Status: [x]
Deps: T04, T05, T09
Spec: `CLAUDE.md` §"7. FAQ"; brand JSON: `typography.scales.body`, `componentStyles.rule`.
Deliverables: `src/components/sections/FAQ.astro`, `tests/faq-accordion.spec.ts`
Do: bgBoneWarm, single-column accordion at 680px reading width, 6 items from `faq.json`,
one open at a time, 0.4s height transition, hairline rule between items, Lucide plus/minus that
swaps on toggle.
Tests (faq-accordion.spec.ts): opening one item collapses any other; icon swaps between plus
and minus. Plus build/check clean.
Done note: src/components/sections/FAQ.astro, tests/faq-accordion.spec.ts

### T20 - FinalCTA.astro                                        Status: [x]
Deps: T04, T06
Spec: `CLAUDE.md` §"8. Final CTA Section"; brand JSON: `componentStyles.{buttonVoltage,
calloutFootnote}`, `typography.scales.{h1,body}`.
Deliverables: `src/components/sections/FinalCTA.astro`
Do: ink full-bleed, 680px centered column, inverse eyebrow, h1 headline, subhead, single
voltage button (this is the third and final page voltage moment), calloutFootnote with voltage
left border below.
Tests: build/check clean; exactly one voltage button here; calloutFootnote has the voltage
left rule.
Done note: src/components/sections/FinalCTA.astro

---

## Phase 5 - Widget

### T21 - ChatWidget.astro                          [interactive] Status: [x]
Deps: T04
Spec: `CLAUDE.md` §"10. Floating Chat Widget"; brand JSON: `componentStyles.input`,
`colorTokens.{voltagePrimary,voltageInk,bgInk,bgInkSoft}`, `effects.elevation.hero`.
Deliverables: `src/components/ui/ChatWidget.astro`, `tests/chat.spec.ts`
Do: fixed bottom-right z-9999, 56px voltage trigger with Lucide MessageCircle, ink panel
360x520 on click, header + close (Lucide X), message area (user vs bot bubble styles), input
row with voltage send. Vanilla JS greeting + predefined response tree; fallback links to
"Book a Diagnostic Call". Full-screen under 480px.
Tests (chat.spec.ts): trigger opens panel; greeting message appears; sending a known keyword
returns a tree response; close button hides panel. Plus build/check clean.
Done note: ____

---

## Phase 6 - Assembly & QA

### T22 - Compose index.astro                                   Status: [x]
Deps: T12, T13, T14, T15, T16, T17, T18, T19, T20, T21
Spec: `CLAUDE.md` §"Page Sections: Build Order and Specs" (section order).
Deliverables: `src/pages/index.astro` (and mount `ChatWidget` via `BaseLayout` or the page).
Do: wrap in BaseLayout; render Header, Hero, Features, HowItWorks, Testimonials, Pricing, FAQ,
FinalCTA, Footer in order; mount ChatWidget; initialize `scrollReveal` on the client. Remove any
remaining scaffold placeholder.
Tests: build/check clean; page renders all nine sections in order with no console errors.
Done note: ____

### T23 - Final QA pass                            [interactive] Status: [x]
Deps: T22
Spec: `CLAUDE.md` §"Final Checklist Before Declaring Done", §"Prohibited Patterns",
§"Accessibility".
Deliverables: `tests/brand-guardrails.spec.ts` (+ small fixes to any failing source file)
Do: encode the checklist as assertions and a source grep:
- At most 3 voltage "primary" elements on the page (hero headline, hero CTA, final CTA button).
  Header "Book a Call" and any tags/borders are not primary voltage moments; if the count
  exceeds 3, fix the offending section, do not relax the test.
- No purple, electric blue, or decorative gradient colors anywhere.
- No horizontal scroll at 375px width.
- Focus rings use the voltage focus shadow; keyboard reachable interactive elements.
- `prefers-reduced-motion` honored (particles static, reveals instant).
- Grep `src/` for banned words, em dashes, and emoji (see Prohibited Patterns). Zero hits.
Tests: `tests/brand-guardrails.spec.ts` passes; build/check clean.
Done note: ____

### T24 - README source-of-truth                                Status: [x]
Deps: T01
Spec: `CLAUDE.md` §"Final Checklist" (brand JSON referenced in README).
Deliverables: `README.md`
Do: replace the Astro starter README. State that
`NextWave_AI_Solutions_Brand_Design.json` is the design system source of truth and `TASKS.md`
is the build execution plan. Include run/build/check/test commands.
Tests: README names both files; commands listed match `package.json` scripts.
Done note: ____

---

## Verification Appendix

Commands every task relies on (defined in T01):

- `npm run build` - production build must exit 0.
- `npm run check` - `astro check`, must report 0 errors.
- `npm run test` - Playwright specs for interactive tasks.
- `npm run dev` - local dev server for manual inspection.

Global gates that apply to every task (from `CLAUDE.md` "Prohibited Patterns"): no purple /
electric blue / decorative gradients, at most three page-level voltage elements, at most one
voltage card, at most two voltage tags, card radius never above 8px, no banned words, no em
dashes, no emoji. A violation fails the task.

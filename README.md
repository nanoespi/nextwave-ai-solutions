# NextWave AI Solutions

Marketing website for NextWave AI Solutions, LLC. Built with Astro and Tailwind CSS v4.

## Source of truth

- **Design system:** `NextWave_AI_Solutions_Brand_Design.json` — every color, typography scale, component spec, and motion behavior traces back to this file. Do not make visual decisions that are not derivable from it.
- **AI session brief:** `CLAUDE.md` — the persistent brief for Claude Code sessions: current phase, task list, file map, and non-negotiable rules.
- **Build plan:** `TASKS.md` — the ordered task list and execution log for building this site incrementally.

## Deployment

Deployed to **Cloudflare Pages**, connected to the `main` branch.

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 20 (set via `NODE_VERSION=20` environment variable)

## Stack

- Framework: Astro (static output)
- Styling: Tailwind CSS v4 with CSS custom properties defined in `src/styles/tokens.css`
- Fonts: General Sans via Fontshare, JetBrains Mono via Google Fonts
- Icons: Lucide (`@lucide/astro`)
- Deployment: Cloudflare Pages (connected to `main` branch)

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Type-check all Astro and TypeScript files
npm run check

# Run Playwright end-to-end tests
npm run test
```

## Project structure

```
src/
  components/
    layout/     BaseLayout, Header, Footer
    sections/   Hero, Features, HowItWorks, Testimonials, Pricing, FAQ, FinalCTA
    ui/         Button, Card, Tag, SectionHeader, ChatWidget
    motion/     EmergentOrder (particle system)
  data/         nav, features, pricing, testimonials, faq (JSON)
  lib/          scrollReveal.ts, utils.ts
  pages/        index.astro
  styles/       tokens.css, global.css
tests/          Playwright specs for interactive components
```

## Brand rules (enforced by `tests/brand-guardrails.spec.ts`)

- Voltage (`#D4FF3D`) appears as a primary element exactly three times per page: hero headline, hero CTA, final CTA button.
- No purple, electric blue, or decorative gradient colors anywhere.
- Card border-radius never exceeds 8px.
- No banned words, em dashes, or emoji in source files.
- All animations respect `prefers-reduced-motion`.

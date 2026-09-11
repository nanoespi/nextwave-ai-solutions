# Naerix: Expertise. Amplified.

Status: implemented local preview, awaiting visual review

## Brief

An investor-facing parent company that builds and operates businesses across industries. The design should demonstrate craft and capability while describing the business honestly. Preserve the original Naerix wordmark. Lead with expertise, craftsmanship, and technology that empowers skilled people. Catherine AI and NAERIX Brickwise are announcement-only pages. Founder names, roles, portraits, biographies, and contact addresses remain clearly marked placeholders.

## Web design skill and seed

Created using Mason's `web-design` skill at `Desktop/Jonesboro-Sage/.agents/skills/web-design/SKILL.md`. This is a new Naerix direction, independent of Jonesboro Sage's existing approved seed.

```text
Jgm1Z9eoxl8SuS8Etr07eNrUQHNDOIamgPP0LchH0qKSVJVrRAjaDy3Uyo8jXiJR5lf8Tam7EYhXalsAzYuX0FRAFRCzMdQg
```

Twelve base-62 slice sums: **244, 248, 261, 205, 211, 234, 224, 286, 221, 271, 236, 244**.

The first five mappings are quiet atlas, compact density, humanist sans with mono, subtle rounding, and measured stagger. The seed contains 14 digits, 44 uppercase letters, and 38 lowercase letters. Its letter-heavy composition suggests an editorial interface, with compactness applied to labels and navigation rather than headline spacing. Equal first and last slice sums suggest matching header/footer anchors. The doubled `PP` and mirrored `SuS` / `VJV` suggest paired planes, repeated rules, and a form assembled from differing perspectives. These are creative associations, not objective properties of a brand.

The user's preference for dark, bold architectural design governs the result. One dominant idea: **a portfolio of distinct businesses held together by a common approach**. Two supporting motifs: the assembled sculptural form and numbered editorial sections. Broad surfaces are square; subtle rounding is reserved for the softer Catherine artwork. The motion mapping is expressed through a single measured sculptural movement rather than staged hiding of page content.

## System

- **Register:** ambitious, deliberate, and precise. Specific descriptions replace invented scale, customer counts, financial results, launch dates, or founder credentials.
- **Layout:** asymmetric editorial opening; a three-part business portfolio; a contrasting approach section; ruled values; a large original wordmark closing the page. Separate About, Contact, and product routes.
- **Typography:** locally hosted Inter for display and body, native monospace for short labels. The original outlined Naerix logo is rendered from its unmodified SVG, cropped to the wordmark through an SVG viewport. Existing Xolonium supports the Brickwise endorsement.
- **Palette:** near-black `#111210`, warm off-white `#EFEEE8`, olive-gray display accent, and a sparing `#D4FF3D` brand signal. Catherine uses sage; Brickwise uses copper; Jonesboro Sage preserves cream and deep sage, with Georgia editorial lettering.
- **Geometry:** fine rules, open compositions, squared controls, no generic rounded card containers. The sculpture's faces use computed lighting shades; Catherine's sphere and Brickwise's planes use material shading.
- **Imagery:** deterministic SVG/CSS artwork and the supplied logo. No stock founder portraits, invented product screenshots, or decorative business statistics.
- **Motion:** one parent SVG transform; no WebGL runtime or per-frame JavaScript. A visible pause/resume control, offscreen/tab pausing, and reduced-motion support. Without JavaScript, the artwork remains static and all content stays visible.
- **Responsive:** desktop side-by-side hero and three business features; stacked mobile content with native disclosure navigation. Keyboard focus survives skip navigation, fragment links, dismissal, and expansion to desktop navigation.
- **Accessibility:** native semantic HTML, descriptive links, visible focus, focusable navigation targets, one main landmark and H1 per page, announcement text rather than nonfunctional signup controls. Automated axe checks supplement manual browser inspection.

## Architecture and preservation

Source reference: `nanoespi/nextwave-ai-solutions`, baseline commit `ab3dd0ab3e8c7e5207afe8a162899b90c7cfe156`.

The entire redesign is an independent app in `naerix/`, on the local `design/naerix-portfolio` branch. The original repository-root Astro app is unmodified. Nothing has been deployed, pushed, merged, or connected to a domain.

The app follows the existing languages and directory conventions: Astro static output, scoped `.astro` styles, TypeScript scripts, Tailwind CSS v4, shared CSS tokens, JSON content, and Playwright tests. Native semantic elements supply the interaction foundation; no React or additional UI primitive library is needed. The existing package versions and build conventions are retained. Axe is added only as a development-time accessibility checker.

## Content decisions and intentional deferrals

- Catherine AI: sage visual identity, mental wellness category, coming-soon announcement. No application, signup, medical claims, launch date, or functioning product mockup.
- NAERIX Brickwise: copper architectural direction, facilities-management category, coming-soon announcement. The name follows Mason's current instruction.
- Jonesboro Sage: brand treatment informed by the approved live public-data preview. The outbound link uses `https://jonesborosage.com`; the subsidiary's own preview/domain transition remains independent of this app.
- Three illustrative founder slots. Replace with the actual number of founders and approved names, roles, portraits, and bios later.
- `hello@naerix.com` and `investors@naerix.com` are proposed placeholder addresses. They are labeled as coming soon and deliberately rendered as text until the mailboxes exist.
- Canonical URLs use `https://naerix.com`. The preview has `noindex, nofollow` and a disallow-all robots file. Domain configuration, indexability, social sharing artwork, final contact information, and deployment belong to the later launch step.

## Independent advisory review

Two Muse advisers received only generic technical briefs about native navigation and decorative motion. No project files, company details, private strategy, or founder information were supplied.

Accepted and verified: focusable skip/fragment destinations; transferring focus from mobile navigation to its desktop equivalent; returning focus after outside dismissal where required; robust handling of observer absence; testing reduced-motion startup, pause persistence, and no-JavaScript operation.

Rejected as an existing defect: a reduced-motion startup race. The code checks the media preference before enabling motion; the CSS fallback also disables it. This behavior is covered by a browser check. Low-end real-device frame-rate claims remain unverified and are not asserted.

## Verification

See the project README for the exact commands. Verification covers the production build, TypeScript/Astro diagnostics, desktop/tablet/mobile layouts down to 320px, axe WCAG A/AA checks, internal links and fragments, product-to-parent navigation, placeholders, 404 recovery, keyboard behavior, reduced motion, and no-JavaScript navigation. Screenshots and advisory receipts are local-only under `.codex/`.

September 10 result: **0 Astro errors/warnings/hints, successful six-page build, 16/16 Playwright tests passing, and no axe violations across the five main pages at 1440, 768, 390, and 320px.** Visual screenshots were inspected for the homepage, both product announcements, About, and Contact; mobile homepage composition was also reviewed. These are local Chromium results, not a claim of real-device or cross-browser coverage.

# NextWave AI Solutions — CLAUDE.md (Phase 4: Real Integrations + SEO)

This file is the persistent project brief for Claude Code. Read it completely at the start of every session before touching any file. Replace the previous CLAUDE.md with this file at the project root.

---

## What this project is

The marketing website for **NextWave AI Solutions, LLC** — an AI automation firm serving local service businesses in Jonesboro, AR. Built on Astro 7 (static output, Content Layer API) + Tailwind 4, deployed to Cloudflare Pages.

**State of the codebase entering Phase 4:**
- All pages are live: `/`, `/about`, `/services`, `/contact`, `/blog`
- Cloudflare Pages deployment is configured, sitemap is generating, Plausible analytics is active
- Cal.com booking modal is wired to all primary CTAs
- Contact form is live via Cloudflare Pages Function + Resend
- Chat widget is live but uses a predefined response tree (no real AI)
- OG meta tags exist but point to a static placeholder image
- No structured data (JSON-LD) exists yet
- Core Web Vitals have not been audited

**Astro 7 + Tailwind 4 specifics (do not deviate from these):**
- Content collection config is at `src/content.config.ts` (not `src/content/config.ts`)
- Content Layer API: use `post.id` not `post.slug` for dynamic routes and URL generation
- Content Layer API: use `render(post)` imported from `astro:content`, not `post.render()`
- Content Layer API: `defineCollection` schema does not use a `type` field
- Tailwind 4: config is `tailwind.config.mjs`; content paths must include all `.astro` files

**Current phase: Real Integrations + SEO.** Four tasks in order. Do not begin a later task until the current one passes verification.

---

## Brand system (non-negotiable)

Full spec: `NextWave_AI_Solutions_Brand_Design.json` at the project root. Read before every visual decision.

Quick rules:
- Bone (`#F4F1EA`) for standard surfaces. Ink (`#0A0E1A`) for hero and emphasis sections.
- Voltage (`#D4FF3D`) maximum three times per page as a primary element.
- Font: General Sans (Fontshare CDN). No serif. No em dashes in any copy.
- No electric blue, purple, neon glows, or decorative gradients.
- All transitions: `cubic-bezier(0.16, 1, 0.3, 1)`. Respect `prefers-reduced-motion` everywhere.

---

## Task 1: Claude-powered chat widget (lead qualifier)

**Goal:** Replace the predefined response tree in `ChatWidget.astro` with a real Claude API integration. The widget behaves as a focused lead qualifier -- every conversation is steered toward booking a Diagnostic Call. It does not answer general AI questions, give business advice outside its scope, or act as a general assistant.

---

### Backend: Cloudflare Pages Function

Create `functions/api/chat.ts`. This function proxies messages to the Claude API, enforces the system prompt, and returns the response. The API key never touches the frontend.

```ts
interface Env {
  ANTHROPIC_API_KEY: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPayload {
  messages: Message[];
}

const SYSTEM_PROMPT = `You are the NextWave AI Solutions intake assistant. NextWave AI Solutions is an AI automation firm based in Jonesboro, Arkansas that builds systems for local service businesses: HVAC, plumbing, roofing, electrical, landscaping, med spas, and similar trades.

Your only job is to qualify the visitor and move them toward booking a free Diagnostic Call. You are not a general assistant. You do not answer questions outside this scope.

HOW YOU QUALIFY:
1. Find out what is costing them the most right now (missed calls, slow follow-up, manual intake, disorganized processes).
2. Confirm they are a local service business owner or operator (not a developer, not a student, not a competitor).
3. Once you have identified a real problem, invite them to book a free Diagnostic Call.

HOW YOU COMMUNICATE:
- Plain, direct, peer-level. You are talking to a business owner, not pitching to a prospect.
- Short responses. Two to four sentences maximum per turn.
- Never use the words: revolutionary, game-changing, cutting-edge, next-generation, unleash, transform, AI-powered, AI-driven, harness the power of, the future of, reimagining, or left behind.
- No em dashes. Use periods, colons, semicolons, or parentheses.
- No bullet lists in the chat. Prose only.
- No emoji.

WHEN TO INVITE THEM TO BOOK:
- After they have described a specific problem (missed calls, slow follow-up, bad intake, etc.)
- After they confirm they are a business owner
- Do not push the booking on the first message. Qualify first.
- When ready: "It sounds like a Diagnostic would show exactly what that's costing you. It's free and takes 20 minutes. Want to book one now?" Then provide the booking link: https://cal.com/nextwave-ai/diagnostic

WHAT YOU DO NOT DO:
- Do not quote specific prices beyond "starts at $1,500 setup" if directly asked.
- Do not make guarantees about revenue recovery amounts.
- Do not discuss competitors.
- Do not answer questions about general AI, technology, or anything outside NextWave's services.
- If someone is clearly not a prospect (developer, student, wrong industry), be friendly but direct: "We work specifically with local service businesses. If that's not you, I'm probably not the right resource."

OPENING:
Your first message in every conversation is already set by the widget: "Hi. What's costing you the most right now?" Do not repeat a greeting if the conversation history already contains one.`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const payload: ChatPayload = await context.request.json();

    if (!payload.messages || !Array.isArray(payload.messages)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Limit conversation history to last 10 messages to control token cost
    const messages = payload.messages.slice(-10);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': context.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Something went wrong. Try refreshing the page.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('Chat worker error:', err);
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

**Model choice:** `claude-haiku-4-5-20251001`. Haiku is fast (sub-second responses in a chat context), inexpensive (well under $1 per 1,000 conversations at 300 max tokens), and more than capable for a scoped lead qualifier. Do not use Sonnet or Opus here -- the cost and latency are not justified.

**Token budget:** `max_tokens: 300` enforces short responses and controls cost. The system prompt instructs the model to stay at two to four sentences, which comfortably fits within 300 tokens.

---

### Frontend: update ChatWidget.astro

Replace the entire JS block in `ChatWidget.astro` with the following. Preserve all existing HTML structure and CSS exactly -- only the JavaScript changes.

Key changes:
- Maintain `conversationHistory` array in memory (role/content pairs)
- On user send: push to history, POST to `/api/chat`, push assistant reply to history, render
- Show a typing indicator (three animated dots) while waiting for the response
- Handle API errors gracefully without exposing technical details to the visitor
- The opening message (`"Hi. What's costing you the most right now?"`) is pre-rendered in the HTML as an assistant bubble and pre-loaded into `conversationHistory` so the API receives correct context

```js
const conversationHistory = [
  {
    role: 'assistant',
    content: "Hi. What's costing you the most right now?"
  }
];

const messagesEl = document.getElementById('chat-messages');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const typingIndicator = document.getElementById('chat-typing');

function appendMessage(role, text) {
  const bubble = document.createElement('div');
  bubble.className = role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot';

  // Convert booking link to clickable anchor
  const linkedText = text.replace(
    /(https:\/\/cal\.com\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener" data-cal-link="nextwave-ai/diagnostic" data-cal-config=\'{"layout":"modal"}\' style="color:var(--voltage-deep);text-decoration:underline;">Book a Diagnostic Call</a>'
  );

  bubble.innerHTML = linkedText;
  messagesEl.insertBefore(bubble, typingIndicator);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  typingIndicator.style.display = 'flex';
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  typingIndicator.style.display = 'none';
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  sendBtn.disabled = true;
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    const reply = data.reply || "Something went wrong. Refresh and try again.";
    conversationHistory.push({ role: 'assistant', content: reply });
    hideTyping();
    appendMessage('assistant', reply);

  } catch {
    hideTyping();
    appendMessage('assistant', "Something went wrong on my end. You can book directly at cal.com/nextwave-ai/diagnostic or email hello@nextwaveaisolutions.com.");
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
```

Add a typing indicator element inside the chat messages container (if not already present):

```html
<div id="chat-typing" style="display:none; align-items:center; gap:4px; padding:8px 0;">
  <span style="width:6px;height:6px;border-radius:50%;background:var(--ink-on-dark-soft);animation:typingDot 1.2s ease-in-out infinite;"></span>
  <span style="width:6px;height:6px;border-radius:50%;background:var(--ink-on-dark-soft);animation:typingDot 1.2s ease-in-out infinite 0.2s;"></span>
  <span style="width:6px;height:6px;border-radius:50%;background:var(--ink-on-dark-soft);animation:typingDot 1.2s ease-in-out infinite 0.4s;"></span>
</div>
```

Add to `tokens.css` or `global.css`:

```css
@keyframes typingDot {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}
```

**Add to `.env.example`:**
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Add to Cloudflare Pages dashboard** (manually, not by Claude Code):
- `ANTHROPIC_API_KEY` — from console.anthropic.com, set for Production environment only

**Verification:**
- Widget opens and shows the pre-rendered greeting
- Typing a message sends to `/api/chat` and returns a reply within 2 seconds
- Typing indicator appears while waiting and disappears on reply
- Booking link in AI response opens the Cal.com modal (not a new tab)
- If the API is unavailable, the fallback message appears with the direct booking link
- Test with Wrangler locally: `npx wrangler pages dev dist`

---

## Task 2: Structured data (JSON-LD)

**Goal:** Add LocalBusiness and FAQ structured data so Google can surface rich results for NextWave searches in the Jonesboro market.

---

### LocalBusiness schema

Add to `BaseLayout.astro` inside `<head>`, rendered only on the index page (pass a prop `isHome: boolean` to BaseLayout):

```astro
---
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  isHome?: boolean;
}
const { isHome = false } = Astro.props;
---

{isHome && (
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "NextWave AI Solutions, LLC",
    "description": "AI automation systems for local service businesses. Missed revenue recovered. Processes systematized.",
    "url": "https://nextwaveaisolutions.com",
    "telephone": "",
    "email": "hello@nextwaveaisolutions.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jonesboro",
      "addressRegion": "AR",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.8423,
      "longitude": -90.7043
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Jonesboro",
        "containedInPlace": {
          "@type": "State",
          "name": "Arkansas"
        }
      }
    ],
    "serviceType": [
      "AI Automation",
      "Lead Recovery Automation",
      "Business Process Automation",
      "AI Voice Agent"
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-17:00",
    "sameAs": []
  })} />
)}
```

Leave `telephone` empty until a business number is established. Leave `sameAs` empty until social profiles exist. Both can be updated in a future session.

In `src/pages/index.astro`, pass `isHome={true}` to BaseLayout:

```astro
<BaseLayout
  title="NextWave AI Solutions — Serious AI. Built locally."
  description="We build AI automation systems for local service businesses..."
  isHome={true}
>
```

---

### FAQ schema

Add to `src/pages/index.astro` inside `<head>` (via a slot or directly in BaseLayout with an `faqSchema` prop). Read the FAQ data from `src/data/faq.json` and render as JSON-LD:

```astro
---
import faqData from '../data/faq.json';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};
---

<script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
```

Add a `faqSchema` slot to `BaseLayout.astro` so pages can inject additional JSON-LD without modifying the layout component:

```astro
<head>
  <!-- existing head content -->
  <slot name="head" />
</head>
```

Then in `index.astro`:

```astro
<BaseLayout isHome={true} ...>
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
  <!-- page content -->
</BaseLayout>
```

**Verification:** After `npm run build`, open `dist/index.html` and confirm both JSON-LD blocks are present in the source. Paste the URL into Google's Rich Results Test (search.google.com/test/rich-results) after deploying and confirm LocalBusiness and FAQ schemas validate without errors.

---

## Task 3: OG image generation

**Goal:** A well-designed static default OG image for all pages, plus dynamic OG images for blog posts generated at build time using Satori.

---

### Static default OG image

Generate `public/images/og/og-default.png` programmatically using a build script. This replaces the placeholder from Phase 2.

Create `scripts/generate-og.mjs` at the project root:

```js
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Run: node scripts/generate-og.mjs

const out = 'public/images/og';
mkdirSync(out, { recursive: true });

async function generateOG({ title, subtitle, filename }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0A0E1A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Top: wordmark
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '8px', height: '8px',
                      borderRadius: '50%',
                      background: '#D4FF3D',
                    }
                  }
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '20px', fontWeight: '500', color: '#F4F1EA' },
                    children: 'NextWave'
                  }
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '20px', fontWeight: '500', color: 'rgba(244,241,234,0.42)' },
                    children: ' AI Solutions'
                  }
                }
              ]
            }
          },
          // Middle: headline
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '16px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: subtitle ? '56px' : '72px',
                      fontWeight: '500',
                      color: '#F4F1EA',
                      lineHeight: '1.1',
                      letterSpacing: '-0.03em',
                      maxWidth: '900px',
                    },
                    children: title
                  }
                },
                subtitle ? {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: '400',
                      color: 'rgba(244,241,234,0.55)',
                      lineHeight: '1.5',
                      maxWidth: '700px',
                    },
                    children: subtitle
                  }
                } : null
              ].filter(Boolean)
            }
          },
          // Bottom: tagline
          {
            type: 'div',
            props: {
              style: {
                fontSize: '16px',
                color: '#D4FF3D',
                fontWeight: '500',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              },
              children: 'Serious AI. Built locally.'
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: readFileSync('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: readFileSync('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff'),
          weight: 500,
          style: 'normal',
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(out, filename), png);
  console.log(`Generated: ${filename}`);
}

await generateOG({
  title: 'Serious AI. Built locally.',
  subtitle: 'AI automation systems for local service businesses.',
  filename: 'og-default.png',
});

console.log('OG images generated.');
```

Install dependencies:

```bash
npm install --save-dev satori sharp @fontsource/inter
```

Add to `package.json` scripts:

```json
"generate:og": "node scripts/generate-og.mjs"
```

Run once to generate the default image:

```bash
npm run generate:og
```

Commit the generated `public/images/og/og-default.png` to the repository. This image should be regenerated manually any time the default copy changes.

---

### Dynamic OG images for blog posts

Add dynamic OG generation to the blog post build pipeline using Astro's endpoint system.

Create `src/pages/og/[slug].png.ts`:

```ts
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'fs';

const interRegular = readFileSync('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff');
const interMedium = readFileSync('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff');

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  // Astro 7 Content Layer API: use post.id, not post.slug
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0A0E1A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Wordmark
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                { type: 'div', props: { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#D4FF3D' } } },
                { type: 'span', props: { style: { fontSize: '18px', fontWeight: '500', color: '#F4F1EA' }, children: 'NextWave' } },
                { type: 'span', props: { style: { fontSize: '18px', fontWeight: '500', color: 'rgba(244,241,234,0.42)' }, children: ' AI Solutions' } }
              ]
            }
          },
          // Post title
          {
            type: 'div',
            props: {
              style: {
                fontSize: '52px',
                fontWeight: '500',
                color: '#F4F1EA',
                lineHeight: '1.15',
                letterSpacing: '-0.025em',
                maxWidth: '960px',
              },
              children: post.data.title
            }
          },
          // Tag + date row
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '16px' },
              children: [
                post.data.tags[0] ? {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#D4FF3D',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(212,255,61,0.40)',
                      borderRadius: '100px',
                      padding: '4px 12px',
                    },
                    children: post.data.tags[0]
                  }
                } : null,
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '15px', color: 'rgba(244,241,234,0.42)' },
                    children: new Date(post.data.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  }
                }
              ].filter(Boolean)
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
```

Update `src/pages/blog/[slug].astro` to pass the dynamic OG image URL to BaseLayout:

```astro
<BaseLayout
  title={post.data.title}
  description={post.data.description}
  ogImage={`/og/${post.id}.png`}
>
```

**Verification:** After `npm run build`, confirm `dist/og/[slug].png` files exist for each non-draft blog post. Confirm the default `dist/images/og/og-default.png` exists. Check OG image dimensions with `file dist/og/*.png` (should be 1200x630).

---

## Task 4: Core Web Vitals audit (Lighthouse 90+ target)

**Goal:** Pass Lighthouse at 90 or above across all four categories (Performance, Accessibility, Best Practices, SEO) on the index page and all additional pages. Fix every issue blocking that target before declaring this task complete.

---

### Run the audit

```bash
npm run build
npm run preview
# In a separate terminal:
npx lighthouse http://localhost:4321 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"
```

Or use Chrome DevTools Lighthouse panel on the local preview server.

Run against: `/`, `/about`, `/services`, `/contact`, `/blog`

---

### Known likely issues and fixes

Resolve each category in this order: Performance first (most impactful), then Accessibility, then Best Practices, then SEO.

**Performance fixes to apply before running the audit:**

1. Font loading: confirm Fontshare is loaded with `font-display: swap`. If Astro is inlining font CSS, add `&display=swap` to the Fontshare URL if not already present.

2. Particle system: the `EmergentOrder.astro` canvas runs on the index page hero. Confirm it:
   - Uses `requestAnimationFrame` correctly with a timestamp delta check to skip frames when the tab is hidden (`document.visibilityState === 'hidden'`)
   - Does not run during Lighthouse audit (Lighthouse runs headless -- visibilityState will be `hidden`)
   - Lazy-initializes: the canvas script should fire after `DOMContentLoaded`, not in the `<head>`

3. Image optimization: confirm all images in `public/` are served as WebP where possible. Astro's built-in `<Image />` component handles this for images imported through `src/assets/`. For images in `public/`, convert manually using sharp:

```bash
node -e "
const sharp = require('sharp');
const { readdirSync } = require('fs');
// Convert any PNG in public/images/ to WebP
"
```

   The OG images remain PNG (required by the OG spec). All other images should be WebP.

4. Script loading: confirm all third-party scripts (Plausible, Cal.com embed, Fontshare) have `defer` or `async` attributes. No render-blocking scripts.

5. CSS: Tailwind's purge/content config should already eliminate unused CSS at build time. Confirm `tailwind.config.mjs` includes all Astro file paths:

```js
content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}']
```

**Accessibility fixes to apply proactively:**

1. Confirm all `<img>` tags have descriptive `alt` attributes. The wordmark SVGs should have `role="img"` and `<title>` elements (already specified in Phase 1).

2. Confirm the chat widget trigger button has `aria-label="Open chat"` and `aria-expanded` state toggled on open/close.

3. Confirm the FAQ accordion has `aria-expanded` on the trigger button and `aria-controls` pointing to the answer panel. Answer panels should have `role="region"` and `aria-labelledby` pointing to the trigger.

4. Color contrast: run the Lighthouse accessibility audit and address any contrast failures. The known risk is `var(--ink-on-dark-soft)` (rgba(244,241,234,0.42)) on `var(--bg-ink)` -- this may fail AA for body text. If flagged, only use this color for decorative or non-essential text (dates, labels), not for readable body copy.

5. Focus visible: confirm all interactive elements show the brand focus ring (`box-shadow: 0 0 0 3px rgba(212,255,61,0.30)`) on keyboard focus. Add to `global.css` if not already present:

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(212,255,61,0.30);
}
```

**SEO fixes to apply proactively:**

1. Confirm every page has a unique `<title>` and `<meta name="description">` (BaseLayout already handles this via props).

2. Confirm the sitemap is generating and the `<link rel="sitemap">` tag is in every page head.

3. Confirm canonical tags are present and correct on every page.

4. Heading hierarchy: every page must have exactly one `<h1>` (the hero headline), followed by `<h2>` section headlines, followed by `<h3>` card headlines. No skipped levels.

---

### Scoring targets

| Category | Target | Blocking threshold |
|---|---|---|
| Performance | 90+ | Below 85 = fix before launch |
| Accessibility | 95+ | Below 90 = fix before launch |
| Best Practices | 95+ | Below 90 = fix before launch |
| SEO | 100 | Below 95 = fix before launch |

Run Lighthouse after each fix, not just at the end. Some fixes have cascading effects.

**Verification:** Lighthouse scores of 90+ across all four categories on all five pages (`/`, `/about`, `/services`, `/contact`, `/blog`). Screenshot or export the final reports and save to `docs/lighthouse/` in the repo.

---

## Out of scope for Phase 4

- Case study pages
- /services/[slug] detail sub-pages
- Email marketing integration
- CRM integration
- A/B testing
- Multi-language support

---

## Environment variables summary (all phases)

| Variable | Where set | Purpose |
|---|---|---|
| `PUBLIC_PLAUSIBLE_DOMAIN` | Cloudflare Pages (Production only) | Plausible analytics domain |
| `PUBLIC_CAL_LINK` | `.env.local` + Cloudflare Pages | Cal.com event link |
| `RESEND_API_KEY` | Cloudflare Pages | Contact form email delivery |
| `CONTACT_EMAIL` | Cloudflare Pages | Inbox for form submissions |
| `ANTHROPIC_API_KEY` | Cloudflare Pages (Production only) | Claude chat widget |

---

## Commands

```bash
npm run dev                          # local dev server
npm run build                        # production build
npm run preview                      # serve dist/ locally
npm run generate:og                  # regenerate static OG image
npx astro check                      # TypeScript + Astro type checking
npx wrangler pages dev dist          # test Cloudflare Functions locally
npx lighthouse http://localhost:4321 --output=html --output-path=./lh.html --chrome-flags="--headless"
```

---

## Verification checklist before declaring Phase 4 complete

- [ ] Chat widget sends real messages to Claude API and receives contextually appropriate replies
- [ ] Chat widget typing indicator appears and dismisses correctly
- [ ] Cal.com booking link inside chat responses opens the modal (not a new tab)
- [ ] Chat widget falls back gracefully if the API is unavailable
- [ ] LocalBusiness JSON-LD is present in index page source
- [ ] FAQ JSON-LD is present in index page source
- [ ] Both schemas validate in Google Rich Results Test with zero errors
- [ ] `public/images/og/og-default.png` exists and is 1200x630
- [ ] Dynamic OG images generate for all non-draft blog posts at build time
- [ ] Lighthouse Performance 90+ on all five pages
- [ ] Lighthouse Accessibility 95+ on all five pages
- [ ] Lighthouse Best Practices 95+ on all five pages
- [ ] Lighthouse SEO 100 on all five pages
- [ ] Lighthouse reports saved to `docs/lighthouse/`
- [ ] `npx astro check` passes with zero errors
- [ ] `npm run build` completes with zero errors
- [ ] No em dashes in any copy added this phase
- [ ] No colors outside brand token system introduced this phase

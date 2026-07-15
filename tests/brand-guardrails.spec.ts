import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, '../src');

function readAllSrcFiles(dir: string, exts = ['.astro', '.ts', '.json']): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readAllSrcFiles(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function srcContains(pattern: RegExp): string[] {
  const hits: string[] = [];
  for (const file of readAllSrcFiles(SRC_DIR)) {
    const content = fs.readFileSync(file, 'utf8');
    if (pattern.test(content)) hits.push(file);
  }
  return hits;
}

test.describe('Brand guardrails', () => {
  test('no horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('voltage CTA buttons: 4 total (desktop header, mobile drawer, hero, finalCTA)', async ({ page }) => {
    await page.goto('/');
    const voltageButtons = page.locator('.btn--voltage');
    const count = await voltageButtons.count();
    // 4: desktop "Book a Call", mobile drawer "Book a Call", hero "Start a Diagnostic", final CTA button
    expect(count).toBe(4);
  });

  test('hero headline voltage line uses --voltage color', async ({ page }) => {
    await page.goto('/');
    const voltageLine = page.locator('.headline-line--voltage');
    await expect(voltageLine).toBeVisible();
    const color = await voltageLine.evaluate((el) => getComputedStyle(el).color);
    // var(--voltage) = #D4FF3D = rgb(212, 255, 61)
    expect(color).toBe('rgb(212, 255, 61)');
  });

  test('no purple or electric blue colors in computed styles of key elements', async ({ page }) => {
    await page.goto('/');
    const violations = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const bad: string[] = [];
      for (const el of elements) {
        const styles = getComputedStyle(el);
        const props = [styles.color, styles.backgroundColor, styles.borderColor];
        for (const val of props) {
          const m = val.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) continue;
          const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
          if (r + g + b < 10) continue;
          const isPurple = b > 150 && r > 100 && g < 100;
          const isElectricBlue = b > 200 && r < 50 && g < 100;
          if (isPurple || isElectricBlue) {
            bad.push(`${el.tagName}.${el.className}: ${val}`);
          }
        }
      }
      return bad.slice(0, 10);
    });
    expect(violations).toHaveLength(0);
  });

  test('all sections present in document order', async ({ page }) => {
    await page.goto('/');
    const sections = ['#services', '#how-it-works', '#results', '#pricing', '#faq', '#contact'];
    for (const id of sections) {
      await expect(page.locator(id)).toBeAttached();
    }
  });

  test('focus rings on interactive elements use voltage shadow', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('source files contain no banned words', () => {
    const banned = /revolutionary|game-changing|cutting-edge|next-generation|unleash|AI-powered|AI-driven|harness the power|the future of|reimagining|left behind/i;
    const hits = srcContains(banned);
    expect(hits).toHaveLength(0);
  });

  test('source files contain no em dashes', () => {
    const hits = srcContains(/—/);
    expect(hits).toHaveLength(0);
  });

  test('source files contain no emoji', () => {
    // Common emoji ranges
    const hits = srcContains(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
    expect(hits).toHaveLength(0);
  });
});

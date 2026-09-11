import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/about/', '/contact/', '/catherine-ai/', '/brickwise/'];

for (const path of pages) {
  test(`${path} renders accessible content across desktop, tablet, and mobile`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('main')).toHaveCount(1);
      const bounds = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(bounds.content, `${path} at ${width}px`).toBeLessThanOrEqual(bounds.viewport);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test('homepage takes visitors to both announcement pages and back to the parent company', async ({
  page,
}) => {
  for (const product of [
    { link: 'Discover Catherine AI', path: '/catherine-ai/' },
    { link: 'Discover Brickwise', path: '/brickwise/' },
  ]) {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore our businesses', exact: true }).click();
    await expect(page).toHaveURL(/#businesses$/);
    await page.getByRole('link', { name: product.link, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(product.path + '$'));
    await expect(page.locator('main').getByText('Coming soon', { exact: true })).toBeVisible();
    await expect(page.locator('form, input, textarea, iframe')).toHaveCount(0);
    await page.getByRole('link', { name: 'Meet the company behind it' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(
      page.getByRole('heading', { name: 'People. Expertise. Possibility.' }),
    ).toBeVisible();
  }
});

test('subsidiary links use the public domain and identify their new-tab behavior', async ({
  page,
}) => {
  await page.goto('/');
  const sage = page.getByRole('link', { name: 'Visit Jonesboro Sage (opens in a new tab)' });
  await expect(sage).toHaveAttribute('href', 'https://jonesborosage.com');
  await expect(sage).toHaveAttribute('target', '_blank');
  await expect(sage).toHaveAttribute('rel', 'noopener noreferrer');
});

test('founder and contact placeholders are clearly labeled and do not create fake functionality', async ({
  page,
}) => {
  await page.goto('/about/#founders');
  await expect(page.getByText('Founder name', { exact: true })).toHaveCount(3);
  await expect(page.getByText('Biography coming soon.', { exact: true })).toHaveCount(3);
  await page.goto('/contact/');
  await expect(page.getByText('Email address coming soon', { exact: true })).toHaveCount(2);
  await expect(page.locator('a[href^="mailto:"], form, input')).toHaveCount(0);
});

test('all internal links resolve and point to real fragment targets', async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    const pageLinks = await page
      .locator('a[href]')
      .evaluateAll((anchors) =>
        anchors
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((href) => href.startsWith(location.origin)),
      );
    pageLinks.forEach((href) => links.add(href));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://naerix.com${path}`,
    );
  }
  for (const href of links) {
    const url = new URL(href);
    const response = await request.get(url.pathname);
    expect(response.status(), href).toBe(200);
    if (url.hash) {
      await page.goto(href);
      await expect(page.locator(`[id="${url.hash.slice(1)}"]`), href).toHaveCount(1);
    }
  }
});

test('unknown pages show a usable recovery page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'A different direction.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to Naerix', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Expertise\.\s*Amplified\./);
});

test('content and mobile navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4323/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.motion-button')).toBeHidden();
  await page.locator('summary').click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: /About/ })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('People. Expertise.');
  await context.close();
});

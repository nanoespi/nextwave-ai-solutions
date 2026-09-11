import { test, expect, type Page } from '@playwright/test';

const renderedGeometry = (page: Page) =>
  page
    .locator('.sculpture-object polygon')
    .evaluateAll((polygons) => polygons.map((polygon) => polygon.getAttribute('points')).join('|'));

const waitForFrames = (page: Page, count = 12) =>
  page.evaluate(async (frames) => {
    for (let i = 0; i < frames; i++)
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }, count);

test('skip link moves focus into main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Explore our businesses', exact: true }),
  ).toBeFocused();
});

test('mobile menu supports Escape, same-page focus, and focus transfer on resize', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.mobile-menu');
  const summary = menu.locator('summary');
  await summary.click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
  await summary.click();
  const businesses = page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: /Our businesses/ });
  await businesses.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#businesses$/);
  await expect(menu).not.toHaveAttribute('open');
  await expect(page.locator('#businesses')).toBeFocused();
  await page.goto('/');
  await summary.click();
  await businesses.focus();
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Our businesses' }),
  ).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(menu).not.toHaveAttribute('open');
});

test('mobile menu closes when tabbing out and on outside pointer interaction', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.mobile-menu');
  await menu.locator('summary').click();
  await menu.getByRole('link', { name: /Contact/ }).focus();
  await page.keyboard.press('Tab');
  await expect(menu).not.toHaveAttribute('open');
  await expect(
    page.getByRole('link', { name: 'Explore our businesses', exact: true }),
  ).toBeFocused();
  await menu.locator('summary').click();
  await page.mouse.click(20, 530);
  await expect(menu).not.toHaveAttribute('open');
  expect(
    await page.locator(':focus').evaluate((element) => !!element.getClientRects().length),
  ).toBe(true);
});

test('motion can be paused and the choice survives scrolling away and back', async ({ page }) => {
  await page.goto('/');
  const sculpture = page.locator('[data-sculpture]');
  const initial = await renderedGeometry(page);
  await expect.poll(() => renderedGeometry(page)).not.toBe(initial);
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  await expect(sculpture).toHaveAttribute('data-paused', 'true');
  const paused = await renderedGeometry(page);
  await waitForFrames(page);
  expect(await renderedGeometry(page)).toBe(paused);
  await page.locator('#values').scrollIntoViewIfNeeded();
  await page.locator('#hero-title').scrollIntoViewIfNeeded();
  await expect(sculpture).toHaveAttribute('data-paused', 'true');
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await expect.poll(() => sculpture.getAttribute('data-paused')).toBe('false');
  await expect.poll(() => renderedGeometry(page)).not.toBe(paused);
  await page.locator('#values').scrollIntoViewIfNeeded();
  await expect.poll(() => sculpture.getAttribute('data-paused')).toBe('true');
  const offscreen = await renderedGeometry(page);
  await waitForFrames(page);
  expect(await renderedGeometry(page)).toBe(offscreen);
});

test('reduced motion disables animation on load and responds to a preference change', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Play motion' })).toBeVisible();
  const initial = await renderedGeometry(page);
  await waitForFrames(page);
  expect(await renderedGeometry(page)).toBe(initial);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeVisible();
  await expect.poll(() => renderedGeometry(page)).not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Play motion' })).toBeVisible();
  const stopped = await renderedGeometry(page);
  await waitForFrames(page);
  expect(await renderedGeometry(page)).toBe(stopped);
});

test('reduced-motion visitors can explicitly play and pause the sculpture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const initial = await renderedGeometry(page);
  await page.getByRole('button', { name: 'Play motion' }).click();
  await expect.poll(() => renderedGeometry(page)).not.toBe(initial);
  await page.getByRole('button', { name: 'Pause motion' }).click();
  const paused = await renderedGeometry(page);
  await waitForFrames(page);
  expect(await renderedGeometry(page)).toBe(paused);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  await waitForFrames(page);
  expect(await renderedGeometry(page)).toBe(paused);
});

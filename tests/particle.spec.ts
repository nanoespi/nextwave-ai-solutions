import { test, expect } from '@playwright/test';

test.describe('EmergentOrder particle system', () => {
  test('canvas element is present and sized to its container', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('#emergent-canvas');
    await expect(canvas).toBeVisible();

    const canvasBox = await canvas.boundingBox();
    const containerBox = await page.locator('.emergent-order').boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(containerBox).not.toBeNull();
    expect(Math.abs((canvasBox?.width ?? 0) - (containerBox?.width ?? 0))).toBeLessThan(2);
    expect(Math.abs((canvasBox?.height ?? 0) - (containerBox?.height ?? 0))).toBeLessThan(2);
  });

  test('no console errors during particle animation', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(3000);
    expect(errors).toHaveLength(0);
  });

  test('with prefers-reduced-motion, static pattern is shown instead of canvas', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('/');

    const canvas = page.locator('#emergent-canvas');
    const staticEl = page.locator('#emergent-static');

    const canvasDisplay = await canvas.evaluate((el) => window.getComputedStyle(el).display);
    const staticDisplay = await staticEl.evaluate((el) => window.getComputedStyle(el).display);

    expect(canvasDisplay).toBe('none');
    expect(staticDisplay).not.toBe('none');
    await context.close();
  });
});

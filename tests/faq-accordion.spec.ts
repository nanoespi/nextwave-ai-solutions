import { test, expect } from '@playwright/test';

test.describe('FAQ accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-faq-item]');
  });

  test('opens an item on click and icon swaps to minus', async ({ page }) => {
    const firstTrigger = page.locator('[data-faq-item]').first().locator('.faq-item__trigger');
    await firstTrigger.click();

    const firstItem = page.locator('[data-faq-item]').first();
    await expect(firstItem).toHaveClass(/faq-item--open/);
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');

    // Wait for CSS transition (var(--dur-fast) = 0.25s) then check final opacity
    await page.waitForTimeout(350);
    const minus = firstItem.locator('.icon-minus');
    const plus = firstItem.locator('.icon-plus');
    const minusOpacity = await minus.evaluate((el) => getComputedStyle(el).opacity);
    const plusOpacity = await plus.evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(minusOpacity)).toBe(1);
    expect(parseFloat(plusOpacity)).toBe(0);
  });

  test('opening a second item collapses the first', async ({ page }) => {
    const items = page.locator('[data-faq-item]');

    await items.nth(0).locator('.faq-item__trigger').click();
    await expect(items.nth(0)).toHaveClass(/faq-item--open/);

    await items.nth(1).locator('.faq-item__trigger').click();
    await expect(items.nth(1)).toHaveClass(/faq-item--open/);
    await expect(items.nth(0)).not.toHaveClass(/faq-item--open/);
  });

  test('clicking an open item closes it', async ({ page }) => {
    const firstTrigger = page.locator('[data-faq-item]').first().locator('.faq-item__trigger');
    await firstTrigger.click();
    await expect(page.locator('[data-faq-item]').first()).toHaveClass(/faq-item--open/);

    await firstTrigger.click();
    await expect(page.locator('[data-faq-item]').first()).not.toHaveClass(/faq-item--open/);
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  });
});

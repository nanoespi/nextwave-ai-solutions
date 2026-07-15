import { test, expect } from '@playwright/test';

test.describe('Header navigation', () => {
  test('nav links are present', async ({ page }) => {
    await page.goto('/');
    const links = ['Services', 'How It Works', 'Pricing', 'About', 'Contact'];
    for (const label of links) {
      await expect(page.locator(`.nav-link:has-text("${label}")`).first()).toBeAttached();
    }
  });

  test('mobile hamburger opens and closes drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const hamburger = page.locator('#hamburger-btn');
    const drawer = page.locator('#mobile-drawer');

    await expect(hamburger).toBeVisible();
    await expect(drawer).toBeHidden();

    await hamburger.click();
    await expect(drawer).toBeVisible();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await hamburger.click();
    await expect(drawer).toBeHidden();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });
});

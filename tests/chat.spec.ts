import { test, expect } from '@playwright/test';

test.describe('Chat widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#chat-trigger');
  });

  test('trigger opens the chat panel', async ({ page }) => {
    await page.click('#chat-trigger');
    await expect(page.locator('#chat-panel')).toHaveClass(/chat-panel--open/);
    await expect(page.locator('#chat-trigger')).toHaveAttribute('aria-expanded', 'true');
  });

  test('greeting message appears on open', async ({ page }) => {
    await page.click('#chat-trigger');
    await expect(page.locator('.chat-bubble--bot').first()).toBeVisible({ timeout: 2000 });
    await expect(page.locator('.chat-bubble--bot').first()).toContainText('costing you the most');
  });

  test('known keyword returns a predefined response', async ({ page }) => {
    await page.click('#chat-trigger');
    await page.waitForSelector('.chat-bubble--bot');

    await page.fill('#chat-input', 'missed calls');
    await page.click('#chat-send');

    await expect(page.locator('.chat-bubble--user').first()).toContainText('missed calls');
    const botReplies = page.locator('.chat-bubble--bot');
    await expect(botReplies).toHaveCount(2, { timeout: 2000 });
    await expect(botReplies.last()).toContainText('voice agent');
  });

  test('close button hides the panel', async ({ page }) => {
    await page.click('#chat-trigger');
    await expect(page.locator('#chat-panel')).toHaveClass(/chat-panel--open/);

    await page.click('#chat-close');
    await expect(page.locator('#chat-panel')).not.toHaveClass(/chat-panel--open/);
    await expect(page.locator('#chat-trigger')).toHaveAttribute('aria-expanded', 'false');
  });
});

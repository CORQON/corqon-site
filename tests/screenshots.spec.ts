import { test, expect } from '@playwright/test';

const desktopSizes = [
  { width: 1280, height: 800, name: '1280x800' },
  { width: 1440, height: 900, name: '1440x900' },
];

const mobileSizes = [
  { width: 375, height: 812, name: '375x812' },
  { width: 390, height: 844, name: '390x844' },
];

test.describe('Desktop Screenshots', () => {
  for (const size of desktopSizes) {
    test(`Home page - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Wait for any animations to settle
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot(`home-${size.name}.png`, {
        fullPage: true,
        maxDiffPixels: 0, // Zero tolerance for desktop
      });
    });

    test(`Contact page - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot(`contact-${size.name}.png`, {
        fullPage: true,
        maxDiffPixels: 0, // Zero tolerance for desktop
      });
    });
  }
});

test.describe('Mobile Screenshots', () => {
  for (const size of mobileSizes) {
    test(`Home page - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot(`home-mobile-${size.name}.png`, {
        fullPage: true,
      });
    });

    test(`Contact page - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot(`contact-mobile-${size.name}.png`, {
        fullPage: true,
      });
    });
  }
});


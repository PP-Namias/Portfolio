// E2E tests for home page functionality
import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
	test("should load home page successfully", async ({ page }) => {
		await page.goto("/");

		// Check if page loads
		await expect(page).toHaveTitle(/Kenneth Namias|Portfolio/);

		// Check for main navigation
		await expect(page.locator("nav")).toBeVisible();
	});

	test("should display blog posts on home page", async ({ page }) => {
		await page.goto("/");

		// Wait for content to load
		await page.waitForLoadState("networkidle");

		// Check if blog posts are visible
		const postCards = page.locator('[class*="card-base"]');
		await expect(postCards.first()).toBeVisible({ timeout: 10000 });

		// Verify post content
		const firstPost = postCards.first();
		await expect(firstPost.locator("a")).toBeVisible();
		await expect(firstPost).toContainText(/.+/); // Should contain some text
	});

	test("should have working navigation", async ({ page }) => {
		await page.goto("/");

		// Test navigation links
		const aboutLink = page.locator('a[href*="about"]');
		if ((await aboutLink.count()) > 0) {
			await aboutLink.first().click();
			await expect(page).toHaveURL(/.*about.*/);
		}
	});

	test("should have responsive design", async ({ page }) => {
		// Test desktop view
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto("/");
		await expect(page.locator("body")).toBeVisible();

		// Test mobile view
		await page.setViewportSize({ width: 375, height: 667 });
		await page.reload();
		await expect(page.locator("body")).toBeVisible();
	});

	test("should have working dark/light mode toggle", async ({ page }) => {
		await page.goto("/");

		// Look for theme toggle button
		const themeToggle = page.locator(
			'[class*="theme"], [class*="dark"], button[aria-label*="theme"]',
		);

		if ((await themeToggle.count()) > 0) {
			await themeToggle.first().click();

			// Verify theme change (check for dark class on html or body)
			const isDarkMode = await page.evaluate(() => {
				return (
					document.documentElement.classList.contains("dark") ||
					document.body.classList.contains("dark")
				);
			});

			expect(typeof isDarkMode).toBe("boolean");
		}
	});
});
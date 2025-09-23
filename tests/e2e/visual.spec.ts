// Visual regression tests
import { expect, test } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
	test("Homepage visual regression", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Take screenshot of full page
		await expect(page).toHaveScreenshot("homepage-full.png", {
			fullPage: true,
			threshold: 0.2,
		});
	});

	test("About page visual regression", async ({ page }) => {
		await page.goto("/about/");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveScreenshot("about-page.png", {
			fullPage: true,
			threshold: 0.2,
		});
	});

	test("Projects page visual regression", async ({ page }) => {
		await page.goto("/posts/");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveScreenshot("projects-page.png", {
			fullPage: true,
			threshold: 0.2,
		});
	});

	test("Gallery page visual regression", async ({ page }) => {
		await page.goto("/posts/");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveScreenshot("gallery-page.png", {
			fullPage: true,
			threshold: 0.2,
		});
	});

	test("Mobile homepage visual regression", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveScreenshot("homepage-mobile.png", {
			fullPage: true,
			threshold: 0.2,
		});
	});

	test("Dark mode visual regression", async ({ page }) => {
		await page.goto("/");

		// Switch to dark mode if toggle exists
		const darkModeToggle = page.locator(
			'[class*="theme"], [class*="dark"], button[aria-label*="theme"]',
		);
		if ((await darkModeToggle.count()) > 0) {
			await darkModeToggle.first().click();
			await page.waitForTimeout(500); // Wait for theme transition
		}

		await page.waitForLoadState("networkidle");

		await expect(page).toHaveScreenshot("homepage-dark-mode.png", {
			fullPage: true,
			threshold: 0.2,
		});
	});

	test("Navigation component visual regression", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const navigation = page.locator("nav");
		await expect(navigation).toHaveScreenshot("navigation-component.png", {
			threshold: 0.1,
		});
	});

	test("Footer component visual regression", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const footer = page.locator('footer, [class*="footer"]');
		if ((await footer.count()) > 0) {
			await expect(footer.first()).toHaveScreenshot("footer-component.png", {
				threshold: 0.1,
			});
		}
	});
});

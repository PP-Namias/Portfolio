// E2E tests for accessibility

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility Tests", () => {
	test("should not have any automatically detectable accessibility issues", async ({
		page,
	}) => {
		await page.goto("/");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("should be keyboard navigable", async ({ page }) => {
		await page.goto("/");

		// Test tab navigation
		await page.keyboard.press("Tab");
		const firstFocusedElement = await page.evaluate(
			() => document.activeElement?.tagName,
		);
		expect(firstFocusedElement).toBeTruthy();

		// Test multiple tab presses
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press("Tab");
		}

		const focusedElement = await page.evaluate(
			() => document.activeElement?.tagName,
		);
		expect(focusedElement).toBeTruthy();
	});

	test("should have proper heading hierarchy", async ({ page }) => {
		await page.goto("/");

		const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
		expect(headings.length).toBeGreaterThan(0);

		// Check if page has at least one h1
		const h1Count = await page.locator("h1").count();
		expect(h1Count).toBeGreaterThanOrEqual(1);
	});

	test("should have alt text for images", async ({ page }) => {
		await page.goto("/");

		const images = await page.locator("img").all();

		for (const image of images) {
			const alt = await image.getAttribute("alt");
			const role = await image.getAttribute("role");
			const ariaLabel = await image.getAttribute("aria-label");

			// Image should have alt, role, or aria-label
			expect(
				alt !== null || role === "presentation" || ariaLabel !== null,
			).toBeTruthy();
		}
	});

	test("should have sufficient color contrast", async ({ page }) => {
		await page.goto("/");

		// Run axe specifically for color contrast
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();

		const colorContrastViolations = accessibilityScanResults.violations.filter(
			(violation) => violation.id === "color-contrast",
		);

		expect(colorContrastViolations).toEqual([]);
	});
});
			.analyze();

		const colorContrastViolations = accessibilityScanResults.violations.filter(
			(violation) => violation.id === "color-contrast",
		);

		expect(colorContrastViolations).toEqual([]);
	});
});
			.analyze();

		const colorContrastViolations = accessibilityScanResults.violations.filter(
			(violation) => violation.id === "color-contrast",
		);

		expect(colorContrastViolations).toEqual([]);
	});
});

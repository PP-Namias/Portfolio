// Unit tests for URL utilities
import { describe, expect, it } from "vitest";
import { getCategoryUrl, getPostUrlBySlug } from "../../src/utils/url-utils";

describe("URL Utils", () => {
	describe("getPostUrlBySlug", () => {
		it("should generate correct post URLs", () => {
			const slug = "test-post";
			const url = getPostUrlBySlug(slug);

			expect(url).toBe("/archive/test-post/");
		});

		it("should handle empty slug", () => {
			const url = getPostUrlBySlug("");

			expect(url).toBe("/archive/");
		});

		it("should handle special characters in slug", () => {
			const slug = "test-post-with-numbers-123";
			const url = getPostUrlBySlug(slug);

			expect(url).toBe("/archive/test-post-with-numbers-123/");
		});
	});

	describe("getCategoryUrl", () => {
		it("should generate correct category URLs", () => {
			const category = "technical";
			const url = getCategoryUrl(category);

			expect(url).toContain(category);
		});

		it("should handle null category", () => {
			const url = getCategoryUrl(null);

			expect(url).toBeDefined();
		});
	});
});

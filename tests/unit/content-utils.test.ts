// Unit tests for utility functions
import { describe, expect, it } from "vitest";
import { getSortedPosts } from "../../src/utils/content-utils";

describe("Content Utils", () => {
	describe("getSortedPosts", () => {
		it("should return posts sorted by publication date", async () => {
			const posts = await getSortedPosts();

			expect(posts).toBeDefined();
			expect(Array.isArray(posts)).toBe(true);

			// Check if posts are sorted by publication date (newest first)
			for (let i = 0; i < posts.length - 1; i++) {
				const currentDate = new Date(posts[i].data.published);
				const nextDate = new Date(posts[i + 1].data.published);
				expect(currentDate.getTime()).toBeGreaterThanOrEqual(
					nextDate.getTime(),
				);
			}
		});

		it("should filter out draft posts in production", async () => {
			// Mock production environment
			const originalEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = "production";

			const posts = await getSortedPosts();
			const draftPosts = posts.filter((post) => post.data.draft === true);

			expect(draftPosts).toHaveLength(0);

			// Restore environment
			process.env.NODE_ENV = originalEnv;
		});

		it("should include navigation properties", async () => {
			const posts = await getSortedPosts();

			if (posts.length > 1) {
				// Check if next/prev properties are set correctly
				expect(posts[0].data.prevSlug).toBeDefined();
				expect(posts[posts.length - 1].data.nextSlug).toBeDefined();
			}
		});
	});
});
	});
});
	});
});

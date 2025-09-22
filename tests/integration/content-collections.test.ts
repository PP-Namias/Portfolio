// Integration tests for content collections

import { getCollection } from "astro:content";
import { beforeAll, describe, expect, it } from "vitest";

describe("Content Collections Integration", () => {
	describe("Posts Collection", () => {
		it("should load posts collection successfully", async () => {
			const posts = await getCollection("posts");

			expect(posts).toBeDefined();
			expect(Array.isArray(posts)).toBe(true);
			expect(posts.length).toBeGreaterThan(0);
		});

		it("should have valid frontmatter for all posts", async () => {
			const posts = await getCollection("posts");

			posts.forEach((post) => {
				expect(post.data.title).toBeDefined();
				expect(post.data.published).toBeInstanceOf(Date);
				expect(typeof post.data.draft).toBe("boolean");
			});
		});

		it("should have unique slugs", async () => {
			const posts = await getCollection("posts");
			const slugs = posts.map((post) => post.slug);
			const uniqueSlugs = new Set(slugs);

			expect(slugs.length).toBe(uniqueSlugs.size);
		});
	});

	describe("Projects Collection", () => {
		it("should load projects collection successfully", async () => {
			const projects = await getCollection("projects");

			expect(projects).toBeDefined();
			expect(Array.isArray(projects)).toBe(true);
		});

		it("should have valid project data", async () => {
			const projects = await getCollection("projects");

			projects.forEach((project) => {
				expect(project.data.title).toBeDefined();
				expect(project.data.description).toBeDefined();
				expect(project.data.published).toBeInstanceOf(Date);
			});
		});
	});

	describe("Gallery Collection", () => {
		it("should load gallery collection successfully", async () => {
			const gallery = await getCollection("gallery");

			expect(gallery).toBeDefined();
			expect(Array.isArray(gallery)).toBe(true);
		});
	});
});
});
});

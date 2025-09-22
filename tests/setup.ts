import "@testing-library/jest-dom";
import { beforeAll, vi } from "vitest";

// Mock Astro modules
vi.mock("astro:content", () => ({
	getCollection: vi.fn(async (collection: string) => {
		// Mock posts data
		if (collection === "posts") {
			return [
				{
					id: "test-post",
					slug: "test-post",
					data: {
						title: "Test Post",
						published: new Date("2024-01-01"),
						draft: false,
						prevSlug: null,
						nextSlug: "another-post",
					},
				},
				{
					id: "another-post",
					slug: "another-post",
					data: {
						title: "Another Post",
						published: new Date("2024-01-02"),
						draft: false,
						prevSlug: "test-post",
						nextSlug: null,
					},
				},
			];
		}
		return [];
	}),
}));

// Global test setup
beforeAll(() => {
	// Setup any global test configurations here
});

// Mock global objects if needed
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

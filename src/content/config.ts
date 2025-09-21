import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({
		title: z.string().optional(),
		banner: z.string().optional(),
	}),
});

const projectsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		featured: z.boolean().optional().default(false),
		image: z.string().optional().default(""),
		technologies: z.array(z.string()).optional().default([]),
		demoUrl: z.string().optional(),
		codeUrl: z.string().optional(),
		category: z.string().optional().default(""),
		status: z.string().optional().default("completed"),
		tags: z.array(z.string()).optional().default([]),
		lang: z.string().optional().default(""),

		/* For internal use - navigation */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const galleryCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		featured: z.boolean().optional().default(false),
		category: z
			.enum([
				"enterprise",
				"web-development",
				"ai-automation",
				"architecture",
				"photography",
			])
			.optional()
			.default("web-development"),
		tags: z.array(z.string()).optional().default([]),

		// Enhanced project metadata following Gallery Best Practices Guide
		mainImage: z.string(),
		additionalImages: z.array(z.string()).optional().default([]),
		techStack: z.array(z.string()).optional().default([]),
		features: z.array(z.string()).optional().default([]),
		liveDemo: z.string().url().optional(),
		sourceCode: z.string().url().optional(),

		// Project details
		projectDate: z.date().optional(),
		client: z.string().optional(),
		teamSize: z.number().optional(),
		duration: z.string().optional(),

		// Challenges, solutions, and results
		challenges: z.array(z.string()).optional().default([]),
		solutions: z.array(z.string()).optional().default([]),
		results: z.array(z.string()).optional().default([]),

		// Legacy fields for backward compatibility
		location: z.string().optional().default(""),
		camera: z.string().optional().default(""),
		settings: z.string().optional().default(""),
		dimensions: z.string().optional().default(""),

		/* For internal use - navigation */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	projects: projectsCollection,
	gallery: galleryCollection,
};

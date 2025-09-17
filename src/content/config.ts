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
	schema: z.object({}),
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
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	projects: projectsCollection,
};

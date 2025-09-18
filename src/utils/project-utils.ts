import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

/**
 * Get all projects sorted by featured status and publication date
 */
export async function getSortedProjects(): Promise<ProjectEntry[]> {
	const projects = await getCollection("projects");

	return projects.sort((a, b) => {
		// Featured projects first
		if (a.data.featured && !b.data.featured) return -1;
		if (!a.data.featured && b.data.featured) return 1;

		// Then by published date (newest first)
		return (
			new Date(b.data.published).getTime() -
			new Date(a.data.published).getTime()
		);
	});
}

/**
 * Get featured projects only
 */
export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
	const projects = await getSortedProjects();
	return projects.filter((project) => project.data.featured);
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(
	category: string,
): Promise<ProjectEntry[]> {
	const projects = await getSortedProjects();
	return projects.filter(
		(project) =>
			project.data.category?.toLowerCase() === category.toLowerCase(),
	);
}

/**
 * Get related projects based on technologies used
 */
export async function getRelatedProjects(
	currentProject: ProjectEntry,
	limit = 3,
): Promise<ProjectEntry[]> {
	const allProjects = await getSortedProjects();
	const currentTechs = currentProject.data.technologies || [];

	if (currentTechs.length === 0) {
		return allProjects
			.filter((project) => project.slug !== currentProject.slug)
			.slice(0, limit);
	}

	// Calculate similarity score based on shared technologies
	const projectsWithScore = allProjects
		.filter((project) => project.slug !== currentProject.slug)
		.map((project) => {
			const projectTechs = project.data.technologies || [];
			const sharedTechs = projectTechs.filter((tech) =>
				currentTechs.includes(tech),
			);
			return {
				project,
				score: sharedTechs.length,
			};
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score);

	return projectsWithScore.slice(0, limit).map((item) => item.project);
}

/**
 * Get project statistics
 */
export async function getProjectStats() {
	const projects = await getCollection("projects");

	const stats = {
		total: projects.length,
		featured: projects.filter((p) => p.data.featured).length,
		categories: [
			...new Set(projects.map((p) => p.data.category).filter(Boolean)),
		],
		technologies: [
			...new Set(projects.flatMap((p) => p.data.technologies || [])),
		],
		statusBreakdown: projects.reduce(
			(acc, project) => {
				const status = project.data.status || "unknown";
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		),
	};

	return stats;
}

/**
 * Search projects by title or description
 */
export async function searchProjects(query: string): Promise<ProjectEntry[]> {
	const projects = await getSortedProjects();
	const searchTerm = query.toLowerCase();

	return projects.filter(
		(project) =>
			project.data.title.toLowerCase().includes(searchTerm) ||
			project.data.description.toLowerCase().includes(searchTerm) ||
			(project.data.technologies || []).some((tech) =>
				tech.toLowerCase().includes(searchTerm),
			),
	);
}

/**
 * Get project URL
 */
export function getProjectUrl(project: ProjectEntry): string {
	return `/projects/${project.slug}/`;
}

/**
 * Format project date
 */
export function formatProjectDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

/**
 * Get project reading time estimate
 */
export function estimateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const wordCount = content.split(/\s+/).length;
	return Math.ceil(wordCount / wordsPerMinute);
}

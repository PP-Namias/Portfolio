// Mock for astro:content module
export const getCollection = async (collection: string) => {
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
};

// Mock other exports if needed
export const getEntryBySlug = async (collection: string, slug: string) => {
	const items = await getCollection(collection);
	return items.find((item) => item.slug === slug);
};
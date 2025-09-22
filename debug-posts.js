// Debug script to check posts collection
import { getCollection } from "astro:content";

async function debugPosts() {
	try {
		console.log("Fetching posts collection...");
		const posts = await getCollection("posts");
		console.log(`Found ${posts.length} posts:`);
		posts.forEach((post, index) => {
			console.log(
				`${index + 1}. ${post.data.title} - Draft: ${post.data.draft} - Published: ${post.data.published}`,
			);
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
	}
}

debugPosts();

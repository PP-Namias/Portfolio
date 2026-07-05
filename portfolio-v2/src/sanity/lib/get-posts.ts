import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface PostData {
  title: string;
  slug: { current: string };
  excerpt: string;
  body: unknown[];
  mainImage: { asset: { url: string } } | null;
  publishedAt: string;
  categories: Array<{ title: string; slug: { current: string } }>;
  tags: string[];
}

export async function getPosts() {
  return sanityFetch<PostData[]>(QUERIES.posts, undefined, {
    tags: ["cms:posts"],
  });
}

export async function getPostBySlug(slug: string) {
  return sanityFetch<PostData>(QUERIES.postBySlug, { slug }, {
    tags: ["cms:posts"],
  });
}

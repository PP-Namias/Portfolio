import { BlogPost } from '@/types';
import blogData from '../../portfolio-resources/data/blog.json';
import { safeFetchSanity } from '@/lib/sanity';

export const blogPosts: BlogPost[] = blogData;

export async function getBlogPosts(): Promise<BlogPost[]> {
  const query = '*[_type == "blogPost"] | order(publishedDate desc)';
  return safeFetchSanity<BlogPost[]>(query, blogData);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = '*[_type == "blogPost" && slug.current == $slug][0]';
  const result = await safeFetchSanity<BlogPost | null>(query, null, 2000);
  if (result) return result;
  
  const jsonPost = blogData.find(post => post.slug === slug);
  return jsonPost || null;
}

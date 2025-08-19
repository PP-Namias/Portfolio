import { useQuery } from '@tanstack/react-query';
import { client, blogQueries } from '../lib/sanity';
import { BlogPost, BlogListItem } from '../data/blog';

// Hook to fetch all blog posts
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const posts = await client.fetch<BlogListItem[]>(blogQueries.allPosts);
        return posts || [];
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch a single blog post by slug
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const post = await client.fetch<BlogPost>(blogQueries.postBySlug, { slug });
      return post;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch featured blog posts
export function useFeaturedPosts() {
  return useQuery({
    queryKey: ['featured-posts'],
    queryFn: async () => {
      const posts = await client.fetch<BlogListItem[]>(blogQueries.featuredPosts);
      return posts;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to fetch posts by category
export function usePostsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ['posts-by-category', categorySlug],
    queryFn: async () => {
      const posts = await client.fetch<BlogListItem[]>(blogQueries.postsByCategory, { categorySlug });
      return posts;
    },
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

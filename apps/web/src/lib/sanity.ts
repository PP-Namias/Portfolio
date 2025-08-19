import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Use environment variables for better deployment management
// Updated for PP Namias Portfolio project: gerattrr
export const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'gerattrr',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true, // Use CDN for better performance in production
  apiVersion: '2024-01-01',
  perspective: 'published', // Only fetch published documents
  stega: false, // Disable Stega for frontend
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ queries for blog content
export const blogQueries = {
  // Test query to check connection
  test: `*[_type == "post"]`,
  
  // Get all blog posts (with essential fields for the blog list)
  allPosts: `*[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    published,
    _createdAt,
    author->{
      name,
      image
    },
    categories[]->{
      title,
      slug
    }
  }`,
  
  // Get a single blog post by slug
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      title,
      slug
    }
  }`,
  
  // Get featured posts
  featuredPosts: `*[_type == "post" && published == true && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{
      name,
      image
    }
  }`,
  
  // Get posts by category
  postsByCategory: `*[_type == "post" && published == true && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{
      name,
      image
    }
  }`
};

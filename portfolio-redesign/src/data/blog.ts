// Import clean JSON data
import blogData from './json/blog-posts-clean.json';

// Blog Post Interface
export interface BlogPost {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  publishedAt: string;
  updatedAt: string;
  status: string;
  featured: boolean;
  readingTime: number;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  author: {
    name: string;
    image: string;
    bio: string;
  };
  coverImage: {
    url: string;
    alt: string;
    caption: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Blog Collection Interface
export interface BlogCollection {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _version: number;
  posts: BlogPost[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    count: number;
  }>;
  tags: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  authors: Array<{
    id: string;
    name: string;
    bio: string;
    image: string;
    socialLinks: {
      github: string;
      linkedin: string;
      twitter: string;
      website: string;
    };
    postsCount: number;
  }>;
  statistics: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    featuredPosts: number;
    totalViews: number;
    totalLikes: number;
    averageReadingTime: number;
    categoriesCount: number;
    tagsCount: number;
  };
  recentActivity: {
    lastPublished: string;
    postsThisMonth: number;
    viewsThisMonth: number;
    likesThisMonth: number;
  };
}

// Export typed data
export const blogCollection: BlogCollection = blogData as BlogCollection;
export const blogPosts: BlogPost[] = blogCollection.posts;
export const featuredPosts: BlogPost[] = blogCollection.posts.filter(post => post.featured);

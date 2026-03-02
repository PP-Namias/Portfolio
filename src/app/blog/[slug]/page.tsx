import { Metadata } from 'next';
import { blogPosts } from '@/data/blogPosts';
import BlogPostContent from './BlogPostContent';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    return { title: 'Post Not Found | Jhon Keneth Namias' };
  }
  return {
    title: `${post.title} | Jhon Keneth Namias`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostContent slug={params.slug} />;
}

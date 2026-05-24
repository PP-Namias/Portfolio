import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogPosts';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import BlogPostContent from './BlogPostContent';

export function generateStaticParams() {
  if (!IS_BLOG_VISIBLE) {
    return [];
  }

  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return { title: 'Post Not Found | Jhon Keneth Ryan Namias' };
  }
  return {
    title: `${post.title} | Jhon Keneth Ryan Namias`,
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!IS_BLOG_VISIBLE) {
    notFound();
  }

  const { slug } = await params;

  const post = blogPosts.find((p) => p.slug === slug);

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: {
          '@type': 'Person',
          name: 'Jhon Keneth Ryan Namias',
          url: 'https://namias.tech',
        },
        image: post.coverImage ? `https://namias.tech${post.coverImage}` : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogPostContent slug={slug} />
    </>
  );
}

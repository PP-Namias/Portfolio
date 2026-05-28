import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCmsContent } from '@/lib/cms-content.server';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import BlogPostContent from './BlogPostContent';
import type { BlogPost } from '@/types';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (!IS_BLOG_VISIBLE) {
    return [];
  }

  const { blogPosts } = await getCmsContent();
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : [
    { slug: 'hello-world' },
    { slug: 'deep-dive' },
  ];

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { blogPosts } = await getCmsContent();
  const fallbackPosts: BlogPost[] = [
    { id: '1', slug: 'hello-world', title: 'Hello World', excerpt: 'Intro', content: '', date: new Date().toISOString(), readTime: '5 min', tags: [], coverImage: '' },
    { id: '2', slug: 'deep-dive', title: 'Deep Dive', excerpt: 'Deep dive', content: '', date: new Date().toISOString(), readTime: '7 min', tags: [], coverImage: '' },
  ];
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : fallbackPosts;

  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return { title: 'Post Not Found | Jhon Keneth Ryan Namias' };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title: `${title} | Jhon Keneth Ryan Namias`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  if (!IS_BLOG_VISIBLE) {
    notFound();
  }

  const { slug } = await params;
  const { blogPosts, siteSettings } = await getCmsContent();
  const blogCopy = siteSettings.blog;
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : [
    { id: '1', slug: 'hello-world', title: 'Hello World', excerpt: 'Intro', content: '', date: new Date().toISOString(), readTime: '5 min', tags: [], coverImage: '' },
    { id: '2', slug: 'deep-dive', title: 'Deep Dive', excerpt: 'Deep dive', content: '', date: new Date().toISOString(), readTime: '7 min', tags: [], coverImage: '' },
  ];

  const post = posts.find((p) => p.slug === slug);

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
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
      <BlogPostContent post={post ?? null} allPosts={posts} backLabel={blogCopy.backLabel || 'Back to Blog'} />
    </>
  );
}

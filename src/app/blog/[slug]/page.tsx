import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCmsContent } from '@/lib/cms-content.server';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import BlogPostContent from './BlogPostContent';

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
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : [
    { id: '1', slug: 'hello-world', title: 'Hello World', excerpt: 'Intro', date: new Date().toISOString(), coverImage: '' },
    { id: '2', slug: 'deep-dive', title: 'Deep Dive', excerpt: 'Deep dive', date: new Date().toISOString(), coverImage: '' },
  ];

  const post = posts.find((p) => p.slug === slug);
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

export default async function BlogPostPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  if (!IS_BLOG_VISIBLE) {
    notFound();
  }

  const { slug } = await params;
  const { blogPosts } = await getCmsContent();
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : [
    { id: '1', slug: 'hello-world', title: 'Hello World', excerpt: 'Intro', content: '', date: new Date().toISOString(), readTime: '5 min', tags: [], coverImage: '' },
    { id: '2', slug: 'deep-dive', title: 'Deep Dive', excerpt: 'Deep dive', content: '', date: new Date().toISOString(), readTime: '7 min', tags: [], coverImage: '' },
  ];

  const post = posts.find((p) => p.slug === slug);

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
      <BlogPostContent post={post ?? null} allPosts={posts} />
    </>
  );
}

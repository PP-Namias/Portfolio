import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCmsContent, getBlogPostSlugsForStaticParams } from '@/lib/cms-content.server';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import { fallbackBlogPosts } from '@/lib/cms-content.shared';
import { JsonLd } from '@/components/seo/JsonLd';
import BlogPostContent from './BlogPostContent';

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getBlogPostSlugsForStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { blogPosts } = await getCmsContent();
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : fallbackBlogPosts;

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
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : fallbackBlogPosts;

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
      <JsonLd data={jsonLd} id="blog-post-jsonld" />
      <BlogPostContent post={post ?? null} allPosts={posts} backLabel={blogCopy.backLabel || 'Back to Blog'} />
    </>
  );
}

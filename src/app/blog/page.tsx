import { getCmsContent } from '@/lib/cms-content.server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import { fallbackBlogPosts } from '@/lib/cms-content.shared';
import BlogListClient from './BlogListClient';

export default async function BlogPage(): Promise<JSX.Element> {
  if (!IS_BLOG_VISIBLE) {
    notFound();
  }

  const { blogPosts, siteSettings } = await getCmsContent();
  const blogCopy = siteSettings.blog;
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : fallbackBlogPosts;

  return (
    <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          {blogCopy.backLabel || 'Back to Portfolio'}
        </Link>
        <ThemeToggle />
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {blogCopy.title || 'Blog'}
        </h1>
        <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
          {blogCopy.description || 'Thoughts on AI, software engineering, cloud development, and more.'}
        </p>
      </div>

      {/* Blog Posts Grid */}
      <BlogListClient posts={posts} />
    </main>
  );
}

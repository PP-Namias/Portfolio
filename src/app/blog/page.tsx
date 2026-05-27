import { getCmsContent } from '@/lib/cms-content.server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import BlogListClient from './BlogListClient';

export default async function BlogPage(): Promise<JSX.Element> {
  if (!IS_BLOG_VISIBLE) {
    notFound();
  }

  const { blogPosts } = await getCmsContent();
  const posts = blogPosts && blogPosts.length > 0 ? blogPosts : [
    { id: '1', slug: 'hello-world', title: 'Hello World', excerpt: 'Intro', content: '', date: new Date().toISOString(), readTime: '5 min', tags: [], coverImage: '' },
    { id: '2', slug: 'deep-dive', title: 'Deep Dive', excerpt: 'Deep dive', content: '', date: new Date().toISOString(), readTime: '7 min', tags: [], coverImage: '' },
  ];

  return (
    <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
        <ThemeToggle />
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Blog
        </h1>
        <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
          Thoughts on AI, software engineering, cloud development, and more.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <BlogListClient posts={posts} />
    </main>
  );
}

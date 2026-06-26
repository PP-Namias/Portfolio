'use client';

import React from 'react';
import Link from 'next/link';
import Image from '@/components/ui/OptimizedImage';
import { motion } from 'framer-motion';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { formatDateUtc } from '@/lib/date';
import type { BlogPost } from '@/types';

const markdownComponents: Components = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-8 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed my-3">
      {children}
    </p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-3 space-y-1.5 pl-5 list-disc">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-3 space-y-1.5 pl-5 list-decimal">
      {children}
    </ol>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-text-primary-light dark:text-text-primary-dark">
      {children}
    </strong>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-accent-pink hover:underline"
      >
        {children}
      </a>
    );
  },
  code: ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return <code className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{children}</code>;
    }
    return <code className="text-accent-pink bg-surface-light dark:bg-surface-dark px-1.5 py-0.5 rounded text-xs">{children}</code>;
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4 my-4 overflow-x-auto">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-2 border-accent-pink pl-4 my-4 italic text-text-muted-light dark:text-text-muted-dark">
      {children}
    </blockquote>
  ),
};

interface BlogPostContentProps {
  post?: BlogPost | null;
  allPosts?: BlogPost[];
  slug?: string;
  backLabel?: string;
}

export default function BlogPostContent({ post, allPosts, slug, backLabel }: Readonly<BlogPostContentProps>) {
  let resolvedAll = allPosts;
  let resolvedPost = post ?? null;

  if (!resolvedPost && typeof slug === 'string' && resolvedAll) {
    resolvedPost = resolvedAll.find((p) => p.slug === slug) ?? null;
  }

  const postIndex = resolvedPost ? (resolvedAll ?? []).findIndex((p) => p.slug === resolvedPost.slug) : -1;

  if (!resolvedPost) {
    return (
      <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel || 'Back to Blog'}
          </Link>
          <ThemeToggle />
        </div>
        <Card>
          <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Post Not Found
          </h1>
          <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
        </Card>
      </main>
    );
  }
  const all = resolvedAll ?? [];
  const postObj = resolvedPost;

  const prevPost = postIndex > 0 ? all[postIndex - 1] : null;
  const nextPost = postIndex < all.length - 1 ? all[postIndex + 1] : null;

  return (
    <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
      <ReadingProgress />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel || 'Back to Blog'}
          </Link>
        <ThemeToggle />
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          {/* Cover Image */}
          <div className="-mx-5 -mt-5 mb-6 rounded-t-xl overflow-hidden">
            {postObj.coverImage ? (
              <Image
                src={postObj.coverImage}
                alt={postObj.title}
                width={800}
                height={320}
                sizes="(max-width: 768px) 100vw, 800px"
                unoptimized
                className="w-full h-48 sm:h-64 object-cover"
                priority
              />
            ) : (
              <div className="flex h-48 sm:h-64 items-center justify-center bg-surface-light dark:bg-surface-dark text-xs text-text-muted-light dark:text-text-muted-dark">
                Cover image unavailable
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {postObj.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
            {postObj.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 mb-6 pb-6 border-b border-border-light dark:border-border-dark">
            <span className="flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDateUtc(postObj.date, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {postObj.readTime}
            </span>
          </div>

          {/* Content — rendered with react-markdown */}
          <div className="prose-custom">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {postObj.content}
            </ReactMarkdown>
          </div>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`}>
              <Card hover className="h-full group cursor-pointer">
                <span className="flex items-center gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1">
                  <ChevronLeft className="h-3 w-3" aria-hidden="true" />
                  Previous
                </span>
                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-1">
                  {prevPost.title}
                </p>
              </Card>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`}>
              <Card hover className="h-full group cursor-pointer text-right">
                <span className="flex items-center justify-end gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1">
                  Next
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-1">
                  {nextPost.title}
                </p>
              </Card>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </motion.article>
    </main>
  );
}


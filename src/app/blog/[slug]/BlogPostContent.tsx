'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface BlogPostContentProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) {
    return (
      <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
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

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  return (
    <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
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
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 sm:h-64 object-cover"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
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
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 mb-6 pb-6 border-b border-border-light dark:border-border-dark">
            <span className="flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-text-primary-light dark:prose-headings:text-text-primary-dark prose-p:text-text-secondary-light dark:prose-p:text-text-secondary-dark prose-a:text-accent-pink prose-strong:text-text-primary-light dark:prose-strong:text-text-primary-dark prose-code:text-accent-pink prose-code:bg-surface-light dark:prose-code:bg-surface-dark prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-surface-light dark:prose-pre:bg-surface-dark prose-pre:border prose-pre:border-border-light dark:prose-pre:border-border-dark">
            {post.content.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h2
                    key={i}
                    className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-8 mb-3"
                  >
                    {block.replace('## ', '')}
                  </h2>
                );
              }
              if (block.startsWith('### ')) {
                return (
                  <h3
                    key={i}
                    className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mt-6 mb-2"
                  >
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('```')) {
                const lines = block.split('\n');
                const code = lines.slice(1, -1).join('\n');
                return (
                  <pre
                    key={i}
                    className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4 my-4 overflow-x-auto"
                  >
                    <code className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {code}
                    </code>
                  </pre>
                );
              }
              if (block.startsWith('1. ') || block.startsWith('- ')) {
                const items = block.split('\n');
                const isOrdered = block.startsWith('1. ');
                const Tag = isOrdered ? 'ol' : 'ul';
                return (
                  <Tag
                    key={i}
                    className={`my-3 space-y-1.5 pl-5 ${isOrdered ? 'list-decimal' : 'list-disc'}`}
                  >
                    {items.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed"
                      >
                        {item.replace(/^\d+\.\s|^-\s/, '')}
                      </li>
                    ))}
                  </Tag>
                );
              }
              if (block.startsWith('**') && block.endsWith('**')) {
                return (
                  <p
                    key={i}
                    className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark my-3"
                  >
                    {block.replace(/\*\*/g, '')}
                  </p>
                );
              }
              return (
                <p
                  key={i}
                  className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed my-3"
                >
                  {block}
                </p>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`}>
              <Card hover className="h-full group cursor-pointer">
                <span className="flex items-center gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1">
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </span>
                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors line-clamp-2">
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
                  <ChevronRight className="h-3 w-3" />
                </span>
                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors line-clamp-2">
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

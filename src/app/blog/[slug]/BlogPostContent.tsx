'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
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
            <Image
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={320}
              className="w-full h-48 sm:h-64 object-cover"
              priority
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

          {/* Content — rendered with react-markdown */}
          <div className="prose-custom">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-8 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mt-6 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed my-3">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-3 space-y-1.5 pl-5 list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-3 space-y-1.5 pl-5 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-pink hover:underline"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <code className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="text-accent-pink bg-surface-light dark:bg-surface-dark px-1.5 py-0.5 rounded text-xs">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4 my-4 overflow-x-auto">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-accent-pink pl-4 my-4 italic text-text-muted-light dark:text-text-muted-dark">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
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
                  <ChevronRight className="h-3 w-3" />
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

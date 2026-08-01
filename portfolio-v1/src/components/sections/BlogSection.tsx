'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from '@/components/ui/OptimizedImage';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useCmsContent } from '@/hooks/useCmsContent';
import { resolveContentImageSrc } from '@/lib/media';
import { formatDateUtc } from '@/lib/date';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import type { BlogPost } from '@/types';

const LATEST_COUNT = 3;
const VISIBLE_TAGS = 2;
const COVER_SIZE = 96;
const EXCERPT_LINES = 2;

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

interface PostRowProps {
  post: BlogPost;
  index: number;
}

function PostRow({ post, index }: PostRowProps) {
  const coverSrc = resolveContentImageSrc(post.coverImage, { folder: 'blog' });

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex items-start gap-3 -mx-2 px-2 py-2 rounded-lg hover:bg-surface-light/60 dark:hover:bg-surface-dark/60 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
      >
        {coverSrc ? (
          <span className="relative h-[96px] w-[96px] flex-shrink-0 overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <Image
              src={coverSrc}
              alt={post.title}
              width={COVER_SIZE}
              height={COVER_SIZE}
              sizes="96px"
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="h-[96px] w-[96px] flex-shrink-0 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center text-[10px] text-text-muted-light dark:text-text-muted-dark"
          >
            No cover
          </span>
        )}

        <span className="flex-1 min-w-0 space-y-1">
          <span className="flex items-center gap-1.5 text-[10px] text-text-muted-light dark:text-text-muted-dark">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date}>
              {formatDateUtc(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
            <span aria-hidden="true">&middot;</span>
            <Clock className="h-3 w-3" />
            <span>{post.readTime}</span>
          </span>

          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {post.tags.length > 0 && (
            <span className="flex flex-wrap gap-1 pt-0.5">
              {post.tags.slice(0, VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20"
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
        </span>
      </Link>
    </motion.article>
  );
}

export function BlogSection() {
  const { blogPosts } = useCmsContent();

  const latest = useMemo(
    () => sortByDateDesc(blogPosts).slice(0, LATEST_COUNT),
    [blogPosts]
  );

  if (!IS_BLOG_VISIBLE) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      aria-labelledby="home-blog-heading"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="home-blog-heading"
          className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark"
        >
          Blog
        </h2>

        {blogPosts.length > 0 && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
          >
            View all blog posts
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {latest.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-light dark:border-border-dark p-4 text-center">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">No posts yet.</p>
          <Link
            href="/blog"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-pink hover:underline"
          >
            Visit the blog
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div
          className="space-y-1"
          style={{ '--clamp-lines': EXCERPT_LINES } as React.CSSProperties}
        >
          {latest.map((post, index) => (
            <PostRow key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </motion.section>
  );
}


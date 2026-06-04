'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Clock, Calendar, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Modal } from './Modal';
import { Card } from './Card';
import { useCmsContent } from '@/hooks/useCmsContent';
import { useModal } from '@/hooks/useModal';
import { formatDateUtc } from '@/lib/date';

const markdownComponents = {
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
    <ul className="my-3 space-y-1.5 pl-5 list-disc">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-3 space-y-1.5 pl-5 list-decimal">{children}</ol>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-text-primary-light dark:text-text-primary-dark">
      {children}
    </strong>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-pink hover:underline"
    >
      {children}
    </a>
  ),
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

interface BlogPostModalProps {
  open: boolean;
  onClose: () => void;
  slug?: string | null;
}

export function BlogPostModal({ open, onClose, slug }: Readonly<BlogPostModalProps>) {
  const { blogPosts } = useCmsContent();
  const { openModal: openInnerModal } = useModal();

  const post = useMemo(() => {
    if (!slug) return null;
    return blogPosts.find((p) => p.slug === slug) ?? null;
  }, [blogPosts, slug]);

  const postIndex = post ? blogPosts.findIndex((p) => p.slug === post.slug) : -1;
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  const goBack = () => {
    onClose();
    setTimeout(() => openInnerModal('blog' as never), 50);
  };

  const goToPost = (targetSlug: string) => {
    onClose();
    setTimeout(() => openInnerModal('blog-post' as never, targetSlug as never), 50);
  };

  return (
    <Modal open={open} onClose={onClose} fullScreen>
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </button>
        <BookOpen className="h-4 w-4 text-text-muted-light dark:text-text-muted-dark" />
      </div>

      <div className="p-5">
        {!post ? (
          <Card>
            <h2 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
              Post Not Found
            </h2>
            <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
          </Card>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              {post.coverImage && (
                <div className="-mx-5 -mt-5 mb-5 rounded-t-xl overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={800}
                    height={320}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full h-48 sm:h-56 object-cover"
                    priority
                  />
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 mt-2 mb-5 pb-5 border-b border-border-light dark:border-border-dark">
                <span className="flex items-center gap-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                  <Calendar className="h-3 w-3" />
                  {formatDateUtc(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>

              <div className="prose-custom">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={markdownComponents as never}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </Card>

            {(prevPost || nextPost) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {prevPost ? (
                  <button
                    type="button"
                    onClick={() => goToPost(prevPost.slug)}
                    className="text-left"
                  >
                    <Card hover className="h-full group cursor-pointer">
                      <span className="flex items-center gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1">
                        <ChevronLeft className="h-3 w-3" />
                        Previous
                      </span>
                      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-1">
                        {prevPost.title}
                      </p>
                    </Card>
                  </button>
                ) : (
                  <div />
                )}
                {nextPost ? (
                  <button
                    type="button"
                    onClick={() => goToPost(nextPost.slug)}
                    className="text-right"
                  >
                    <Card hover className="h-full group cursor-pointer">
                      <span className="flex items-center justify-end gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1">
                        Next
                        <ChevronRight className="h-3 w-3" />
                      </span>
                      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-1">
                        {nextPost.title}
                      </p>
                    </Card>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            )}
          </motion.article>
        )}
      </div>
    </Modal>
  );
}

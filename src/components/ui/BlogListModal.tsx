'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { Modal } from './Modal';
import { Card } from './Card';
import { useCmsContent } from '@/hooks/useCmsContent';
import { useModal } from '@/hooks/useModal';
import { formatDateUtc } from '@/lib/date';
import { IS_BLOG_VISIBLE } from '@/lib/features';

interface BlogListModalProps {
  open: boolean;
  onClose: () => void;
}

export function BlogListModal({ open, onClose }: Readonly<BlogListModalProps>) {
  const { blogPosts } = useCmsContent();
  const { openModal: openInnerModal } = useModal();

  const handlePostClick = (slug: string) => {
    onClose();
    setTimeout(() => openInnerModal('blog-post' as never, slug as never), 50);
  };

  return (
    <Modal open={open} onClose={onClose} fullScreen>
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Blog
        </h2>
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
          {blogPosts.length} {blogPosts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      <div className="p-5">
        {!IS_BLOG_VISIBLE || blogPosts.length === 0 ? (
          <Card>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-8">
              No blog posts yet. Check back soon.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.map((post, index) => (
              <motion.button
                key={post.id}
                type="button"
                onClick={() => handlePostClick(post.slug)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="text-left"
                aria-label={`Read post: ${post.title}`}
              >
                <Card hover className="h-full flex flex-col cursor-pointer group">
                  <div className="relative -mx-5 -mt-5 mb-4 rounded-t-xl overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={160}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-surface-light dark:bg-surface-dark text-xs text-text-muted-light dark:text-text-muted-dark">
                        Cover image unavailable
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                    <span className="flex items-center gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                      <Calendar className="h-3 w-3" />
                      {formatDateUtc(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <span className="ml-auto flex items-center gap-0.5 text-[11px] font-medium text-accent-pink">
                      Read
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

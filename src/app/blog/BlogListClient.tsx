'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BlogPost } from '@/types';

interface BlogListClientProps {
  posts: BlogPost[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <Link href={`/blog/${post.slug}`}>
            <Card hover className="h-full flex flex-col cursor-pointer group">
              {/* Cover Image */}
              <div className="relative -mx-5 -mt-5 mb-4 rounded-t-xl overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Tags */}
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

              {/* Title */}
              <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-2">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed line-clamp-3 flex-1">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                <span className="flex items-center gap-1 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
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
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

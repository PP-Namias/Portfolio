'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Calendar, Clock, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  url: string;
  featured: boolean;
  views?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'ai-integration-guide',
    title: 'Mastering AI Integration in Modern Web Applications',
    excerpt: 'Comprehensive guide to implementing AI features in React applications, covering API integration, state management, and user experience optimization.',
    publishedDate: '2024-12-15',
    readTime: '8 min read',
    tags: ['AI', 'React', 'TypeScript', 'API Integration'],
    url: 'https://blog.ppnamias.dev/ai-integration-guide',
    featured: true,
    views: '2.1K'
  },
  {
    id: 'nextjs-performance',
    title: 'Next.js 15 Performance Optimization Techniques',
    excerpt: 'Advanced strategies for building lightning-fast Next.js applications with the latest features including Turbopack and Server Components.',
    publishedDate: '2024-11-28',
    readTime: '12 min read',
    tags: ['Next.js', 'Performance', 'Web Development', 'Optimization'],
    url: 'https://blog.ppnamias.dev/nextjs-performance',
    featured: true,
    views: '3.5K'
  },
  {
    id: 'typescript-best-practices',
    title: 'TypeScript Best Practices for Large-Scale Applications',
    excerpt: 'Essential patterns and practices for maintaining type safety and code quality in enterprise TypeScript projects.',
    publishedDate: '2024-10-20',
    readTime: '10 min read',
    tags: ['TypeScript', 'Best Practices', 'Enterprise', 'Code Quality'],
    url: 'https://blog.ppnamias.dev/typescript-best-practices',
    featured: false,
    views: '1.8K'
  },
  {
    id: 'ai-career-guide',
    title: 'Building a Career in AI: A Developer\'s Roadmap',
    excerpt: 'Practical guide for developers transitioning into AI roles, covering essential skills, learning resources, and career strategies.',
    publishedDate: '2024-09-15',
    readTime: '15 min read',
    tags: ['AI Career', 'Machine Learning', 'Professional Growth', 'Skills'],
    url: 'https://blog.ppnamias.dev/ai-career-guide',
    featured: false,
    views: '4.2K'
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  variant?: 'default' | 'compact';
}

const BlogPostCard = ({ post, index, variant = 'default' }: BlogPostCardProps) => {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group"
      >
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-lg bg-secondary/10 border border-border hover:border-accent/30 hover:bg-secondary/20 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-primary group-hover:text-accent transition-colors line-clamp-2 flex-1 mr-2">
              {post.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-secondary group-hover:text-accent transition-colors flex-shrink-0" />
          </div>
          
          <p className="text-secondary text-sm mb-3 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-secondary">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
            </div>
            {post.views && (
              <span className="text-accent font-medium">{post.views} views</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-secondary/30 text-secondary rounded border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-secondary/20 border border-border rounded-lg p-6 hover:border-accent/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {post.featured && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-accent/20 text-accent border border-accent/30 rounded mb-2">
                Featured
              </span>
            )}
            <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors mb-2">
              {post.title}
            </h3>
          </div>
          <ExternalLink className="w-5 h-5 text-secondary group-hover:text-accent transition-colors flex-shrink-0 ml-3" />
        </div>

        <p className="text-secondary mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-secondary/30 text-secondary rounded border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-secondary pt-3 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          {post.views && (
            <span className="text-accent font-medium">{post.views} views</span>
          )}
        </div>
      </a>
    </motion.div>
  );
};

export const RecentBlogPostsSection = () => {
  const featuredPosts = blogPosts.filter(p => p.featured);
  const recentPosts = blogPosts.filter(p => !p.featured).slice(0, 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="blog"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-3 text-accent" />
          <h2 className="text-xl font-semibold text-primary">Recent Blog Posts</h2>
        </div>
        <a
          href="https://blog.ppnamias.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-6">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-yellow-400" />
              Featured Articles
            </h3>
            <div className="space-y-4">
              {featuredPosts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} variant="default" />
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Latest Articles</h3>
            <div className="space-y-3">
              {recentPosts.map((post, index) => (
                <BlogPostCard 
                  key={post.id} 
                  post={post} 
                  index={index + featuredPosts.length} 
                  variant="compact" 
                />
              ))}
            </div>
          </div>
        )}

        {/* Blog Stats */}
        <div className="pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">{blogPosts.length}</div>
              <div className="text-sm text-secondary">Articles Published</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {blogPosts.reduce((acc, post) => {
                  const views = parseInt(post.views?.replace('K', '000').replace('.', '') || '0');
                  return acc + views;
                }, 0) / 1000}K
              </div>
              <div className="text-sm text-secondary">Total Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">4.8</div>
              <div className="text-sm text-secondary">Avg. Rating</div>
            </div>
          </div>
        </div>

        {/* Writing Focus */}
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm font-medium text-accent">Writing Focus</span>
          </div>
          <p className="text-secondary text-sm">
            Sharing insights on <strong className="text-primary">AI development</strong>, <strong className="text-primary">modern web technologies</strong>, and <strong className="text-primary">career growth</strong> to help developers build better applications and advance their careers.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

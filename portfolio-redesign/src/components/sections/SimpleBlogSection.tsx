'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowUpRight, Clock, Eye, Heart, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  views?: string;
  likes?: number;
  featured?: boolean;
  thumbnail?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable Web Applications with Next.js 15',
    excerpt: 'Learn how to build performant and scalable web applications using Next.js 15 with App Router and modern React patterns for enterprise applications.',
    date: '2024-01-15',
    readTime: '5 min read',
    views: '2.1k',
    likes: 34,
    tags: ['React', 'Next.js', 'Web Development', 'Performance'],
    featured: true,
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: '2',
    title: 'The Future of TypeScript: Advanced Features & Best Practices',
    excerpt: 'Exploring the latest features and improvements in TypeScript 5.0 that are revolutionizing how we write type-safe applications.',
    date: '2024-01-10',
    readTime: '7 min read',
    views: '1.8k',
    likes: 27,
    tags: ['TypeScript', 'JavaScript', 'Development', 'Best Practices'],
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: '3',
    title: 'Mastering Modern CSS: Grid, Flexbox & Container Queries',
    excerpt: 'A comprehensive guide to modern CSS layout techniques including CSS Grid, Flexbox, and the new Container Queries for responsive design.',
    date: '2024-01-05',
    readTime: '6 min read',
    views: '1.5k',
    likes: 19,
    tags: ['CSS', 'Layout', 'Responsive Design', 'Modern CSS'],
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
];

const BlogPostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card card-compact group cursor-pointer relative overflow-hidden"
      whileHover={{ y: -4 }}
    >
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-3 left-3 z-10">
          <div className="chip chip-accent">
            <span className="text-xs font-semibold">Featured</span>
          </div>
        </div>
      )}

      {/* Thumbnail */}
      <div 
        className="h-24 rounded-lg mb-4 relative overflow-hidden"
        style={{ background: post.thumbnail || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 right-3">
          <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-primary text-sm mb-2 group-hover:text-gradient transition-colors leading-relaxed line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-secondary leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {post.views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </div>
            )}
            {post.likes && (
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{post.likes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <div key={tag} className="chip chip-secondary">
              <Tag className="w-2.5 h-2.5" />
              <span className="text-xs">{tag}</span>
            </div>
          ))}
          {post.tags.length > 3 && (
            <div className="chip">
              <span className="text-xs">+{post.tags.length - 3}</span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export const SimpleBlogSection = () => {
  const totalViews = blogPosts.reduce((total, post) => {
    const views = post.views ? parseFloat(post.views.replace('k', '')) * 1000 : 0;
    return total + views;
  }, 0);

  const totalLikes = blogPosts.reduce((total, post) => total + (post.likes || 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card relative overflow-hidden"
      id="blog"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-warm rounded-full opacity-5 -translate-y-10 translate-x-10" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="heading-sm text-primary">Recent Blog Posts</h2>
              <p className="text-sm text-muted">
                {Math.round(totalViews / 1000)}k+ views • {totalLikes} likes
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
          >
            <ArrowUpRight className="w-4 h-4" />
            View All
          </motion.button>
        </div>

        {/* Blog Posts Grid */}
        <div className="space-y-4">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 p-4 bg-surface rounded-lg border border-light"
        >
          <p className="text-sm text-secondary leading-relaxed">
            💡 I write about web development, best practices, emerging technologies, and share insights from building scalable applications.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

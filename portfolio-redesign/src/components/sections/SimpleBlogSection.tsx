'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  Eye, 
  Heart, 
  TrendingUp,
  Bookmark,
  Share,
  ExternalLink
} from 'lucide-react';

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
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -6 }}
      className="glass-card card-compact group cursor-pointer relative overflow-hidden"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="chip chip-success">
            <TrendingUp className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 glass-card hover:bg-[var(--color-surface-light)] transition-colors flex items-center justify-center"
          aria-label="Bookmark post"
        >
          <Bookmark className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 glass-card hover:bg-[var(--color-surface-light)] transition-colors flex items-center justify-center"
          aria-label="Share post"
        >
          <Share className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </motion.button>
      </div>

      <div className="relative z-10">
        {/* Enhanced Thumbnail */}
        <div 
          className="h-32 rounded-lg mb-6 relative overflow-hidden shadow-lg"
          style={{ background: post.thumbnail || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ExternalLink className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="space-y-4">
          <div>
            <h3 className="body-lg font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors leading-relaxed line-clamp-2">
              {post.title}
            </h3>
            <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* Enhanced Meta Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                <Calendar className="w-3.5 h-3.5" />
                <span className="body-xs">{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                <Clock className="w-3.5 h-3.5" />
                <span className="body-xs">{post.readTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {post.views && (
                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="body-xs">{post.views}</span>
                </div>
              )}
              {post.likes && (
                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="body-xs">{post.likes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (index * 0.1) + (tagIndex * 0.05) }}
                viewport={{ once: true }}
                className="chip chip-primary"
              >
                {tag}
              </motion.span>
            ))}
            {post.tags.length > 3 && (
              <span className="chip chip-secondary">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
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
    <section className="card relative overflow-hidden" id="blog">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 rounded-full opacity-50 -translate-y-16 -translate-x-16" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="heading-md text-[var(--color-text-primary)]">Recent Blog Posts</h2>
              <p className="body-sm text-[var(--color-text-muted)]">
                {Math.round(totalViews / 1000)}k+ views • {totalLikes} likes
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary hidden sm:flex"
          >
            <ArrowUpRight className="w-4 h-4" />
            View All
          </motion.button>
        </div>

        {/* Enhanced Blog Posts Grid */}
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Enhanced Footer Note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="glass-card card-compact mt-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="body-md font-semibold text-[var(--color-text-primary)] mb-2">Writing Philosophy</h3>
              <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed">
                I write about web development, best practices, emerging technologies, and share insights from building scalable applications.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowUpRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable Web Applications with Next.js',
    excerpt: 'Learn how to build performant and scalable web applications using Next.js and modern React patterns.',
    date: '2024-01-15',
    readTime: '5 min read',
    tags: ['React', 'Next.js', 'Web Development'],
    featured: true
  },
  {
    id: '2',
    title: 'The Future of TypeScript',
    excerpt: 'Exploring the latest features and improvements in TypeScript that are changing how we write code.',
    date: '2024-01-10',
    readTime: '7 min read',
    tags: ['TypeScript', 'JavaScript', 'Development']
  },
  {
    id: '3',
    title: 'Mastering CSS Grid and Flexbox',
    excerpt: 'A comprehensive guide to modern CSS layout techniques for responsive web design.',
    date: '2024-01-05',
    readTime: '6 min read',
    tags: ['CSS', 'Layout', 'Responsive Design']
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
      className="bg-surface rounded-2xl p-4 border border-default hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-primary text-sm mb-2 group-hover:text-accent transition-colors leading-relaxed">
            {post.title}
          </h3>
          <p className="text-xs text-secondary mb-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-accent transition-colors ml-2 flex-shrink-0" />
      </div>

      <div className="flex items-center justify-between text-xs text-secondary mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(post.date)}</span>
        </div>
        <span>{post.readTime}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-accent/10 text-accent rounded-md text-xs font-medium"
          >
            {tag}
          </span>
        ))}
        {post.tags.length > 2 && (
          <span className="px-2 py-0.5 bg-muted text-secondary rounded-md text-xs">
            +{post.tags.length - 2}
          </span>
        )}
      </div>
    </motion.article>
  );
};

export const SimpleBlogSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="blog"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Recent Blog Posts</h2>
        </div>
        <button className="text-xs text-accent hover:text-accent/80 transition-colors font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {blogPosts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      <p className="text-xs text-secondary mt-4 leading-relaxed">
        I write about web development, best practices, and emerging technologies.
      </p>
    </motion.section>
  );
};

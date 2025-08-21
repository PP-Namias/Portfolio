'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  url?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Mastering JavaScript: Practical Tips and Best Practices',
    description: 'A concise guide to enhance your JavaScript skills with practical examples and best practices for writing clean, more efficient code.',
    date: 'Aug 12, 2025',
    readTime: '3 min read',
    tags: ['JavaScript', 'Programming', 'Web Development', 'Tutorial'],
    url: '#'
  },
  {
    id: '2',
    title: 'Level Up Your Prompts: Practical Tips for Getting the Most Out of LLMs',
    description: 'This post provides actionable advice and practical examples to help you craft effective prompts for Large Language Models (LLMs) like GPT-4, Bard and Llama.',
    date: 'July 18, 2025',
    readTime: '5 min read',
    tags: ['LLMs', 'Programming', 'Web Development', 'Tutorial'],
    url: '#'
  },
  {
    id: '3',
    title: 'Minimalism in Tech: Less is More, More or Less',
    description: 'This post explores the concept of minimalism in tech, covering its benefits and providing practical examples for developers, designers, and product managers.',
    date: 'June 8, 2025',
    readTime: '4 min read',
    tags: ['Minimalism in Tech', 'Programming', 'Web Development', 'Tutorial'],
    url: '#'
  }
];

const BlogPostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="p-4 rounded-lg border border-default hover:border-accent/30 transition-all duration-300 hover:shadow-md">
        <h3 className="font-semibold text-primary mb-2 group-hover:text-accent transition-colors leading-tight">
          {post.title}
        </h3>
        
        <p className="text-sm text-secondary mb-3 leading-relaxed line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span key={tagIndex} className="chip-sm">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="chip-sm text-muted">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
          
          <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
        </div>
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-3 text-accent" />
          <h2 className="text-xl font-semibold text-primary">Recent Blog Posts</h2>
        </div>
        <a 
          href="#all-posts"
          className="btn-text"
        >
          View All
        </a>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-6 pt-6 border-t border-default text-center">
        <p className="text-sm text-secondary mb-3">
          Want to stay updated with my latest insights?
        </p>
        <a 
          href="#newsletter"
          className="btn-secondary"
        >
          Subscribe to Newsletter
        </a>
      </div>
    </motion.section>
  );
};

'use client';

import { blogCollection } from '@/data/blog';
import { motion } from 'framer-motion';
import { FileText, Calendar, Clock, ExternalLink, ArrowRight } from 'lucide-react';

export function BlogPostsCard() {
  // Get recent blog posts (first 4)
  const recentPosts = blogCollection.posts?.slice(0, 4) || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const calculateReadTime = (content: string) => {
    if (!content) return '2 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="card"
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Latest Blog Posts</h2>
          {blogCollection.posts && blogCollection.posts.length > 4 && (
            <a 
              href="/blog" 
              className="text-accent hover:text-accent-hover text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
      
      <div className="card-content">
        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post, index: number) => (
              <motion.article
                key={post._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group border border-subtle rounded-lg p-4 hover:border-accent hover:bg-accent/5 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Article Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-accent" />
                  </div>

                  {/* Article Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="heading-5 mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="body-base text-secondary mb-3 line-clamp-2">
                      {post.excerpt || 'No description available.'}
                    </p>

                    {/* Article Meta */}
                    <div className="flex items-center gap-4 text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span className="body-xs">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="body-xs">
                          {post.readingTime || calculateReadTime(post.content || '')} min read
                        </span>
                      </div>
                      {post.category && (
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-muted/20 text-muted text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 bg-muted/20 text-muted text-xs rounded-md">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Read More Link */}
                  {post.slug && (
                    <div className="flex-shrink-0">
                      <a
                        href={`/blog/${post.slug}`}
                        className="p-2 rounded-lg hover:bg-accent/10 text-accent opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label={`Read ${post.title}`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-muted" />
            </div>
            <p className="body-base text-muted">No blog posts available at the moment.</p>
          </div>
        )}

        {/* Blog Summary */}
        {recentPosts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-subtle">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="heading-3 text-accent">{blogCollection.posts?.length || 0}</div>
                <div className="body-small">Articles</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {blogCollection.categories?.length || 0}
                </div>
                <div className="body-small">Categories</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {blogCollection.posts?.reduce((total, post) => total + (post.views || 0), 0) > 1000 ? '1K+' : '500+'}
                </div>
                <div className="body-small">Total Views</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

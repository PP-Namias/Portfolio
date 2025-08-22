'use client';

import { blogCollection, type BlogPost } from '@/data/blog';
import { motion } from 'framer-motion';

export function BlogPostsCard() {
  const recentPosts = blogCollection.posts
    .sort((a: BlogPost, b: BlogPost) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 4);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'technology': 'badge-blue',
      'web-development': 'badge-green',
      'mobile-development': 'badge-purple',
      'design': 'badge-pink',
      'tutorial': 'badge-orange',
      'opinion': 'badge-yellow',
      'career': 'badge-indigo',
      'tools': 'badge-gray'
    };
    return colors[category.toLowerCase().replace(/\s+/g, '-')] || colors['technology'];
  };

  const formatReadTime = (readTime: number): string => {
    return `${readTime} min read`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Recent Posts
        </h2>
        <p className="text-muted">Latest articles & insights</p>
      </div>

      <div className="card-content">
        <div className="space-y-4">
          {recentPosts.map((post: BlogPost, index: number) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="blog-post-item group cursor-pointer"
              onClick={() => window.open(post.url, '_blank')}
            >
              <div className="flex items-start gap-3">
                {/* Post Thumbnail or Icon */}
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors overflow-hidden">
                  {post.thumbnail ? (
                    <img 
                      src={post.thumbnail.url} 
                      alt={post.thumbnail.alt || post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                </div>

                {/* Post Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="blog-post-title group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  
                  {/* Category and Reading Time */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getCategoryColor(post.category)} text-xs`}>
                      {post.category}
                    </span>
                    <span className="text-muted text-xs">
                      {formatReadTime(post.readTime)}
                    </span>
                  </div>
                  
                  {/* Excerpt */}
                  <p className="body-small text-muted mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-muted">
                        {formatDate(post.publishedAt)}
                      </span>
                      {post.featured && (
                        <span className="badge badge-outline text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center gap-3 text-muted">
                      {post.stats?.views && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {post.stats.views > 1000 ? `${(post.stats.views / 1000).toFixed(1)}k` : post.stats.views}
                        </div>
                      )}
                      {post.stats?.likes && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.stats.likes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="badge badge-outline text-xs">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="badge badge-outline text-xs">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-semibold">
              {blogCollection.statistics.totalPosts}
            </span>
            <span className="text-muted text-sm">Articles</span>
          </div>
          <button className="btn btn-ghost btn-sm">
            View Blog
          </button>
        </div>
      </div>
    </motion.div>
  );
}

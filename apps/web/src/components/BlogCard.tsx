import { FC } from 'react';
import { Link } from 'wouter';
import { BlogListItem } from '../data/blog';
import { urlFor } from '../lib/sanity';
import { Card, CardContent, CardHeader } from './ui/card';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogListItem;
}

export const BlogCard: FC<BlogCardProps> = ({ post }) => {
  // Handle minimal post data for testing
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(400).height(250).url() : '';
  const slug = post.slug?.current || post._id;
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${slug}`}>
        <div className="cursor-pointer">
          {imageUrl && (
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              {post.publishedAt && (
                <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
              )}
              {post.author && <span>By {post.author.name}</span>}
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {post.title || 'Untitled Post'}
            </h3>
          </CardHeader>
          <CardContent>
            {post.excerpt && (
              <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
            )}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <span
                    key={category.slug?.current || category.title || `category-${index}`}
                    className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-200"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Link>
    </Card>
  );
};

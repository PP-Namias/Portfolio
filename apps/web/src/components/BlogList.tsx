import { FC } from 'react';
import { useBlogPosts } from '../hooks/useBlog';
import { BlogCard } from './BlogCard';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';

interface BlogListProps {
  limit?: number;
  showTitle?: boolean;
}

export const BlogList: FC<BlogListProps> = ({ limit, showTitle = true }) => {
  const { data: posts, isLoading, error } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showTitle && <h2 className="text-3xl font-bold">Latest Blog Posts</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Blog loading error:', error);
    return (
      <Alert>
        <AlertDescription>
          Failed to load blog posts. Please check your Sanity configuration.
          <br />
          <small>Error: {error instanceof Error ? error.message : 'Unknown error'}</small>
        </AlertDescription>
      </Alert>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No blog posts found</h2>
        <p className="text-muted-foreground">Check back soon for new content!</p>
      </div>
    );
  }

  const displayPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="space-y-6">
      {showTitle && <h2 className="text-3xl font-bold">Latest Blog Posts</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

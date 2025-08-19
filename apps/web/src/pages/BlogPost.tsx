import { FC } from 'react';
import { useParams } from 'wouter';
import { useBlogPost } from '../hooks/useBlog';
import { PortableTextComponent } from '../components/PortableTextComponent';
import { urlFor } from '../lib/sanity';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const BlogPostPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-24 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Skeleton className="aspect-video w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <Alert>
              <AlertDescription>
                {error ? 'Failed to load blog post.' : 'Blog post not found.'}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(600).url() : '';

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={post.title}
        description={post.excerpt || `Read "${post.title}" by ${post.author?.name || 'Ervhyne R. Dalugdog'} on topics including ${post.categories?.map(cat => cat.title).join(', ') || 'web development'}.`}
        keywords={`${post.title}, ${post.categories?.map(cat => cat.title).join(', ') || ''}, blog post, Ervhyne Dalugdog, web development, programming`}
        image={imageUrl || undefined}
        url={`https://ervhyne.vercel.app/blog/${slug}`}
        type="article"
        author={post.author?.name}
        publishedTime={post.publishedAt}
        article={{
          author: post.author?.name,
          publishedTime: post.publishedAt,
          section: post.categories?.[0]?.title,
          tags: post.categories?.map(cat => cat.title)
        }}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between text-muted-foreground mb-6">
              <div className="flex items-center space-x-4">
                {post.author && (
                  <div className="flex items-center space-x-2">
                    {post.author.image && (
                      <img
                        src={urlFor(post.author.image).width(40).height(40).url()}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <span>By {post.author.name}</span>
                  </div>
                )}
                <span>•</span>
                <time>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</time>
              </div>
            </div>

            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category.slug.current}
                    className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-200"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-8">
              <img
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          {post.body && (
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <PortableTextComponent value={post.body} />
            </article>
          )}

          {/* Author Bio */}
          {post.author?.bio && (
            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">About the Author</h3>
              <div className="flex items-start space-x-4">
                {post.author.image && (
                  <img
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-medium">{post.author.name}</h4>
                  <div className="prose prose-sm dark:prose-invert">
                    <PortableTextComponent value={post.author.bio} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;

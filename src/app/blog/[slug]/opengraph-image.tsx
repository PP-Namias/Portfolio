/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { getBlogPostBySlug } from '@/data/blogPosts';
import { resolveImage } from '@/lib/utils';

export const runtime = 'edge';

export const alt = 'Blog Post Cover Image';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#0a0a0a',
            color: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Post Not Found
        </div>
      ),
      { ...size }
    );
  }

  const coverUrl = post.coverImage ? resolveImage(post.coverImage, 'blog') : null;
  // If it's a relative URL, we need to make it absolute for OpenGraph
  const absoluteCoverUrl = coverUrl && coverUrl.startsWith('/') 
    ? `https://namias.tech${coverUrl}` 
    : coverUrl;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        {absoluteCoverUrl && (
          <img
            src={absoluteCoverUrl}
            alt={post.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '60px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  color: '#ec4899',
                  background: 'rgba(236, 72, 153, 0.15)',
                  padding: '6px 16px',
                  borderRadius: '24px',
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            {post.title}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 28,
            }}
          >
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span style={{ margin: '0 16px' }}>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

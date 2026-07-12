import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import { buildMediaGatewayUrl } from '@/lib/media-gateway';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import type { BlogPost } from '@/types';

const maybeCache = <T extends (...args: unknown[]) => Promise<BlogData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

function portableTextToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks)) {
    return '';
  }

  const lines: string[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    const candidate = block as {
      style?: string;
      children?: Array<{ text?: string }>;
    };
    const text = candidate.children?.map((child) => child.text ?? '').join(' ').trim() ?? '';

    if (!text) {
      continue;
    }

    if (candidate.style === 'h1') {
      lines.push(`# ${text}`);
    } else if (candidate.style === 'h2') {
      lines.push(`## ${text}`);
    } else if (candidate.style === 'h3') {
      lines.push(`### ${text}`);
    } else {
      lines.push(text);
    }

    lines.push('');
  }

  return lines.join('\n').trim();
}

export type BlogData = {
  blogPosts: BlogPost[];
};

async function fetchBlogDataImpl(): Promise<BlogData> {
  if (!IS_BLOG_VISIBLE) {
    return { blogPosts: [] };
  }

  const blogDocs = await querySanity<Array<{
    title?: string;
    slug?: string;
    excerpt?: string;
    readTime?: string;
    body?: unknown;
    tags?: string[];
    publishedAt?: string;
    coverImagePath?: string;
    mainImage?: { asset?: { originalFilename?: string; url?: string } };
    author?: { name?: string };
    categories?: Array<{ title?: string }>;
    sourceId?: string;
    published?: boolean;
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    mainImageFile?: string;
    mainImageUrl?: string;
  }>>(
    '*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){title,"slug":slug.current,excerpt,readTime,body,tags,publishedAt,coverImagePath,featured,metaTitle,metaDescription,"mainImageFile":mainImage.asset->originalFilename,"mainImageUrl":mainImage.asset->url,"author":author->name,"categories":categories[]->title,sourceId,published}',
    { tags: CONTENT_TAGS.post }
  );

  const blogPosts: BlogPost[] = (blogDocs ?? []).map((post, index) => ({
    id: post.sourceId || post.slug || `post-${index + 1}`,
    slug: post.slug || `post-${index + 1}`,
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: portableTextToMarkdown(post.body) || post.excerpt || '',
    date: post.publishedAt || new Date().toISOString(),
    readTime: post.readTime || '5 min read',
    tags: post.tags || [],
    coverImage: (() => {
      const resolved = buildMediaGatewayUrl(post.mainImageUrl || '', {
        width: 960,
        quality: 85,
        sign: true,
      });
      return resolved || '';
    })(),
    featured: post.featured || false,
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
  }));

  return { blogPosts };
}

export const fetchBlogData = maybeCache(fetchBlogDataImpl);

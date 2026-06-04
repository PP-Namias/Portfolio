import { describe, it, expect } from 'vitest';
import nextConfig from '../../../next.config.js';

const nextConfigAny = nextConfig as unknown as {
  redirects?: () => Promise<Array<{ source: string; destination: string; permanent: boolean }>>;
};

describe('next.config.js redirects', () => {
  it('301-redirects /blog to /?modal=blog', async () => {
    const redirects = await nextConfigAny.redirects?.();
    const blogList = redirects?.find((r) => r.source === '/blog');
    expect(blogList).toBeDefined();
    expect(blogList?.destination).toBe('/?modal=blog');
    expect(blogList?.permanent).toBe(true);
  });

  it('301-redirects /blog/:slug to /?modal=blog-post&slug=:slug', async () => {
    const redirects = await nextConfigAny.redirects?.();
    const blogPost = redirects?.find((r) => r.source === '/blog/:slug');
    expect(blogPost).toBeDefined();
    expect(blogPost?.destination).toBe('/?modal=blog-post&slug=:slug');
    expect(blogPost?.permanent).toBe(true);
  });
});

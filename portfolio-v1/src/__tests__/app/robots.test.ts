import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';

describe('robots.txt route', () => {
  it('returns a catch-all allow rule for all crawlers', () => {
    const res = robots();
    expect(res.rules[0]).toEqual({ userAgent: '*', allow: '/' });
  });

  it('explicitly allows major web and image crawlers', () => {
    const res = robots();
    const web = res.rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes('Googlebot'));
    expect(web?.userAgent).toContain('Googlebot');
    expect(web?.userAgent).toContain('Googlebot-Image');
    expect(web?.userAgent).toContain('Bingbot');
    expect(web?.allow).toBe('/');
  });

  it('explicitly allows AI model and answer engine crawlers', () => {
    const res = robots();
    const ai = res.rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes('GPTBot'));
    expect(ai?.userAgent).toContain('GPTBot');
    expect(ai?.userAgent).toContain('OAI-SearchBot');
    expect(ai?.userAgent).toContain('PerplexityBot');
    expect(ai?.userAgent).toContain('anthropic-ai');
    expect(ai?.userAgent).toContain('ClaudeBot');
    expect(ai?.allow).toBe('/');
  });

  it('points crawlers to the sitemap', () => {
    const res = robots();
    expect(res.sitemap).toBe('https://namias.tech/sitemap.xml');
  });
});
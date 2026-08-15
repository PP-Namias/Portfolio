import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/offline', '/studio'] },
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/admin', '/offline', '/studio'],
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'PerplexityBot',
          'anthropic-ai',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
        ],
        allow: '/',
        disallow: ['/admin', '/offline', '/studio'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

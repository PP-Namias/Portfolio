import { NextRequest } from 'next/server';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || '';
  const method = request.method;

  const token = getCanaryTokenById('canary-sitemap');
  if (token) {
    const trigger = createTrigger(token.id, token.name, token.type, token.path, {
      ip,
      userAgent,
      referer,
      method,
    });

    logTrigger(trigger);
    await sendCanaryAlert(trigger);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- This is a CANARY TOKEN sitemap - access is logged -->
<!-- If you're reading this, you've triggered a security alert -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ppnamias.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ppnamias.com/api/canary/admin</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.1</priority>
  </url>
  <url>
    <loc>https://ppnamias.com/api/canary/config</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.1</priority>
  </url>
  <url>
    <loc>https://ppnamias.com/wp-admin-canary</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.1</priority>
  </url>
  <url>
    <loc>https://ppnamias.com/phpmyadmin-canary</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.1</priority>
  </url>
</urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Canary-Token': 'canary-sitemap',
      'X-Canary-Triggered': 'true',
    },
  });
}

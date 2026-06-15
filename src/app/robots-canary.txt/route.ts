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

  const token = getCanaryTokenById('canary-robots');
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

  const robotsTxt = `# Portfolio Robots.txt (Canary Token)
# This file is a canary token - access is logged
# If you're reading this, you've triggered a security alert

User-agent: *
Disallow: /api/canary/
Disallow: /admin/
Disallow: /wp-admin-canary/
Disallow: /phpmyadmin-canary/
Disallow: /.env-canary
Disallow: /.ssh-canary/
Disallow: /.aws-canary/
Disallow: /backups-canary/
Disallow: /robots-canary.txt
Disallow: /sitemap-canary.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://ppnamias.com/sitemap.xml
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Canary-Token': 'canary-robots',
      'X-Canary-Triggered': 'true',
    },
  });
}

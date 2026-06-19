import { NextRequest, NextResponse } from 'next/server';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || '';
  const method = request.method;

  const token = getCanaryTokenById('canary-config');
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

  return NextResponse.json({
    config: {
      database: {
        host: 'db-canary-internal',
        port: 5432,
        name: 'canary_fake_db',
        user: 'canary_admin',
        password: 'th1s_1s_f4ke_canary',
      },
      redis: {
        host: 'redis-canary-internal',
        port: 6379,
      },
      api: {
        key: 'canary-fake-api-key-12345',
        secret: 'canary-fake-secret-67890',
      },
      aws: {
        accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        region: 'us-east-1',
      },
    },
    timestamp: new Date().toISOString(),
  });
}

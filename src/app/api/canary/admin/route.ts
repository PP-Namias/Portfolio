import { NextRequest, NextResponse } from 'next/server';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

export async function GET(request: NextRequest) {
  const token = getCanaryTokenById('canary-admin');

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 500 });
  }

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || '';
  const method = request.method;

  const trigger = createTrigger(token.id, token.name, token.type, token.path, {
    ip,
    userAgent,
    referer,
    method,
  });

  logTrigger(trigger);
  await sendCanaryAlert(trigger);

  return NextResponse.json({
    message: 'Admin panel',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || '';
  const method = request.method;

  const token = getCanaryTokenById('canary-admin');
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
    message: 'Admin login attempt received',
    timestamp: new Date().toISOString(),
  });
}

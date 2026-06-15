import { NextRequest, NextResponse } from 'next/server';
import { CANARY_TOKENS, CANARY_CONFIG } from '@/lib/canary/config';
import { getTriggerStats } from '@/lib/canary/logger';
import { sendTestAlert } from '@/lib/canary/notify';

export async function GET(request: NextRequest) {
  const stats = getTriggerStats();

  return NextResponse.json({
    status: 'ok',
    message: 'Canary system is operational',
    config: {
      email: CANARY_CONFIG.notifyEmail,
      enabled: CANARY_CONFIG.enabled,
      rateLimitWindowMs: CANARY_CONFIG.rateLimitWindowMs,
      rateLimitMaxRequests: CANARY_CONFIG.rateLimitMaxRequests,
    },
    tokens: {
      total: CANARY_TOKENS.length,
      active: CANARY_TOKENS.filter((t) => t.status === 'active').length,
    },
    stats: {
      totalTriggers: stats.total,
      recentTriggers: stats.recentCount,
      triggersByType: stats.byType,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const result = await sendTestAlert();
    return NextResponse.json({
      status: result ? 'ok' : 'error',
      message: result ? 'Test alert sent successfully' : 'Failed to send test alert',
      email: CANARY_CONFIG.notifyEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to send test alert',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

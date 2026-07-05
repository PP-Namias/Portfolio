import { NextRequest, NextResponse } from 'next/server';
import { CANARY_TOKENS } from '@/lib/canary/config';
import { getTriggerLog, getTriggerStats } from '@/lib/canary/logger';
import { isAdminRequest } from '@/lib/admin';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = getTriggerStats();
  const triggers = getTriggerLog();

  const tokenStats = CANARY_TOKENS.map((token) => ({
    id: token.id,
    name: token.name,
    type: token.type,
    path: token.path,
    status: token.status,
    triggerCount: token.triggerCount,
    lastTriggered: token.triggeredAt || null,
    lastTriggerIp: token.lastTriggerIp || null,
  }));

  const recentTriggers = triggers.slice(-50).map((trigger) => ({
    id: trigger.id,
    tokenName: trigger.tokenName,
    tokenType: trigger.tokenType,
    tokenPath: trigger.tokenPath,
    ip: trigger.ip,
    userAgent: trigger.userAgent,
    method: trigger.method,
    timestamp: trigger.timestamp,
  }));

  return NextResponse.json({
    summary: {
      totalTokens: CANARY_TOKENS.length,
      activeTokens: CANARY_TOKENS.filter((t) => t.status === 'active').length,
      totalTriggers: stats.total,
      recentTriggers: stats.recentCount,
    },
    tokens: tokenStats,
    recentTriggers: recentTriggers,
    timestamp: new Date().toISOString(),
  });
}

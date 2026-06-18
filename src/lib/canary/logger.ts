import { CanaryTrigger, CanaryTokenType } from './types';
import { CANARY_TOKENS } from './config';

const triggerLog: CanaryTrigger[] = [];

export function logTrigger(trigger: CanaryTrigger): void {
  triggerLog.push(trigger);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Canary] Trigger logged: ${trigger.tokenName}`);
    console.log(`[Canary] IP: ${trigger.ip}`);
    console.log(`[Canary] Path: ${trigger.tokenPath}`);
    console.log(`[Canary] Time: ${trigger.timestamp}`);
  }

  const token = CANARY_TOKENS.find((t) => t.id === trigger.tokenId);
  if (token) {
    token.triggerCount++;
    token.triggeredAt = trigger.timestamp;
    token.lastTriggerIp = trigger.ip;
    token.lastTriggerUserAgent = trigger.userAgent;
    token.lastTriggerReferer = trigger.referer;
  }
}

export function getTriggerLog(): CanaryTrigger[] {
  return [...triggerLog];
}

export function getTriggerLogByTokenId(tokenId: string): CanaryTrigger[] {
  return triggerLog.filter((trigger) => trigger.tokenId === tokenId);
}

export function getTriggerLogByIp(ip: string): CanaryTrigger[] {
  return triggerLog.filter((trigger) => trigger.ip === ip);
}

export function getTriggerLogByType(type: CanaryTokenType): CanaryTrigger[] {
  return triggerLog.filter((trigger) => trigger.tokenType === type);
}

export function getRecentTriggers(minutes: number): CanaryTrigger[] {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000);
  return triggerLog.filter((trigger) => new Date(trigger.timestamp) > cutoff);
}

export function getTriggerStats(): {
  total: number;
  byType: Record<string, number>;
  byIp: Record<string, number>;
  recentCount: number;
} {
  const byType: Record<string, number> = {};
  const byIp: Record<string, number> = {};

  for (const trigger of triggerLog) {
    byType[trigger.tokenType] = (byType[trigger.tokenType] || 0) + 1;
    byIp[trigger.ip] = (byIp[trigger.ip] || 0) + 1;
  }

  return {
    total: triggerLog.length,
    byType,
    byIp,
    recentCount: getRecentTriggers(60).length,
  };
}

export function clearTriggerLog(): void {
  triggerLog.length = 0;
}

export function createTrigger(
  tokenId: string,
  tokenName: string,
  tokenType: CanaryTokenType,
  tokenPath: string,
  request: {
    ip: string;
    userAgent: string;
    referer: string;
    method: string;
  }
): CanaryTrigger {
  return {
    id: `trigger-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    tokenId,
    tokenName,
    tokenType,
    tokenPath,
    ip: request.ip,
    userAgent: request.userAgent,
    referer: request.referer,
    method: request.method,
    timestamp: new Date().toISOString(),
  };
}

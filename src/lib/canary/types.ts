export type CanaryTokenType =
  | 'web'
  | 'dns'
  | 'file'
  | 'aws'
  | 'msword'
  | 'pdf'
  | 'qr'
  | 'mysql'
  | 'sqlserver'
  | 'fast-redirect'
  | 'slow-redirect'
  | 'web-image'
  | 'svg'
  | 'cloned-website-js'
  | 'cloned-website-css';

export type CanaryTokenStatus = 'active' | 'triggered' | 'disabled';

export interface CanaryToken {
  id: string;
  name: string;
  type: CanaryTokenType;
  path: string;
  description: string;
  notifyEmail: string;
  status: CanaryTokenStatus;
  createdAt: string;
  triggeredAt?: string;
  triggerCount: number;
  lastTriggerIp?: string;
  lastTriggerUserAgent?: string;
  lastTriggerReferer?: string;
  metadata?: Record<string, string>;
}

export interface CanaryTrigger {
  id: string;
  tokenId: string;
  tokenName: string;
  tokenType: CanaryTokenType;
  tokenPath: string;
  ip: string;
  userAgent: string;
  referer: string;
  method: string;
  country?: string;
  city?: string;
  isp?: string;
  timestamp: string;
}

export interface CanaryConfig {
  notifyEmail: string;
  enabled: boolean;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logTriggers: boolean;
  sendEmailAlerts: boolean;
}

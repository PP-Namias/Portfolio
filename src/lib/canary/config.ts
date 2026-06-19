import { CanaryToken, CanaryConfig } from './types';

export const CANARY_CONFIG: CanaryConfig = {
  notifyEmail: 'jkrbn99@gmail.com',
  enabled: true,
  rateLimitWindowMs: 60 * 1000,
  rateLimitMaxRequests: 10,
  logTriggers: true,
  sendEmailAlerts: true,
};

export const CANARY_TOKENS: CanaryToken[] = [
  {
    id: 'canary-admin',
    name: 'Fake Admin Panel',
    type: 'web',
    path: '/api/canary/admin',
    description: 'Decoy admin endpoint that attracts scanners looking for admin panels',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-config',
    name: 'Fake Config Endpoint',
    type: 'web',
    path: '/api/canary/config',
    description: 'Decoy config endpoint probing for application secrets',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-env',
    name: 'Fake .env File',
    type: 'file',
    path: '/.env-canary',
    description: 'Decoy environment file with fake credentials',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-wp-admin',
    name: 'Fake WordPress Admin',
    type: 'web',
    path: '/wp-admin-canary',
    description: 'Decoy WordPress admin panel for WP scanners',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-phpmyadmin',
    name: 'Fake phpMyAdmin',
    type: 'web',
    path: '/phpmyadmin-canary',
    description: 'Decoy database admin panel',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-ssh-key',
    name: 'Fake SSH Key',
    type: 'file',
    path: '/.ssh-canary/id_rsa',
    description: 'Decoy SSH private key',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-aws-creds',
    name: 'Fake AWS Credentials',
    type: 'file',
    path: '/.aws-canary/credentials',
    description: 'Decoy AWS access keys',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-db-backup',
    name: 'Fake Database Backup',
    type: 'file',
    path: '/backups-canary/database.sql',
    description: 'Decoy database backup file',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-sitemap',
    name: 'Fake Sitemap',
    type: 'web',
    path: '/sitemap-canary.xml',
    description: 'Decoy sitemap with hidden admin URLs',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
  {
    id: 'canary-robots',
    name: 'Fake robots.txt',
    type: 'web',
    path: '/robots-canary.txt',
    description: 'Decoy robots.txt with disallowed admin paths',
    notifyEmail: CANARY_CONFIG.notifyEmail,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  },
];

export function getCanaryTokenById(id: string): CanaryToken | undefined {
  return CANARY_TOKENS.find((token) => token.id === id);
}

export function getCanaryTokenByPath(path: string): CanaryToken | undefined {
  return CANARY_TOKENS.find((token) => token.path === path);
}

export function getActiveCanaryTokens(): CanaryToken[] {
  return CANARY_TOKENS.filter((token) => token.status === 'active');
}

export function getCanaryTokensByType(type: CanaryToken['type']): CanaryToken[] {
  return CANARY_TOKENS.filter((token) => token.type === type);
}

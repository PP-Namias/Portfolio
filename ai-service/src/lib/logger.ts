import { pino, type Logger } from 'pino';

export function createLogger(name: string): Logger {
  return pino({
    name,
    level: process.env.NODE_ENV === 'test' ? 'silent' : (process.env.AI_LOG_LEVEL ?? 'info'),
  });
}

export const logger = createLogger('ai-service');

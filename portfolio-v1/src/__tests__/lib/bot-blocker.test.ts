import { describe, expect, it } from 'vitest';
import { checkBot } from '@/lib/bot-blocker';

describe('checkBot', () => {
  it('blocks empty user agent', () => {
    const result = checkBot(null, '/');
    expect(result.blocked).toBe(true);
    expect(result.statusCode).toBe(418);
    expect(result.reason).toBe('empty-user-agent');
  });

  it('blocks empty string user agent', () => {
    const result = checkBot('  ', '/');
    expect(result.blocked).toBe(true);
    expect(result.statusCode).toBe(418);
  });

  it('blocks known scrapers', () => {
    const scrapers = [
      'SemrushBot/7.0',
      'Mozilla/5.0 (compatible; AhrefsBot/7.0)',
      'Mozilla/5.0 (compatible; MJ12bot/v1.4.8)',
      'Mozilla/5.0 (compatible; DotBot/1.2)',
      'Mozilla/5.0 (compatible; PetalBot/6.5)',
      'Mozilla/5.0 (Linux; Android 6.0.1) Bytespider',
      'Mozilla/5.0 (compatible; GPTBot/1.0)',
      'Mozilla/5.0 (compatible; ChatGPT-User/1.0)',
      'ClaudeBot/1.0',
      'Amazonbot/0.1',
    ];

    for (const ua of scrapers) {
      const result = checkBot(ua, '/');
      expect(result.blocked).toBe(true);
      expect(result.statusCode).toBe(418);
    }
  });

  it('blocks scanner tools', () => {
    const scanners = [
      'Nikto/2.1.6',
      'sqlmap/1.4.7',
      'Nmap/7.80',
      'Mozilla/5.0 (compatible; Zgrab/0.5)',
      'Mozilla/5.0 (compatible; Nuclei)',
    ];

    for (const ua of scanners) {
      const result = checkBot(ua, '/');
      expect(result.blocked).toBe(true);
      expect(result.statusCode).toBe(418);
    }
  });

  it('blocks HTTP clients', () => {
    const clients = [
      'curl/7.68.0',
      'Wget/1.20.3',
      'python-requests/2.25.1',
      'Go-http-client/1.1',
    ];

    for (const ua of clients) {
      const result = checkBot(ua, '/');
      expect(result.blocked).toBe(true);
      expect(result.statusCode).toBe(418);
    }
  });

  it('blocks attack paths', () => {
    const paths = [
      '/wp-admin',
      '/wp-login.php',
      '/wp-content/plugins',
      '/xmlrpc.php',
      '/cgi-bin/test',
      '/phpmyadmin',
      '/.env',
      '/.git/config',
      '/config.php',
      '/server-status',
    ];

    for (const path of paths) {
      const result = checkBot('Mozilla/5.0', path);
      expect(result.blocked).toBe(true);
      expect(result.statusCode).toBe(418);
    }
  });

  it('allows legitimate browsers', () => {
    const browsers = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0',
    ];

    for (const ua of browsers) {
      const result = checkBot(ua, '/');
      expect(result.blocked).toBe(false);
    }
  });

  it('allows legitimate API paths', () => {
    const result = checkBot('Mozilla/5.0', '/api/chat');
    expect(result.blocked).toBe(false);
  });
});

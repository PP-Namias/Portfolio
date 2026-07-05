const BLOCKED_UA_PATTERNS: RegExp[] = [
  /semrush/i,
  /ahrefs/i,
  /mj12bot/i,
  /dotbot/i,
  /blexbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /chatgpt-user/i,
  /ccbot/i,
  /claudebot/i,
  /anthropic-ai/i,
  /cohere-ai/i,
  /amazonbot/i,
  /meta-externalagent/i,
  /facebookbot/i,
  /scrapy/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /python-urllib/i,
  /go-http-client/i,
  /java\//i,
  /nikto/i,
  /sqlmap/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /httpx/i,
  /dirbuster/i,
  /gobuster/i,
  /ffuf/i,
  /wfuzz/i,
  /hydra/i,
  /medusa/i,
  /netsparker/i,
  /acunetix/i,
  /qualys/i,
  /openvas/i,
  /burpsuite/i,
  /owasp/i,
  /w3af/i,
  /whatweb/i,
  /builtwith/i,
  /censys/i,
  /shodan/i,
  /nuclei/i,
  /zoominfobot/i,
  /sogou/i,
  /exabot/i,
  /yandex/i,
  /baiduspider/i,
  /dotbot/i,
  /rogerbot/i,
  /linkedinbot/i,
  /embedly/i,
  /quora link preview/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest/i,
  /slackbot/i,
  /vkShare/i,
  /W3C_Validator/i,
  /whatsapp/i,
  /flipboard/i,
  /tumblr/i,
  /bitlybot/i,
  /skypeuripreview/i,
  /nuzzel/i,
  /discordbot/i,
  /qwantify/i,
  /pinterestbot/i,
  /bitrix link preview/i,
  /xing-contenttabreceiver/i,
  /chrome-lighthouse/i,
  /telegrambot/i,
  /seznambot/i,
  /backlinkcrawler/i,
  /email/i,
  /image/i,
  /data/i,
];

const BLOCKED_PATH_PATTERNS: RegExp[] = [
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
  /^\/xmlrpc\.php/i,
  /^\/wp-cron\.php/i,
  /^\/wp-json/i,
  /^\/cgi-bin/i,
  /^\/phpmyadmin/i,
  /^\/adminer/i,
  /^\/phpinfo/i,
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/\.svn/i,
  /^\/\.hg/i,
  /^\/config\.php/i,
  /^\/config\.inc\.php/i,
  /^\/setup\.php/i,
  /^\/install\.php/i,
  /^\/server-status/i,
  /^\/server-info/i,
  /^\/.well-known\/security/i,
];

export interface BotBlockResult {
  blocked: boolean;
  reason?: string;
  statusCode?: number;
}

export function checkBot(userAgent: string | null, pathname: string): BotBlockResult {
  if (!userAgent || userAgent.trim().length === 0) {
    return {
      blocked: true,
      reason: 'empty-user-agent',
      statusCode: 418,
    };
  }

  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (pattern.test(userAgent)) {
      return {
        blocked: true,
        reason: `blocked-ua:${pattern.source}`,
        statusCode: 418,
      };
    }
  }

  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return {
        blocked: true,
        reason: `blocked-path:${pattern.source}`,
        statusCode: 418,
      };
    }
  }

  return { blocked: false };
}

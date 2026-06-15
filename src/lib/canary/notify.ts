import { CanaryTrigger, CanaryTokenType } from './types';
import { CANARY_CONFIG } from './config';

interface EmailAlert {
  to: string;
  subject: string;
  html: string;
}

function getTokenTypeEmoji(type: CanaryTokenType): string {
  const emojis: Record<CanaryTokenType, string> = {
    web: '🌐',
    dns: '🔍',
    file: '📁',
    aws: '☁️',
    msword: '📄',
    pdf: '📕',
    qr: '📱',
    mysql: '🗃️',
    sqlserver: '🗃️',
    'fast-redirect': '↪️',
    'slow-redirect': '↪️',
    'web-image': '🖼️',
    svg: '🎨',
    'cloned-website-js': '🌐',
    'cloned-website-css': '🎨',
  };
  return emojis[type] || '⚠️';
}

function getTokenTypeName(type: CanaryTokenType): string {
  const names: Record<CanaryTokenType, string> = {
    web: 'Web Token',
    dns: 'DNS Token',
    file: 'File Token',
    aws: 'AWS Token',
    msword: 'Word Document',
    pdf: 'PDF Document',
    qr: 'QR Code',
    mysql: 'MySQL Token',
    sqlserver: 'SQL Server Token',
    'fast-redirect': 'Fast Redirect',
    'slow-redirect': 'Slow Redirect',
    'web-image': 'Web Image',
    svg: 'SVG Image',
    'cloned-website-js': 'Cloned Website (JS)',
    'cloned-website-css': 'Cloned Website (CSS)',
  };
  return names[type] || 'Unknown';
}

export function buildEmailAlert(trigger: CanaryTrigger): EmailAlert {
  const emoji = getTokenTypeEmoji(trigger.tokenType);
  const typeName = getTokenTypeName(trigger.tokenType);

  const subject = `${emoji} Canary Token Triggered: ${trigger.tokenName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 20px; }
    .section { margin-bottom: 20px; }
    .section h2 { color: #333; font-size: 16px; border-bottom: 2px solid #e74c3c; padding-bottom: 8px; margin-bottom: 12px; }
    .field { display: flex; margin-bottom: 8px; }
    .field-label { font-weight: 600; color: #666; min-width: 120px; }
    .field-value { color: #333; font-family: monospace; background: #f8f9fa; padding: 2px 8px; border-radius: 4px; flex: 1; word-break: break-all; }
    .action-box { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-top: 20px; }
    .action-box h3 { color: #856404; margin: 0 0 10px; font-size: 14px; }
    .action-box ul { margin: 0; padding-left: 20px; color: #856404; }
    .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    .badge { display: inline-block; background: #e74c3c; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${emoji} Canary Token Triggered</h1>
      <p>A tripwire has been activated on your portfolio</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>Token Details</h2>
        <div class="field">
          <span class="field-label">Name:</span>
          <span class="field-value">${trigger.tokenName}</span>
        </div>
        <div class="field">
          <span class="field-label">Type:</span>
          <span class="field-value"><span class="badge">${typeName}</span></span>
        </div>
        <div class="field">
          <span class="field-label">Path:</span>
          <span class="field-value">${trigger.tokenPath}</span>
        </div>
        <div class="field">
          <span class="field-label">Triggered At:</span>
          <span class="field-value">${new Date(trigger.timestamp).toISOString()}</span>
        </div>
      </div>

      <div class="section">
        <h2>Request Details</h2>
        <div class="field">
          <span class="field-label">IP Address:</span>
          <span class="field-value">${trigger.ip}</span>
        </div>
        <div class="field">
          <span class="field-label">Method:</span>
          <span class="field-value">${trigger.method}</span>
        </div>
        <div class="field">
          <span class="field-label">User Agent:</span>
          <span class="field-value">${trigger.userAgent || 'Not provided'}</span>
        </div>
        <div class="field">
          <span class="field-label">Referer:</span>
          <span class="field-value">${trigger.referer || 'Direct access'}</span>
        </div>
      </div>

      ${trigger.country ? `
      <div class="section">
        <h2>Geolocation</h2>
        <div class="field">
          <span class="field-label">Country:</span>
          <span class="field-value">${trigger.country}</span>
        </div>
        ${trigger.city ? `
        <div class="field">
          <span class="field-label">City:</span>
          <span class="field-value">${trigger.city}</span>
        </div>
        ` : ''}
        ${trigger.isp ? `
        <div class="field">
          <span class="field-label">ISP:</span>
          <span class="field-value">${trigger.isp}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="action-box">
        <h3>⚡ Action Required</h3>
        <ul>
          <li>Review the trigger details above</li>
          <li>Check for patterns (multiple triggers from same IP?)</li>
          <li>Block suspicious IPs at firewall level</li>
          <li>Update security rules if needed</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>This alert was sent by your Portfolio Canary System</p>
      <p>Trigger ID: ${trigger.id} | Token ID: ${trigger.tokenId}</p>
    </div>
  </div>
</body>
</html>
`;

  return {
    to: CANARY_CONFIG.notifyEmail,
    subject,
    html,
  };
}

export async function sendCanaryAlert(trigger: CanaryTrigger): Promise<boolean> {
  if (!CANARY_CONFIG.sendEmailAlerts) {
    console.log('[Canary] Email alerts disabled, skipping');
    return false;
  }

  const alert = buildEmailAlert(trigger);

  try {
    console.log(`[Canary] Sending alert to ${alert.to}`);
    console.log(`[Canary] Subject: ${alert.subject}`);
    console.log(`[Canary] Token: ${trigger.tokenName} at ${trigger.tokenPath}`);
    console.log(`[Canary] IP: ${trigger.ip}`);
    console.log(`[Canary] User Agent: ${trigger.userAgent}`);

    return true;
  } catch (error) {
    console.error('[Canary] Failed to send alert:', error);
    return false;
  }
}

export async function sendTestAlert(): Promise<boolean> {
  const testTrigger: CanaryTrigger = {
    id: 'test-trigger',
    tokenId: 'test-token',
    tokenName: 'Test Token',
    tokenType: 'web',
    tokenPath: '/api/canary/test',
    ip: '127.0.0.1',
    userAgent: 'CanaryTestAgent/1.0',
    referer: '',
    method: 'GET',
    timestamp: new Date().toISOString(),
  };

  return sendCanaryAlert(testTrigger);
}

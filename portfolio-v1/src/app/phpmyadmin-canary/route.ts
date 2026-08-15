import { NextRequest } from 'next/server';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || '';
  const method = request.method;

  const token = getCanaryTokenById('canary-phpmyadmin');
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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>phpMyAdmin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; }
    .header { background: #00758f; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 18px; font-weight: normal; }
    .header .logo { font-size: 24px; }
    .login-container { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 50px); }
    .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 400px; }
    .login-box h2 { color: #00758f; margin-bottom: 20px; font-size: 20px; border-bottom: 2px solid #00758f; padding-bottom: 10px; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; color: #333; font-size: 14px; }
    .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
    .form-group select { background: white; }
    .btn { background: #00758f; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; }
    .btn:hover { background: #005a73; }
    .canary-notice { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #856404; text-align: center; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🗄️ phpMyAdmin</div>
    <div>Login</div>
  </div>
  
  <div class="login-container">
    <div class="login-box">
      <h2>Welcome to phpMyAdmin</h2>
      <div class="canary-notice">⚠️ This is a canary token - access logged</div>
      
      <form>
        <div class="form-group">
          <label for="server">Server:</label>
          <select id="server">
            <option value="localhost">localhost:3306</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="pma_username" autocomplete="username">
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="pma_password" autocomplete="current-password">
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" name="phpMyAdmin" value="phpMyAdmin"> Enter without password
          </label>
        </div>
        
        <button type="submit" class="btn">Go</button>
      </form>
    </div>
  </div>
  
  <div class="footer">
    <p>phpMyAdmin - Canary Token | Access Logged</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Canary-Token': 'canary-phpmyadmin',
      'X-Canary-Triggered': 'true',
    },
  });
}

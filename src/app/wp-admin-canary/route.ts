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

  const token = getCanaryTokenById('canary-wp-admin');
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
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log In &lsaquo; WordPress</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f1f1; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .login { width: 320px; }
    .login h1 { text-align: center; margin-bottom: 20px; }
    .login h1 a { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>') no-repeat; background-size: 80px 80px; display: block; height: 80px; width: 80px; margin: 0 auto; text-indent: -9999px; }
    .login form { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.13); padding: 20px; border-radius: 4px; }
    .login label { display: block; margin-bottom: 5px; font-size: 14px; color: #333; }
    .login input[type="text"], .login input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-bottom: 15px; }
    .login input[type="submit"] { background: #0073aa; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; }
    .login input[type="submit"]:hover { background: #005a87; }
    .login .lost-password { text-align: center; margin-top: 15px; }
    .login .lost-password a { color: #0073aa; text-decoration: none; font-size: 13px; }
    .login .nav { text-align: center; margin-top: 20px; font-size: 13px; }
    .login .nav a { color: #0073aa; text-decoration: none; }
    .canary-notice { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #856404; text-align: center; }
  </style>
</head>
<body>
  <div class="login">
    <h1><a href="#">WordPress</a></h1>
    <div class="canary-notice">⚠️ This is a canary token - access logged</div>
    <form>
      <label for="user_login">Username or Email Address</label>
      <input type="text" name="log" id="user_login" autocomplete="username">
      
      <label for="user_pass">Password</label>
      <input type="password" name="pwd" id="user_pass" autocomplete="current-password">
      
      <label>
        <input type="checkbox" name="rememberme" value="forever"> Remember Me
      </label>
      
      <input type="submit" name="wp-submit" value="Log In">
      
      <div class="lost-password">
        <a href="#">Lost your password?</a>
      </div>
    </form>
    <div class="nav">
      <a href="#">← Back to Portfolio</a>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Canary-Token': 'canary-wp-admin',
      'X-Canary-Triggered': 'true',
    },
  });
}

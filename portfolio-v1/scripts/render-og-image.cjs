const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const FONT_DIR = path.join(__dirname, 'og-fonts');
const OUT_DIR = path.join(__dirname, '..', '.og-render-tmp');

function readBase64(name) {
  return fs.readFileSync(path.join(FONT_DIR, name)).toString('base64');
}

const F500 = readBase64('inter-500.woff2');
const F800 = readBase64('inter-800.woff2');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Inter'; src: url(data:font/woff2;base64,${F500}) format('woff2'); font-weight: 500; font-style: normal; }
  @font-face { font-family: 'Inter'; src: url(data:font/woff2;base64,${F800}) format('woff2'); font-weight: 800; font-style: normal; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: linear-gradient(135deg, #0b0d12 0%, #1e1b2e 50%, #2a1a35 100%);
    position: relative;
    color: #fff;
  }
  .grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .glow-pink { position: absolute; top: -80px; right: -60px; width: 400px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,99,165,0.3) 0%, transparent 70%); }
  .glow-cyan { position: absolute; bottom: -60px; left: -40px; width: 380px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%); }
  .bar { position: absolute; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #ff63a5, #a78bfa, #06b6d4); }
  .bar-top { top: 0; } .bar-bottom { bottom: 0; }
  .content { position: absolute; inset: 0; padding: 60px 80px; display: flex; flex-direction: column; }
  .row-badge { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
  .badge { width: 60px; height: 60px; border-radius: 14px; background: #ff63a5; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #fff; }
  .tagline { font-size: 14px; font-weight: 500; color: #06b6d4; letter-spacing: 3px; }
  .name-1 { font-size: 72px; font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 12px; }
  .name-2 { font-size: 72px; font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 20px; }
  .name-2 .accent { color: #ff63a5; }
  .role { font-size: 26px; font-weight: 500; color: #a78bfa; margin-bottom: 24px; }
  .divider { width: 140px; height: 3px; background: #ff63a5; margin-bottom: 28px; }
  .tags { display: flex; gap: 12px; }
  .tag { display: flex; align-items: center; justify-content: center; padding: 8px 20px; border-radius: 20px; font-size: 16px; font-weight: 500; }
  .t-nextjs { border: 1px solid #ff63a5; background: rgba(255,99,165,0.15); color: #ff63a5; }
  .t-ts { border: 1px solid #a78bfa; background: rgba(167,139,250,0.15); color: #a78bfa; }
  .t-sanity { border: 1px solid #06b6d4; background: rgba(6,182,212,0.15); color: #06b6d4; }
  .t-cf { border: 1px solid #22c55e; background: rgba(34,197,94,0.15); color: #22c55e; }
  .bottom { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-bottom: 4px; }
  .status { display: flex; align-items: center; gap: 10px; font-size: 15px; color: #94a3b8; font-weight: 500; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.2); }
  .url { font-size: 18px; font-weight: 600; color: #06b6d4; letter-spacing: 1px; }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="glow-pink"></div>
  <div class="glow-cyan"></div>
  <div class="bar bar-top"></div>
  <div class="content">
    <div class="row-badge">
      <div class="badge">JN</div>
      <div class="tagline">PORTFOLIO &bull; 2026</div>
    </div>
    <div class="name-1">Jhon Keneth</div>
    <div class="name-2"><span class="accent">Ryan</span> Namias</div>
    <div class="role">Full Stack Engineer &amp; AI Automation Specialist</div>
    <div class="divider"></div>
    <div class="tags">
      <div class="tag t-nextjs">Next.js</div>
      <div class="tag t-ts">TypeScript</div>
      <div class="tag t-sanity">Sanity</div>
      <div class="tag t-cf">Cloudflare</div>
    </div>
    <div class="bottom">
      <div class="status"><div class="dot"></div>Available for new work</div>
      <div class="url">namias.tech</div>
    </div>
  </div>
  <div class="bar bar-bottom"></div>
</body>
</html>`;

const htmlPath = path.join(OUT_DIR, 'og-card.html');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(htmlPath, html);
console.log('html written:', html.length, 'bytes');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const pngPath = 'public/og-image.png';
  await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  const buf = fs.readFileSync(pngPath);
  const sig = buf.slice(0, 8).toString('hex');
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log('PNG written:', pngPath, 'bytes:', buf.length, 'sig:', sig, 'dims:', width + 'x' + height);
})();

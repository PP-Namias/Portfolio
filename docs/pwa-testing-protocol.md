# PWA Testing Protocol — PP Namias Portfolio

Stack: Next.js 16.2.10 / TypeScript / Tailwind CSS
SW: `public/sw.js` v5 (custom, no library)
Registration: `src/lib/sw-register.ts` (production-only)
Tunnel: ngrok (recommended) or cloudflared

---

## 1. Local Production Build

SW does NOT register in dev mode (`next dev`). You must build and serve the production bundle.

```bash
# From portfolio-v1/
npm run build

# Build output should show "✓ Compiled successfully" and 43/43 pages generated
# Then generate the SW asset manifest:
npm run generate-sw-manifest

# Start production server on port 3333
npx next start -p 3333
```

Verify the server is up:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3333
# Expected: 200
```

---

## 2. Chrome DevTools Verification

### 2.1 Service Worker Registration

1. Open Chrome and navigate to `http://localhost:3333`
2. Open DevTools: `F12` or `Ctrl+Shift+I`
3. Click the **Application** tab (» maybe hidden under `>>`)
4. In the left sidebar, click **Service Workers**
5. Verify:
   - [ ] **"Received 200 OK"** next to `/sw.js` scope `/`
   - [ ] Status shows **Activated and is running**
   - [ ] **"Clients"** count shows 1 (or more if multiple tabs)
   - [ ] **Update on reload** checkbox is visible (leave unchecked)

### 2.2 Cache Storage Inspection

1. In the **Application** tab left sidebar, expand **Cache Storage**
2. You should see three caches:
   - `portfolio-static-v5`
   - `portfolio-nav-v5`
   - `portfolio-api-v5`
3. Click each cache to view its contents:
   - **portfolio-static-v5**: `/`, `/site.webmanifest`, `/favicon.svg`, `/apple-touch-icon.png`, `/icons/*.png`, `/_next/static/**/*.js`, `/_next/static/**/*.css`
   - **portfolio-nav-v5**: `/offline` and previously visited pages
   - **portfolio-api-v5**: Cached API responses (if any were fetched)

### 2.3 Offline Simulation

1. Keep DevTools open on the **Application > Service Workers** pane
2. Go to the **Network** tab
3. Check the **Offline** checkbox (top-left of the Network tab)
4. Reload the page (`Ctrl+R`)
5. Verify:
   - [ ] The page loads fully (all CSS, JS, images visible)
   - [ ] No network requests show in the Network tab (all grayed out or zero)
   - [ ] The offline banner does NOT appear (because the page loaded from cache successfully)

### 2.4 Unvisited Route Fallback

1. While still offline in DevTools
2. Navigate to a page you have NOT visited before, e.g. `http://localhost:3333/projects/car-dealership-manager`
3. Verify:
   - [ ] The page loads from stale-while-revalidate cache (or shows cached content)
   - [ ] If no cached version exists, it shows the `/offline` page with the wifi-off icon and "Try again" button
4. Click **"Try again"** — it should reload and detect you're still offline

---

## 3. Mobile "Airplane Mode" Test (The Wow Moment)

SW requires a secure context (HTTPS). Local HTTP won't work for the install prompt or mobile testing. Use a tunnel.

### 3.1 Install a Tunnel Tool

**Option A — ngrok** (recommended):

```bash
# Download from https://ngrok.com/download
# Or via winget:
winget install ngrok

# Authenticate (free tier — sign up at ngrok.com for a token)
ngrok config add-authtoken YOUR_TOKEN

# Tunnel the production server
ngrok http http://localhost:3333
```

**Option B — cloudflared** (if you already use Cloudflare):

```bash
# Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
# Or via winget:
winget install cloudflare.cloudflared

# Tunnel the production server
cloudflared tunnel --url http://localhost:3333
```

**Option C — localtunnel** (no account needed, but slower):

```bash
npx localtunnel --port 3333
```

### 3.2 Tunnel Verification

After running the tunnel, you'll get a public HTTPS URL like:
- ngrok: `https://abc123.ngrok-free.app`
- cloudflared: `https://random-name.trycloudflare.com`

Open that URL on your desktop browser first to verify the site loads.

**IMPORTANT CSP note**: The tunnel URL differs from `localhost`, so the CSP `upgrade-insecure-requests` directive will trigger browser warnings. This is cosmetic in testing; the site will still work. For a production deployment, the CSP is calibrated for the real domain (`namias.tech`).

### 3.3 Mobile Phone Setup

1. Ensure your phone is on the **same Wi-Fi network** as your dev machine
2. Open **Chrome** (Android) or **Safari** (iOS) on your phone
3. Navigate to the tunnel HTTPS URL from step 3.2
4. Wait for the page to fully load (all images, fonts, styling)
5. The SW registers automatically in the background

### 3.4 Verify Service Worker on Mobile (Android)

1. Open Chrome on Android
2. Go to `chrome://inspect` on desktop (optional for debugging)
3. On the phone, go to the tunnel URL
4. In Chrome address bar, type `chrome://serviceworker-internals`
5. Verify:
   - [ ] `/sw.js` is listed with scope `/`
   - [ ] Status is **ACTIVATED**

### 3.5 The Wow Moment — Airplane Mode

1. With the site fully loaded on your phone
2. **Toggle Airplane Mode ON** (or turn off Wi-Fi and mobile data)
3. **Close the browser tab completely**
4. **Open a fresh browser tab**
5. Navigate to the same tunnel HTTPS URL
6. **Expected result** — the entire portfolio loads instantly:
   - [ ] All text, styling, and layout render correctly
   - [ ] All SVG and PNG icons display
   - [ ] The homepage hero, blog section, project cards, and certifications all visible
   - [ ] The amber offline banner **may** appear at the bottom: *"You are currently offline. Browsing cached portfolio data."*
   - [ ] Clicking project links loads cached versions or gracefully shows the `/offline` page
7. **Turn off Airplane Mode**
8. **The green banner** appears briefly: *"Back online — you are viewing the latest content."* then fades

### 3.6 iOS Safari-specific Notes

iOS Safari has stricter SW behavior:

1. SW only activates after the **second visit** (first load registers, second load activates)
2. Navigate to the tunnel URL, then close and reopen the tab
3. The offline prompt (`Add to Home Screen`) requires the page to be visited a few times
4. To add to home screen: tap the **Share** button → **Add to Home Screen**
5. After adding, open the home screen icon and test Airplane Mode

---

## 4. Lighthouse PWA Audit

Run a Lighthouse audit to verify PWA compliance:

```bash
# Using Chrome DevTools:
# 1. Open the site in Chrome
# 2. F12 → Lighthouse tab
# 3. Check only "Progressive Web App" category
# 4. Select "Mobile" device
# 5. Click "Analyze page load"
```

Expected passing audits:

| Audit | Expected | Notes |
|-------|----------|-------|
| `installable-manifest` | Pass | Manifest has all required fields |
| `splash-screen` | Pass | Icons + theme_color configured |
| `themed-omnibox` | Pass | theme_color in manifest + viewport |
| `content-width` | Pass | Responsive viewport set |
| `viewport` | Pass | `width=device-width` |
| `apple-touch-icon` | Pass | 180x180 PNG configured |
| `service-worker` | Pass | SW registered and responding |
| `offline-start-url` | Pass | Start URL returns 200 when offline |
| `load-fast-enough-for-pwa` | Pass | Performance metrics |

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| SW not registering | You're running `next dev` | Build + start with `next start` |
| Cache Storage empty | First visit hasn't finished installing | Reload the page once, wait 5s |
| Offline shows blank page / 503 | Route not in cache | Visit the route once while online first |
| `ngrok` gives 502 bad gateway | Server not running on port 3333 | Verify `next start -p 3333` is running |
| Mobile shows "Not Secure" | Tunnel free tier warning | Click "Advanced" → "Proceed anyway" |
| Lighthouse PWA score < 90 | Missing screenshots or description | Verify `site.webmanifest` has all fields |
| "Back online" banner never shows | `wasOffline` ref resets on navigation | Reload the page once after reconnection |

---

## 6. Cleanup & Reset

To clear all caches and start fresh:

```bash
# In Chrome DevTools Console on the site:
await navigator.serviceWorker.getRegistration().then(r => r?.unregister());
// or use the registered message channel:
// (imported from sw-register.ts)
sendMessageToSW('CLEAR_CACHE');

# In DevTools Application tab:
# Click "Clear storage" → "Clear site data"
```

To kill the production server:

```bash
# Find and kill the next start process
netstat -ano | findstr ":3333"
# Get the PID, then:
Stop-Process -Id <PID> -Force
```

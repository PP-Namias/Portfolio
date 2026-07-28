const CACHE_VERSION = 'v5';
const STATIC_CACHE = `portfolio-static-${CACHE_VERSION}`;
const NAV_CACHE = `portfolio-nav-${CACHE_VERSION}`;
const API_CACHE = `portfolio-api-${CACHE_VERSION}`;

const ASSETS = [
  '/',
  '/offline',
  '/site.webmanifest',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/og-image.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon-180x180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      await staticCache.addAll(ASSETS).catch(() => {});
      const navCache = await caches.open(NAV_CACHE);
      try {
        const res = await fetch('/offline');
        if (res.ok) navCache.put('/offline', res.clone());
      } catch {}
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/favicon.svg' ||
    url.pathname === '/apple-touch-icon.png' ||
    url.pathname === '/site.webmanifest'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith('/api/media/')) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request, NAV_CACHE));
    return;
  }

  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      const clone = response.clone();
      await cache.put(request, clone);
    }
    return response;
  }).catch(async () => {
    const offline = await caches.match('/offline');
    return offline || new Response('Offline', { status: 503 });
  });
  return cached || fetchPromise;
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const keep = event.data.keep || [];
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => !keep.includes(k))
          .map((k) => caches.delete(k))
      );
    }).then(() => {
      if (event.ports && event.ports[0]) event.ports[0].postMessage({ success: true });
    });
  }
});

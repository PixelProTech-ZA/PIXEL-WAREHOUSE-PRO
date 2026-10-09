// Pixel Warehouse Pro — service worker
// Bump CACHE_NAME on every release so installed copies pick up the new index.html.
const CACHE_NAME = 'pixel-warehouse-pro-v2';

// index.html + manifest are mandatory. Icons are best-effort: a missing icon must
// never stop the app from installing or working offline.
const REQUIRED = ['./', './index.html', './manifest.json'];
const OPTIONAL = [
  './icon-72.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];
const SHELL_PATHS = new Set(
  [...REQUIRED, ...OPTIONAL].map((p) => new URL(p, self.location).pathname)
);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(REQUIRED);
    await Promise.allSettled(OPTIONAL.map((p) => cache.add(p)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page loads: network first so a new release is picked up, cached copy when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // App shell files: cache first.
  if (url.origin === self.location.origin && SHELL_PATHS.has(url.pathname)) {
    event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
    return;
  }

  // Everything else (Google Fonts etc.): network first, cache only good responses.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

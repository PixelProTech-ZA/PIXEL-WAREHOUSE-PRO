/* Pixel Warehouse Pro — service worker
   Caches the app shell so the app opens and works offline.
   All warehouse data itself lives in IndexedDB/localStorage on-device,
   so offline receiving/scanning/inventory already work without this file —
   this just makes the app itself installable and load instantly with no network. */

const CACHE = 'pwp-shell-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache =>
        Promise.allSettled(
          SHELL.map(url =>
            fetch(url).then(res => {
              if (res && res.ok) return cache.put(url, res);
              console.warn('[sw] skipped caching (bad response):', url, res && res.status);
            }).catch(err => console.warn('[sw] skipped caching (fetch failed):', url, err))
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('./index.html'));
      return cached || network;
    })
  );
});

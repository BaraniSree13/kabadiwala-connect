// Kabadiwala Connect Service Worker
const CACHE_NAME = 'kabadiwala-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Network first, then fallback to cache for offline mode
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

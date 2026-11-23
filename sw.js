// Auto-generated Service Worker for 山河天际线 Pro 3D (v8.3-e93bc80e66-a8fd7626)
const CACHE_NAME = 'mini-skylines-v8.3-e93bc80e66-a8fd7626';
const CORE_SHELL = [
  './',
  './index.html',
  './app.bundle.js',
  './vendor/three_classic.js',
  './manifest.json',
  './assets/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('mini-skylines-') && k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isBinaryAsset = url.pathname.includes('/assets/') || url.pathname.includes('/icons/');
  const isManifestJson = url.pathname.endsWith('manifest.json');

  if (isBinaryAsset && !isManifestJson) {
    // Cache-First for immutable binary PBR textures, models & icons
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((resp) => {
            if (resp && resp.ok) cache.put(event.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // Network-First with offline cache fallback for HTML, JS & manifest.json (instant updates on iPhone!)
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }).then((c) => c || caches.match('./index.html')))
  );
});

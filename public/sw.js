// PWA Service Worker - Cosmic Love
// Fast-activation and complete cache-clearing to prevent background requests to obsolete endpoints

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Never intercept or cache API requests or non-GET requests
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // Pass-through standard fetches without caching dead routes
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return new Response('Network offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});

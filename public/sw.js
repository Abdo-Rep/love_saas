// PWA Service Worker for Cosmic Love SaaS
const CACHE_NAME = 'cosmic-love-saas-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Allow network requests to pass through seamlessly for real-time SaaS dynamic content
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

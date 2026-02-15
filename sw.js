
const CACHE_NAME = 'tamween-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // استراتيجية Network First لضمان تحميل أحدث كود دائماً
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

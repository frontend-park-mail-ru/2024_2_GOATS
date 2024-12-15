const CACHE_NAME = 'cache_v1';
const CACHE_URLS = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        cache.addAll(CACHE_URLS);
      })
      .then(() => self.skipWaiting()), //???
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        if (event.request.destination === 'image') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
    })(),
  );
});

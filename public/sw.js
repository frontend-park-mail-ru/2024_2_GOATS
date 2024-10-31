const CACHE_NAME = 'cache_v1';
const CACHE_URLS = ['/'];

self.addEventListener('install', (event) => {
  // console.log('Установлен');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CACHE_URLS);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  // console.log('Активирован');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return;
          }

          return caches.delete(key);
        }),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  // console.log('Че-то фетчим');
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());

        // console.log('--------- ВЗЯЛИ ИЗ ИНЕТА');
        return response;
      } catch (error) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          // console.log('--------- ВЗЯЛИ ИЗ КЭША');
          return cachedResponse;
        }
        // console.log('--------- В КЭШЕ ТАКОГО НЕТ');
      }
    })(),
  );
});

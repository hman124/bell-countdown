const CACHE_VERSION = 2;
const CURRENT_CACHES = {
  web: `web-cache-v${CACHE_VERSION}`,
};

self.addEventListener("activate", (event) => {
  console.log(navigator.onLine);
  const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCacheNamesSet.has(cacheName)) {
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CURRENT_CACHES.web).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          if (response.status < 400 && response.headers.has("content-type")) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch((error) => cache.match(event.request));
    }));
});

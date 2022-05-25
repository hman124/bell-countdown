const CACHE_NAME = "cache-v1.2.9";

self.addEventListener("install", e => {
  caches.keys().then(function(names) {
    for (let name of names) caches.delete(name);
  });
  e.waitUntil(async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      "/index.html",
      "/assets/index.js",
      "/assets/index.css",
      "/assets/vendor.js"
    ]);
  });
});

self.addEventListener("fetch", function(event) {
  if (!event.request.url.includes('http')) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return fetch(event.request)
        .then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(function() {
          return caches.match(event.request);
        });
    })
  );
});
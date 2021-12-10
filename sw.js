const CACHE_NAME = "cache-v1.2.7";

self.addEventListener("install", e => {
  caches.keys().then(function(names) {
    for (let name of names) caches.delete(name);
  });
  e.waitUntil(async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      "/index.html",
      "/img/0.png",
      "/img/1.png",
      "/img/2.png",
      "/img/3.png",
      "/img/4.png",
      "/img/5.png",
      "/assets/index.c89c4e46.js",
      "/assets/index.ae306ca4.css",
      "/assets/vendor.cd7509fb.js"
    ]);
  });
});

self.addEventListener("fetch", function(event) {
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

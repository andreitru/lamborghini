const NOT_FOUND = 404;

const CACHE_NAME = "lamborghini-app-v9";
const APP_FILES = [
  "/",
  "/js/main.js",
  "/js/vendor.js",
  "/program.html",
  "/program2.html",
  "/index.html",
  "/loading.html",
  "/css/global.css",
  "/css/main.css",
  "/css/vendor.css",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_FILES);
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return;
          }
          caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const cachedResp = await caches.match(e.request);
      if (cachedResp) {
        return cachedResp;
      }

      const response = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(e.request, response.clone());

      return response;
    })()
  );
});

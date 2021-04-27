const NOT_FOUND = 404;

const CACHE_NAME = "lamborghini-app-v12";
const APP_FILES = [
  "/",
  "/fonts/GLInterstateBold.otf",
  "/fonts/GLInterstateLight.otf",
  "/fonts/GLInterstateRegular.otf",
  "/img/cover.jpg",
  "/img/hotel.jpg",
  "/img/hotel-map.jpg",
  "/img/icon-32.png",
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/larnaline.png",
  "/img/logo.png",
  "/img/nyman.jpg",
  "/img/osipenko.jpg",
  "/img/submit.png",
  "/img/sychev.jpg",
  "/img/useniks.jpg",
  "/img/academy.svg",
  "/img/arrow.svg",
  "/img/arrow-top.svg",
  "/img/background-bottom.svg",
  "/img/black-hex.svg",
  "/img/check.svg",
  "/img/check-reg.svg",
  "/img/clock.svg",
  "/img/contacts.svg",
  "/img/feedback.svg",
  "/img/green-hex.svg",
  "/img/greeting.svg",
  "/img/hexagon.svg",
  "/img/line.svg",
  "/img/main-screen-background.svg",
  "/img/main-screen-background-bottom.svg",
  "/img/main-screen-background-top.svg",
  "/img/main-screen-hexagon.svg",
  "/img/map.svg",
  "/img/orange-hex.svg",
  "/img/participants.svg",
  "/img/place.svg",
  "/img/program.svg",
  "/img/qr.svg",
  "/img/qr-hex.svg",
  "/img/sprite.svg",
  "/img/test-drive.svg",
  "/img/user.svg",
  "/img/bentayga/1.jpg",
  "/img/bentayga/2.jpg",
  "/img/bentayga/3.jpg",
  "/img/bentayga/4.jpg",
  "/img/bentayga/5.jpg",
  "/img/bentayga/6.jpg",
  "/img/bentayga/7.jpg",
  "/img/bentayga/8.jpg",
  "/img/cayenne/1.jpg",
  "/img/cayenne/2.jpg",
  "/img/cayenne/3.jpg",
  "/img/cayenne/4.jpg",
  "/img/cayenne/5.jpg",
  "/img/cayenne/6.jpg",
  "/img/cayenne/7.jpg",
  "/img/cayenne/8.jpg",
  "/img/cullinan/1.jpg",
  "/img/cullinan/2.jpg",
  "/img/cullinan/3.jpg",
  "/img/cullinan/4.jpg",
  "/img/cullinan/5.jpg",
  "/img/cullinan/6.jpg",
  "/img/cullinan/7.jpg",
  "/img/cullinan/8.jpg",
  "/img/dbx/1.jpg",
  "/img/dbx/2.jpg",
  "/img/dbx/3.jpg",
  "/img/dbx/4.jpg",
  "/img/dbx/5.jpg",
  "/img/dbx/6.jpg",
  "/img/dbx/7.jpg",
  "/img/dbx/8.jpg",
  "/img/g63/1.jpg",
  "/img/g63/2.jpg",
  "/img/g63/3.jpg",
  "/img/g63/4.jpg",
  "/img/g63/5.jpg",
  "/img/g63/6.jpg",
  "/img/g63/7.jpg",
  "/img/g63/8.jpg",
  "/img/gle63s/1.jpg",
  "/img/gle63s/2.jpg",
  "/img/gle63s/3.jpg",
  "/img/gle63s/4.jpg",
  "/img/gle63s/5.jpg",
  "/img/gle63s/6.jpg",
  "/img/gle63s/7.jpg",
  "/img/gle63s/8.jpg",
  "/img/range-rover/1.jpg",
  "/img/range-rover/2.jpg",
  "/img/range-rover/3.jpg",
  "/img/range-rover/4.jpg",
  "/img/range-rover/5.jpg",
  "/img/range-rover/6.jpg",
  "/img/range-rover/7.jpg",
  "/img/range-rover/8.jpg",
  "/img/rsq8/1.jpg",
  "/img/rsq8/2.jpg",
  "/img/rsq8/3.jpg",
  "/img/rsq8/4.jpg",
  "/img/rsq8/5.jpg",
  "/img/rsq8/6.jpg",
  "/img/rsq8/7.jpg",
  "/img/rsq8/8.jpg",
  "/img/x6m/1.jpg",
  "/img/x6m/2.jpg",
  "/img/x6m/3.jpg",
  "/img/x6m/4.jpg",
  "/img/x6m/5.jpg",
  "/img/x6m/6.jpg",
  "/img/x6m/7.jpg",
  "/img/x6m/8.jpg",
  "/js/main.js",
  "/js/vendor.js",
  "/academy.html",
  "/academy2.html",
  "/access.html",
  "/contacts.html",
  "/feedback.html",
  "/feedback-submit.html",
  "/greeting.html",
  "/index.html",
  "/loading.html",
  "/participants.html",
  "/place.html",
  "/program.html",
  "/program2.html",
  "/qr.html",
  "/registration.html",
  "/spec.html",
  "/test.html",
  "/test-confirm.html",
  "/test-drive.html",
  "/touch-to-start.html",
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

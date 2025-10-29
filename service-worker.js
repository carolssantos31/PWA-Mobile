const CACHE_NAME = "pwa-dogfinder-v1";
const ASSETS = ["/", "/index.html", "/style.css", "/app.js", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/index.html")))
  );
});

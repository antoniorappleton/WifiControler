const CACHE_NAME = "mkrwifi-cache-v1";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  // Se adicionares CSS/JS externos, também podes pôr aqui.
];

self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

// Cache-first para recursos do próprio site (mesma origem)
self.addEventListener("fetch", (event) => {
  // Não interferir com pedidos para o Arduino (ou outros domínios)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se estiver em cache, devolve; senão vai à rede
      return response || fetch(event.request);
    })
  );
});

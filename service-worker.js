const CACHE_NAME = "model-cache-v1";

const MODEL_URLS = [
  "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_0.tflite",
  "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_1.tflite",
  "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_2.tflite",
  "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_3.tflite"
];

const CORE_ASSETS = [
  "/", 
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/styles.css",       // optional: only if exists
  "/script.js",        // optional: only if exists
  "/service-worker.js" // optional
];

// INSTALL
self.addEventListener("install", (event) => {
  console.log("🛠 Installing Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📥 Caching core assets and models...");
      return cache.addAll([...CORE_ASSETS, ...MODEL_URLS]);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("🔄 Activating Service Worker...");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑 Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`✅ Cache hit: ${event.request.url}`);
        return cachedResponse;
      }
      console.log(`🌐 Network fetch: ${event.request.url}`);
      return fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match("/index.html");
        }
      });
    })
  );
});

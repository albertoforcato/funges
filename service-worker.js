const CACHE_NAME = "model-cache-v1";
const MODEL_URLS = [
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_0.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_1.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_2.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_3.tflite"
];

self.addEventListener("install", (event) => {
    console.log("🛠 Service Worker Installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("📥 Caching models...");
            return cache.addAll(MODEL_URLS);
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log(`🔍 Checking cache for: ${event.request.url}`);
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log(`✅ Serving from cache: ${event.request.url}`);
                return cachedResponse;
            }
            console.log(`🌐 Fetching from network: ${event.request.url}`);
            return fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("🔄 Service Worker Activating...");
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("🗑 Removing old cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

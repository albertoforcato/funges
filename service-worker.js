const CACHE_NAME = "model-cache-v1";
const MODEL_URLS = [
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_0.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_1.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_2.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_3.tflite"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("📥 Caching models...");
            return cache.addAll(MODEL_URLS);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
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

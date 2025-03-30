if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((error) => console.error("❌ Service Worker Registration Failed", error));
}


// ✅ Set the WASM path before using TFLite
tflite.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/");

console.log("Checking TFLite WASM Features:", tflite.getWasmFeatures());

let models = [];
let modelsLoaded = false;
const modelUrls = [
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_0.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_1.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_2.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_3.tflite"
];

// ✅ Ensure TFLite WASM is initialized before loading models
(async function() {
    console.log("🔍 Checking cache before loading TFLite model...");
    try {
        let response = await fetch(modelUrls[0]); // Uses Service Worker cache if available
        if (!response.ok) {
            throw new Error(`❌ Failed to fetch model: ${modelUrls[0]}`);
        }
        let model = await tflite.loadTFLiteModel(modelUrls[0]);
        console.log("✅ Model loaded successfully from cache or R2!", model);
    } catch (error) {
        console.error("❌ Error loading model:", error);
    }
})();



// ========== OPEN IMAGE MASK ==========
function openImageMask() {
    document.getElementById('image-mask').style.display = 'flex';

    // ✅ Reset file input field when opening the mask
    document.getElementById('fileInput').value = "";
}

// Close mask if user clicks outside
document.getElementById('image-mask').addEventListener('click', function (event) {
    if (event.target.id === 'image-mask') {
        document.getElementById('image-mask').style.display = 'none';
    }
});

// ========== HANDLE IMAGE UPLOAD ==========
function handleImage(event) {
    const fileInput = event.target;
    
    if (!fileInput.files || fileInput.files.length === 0) {
        console.error("❌ No file selected.");
        return;
    }

    const file = fileInput.files[0];

    // ✅ Reset input field so same file can be selected again
    fileInput.value = "";

    processImage(file);
}


// ========== HANDLE DRAG & DROP ==========
const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007BFF';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.border = '2px dashed #ccc';
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const file = event.dataTransfer.files[0];
    processImage(file);
});

// ========== PROCESS IMAGE ==========
function processImage(file) {
    if (!file) {
        console.error("❌ No file selected.");
        return;
    }

    console.log("📂 File selected:", file.name);
    document.getElementById('image-mask').style.display = 'none';

    const reader = new FileReader();
    
    reader.onload = function (e) {
        console.log("📸 Image loaded into memory!");

        let img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            console.log("✅ Image fully loaded:", img);
            predict(img);
        };

        img.onerror = function () {
            console.error("❌ Error loading image!");
        };
    };

    reader.onerror = function () {
        console.error("❌ FileReader failed to read the file!");
    };

    reader.readAsDataURL(file);
}


// ========== MODEL LOADING ==========

async function ensureTFLiteLoaded() {
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            if (tflite && tflite.loadTFLiteModel) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 200);
        setTimeout(() => {
            clearInterval(checkInterval);
            reject("❌ TFLite failed to load in time.");
        }, 5000);
    });
}

async function loadModels() {
    console.log("📢 Starting model loading process...");
    try {
        await ensureTFLiteLoaded();
    } catch (error) {
        console.error(error);
        alert(error);
        return;
    }

    try {
        const cache = await caches.open("model-cache-v1");
        for (let url of modelUrls) {
            console.log(`🔍 Checking cache for model: ${url}`);

            let cachedResponse = await cache.match(url);
            if (cachedResponse) {
                console.log(`✅ Model found in cache: ${url}`);
                let model = await tflite.loadTFLiteModel(url); // Load from cache
                models.push(model);
                continue; // Skip fetching from R2
            }

            console.log(`📥 Fetching model from R2: ${url}`);
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`❌ Failed to fetch model: ${url}`);
            }

            let model = await tflite.loadTFLiteModel(url);
            console.log(`✅ Model loaded: ${url}`, model);
            models.push(model);
        }

        modelsLoaded = true;
        console.log("✅ All models loaded successfully!");
    } catch (error) {
        console.error("❌ Error loading models:", error);
        alert("❌ Failed to load models. Check CORS, network, and file integrity.");
    }
}


loadModels();

// ========== IMAGE PREPROCESSING ==========
function preprocessImage(image) {
    return tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0)) 
        .expandDims();
}

// ========== PREDICTION ==========
async function predict(image) {
    console.log("🚀 Starting prediction...");

    if (!modelsLoaded) {
        console.error("❌ Models are NOT loaded.");
        alert("⏳ Please wait... Models are still loading.");
        return;
    }

    if (Object.keys(CLASS_NAMES).length === 0) {
        console.error("❌ Class names are NOT loaded.");
        alert("⏳ Please wait... Class names are still loading.");
        return;
    }

    console.log("✅ Models & Class Names Loaded!");
    
    try {
        console.log("🖼 Preprocessing image...");
        let tensor = preprocessImage(image);
        console.log("📊 Tensor shape:", tensor.shape);

        let allPredictions = [];

        for (let i = 0; i < models.length; i++) {
            console.log(`🔍 Running inference on model ${i + 1}...`);

            let outputTensor = await models[i].predict(tensor);
            console.log(`📤 Model ${i + 1} output:`, outputTensor);

            let predictions = await outputTensor.data();
            console.log(`📈 Model ${i + 1} predictions:`, predictions);

            // ✅ Store predictions with their model index
            predictions.forEach((prob, classIndex) => {
                allPredictions.push([classIndex, prob, i]); 
            });
            
            // ✅ Ensure all predictions include the model index
            console.log("📊 Raw predictions with model indices:", allPredictions);

        }

        console.log("📊 Combining predictions...");

        // ✅ Sort predictions by probability
        let sortedPredictions = allPredictions.sort((a, b) => b[1] - a[1]);

        console.log("📊 Final sorted predictions:", sortedPredictions);

        displayResults(sortedPredictions);

    } catch (error) {
        console.error("❌ Prediction Error:", error);
        alert("❌ Something went wrong during prediction.");
    }
}


// ========== DISPLAY RESULTS ==========
function displayResults(predictions) {
    console.log("📢 Displaying results...");
    console.log("📊 Sorted Predictions:", predictions);

    let predictionBox = document.getElementById('prediction-box');
    let predictionText = document.getElementById('prediction-text');

    if (!predictionBox || !predictionText) {
        console.error("❌ Error: Prediction box elements not found!");
        return;
    }

    predictionBox.style.display = "block"; // Show the box

    if (predictions.length === 0) {
        console.error("❌ No predictions to display!");
        predictionText.innerText = "❌ No predictions available!";
        return;
    }

    // ✅ Ensure at least 3 predictions exist
    let topPredictions = predictions.slice(0, 3);
    let resultHTML = `<strong style="color: #aa1100 !important;">⚠️ Always seek professional advice before consuming wild edibles</strong><br><br>
                      <strong>🍄 Top Predictions:</strong><br><br>`;

    try {
        topPredictions.forEach((pred, rank) => {
            let classIndex = parseInt(pred[0]);
            let modelIndex = parseInt(pred[2]);
            let probability = (pred[1] * 100).toFixed(2); // Convert to %

            // ✅ Check if model and class exist
            if (!CLASS_NAMES[modelIndex] || !CLASS_NAMES[modelIndex][classIndex]) {
                console.error(`❌ ERROR: CLASS_NAMES[${modelIndex}][${classIndex}] does not exist!`, { modelIndex, classIndex });
                resultHTML += `${rank + 1}. ❌ Unknown Class (${classIndex})<br>`;
                return;
            }

            let className = CLASS_NAMES[modelIndex][classIndex];
            let searchURL = `https://duckduckgo.com/?q=${encodeURIComponent(className)}`;

            // ✅ Add prediction with DuckDuckGo search link
            resultHTML += `${rank + 1}. <strong>${className}</strong> (${probability}%)<br>`;
            resultHTML += `<a href="${searchURL}" target="_blank" style="color: #aa1100; text-decoration: underline;">🔍 Search</a><br><br>`;

            console.log(`📌 Rank ${rank + 1}: ${className} (${probability}%)`);
        });

        console.log("📢 Final Prediction Output:\n" + resultHTML);
        
        // ✅ Display predictions in UI
        predictionText.innerHTML = resultHTML; // Use `innerHTML` to allow links

    } catch (error) {
        console.error("❌ ERROR in displayResults:", error);
        predictionText.innerText = "❌ Error displaying predictions!";
    }
}

// ========== NEARBY EDIBLES MODAL ==========




function toggleNearbyModal() {
  console.log("🟢 toggleNearbyModal() was called");

  const modal = document.getElementById('nearby-modal');
  const listContainer = document.getElementById('nearby-edibles-list');

  // Close modal if open
  if (modal.style.display !== 'none') {
    console.log("🧪 Closing nearby modal.");
    modal.style.display = 'none';
    return;
  }

  document.getElementById('loading-spinner').style.display = 'flex';
  console.log("📡 Requesting location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = [position.coords.longitude, position.coords.latitude];
      console.log("📍 Location acquired:", coords);

      map.flyTo({
        center: coords,
        zoom: 8,
        speed: 1.2,
        essential: true
      });

      // Wait for map to fully finish rendering
      map.once('idle', () => {
        console.log("🗺️ Map idle. Starting polygon scan...");

        const center = map.getCenter();
        const point = map.project(center);
        const box = [
          [point.x - 300, point.y - 300],
          [point.x + 300, point.y + 300]
        ];

        const features = map.queryRenderedFeatures(box);

        const foundItems = {};
        features.forEach((f, i) => {
          if (!f.properties) return;
          const scores = Object.entries(f.properties)
            .filter(([k, v]) => k.endsWith('_score') && typeof v === 'number' && v > 3);

          if (scores.length) {
            console.log(`🍄 Feature ${i + 1} with scores:`, scores);
            scores.forEach(([key, value]) => {
              const edibleName = key.replace('_score', '').replace(/_/g, ' ');
              if (!foundItems[edibleName] || value > foundItems[edibleName]) {
                foundItems[edibleName] = value;
              }
            });
          }
        });

        document.getElementById('loading-spinner').style.display = 'none';
        listContainer.innerHTML = '';

        const sortedItems = Object.entries(foundItems).sort((a, b) => b[1] - a[1]);
        const intro = document.createElement("p");
        intro.style.marginBottom = "12px";

        if (sortedItems.length === 0) {
          intro.innerHTML = "🪵 <strong>Dear forager</strong>, the season is being tough on you. Better times will come.";
          listContainer.appendChild(intro);
        } else {
          intro.innerHTML = "🌿 <strong>Hey fellow forager</strong>, following edibles can be found in your proximity:";
          listContainer.appendChild(intro);
          sortedItems.forEach(([item, score]) => {
            const li = document.createElement("li");
            li.innerHTML = `🍄 <strong>${item}</strong> – Score: ${score.toFixed(1)}`;
            listContainer.appendChild(li);
          });
        }

        console.log("✅ Modal ready with:", sortedItems);
        modal.style.display = 'flex';
      });
    },
    (err) => {
      document.getElementById('loading-spinner').style.display = 'none';
      console.error("❌ Location error:", err);
      alert('📍 Unable to retrieve your location.');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}










// Allow closing the Nearby Edibles modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
  const predictionBox = document.getElementById('prediction-box');
  document.addEventListener('click', (event) => {
    if (predictionBox && predictionBox.style.display === "block" && !predictionBox.contains(event.target)) {
      predictionBox.style.display = "none";
    }
  });

  const nearbyModal = document.getElementById('nearby-modal');
  if (nearbyModal) {
    nearbyModal.addEventListener('click', (e) => {
      if (e.target === nearbyModal) {
        toggleNearbyModal();
      }
    });
  }
});


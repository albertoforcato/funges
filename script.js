// ✅ Set the WASM path before using TFLite
tflite.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/");

console.log("Checking TFLite WASM Features:", tflite.getWasmFeatures());

// ✅ Ensure TFLite WASM is initialized before loading models
(async function() {
    console.log("Loading TFLite model...");
    try {
        let model = await tflite.loadTFLiteModel("https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_0.tflite");
        console.log("✅ Model loaded successfully!", model);
    } catch (error) {
        console.error("❌ Error loading model:", error);
    }
})();


// ========== OPEN IMAGE MASK ==========
function openImageMask() {
    document.getElementById('image-mask').style.display = 'flex';
}

// Close mask if user clicks outside
document.getElementById('image-mask').addEventListener('click', function (event) {
    if (event.target.id === 'image-mask') {
        document.getElementById('image-mask').style.display = 'none';
    }
});

// ========== HANDLE IMAGE UPLOAD ==========
function handleImage(event) {
    const file = event.target.files[0];
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
let models = [];
let modelsLoaded = false;
const modelUrls = [
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_0.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_1.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_2.tflite",
    "https://pub-92765923660e431daff3170fbef6471d.r2.dev/mushroom_classification_model_3.tflite"
];

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
        for (let url of modelUrls) {
            console.log(`📥 Fetching model: ${url}`);
            let model = await tflite.loadTFLiteModel(url);
            console.log(`✅ Model loaded: ${url}`, model);
            if (!model || typeof model.predict !== "function") {
                console.error(`❌ Model at ${url} is not valid.`);
                alert(`❌ Model at ${url} failed to load.`);
                return;
            }
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

            allPredictions.push(predictions);
        }

        console.log("📊 Combining predictions...");

        let combinedPredictions = {};
        let totalScores = 0;

        allPredictions.forEach((predictions) => {
            predictions.forEach((prob, classIndex) => {
                combinedPredictions[classIndex] = (combinedPredictions[classIndex] || 0) + prob;
                totalScores += prob;
            });
        });

        console.log("📏 Normalizing predictions...");
        Object.keys(combinedPredictions).forEach((key) => {
            combinedPredictions[key] /= totalScores;
        });

        let sortedPredictions = Object.entries(combinedPredictions).sort((a, b) => b[1] - a[1]);

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
    console.log("📜 CLASS_NAMES object:", CLASS_NAMES);

    let resultDiv = document.getElementById('result');

    if (!resultDiv) {
        console.error("❌ Error: Result div not found!");
        return;
    }

    resultDiv.innerHTML = ""; // Clear previous results

    if (!Array.isArray(predictions) || predictions.length === 0) {
        console.error("❌ No predictions to display!");
        resultDiv.innerText = "❌ No predictions available!";
        return;
    }

    let classIndex = predictions[0][0];
    let prob = predictions[0][1].toFixed(2);

    console.log("🔢 Predicted Class Index:", classIndex);

    if (!CLASS_NAMES.hasOwnProperty(classIndex)) {
        console.error(`❌ Class ${classIndex} not found in CLASS_NAMES!`);
        resultDiv.innerText = `❌ Unknown Class ${classIndex}`;
        return;
    }

    let className = CLASS_NAMES[classIndex];

    // Handle list-based class names (pick first entry)
    if (Array.isArray(className)) {
        console.log("📜 Multiple class names found, selecting first:", className);
        className = className[0]; // Take the first entry
    } else if (typeof className !== "string") {
        console.error("❌ Invalid class name format:", className);
        resultDiv.innerText = `❌ Invalid Class Name ${classIndex}`;
        return;
    }

    console.log(`🍄 Predicted: ${className} (Confidence: ${prob})`);

    let p = document.createElement("p");
    p.innerText = `🍄 ${className} (Confidence: ${prob})`;
    resultDiv.appendChild(p);
}

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
    if (!file) return;

    // Hide the mask after image selection
    document.getElementById('image-mask').style.display = 'none';

    // Read the image but do NOT display it
    const reader = new FileReader();
    reader.onload = function (e) {
        let img = new Image();
        img.src = e.target.result;

        // Wait until the image is loaded before running prediction
        img.onload = function () {
            predict(img); // Pass the image directly to prediction
        };
    };
    reader.readAsDataURL(file);
}

// ========== MODEL LOADING ==========
let models = [];
let modelsLoaded = false;
const modelUrls = [
    "https://lodist.github.io/tripped-map/mushroom_classification_model_0.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_1.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_2.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_3.tflite"
];

// Load models on page load
async function loadModels() {
    try {
        for (let url of modelUrls) {
            let model = await tflite.loadTFLiteModel(url);
            models.push(model);
        }
        modelsLoaded = true;
        console.log("✅ All models loaded!");
    } catch (error) {
        console.error("❌ Error loading models:", error);
        alert("❌ Failed to load models. Check your internet connection.");
    }
}

loadModels();

// ========== LOAD CLASS NAMES ==========
let CLASS_NAMES = {};
async function loadClassNames() {
    try {
        let response = await fetch("https://lodist.github.io/tripped-map/class_names.json");
        CLASS_NAMES = await response.json();
        console.log("✅ Class names loaded!");
    } catch (error) {
        console.error("❌ Failed to load class names:", error);
        alert("❌ Failed to load class names.");
    }
}

loadClassNames();

// ========== IMAGE PREPROCESSING ==========
function preprocessImage(image) {
    return tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224]) // Resize to match model input
        .toFloat()
        .expandDims(); // Add batch dimension
}

// ========== PREDICTION ==========
async function predict(image) {
    if (!modelsLoaded) {
        alert("⏳ Please wait... Models are still loading.");
        return;
    }

    let tensor = preprocessImage(image);
    
    let allPredictions = [];

    for (let model of models) {
        let outputTensor = await model.predict(tensor);
        let predictions = await outputTensor.data();
        allPredictions.push(predictions);
    }

    // Combine predictions
    let combinedPredictions = {};
    let totalScores = 0;

    allPredictions.forEach((predictions) => {
        predictions.forEach((prob, classIndex) => {
            combinedPredictions[classIndex] = (combinedPredictions[classIndex] || 0) + prob;
            totalScores += prob;
        });
    });

    // Normalize predictions
    Object.keys(combinedPredictions).forEach((key) => {
        combinedPredictions[key] /= totalScores;
    });

    // Sort predictions
    let sortedPredictions = Object.entries(combinedPredictions).sort((a, b) => b[1] - a[1]);

    // Display results
    displayResults(sortedPredictions);
}

// ========== DISPLAY RESULTS ==========
function displayResults(predictions) {
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    let classIndex = predictions[0][0];
    let prob = predictions[0][1].toFixed(2);
    let className = CLASS_NAMES[classIndex] || `Unknown Class ${classIndex}`;

    let p = document.createElement("p");
    p.innerText = `🍄 ${className} (Confidence: ${prob})`;
    resultDiv.appendChild(p);
}

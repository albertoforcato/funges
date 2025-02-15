// ========== IMAGE UPLOAD & CAMERA ==========

// Open file input when button is clicked
function openFileInput() {
    document.getElementById('fileInput').click();
}

// Handle image upload and display preview
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('uploadedImage');
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// ========== MODEL LOADING ==========

let models = [];
const modelUrls = [
    "https://lodist.github.io/tripped-map/mushroom_classification_model_0.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_1.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_2.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_3.tflite"
];

// Load all models
async function loadModels() {
    for (let url of modelUrls) {
        let model = await tflite.loadTFLiteModel(url);
        models.push(model);
    }
    console.log("✅ All models loaded!");
}

// Call this when the page loads
loadModels();

// ========== IMAGE PROCESSING & PREDICTION ==========

// Preprocess the uploaded image for model input
function preprocessImage(image) {
    return tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224]) // Resize to match model input
        .toFloat()
        .expandDims(); // Add batch dimension
}

// Predict mushroom species using all models (Ensemble Method)
async function predict() {
    if (models.length === 0) {
        alert("Models are still loading...");
        return;
    }

    let image = document.getElementById('uploadedImage');
    let tensor = preprocessImage(image);
    
    let allPredictions = [];

    for (let model of models) {
        let outputTensor = model.predict(tensor);
        let predictions = await outputTensor.data();
        allPredictions.push(predictions);
    }

    // Combine predictions from all models
    let combinedPredictions = {};
    let totalScores = 0;

    allPredictions.forEach((predictions) => {
        predictions.forEach((prob, classIndex) => {
            if (combinedPredictions[classIndex]) {
                combinedPredictions[classIndex] += prob;
            } else {
                combinedPredictions[classIndex] = prob;
            }
            totalScores += prob;
        });
    });

    // Normalize predictions
    Object.keys(combinedPredictions).forEach((key) => {
        combinedPredictions[key] /= totalScores;
    });

    // Sort predictions
    let sortedPredictions = Object.entries(combinedPredictions).sort((a, b) => b[1] - a[1]);
    
    displayResults(sortedPredictions);
}

// ========== DISPLAY RESULTS ==========

// Show top 3 predicted species
function displayResults(predictions) {
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        let classIndex = predictions[i][0];
        let prob = predictions[i][1].toFixed(2);
        let className = CLASS_NAMES[classIndex] || `Unknown Class ${classIndex}`;

        let p = document.createElement("p");
        p.innerText = `🍄 ${className}: ${prob}`;
        resultDiv.appendChild(p);
    }
}

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
    
    // Hide mask
    document.getElementById('image-mask').style.display = 'none';

    // Read and display image
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById('uploadedImage');
        img.src = e.target.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Start prediction
    predict();
}

// ========== MODEL LOADING ==========
let models = [];
const modelUrls = [
    "https://lodist.github.io/tripped-map/mushroom_classification_model_0.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_1.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_2.tflite",
    "https://lodist.github.io/tripped-map/mushroom_classification_model_3.tflite"
];

// Load models on page load
async function loadModels() {
    for (let url of modelUrls) {
        let model = await tflite.loadTFLiteModel(url);
        models.push(model);
    }
    console.log("✅ All models loaded!");
}

loadModels();

// ========== PREDICTION ==========
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

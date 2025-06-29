import * as tf from '@tensorflow/tfjs';
import { CLASS_NAMES } from '../data/species';

export interface PredictionResult {
  species: string;
  confidence: number;
  modelIndex: number;
}

export interface ClassificationResult {
  predictions: PredictionResult[];
  topPrediction: PredictionResult;
  averageConfidence: number;
}

class TensorFlowService {
  private models: tf.GraphModel[] = [];
  private isInitialized = false;
  private isLoading = false;

  async initialize(): Promise<void> {
    if (this.isInitialized || this.isLoading) {
      return;
    }

    this.isLoading = true;
    try {
      // Load all 4 TensorFlow Lite models
      const modelPromises = [
        this.loadModel('/src/assets/mushroom_classification_model_0.tflite'),
        this.loadModel('/src/assets/mushroom_classification_model_1.tflite'),
        this.loadModel('/src/assets/mushroom_classification_model_2.tflite'),
        this.loadModel('/src/assets/mushroom_classification_model_3.tflite'),
      ];

      this.models = await Promise.all(modelPromises);
      this.isInitialized = true;
      console.log('TensorFlow models loaded successfully');
    } catch (error) {
      console.error('Failed to load TensorFlow models:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadModel(modelPath: string): Promise<tf.GraphModel> {
    try {
      const model = await tf.loadGraphModel(modelPath);
      return model;
    } catch (error) {
      console.error(`Failed to load model from ${modelPath}:`, error);
      throw error;
    }
  }

  async classifyImage(
    imageElement: HTMLImageElement
  ): Promise<ClassificationResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Preprocess the image
      const tensor = tf.browser.fromPixels(imageElement, 3);
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);

      // Get predictions from all models
      const predictions: PredictionResult[] = [];

      for (let i = 0; i < this.models.length; i++) {
        const model = this.models[i];
        const prediction = (await model.predict(batched)) as tf.Tensor;
        const predictionArray = (await prediction.array()) as number[][];

        // Get the top prediction for this model
        const maxIndex = predictionArray[0].indexOf(
          Math.max(...predictionArray[0])
        );
        const confidence = predictionArray[0][maxIndex];
        const species = CLASS_NAMES[0][maxIndex];

        predictions.push({
          species,
          confidence,
          modelIndex: i,
        });

        // Clean up tensors
        prediction.dispose();
      }

      // Clean up input tensors
      tensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();

      // Calculate ensemble results
      const topPrediction = predictions.reduce((max, current) =>
        current.confidence > max.confidence ? current : max
      );

      const averageConfidence =
        predictions.reduce((sum, pred) => sum + pred.confidence, 0) /
        predictions.length;

      return {
        predictions,
        topPrediction,
        averageConfidence,
      };
    } catch (error) {
      console.error('Classification failed:', error);
      throw error;
    }
  }

  async classifyImageFromFile(file: File): Promise<ClassificationResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const result = await this.classifyImage(img);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getLoadingStatus(): boolean {
    return this.isLoading;
  }
}

// Export singleton instance
export const tensorflowService = new TensorFlowService();

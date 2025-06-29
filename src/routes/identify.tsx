import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageUploadModal } from '../components/ImageUploadModal';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Camera, Upload, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { tensorflowService } from '../lib/tensorflow';
import type { ClassificationResult } from '../lib/tensorflow';

export const Route = createFileRoute('/identify')({
  component: IdentifyPage,
});

export default function IdentifyPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const classificationResult =
        await tensorflowService.classifyImageFromFile(file);
      setResult(classificationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className='w-4 h-4' />;
    if (confidence >= 0.6) return <Info className='w-4 h-4' />;
    return <AlertTriangle className='w-4 h-4' />;
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold mb-4'>{t('identify.title')}</h1>
        <p className='text-lg text-muted-foreground mb-6'>
          {t('identify.description')}
        </p>

        <div className='flex gap-4 justify-center'>
          <Button
            onClick={() => setIsModalOpen(true)}
            size='lg'
            className='flex items-center gap-2'
          >
            <Upload className='w-5 h-5' />
            {t('identify.uploadImage')}
          </Button>
          <Button
            variant='outline'
            size='lg'
            className='flex items-center gap-2'
          >
            <Camera className='w-5 h-5' />
            {t('identify.captureImage')}
          </Button>
        </div>
      </div>

      {isProcessing && (
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-center gap-3'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
              <span>{t('identify.processing')}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className='mb-6 border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-red-800'>
              <AlertTriangle className='h-4 w-4' />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className='space-y-6'>
          {/* Top Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {getConfidenceIcon(result.topPrediction.confidence)}
                {t('identify.topPrediction')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-xl font-semibold'>
                    {result.topPrediction.species}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {t('identify.model')} {result.topPrediction.modelIndex + 1}
                  </p>
                </div>
                <Badge
                  className={getConfidenceColor(
                    result.topPrediction.confidence
                  )}
                >
                  {(result.topPrediction.confidence * 100).toFixed(1)}%
                </Badge>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>{t('identify.averageConfidence')}:</span>
                  <span className='font-medium'>
                    {(result.averageConfidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${result.averageConfidence * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Model Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('identify.allPredictions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {result.predictions.map((prediction, index) => (
                  <div key={index}>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <Badge variant='outline'>
                          {t('identify.model')} {prediction.modelIndex + 1}
                        </Badge>
                        <span className='font-medium'>
                          {prediction.species}
                        </span>
                      </div>
                      <Badge
                        className={getConfidenceColor(prediction.confidence)}
                      >
                        {(prediction.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-1'>
                      <div
                        className='bg-primary h-1 rounded-full transition-all duration-300'
                        style={{
                          width: `${prediction.confidence * 100}%`,
                        }}
                      ></div>
                    </div>
                    {index < result.predictions.length - 1 && (
                      <Separator className='mt-4' />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Information */}
          <Card className='border-blue-200 bg-blue-50'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2 text-blue-800'>
                <Info className='h-4 w-4' />
                <span>{t('identify.safetyWarning')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}

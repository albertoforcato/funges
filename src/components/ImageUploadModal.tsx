import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (file: File) => void;
}

export const ImageUploadModal = ({ isOpen, onClose, onImageUpload }: ImageUploadModalProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [result, setResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      setResult('Processing image...');
    } else {
      setResult('Please select a valid image file.');
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 rounded-lg text-center max-w-md w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-4">
            Identify Mushroom
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">
            Drag an image here or use the camera
          </p>

          {/* Camera Button */}
          <Button
            onClick={handleCameraClick}
            className="text-2xl p-4 rounded-full bg-gray-100 hover:bg-gray-200"
            variant="ghost"
          >
            📷
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Drop Zone */}
          <Card
            className={`w-full h-36 border-2 border-dashed flex items-center justify-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="text-gray-500 text-base">
                {isDragOver ? 'Drop image here' : 'Drop Image Here'}
              </div>
            </div>
          </Card>

          {/* Result Display */}
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-semibold text-gray-700">{result}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
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
      setResult('Image uploaded successfully!');
      setTimeout(() => {
        onClose();
        setResult('');
      }, 2000);
    } else {
      setResult('Please select a valid image file.');
    }
  }, [onImageUpload, onClose]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleCameraCapture = useCallback(() => {
    // This would integrate with device camera
    setResult('Camera capture not yet implemented');
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Image for Identification</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <Card
            className={`p-8 text-center border-2 border-dashed transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            role="button"
            tabIndex={0}
            aria-label="Drag and drop image here or click to select file"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="space-y-2">
              <div className="text-4xl" aria-hidden="true">📷</div>
              <p className="text-lg font-medium">
                Drag & drop your image here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
          </Card>

          {/* File Input (Hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="Select image file"
          />

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Browse for image file"
            >
              Browse Files
            </Button>
            <Button
              onClick={handleCameraCapture}
              variant="outline"
              aria-label="Capture image with camera"
            >
              📸 Camera
            </Button>
          </div>

          {/* Result Message */}
          {result && (
            <div 
              className="p-3 text-center rounded-md bg-blue-50 text-blue-800"
              role="status"
              aria-live="polite"
            >
              {result}
            </div>
          )}

          {/* Instructions */}
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Supported formats:</strong> JPG, PNG, GIF, WebP</p>
            <p><strong>Maximum size:</strong> 10MB</p>
            <p><strong>Tip:</strong> Clear, well-lit photos work best for identification</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
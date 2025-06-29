import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, Camera, X, FileImage } from 'lucide-react';

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleCameraCapture = useCallback(() => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      // Implementation for camera capture would go here
      setResult('Camera capture not yet implemented');
    } else {
      setResult('Camera not available');
    }
  }, []);

  const handleClose = useCallback(() => {
    setResult('');
    setIsDragOver(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Upload Image for Identification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <Card
            className={`p-8 border-2 border-dashed text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Drag and drop an image here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="Select image file"
            />
          </Card>

          {/* Camera Capture */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Or capture with camera</p>
            <Button
              onClick={handleCameraCapture}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Use Camera
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm">{result}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResult('')}
                  className="ml-auto"
                  aria-label="Clear result"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
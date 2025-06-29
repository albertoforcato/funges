import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useZodForm } from '../../lib/forms';

// Define the image upload schema
const imageUploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG and WebP images are allowed'
    )
    .optional(),
  useCamera: z.boolean().default(false),
});

type ImageUploadData = z.infer<typeof imageUploadSchema>;

interface ImageUploadFormProps {
  onImageUpload: (data: ImageUploadData) => void;
  onImageDrop?: (file: File) => void;
}

export function ImageUploadForm({ onImageUpload, onImageDrop }: ImageUploadFormProps) {
  const form = useZodForm(imageUploadSchema, {
    defaultValues: {
      image: undefined,
      useCamera: false,
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const selectedFile = watch('image');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
    }
  };

  const handleCameraClick = () => {
    setValue('useCamera', true);
    // Trigger camera input
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment';
    cameraInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setValue('image', file);
      }
    };
    cameraInput.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setValue('image', file);
      onImageDrop?.(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const onSubmit = (data: ImageUploadData) => {
    onImageUpload(data);
  };

  return (
    <div className="image-upload-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="upload-area">
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p>Drag an image here or use the camera</p>
            
            <div className="upload-buttons">
              <button
                type="button"
                onClick={handleCameraClick}
                className="camera-button"
              >
                📷 Camera
              </button>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" className="file-button">
                📁 Choose File
              </label>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="selected-file">
            <p>Selected: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {errors.image && (
          <div className="error-message">
            {errors.image.message}
          </div>
        )}

        <button type="submit" className="upload-submit">
          Upload Image
        </button>
      </form>
    </div>
  );
} 
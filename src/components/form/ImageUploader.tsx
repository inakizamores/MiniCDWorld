import { useState, useRef, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import ImageCropper from './ImageCropper';

interface ImageUploaderProps {
  label: string;
  description?: string;
  onChange: (file: any) => void;
  value: any;
  isCircular?: boolean;
  aspectRatio?: number;
  componentType: string;
}

export default function ImageUploader({ 
  label, 
  description, 
  onChange, 
  value,
  isCircular = false,
  aspectRatio = 1,
  componentType 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set the appropriate aspect ratio based on component type
  const getAspectRatio = () => {
    switch (componentType) {
      case 'frenteAfuera':
      case 'frenteDentro':
      case 'disco':
        return 1; // 1:1 ratio
      case 'traseraAfueraLeft':
        return 50/38; // 50mm:38mm
      case 'traseraAfueraRight':
        return 4/38; // 4mm:38mm
      case 'traseraDentroLeft':
        return 4/38; // 4mm:38mm
      case 'traseraDentroRight':
        return 50/38; // 50mm:38mm
      default:
        return aspectRatio;
    }
  };

  const handleInitialFileLoad = (file: File) => {
    // Store the original file
    setOriginalFile(file);
    
    // Generate a preview and open the cropper
    const objectUrl = URL.createObjectURL(file);
    setCropperImage(objectUrl);
  };

  const handleCropComplete = async (croppedImageUrl: string, croppedBlob: Blob) => {
    try {
      setUploading(true);
      setCropperImage(null);

      // Update the local preview
      setPreview(croppedImageUrl);

      // Create a file from the cropped blob
      const fileName = originalFile ? originalFile.name : `${componentType}.jpg`;
      const fileType = 'image/jpeg';
      const croppedFile = new File([croppedBlob], fileName, { type: fileType });

      // Upload to Vercel Blob
      const newBlob = await upload(fileName, croppedFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      onChange(newBlob.url);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  const handleCancelCrop = () => {
    setCropperImage(null);
    setOriginalFile(null);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleInitialFileLoad(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleInitialFileLoad(e.target.files[0]);
    }
  }, []);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Use the value prop if available, otherwise use the preview
  const imageUrl = value || preview;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative">
            <div className={isCircular ? "relative w-32 h-32 mx-auto overflow-hidden rounded-full" : ""}>
              <img 
                src={imageUrl} 
                alt={label} 
                className={`mx-auto ${isCircular ? 'h-full w-full object-cover' : 'h-32 object-contain'}`}
              />
              {isCircular && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black rounded-full w-6 h-6"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <div className="py-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              Drag & drop an image, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, GIF up to 5MB
            </p>
            {isCircular && (
              <p className="mt-1 text-xs text-gray-400">
                Image will be cropped to a circle with center hole
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          aspectRatio={getAspectRatio()}
          isCircular={isCircular}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  );
} 
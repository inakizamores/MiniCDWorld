import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: string;
  aspectRatio: number;
  isCircular?: boolean;
  onCropComplete: (croppedImageUrl: string, croppedBlob: Blob) => void;
  onCancel: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropper({ 
  image, 
  aspectRatio, 
  isCircular = false, 
  onCropComplete, 
  onCancel 
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // When the image loads, set up the initial crop
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }, [aspectRatio]);

  // Generate cropped image when the user completes a crop
  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    // Create a canvas to draw the cropped image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No 2d context');
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to the cropped size
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    // Draw the cropped image on the canvas
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // If circular crop is requested, apply circular mask
    if (isCircular) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(
        completedCrop.width / 2,
        completedCrop.height / 2,
        Math.min(completedCrop.width, completedCrop.height) / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      
      const croppedImageUrl = URL.createObjectURL(blob);
      onCropComplete(croppedImageUrl, blob);
    }, 'image/jpeg', 0.95);
  }, [completedCrop, imgRef, isCircular, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-auto">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <p className="text-sm text-gray-500">
            {isCircular
              ? 'Crop the image to a circle for the CD label'
              : `Adjust the crop to fit the required ${aspectRatio}:1 aspect ratio`}
          </p>
        </div>
        
        <div className="p-4 flex justify-center overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={isCircular}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            type="button"
            className="btn-outline"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleCropComplete}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
} 
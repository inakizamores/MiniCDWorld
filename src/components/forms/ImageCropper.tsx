import React, { useState, useRef } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { FaCheck, FaTimes, FaSync } from 'react-icons/fa'

// Add type definition for the Cropper instance
interface CropperElement extends HTMLImageElement {
  cropper: {
    getCroppedCanvas: (options?: any) => HTMLCanvasElement;
    reset: () => void;
  }
}

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio: number;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  aspectRatio,
  onCropComplete,
  onCancel
}) => {
  const cropperRef = useRef<CropperElement>(null)
  const [isCropping, setIsCropping] = useState(false)

  const getCropData = () => {
    if (!cropperRef.current || !cropperRef.current.cropper) {
      return
    }
    
    setIsCropping(true)
    
    try {
      const cropper = cropperRef.current.cropper
      const croppedCanvas = cropper.getCroppedCanvas({
        maxWidth: 1000,
        maxHeight: 1000,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      })
      
      const croppedImage = croppedCanvas.toDataURL('image/jpeg', 0.9)
      onCropComplete(croppedImage)
    } catch (error) {
      console.error('Error cropping image:', error)
    } finally {
      setIsCropping(false)
    }
  }

  const resetCropper = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.reset()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/80">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Crop Image</h3>
          <button 
            onClick={onCancel}
            className="text-secondary-500 hover:text-secondary-700"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="flex-grow overflow-hidden">
          <Cropper
            src={imageUrl}
            style={{ height: '100%', width: '100%' }}
            aspectRatio={aspectRatio}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            responsive={true}
            checkOrientation={false}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            autoCropArea={1}
            checkCrossOrigin={false}
          />
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t border-secondary-200">
          <div>
            <button
              onClick={resetCropper}
              className="btn btn-secondary mr-2"
              disabled={isCropping}
            >
              <FaSync className="mr-2" /> Reset
            </button>
            <button
              onClick={onCancel}
              className="btn btn-outline"
              disabled={isCropping}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
          
          <button
            onClick={getCropData}
            className="btn btn-primary"
            disabled={isCropping}
          >
            {isCropping ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Processing...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" /> Apply Crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper 
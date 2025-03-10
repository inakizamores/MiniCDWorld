import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { FaCheck, FaTimes, FaSync } from 'react-icons/fa'
import { DIMENSIONS } from '@constants/dimensions'

// Add type definition for the Cropper instance
interface CropperElement extends HTMLImageElement {
  cropper: {
    getCroppedCanvas: (options?: any) => HTMLCanvasElement;
    reset: () => void;
    getContainerData: () => {
      width: number;
      height: number;
    };
    getCropBoxData: () => {
      left: number;
      top: number;
      width: number;
      height: number;
    };
  }
}

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio: number;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  isDiscCropper?: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  aspectRatio,
  onCropComplete,
  onCancel,
  isDiscCropper = false
}) => {
  const cropperRef = useRef<CropperElement>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [cropperReady, setCropperReady] = useState(false)
  const [cropBoxData, setCropBoxData] = useState<{left: number; top: number; width: number; height: number} | null>(null)
  
  // Add effect to prevent body scrolling while cropper is open
  useEffect(() => {
    // Save original overflow setting
    const originalOverflow = document.body.style.overflow;
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Apply styles to any fixed headers
    const fixedElements = document.querySelectorAll('header, .header, [class*="header"]');
    const originalStyles = new Map();
    
    fixedElements.forEach((el) => {
      const element = el as HTMLElement;
      // Store original styles
      originalStyles.set(element, {
        zIndex: element.style.zIndex,
        position: element.style.position
      });
      
      // Apply lower z-index to ensure overlay covers it
      element.style.zIndex = '1';
      element.style.position = 'relative';
    });
    
    // Restore original styles on component unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      
      // Restore original styles to fixed elements
      fixedElements.forEach((el) => {
        const element = el as HTMLElement;
        const original = originalStyles.get(element);
        if (original) {
          element.style.zIndex = original.zIndex;
          element.style.position = original.position;
        }
      });
    };
  }, []);
  
  // Update crop box data when cropper changes
  const handleCropperChange = () => {
    if (cropperRef.current && cropperRef.current.cropper && isDiscCropper) {
      const data = cropperRef.current.cropper.getCropBoxData();
      setCropBoxData(data);
    }
  };

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
  
  // Disc guides component to show circular outline and center hole
  const DiscGuides = () => {
    if (!cropBoxData || !cropperReady) {
      return null;
    }
    
    try {
      const { width, height, left, top } = cropBoxData;
      
      // Only show guides if crop box has dimensions
      if (!width || !height) return null;
      
      const circleSize = Math.min(width, height);
      const circleRadius = circleSize / 2;
      
      // Center the guides within the crop box
      const centerX = circleRadius;
      const centerY = circleRadius;
      
      // Calculate the center hole size proportionally to the main circle
      const holeSizeRatio = DIMENSIONS.DISCO.holeSize / DIMENSIONS.DISCO.diameter;
      const holeRadius = circleRadius * holeSizeRatio;
      
      return (
        <div 
          className="absolute z-10 pointer-events-none" 
          style={{
            left: left,
            top: top,
            width: circleSize,
            height: circleSize,
          }}
        >
          {/* Circular outline guide */}
          <div 
            className="absolute w-full h-full rounded-full border-2 border-primary-500 border-dashed opacity-80"
          />
          
          {/* Center hole guide */}
          <div 
            className="absolute rounded-full border-2 border-primary-500 border-dashed opacity-80"
            style={{
              left: centerX - holeRadius,
              top: centerY - holeRadius,
              width: holeRadius * 2,
              height: holeRadius * 2,
            }}
          />
          
          {/* Helpful text */}
          <div className="absolute -top-8 left-0 w-full text-center text-xs text-primary-700 bg-white/80 py-1 px-2 rounded-md">
            Alinea tu imagen con las guías circulares
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering disc guides:", error);
      return null;
    }
  };

  // Create crop modal content
  const cropperModal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80" 
         style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isDiscCropper ? "Recortar Imagen del Disco CD" : "Recortar Imagen"}</h3>
          <button 
            onClick={onCancel}
            className="text-secondary-500 hover:text-secondary-700"
            aria-label="Cerrar"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="flex-grow overflow-hidden relative" style={{ maxHeight: '60vh' }}>
          <Cropper
            src={imageUrl}
            style={{ height: '100%', width: '100%', maxHeight: '60vh' }}
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
            ready={() => {
              setCropperReady(true);
              handleCropperChange(); // Initial update of crop box data
            }}
            crop={handleCropperChange} // Update guides when cropping changes
          />
          
          {isDiscCropper && <DiscGuides />}
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t border-secondary-200">
          <div>
            <button
              onClick={resetCropper}
              className="btn btn-secondary mr-2"
              disabled={isCropping}
            >
              <FaSync className="mr-2" /> Restablecer
            </button>
            <button
              onClick={onCancel}
              className="btn btn-outline"
              disabled={isCropping}
            >
              <FaTimes className="mr-2" /> Cancelar
            </button>
          </div>
          
          <button
            onClick={getCropData}
            className="btn btn-primary"
            disabled={isCropping}
          >
            {isCropping ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Procesando...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" /> Aplicar Recorte
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render at the root level of the DOM
  return ReactDOM.createPortal(
    cropperModal,
    document.body
  );
}

export default ImageCropper 
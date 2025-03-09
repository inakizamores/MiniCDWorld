import React, { useState } from 'react'
import ImageUploader from '@components/forms/ImageUploader'
import ImageCropper from '@components/forms/ImageCropper'
import { ImageSection } from '@features/template/templateSlice'

interface ImageUploadSectionProps {
  title: string;
  description: string;
  dimensions: string;
  aspectRatio: number;
  currentImage: ImageSection | null;
  onImageSave: (image: ImageSection) => void;
  required?: boolean;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  title,
  description,
  dimensions,
  aspectRatio,
  currentImage,
  onImageSave,
  required = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCropping, setIsCropping] = useState<boolean>(false)
  
  const handleImageSelected = (file: File) => {
    setSelectedFile(file)
    setIsCropping(true)
  }
  
  const handleCropComplete = (croppedImage: string) => {
    if (!selectedFile) return
    
    const dimensionParts = dimensions.match(/(\d+)mm\s*[×x]\s*(\d+)mm/)
    const width = dimensionParts ? parseInt(dimensionParts[1]) : 0
    const height = dimensionParts ? parseInt(dimensionParts[2]) : 0
    
    onImageSave({
      originalFile: selectedFile,
      croppedImage,
      width,
      height
    })
    
    setIsCropping(false)
    setSelectedFile(null)
  }
  
  const handleRemoveImage = () => {
    onImageSave({
      originalFile: null,
      croppedImage: null,
      width: 0,
      height: 0
    })
  }
  
  const handleCancelCrop = () => {
    setIsCropping(false)
    setSelectedFile(null)
  }
  
  // Enhanced title with required indicator if needed
  const displayTitle = required ? `${title} *` : title;
  
  return (
    <div className="flex flex-col h-full min-h-[350px]">
      <ImageUploader
        title={displayTitle}
        description={description}
        dimensions={dimensions}
        onImageSelected={handleImageSelected}
        previewImage={currentImage?.croppedImage || null}
        onRemove={currentImage?.croppedImage ? handleRemoveImage : undefined}
        required={required}
      />
      
      {isCropping && selectedFile && (
        <ImageCropper
          imageUrl={URL.createObjectURL(selectedFile)}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  )
}

export default ImageUploadSection 
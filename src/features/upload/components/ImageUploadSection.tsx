import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import ImageUploader from '@components/forms/ImageUploader'
import ImageCropper from '@components/forms/ImageCropper'
import { ASPECT_RATIOS, DIMENSIONS } from '@constants/dimensions'
import { ImageSection } from '@features/template/templateSlice'

interface ImageUploadSectionProps {
  title: string;
  description: string;
  dimensions: string;
  aspectRatio: number;
  currentImage: ImageSection | null;
  onImageSave: (image: ImageSection) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  title,
  description,
  dimensions,
  aspectRatio,
  currentImage,
  onImageSave
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
  
  return (
    <div>
      <ImageUploader
        title={title}
        description={description}
        dimensions={dimensions}
        onImageSelected={handleImageSelected}
        previewImage={currentImage?.croppedImage || null}
        onRemove={currentImage?.croppedImage ? handleRemoveImage : undefined}
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
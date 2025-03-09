import React from 'react'
import { FaCloudUploadAlt, FaSpinner, FaTimesCircle } from 'react-icons/fa'
import useImageUpload from '@hooks/useImageUpload'

interface ImageUploaderProps {
  title: string;
  description: string;
  dimensions: string;
  onImageSelected: (file: File) => void;
  previewImage?: string | null;
  onRemove?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  description,
  dimensions,
  onImageSelected,
  previewImage,
  onRemove
}) => {
  const { getRootProps, getInputProps, isDragActive, error, isLoading } = useImageUpload({
    onImageSelected
  })

  // Check if this is a narrow image based on dimensions (like 4mm × 38mm)
  const isNarrowImage = dimensions.includes('4mm × 38mm')
  const isDisc = dimensions.includes('diameter')

  return (
    <div className="card h-full image-uploader flex flex-col">
      <h3 className="text-lg font-bold mb-2 flex items-center">
        {title}
        <span className="ml-2 text-xs font-normal text-secondary-500 px-2 py-1 bg-secondary-100 rounded-full">
          {dimensions}
        </span>
      </h3>
      
      {!previewImage ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 flex-grow min-h-[200px] ${
            isDragActive ? 'border-primary-500 bg-primary-50 scale-[1.02]' : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50/30'
          }`}
        >
          <input {...getInputProps()} />
          
          {isLoading ? (
            <div className="bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <FaSpinner className="text-3xl text-primary-500 animate-spin" />
            </div>
          ) : (
            <div className="bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <FaCloudUploadAlt className="text-3xl text-primary-500" />
            </div>
          )}
          
          <p className="text-center text-secondary-700 font-medium mb-1">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
          </p>
          <p className="text-center text-secondary-500 text-sm">or click to browse files</p>
          <p className="text-center text-sm text-secondary-500 mt-2 max-w-xs mx-auto">{description}</p>
          
          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-100 w-full">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="relative image-preview flex-grow flex flex-col justify-center">
          <div className={`overflow-hidden rounded-lg flex justify-center items-center h-auto ${
            isDisc ? 'p-4' : ''
          }`}>
            {isDisc ? (
              // Special handling for disc images - circular display
              <div className="relative max-w-full" style={{ maxHeight: '250px' }}>
                <div className="rounded-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={previewImage}
                    alt={`Preview for ${title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" 
                  style={{ width: '15%', height: '15%' }}>
                </div>
              </div>
            ) : (
              // For all other images - preserve aspect ratio with max height
              <img
                src={previewImage}
                alt={`Preview for ${title}`}
                className={`rounded-lg object-contain max-w-full ${
                  isNarrowImage ? 'max-h-[180px] w-auto' : 'max-h-[220px]'
                }`}
                style={{ 
                  width: isNarrowImage ? 'auto' : '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
          
          {onRemove && (
            <button
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-secondary-100 transition-colors"
              onClick={onRemove}
              type="button"
              aria-label="Remove image"
            >
              <FaTimesCircle className="text-red-500 text-lg" />
            </button>
          )}
          
          <div className="mt-2 px-2 py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded text-sm font-medium text-center">
            {title}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader 
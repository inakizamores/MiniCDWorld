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

  return (
    <div className="card h-full">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-secondary-600 mb-4">{dimensions}</p>
      
      {!previewImage ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {isLoading ? (
            <FaSpinner className="text-3xl text-primary-500 animate-spin mb-3" />
          ) : (
            <FaCloudUploadAlt className="text-3xl text-primary-500 mb-3" />
          )}
          
          <p className="text-center text-secondary-700 mb-1">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
          </p>
          <p className="text-center text-secondary-500 text-sm">or click to browse files</p>
          <p className="text-center text-sm text-secondary-500 mt-2">{description}</p>
          
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewImage}
            alt={`Preview for ${title}`}
            className="w-full h-auto rounded-lg"
          />
          
          {onRemove && (
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-secondary-100 transition-colors"
              onClick={onRemove}
              type="button"
              aria-label="Remove image"
            >
              <FaTimesCircle className="text-red-500 text-lg" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUploader 
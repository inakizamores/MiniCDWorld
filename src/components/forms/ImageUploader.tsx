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
    <div className="card h-full image-uploader">
      <h3 className="text-lg font-bold mb-2 flex items-center">
        {title}
        <span className="ml-2 text-xs font-normal text-secondary-500 px-2 py-1 bg-secondary-100 rounded-full">
          {dimensions}
        </span>
      </h3>
      
      {!previewImage ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px] ${
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
        <div className="relative image-preview">
          <img
            src={previewImage}
            alt={`Preview for ${title}`}
            className="w-full h-auto rounded-lg object-cover"
          />
          
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
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader 
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UseImageUploadProps {
  acceptedFileTypes?: string[];
  maxSize?: number;
  onImageSelected: (file: File) => void;
}

export default function useImageUpload({
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 5 * 1024 * 1024, // 5MB
  onImageSelected
}: UseImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return
      }

      try {
        setError(null)
        setIsLoading(true)
        
        const file = acceptedFiles[0]
        
        if (!acceptedFileTypes.includes(file.type)) {
          throw new Error(`File type must be ${acceptedFileTypes.join(', ')}`)
        }
        
        if (file.size > maxSize) {
          throw new Error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
        }
        
        onImageSelected(file)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    },
    [acceptedFileTypes, maxSize, onImageSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedFileTypes.map(type => `.${type.split('/')[1]}`)
    },
    maxSize,
    multiple: false
  })

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    error,
    isLoading
  }
} 
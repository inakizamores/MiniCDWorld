import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  selectTemplateState,
  nextStep,
  prevStep,
  setCdsPerPage 
} from '@features/template/templateSlice'
import { DIMENSIONS, mmToPixels } from '@constants/dimensions'
import { FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa'

const PreviewPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { images, albumTitle, artistName, cdsPerPage } = useSelector(selectTemplateState)
  
  // Navigation handlers
  const handleBack = () => {
    dispatch(prevStep())
    navigate('/upload')
  }
  
  const handleContinue = () => {
    dispatch(nextStep())
    navigate('/generate')
  }
  
  const handleCdsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCdsPerPage(parseInt(e.target.value)))
  }
  
  // Check if required images are available
  const hasRequiredImages = 
    images.frenteAfuera?.croppedImage &&
    images.frenteDentro?.croppedImage &&
    images.disco?.croppedImage &&
    images.traseraAfuera.main?.croppedImage
  
  if (!hasRequiredImages) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-md">
        <div className="bg-secondary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FaEye className="text-3xl text-secondary-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Missing Required Images</h1>
        <p className="text-secondary-600 mb-8 max-w-lg mx-auto">
          You need to upload all required images before previewing your template.
          Please go back and complete the uploads.
        </p>
        <button
          className="btn btn-primary"
          onClick={handleBack}
        >
          Return to Upload Page
        </button>
      </div>
    )
  }
  
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Preview Your CD Template</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          This is how your CD template will look when printed. You can adjust how many CDs to print per page.
        </p>
      </div>
      
      <div className="card mb-10">
        <div className="mb-8">
          <label className="block text-secondary-700 font-medium mb-3">
            Number of CDs per page
          </label>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3].map((num) => (
              <label key={num} className="flex items-center cursor-pointer bg-white border border-secondary-200 rounded-lg p-3 transition-all hover:bg-primary-50 hover:border-primary-300">
                <input
                  type="radio"
                  name="cdsPerPage"
                  value={num}
                  checked={cdsPerPage === num}
                  onChange={handleCdsPerPageChange}
                  className="mr-3 h-4 w-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium">{num} {num === 1 ? 'CD' : 'CDs'}</span>
                  <p className="text-xs text-secondary-500">per page</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="font-medium mb-3 flex items-center">
            <FaEye className="mr-2 text-primary-600" /> 
            Template Preview
          </div>
          <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-4 overflow-auto">
            <div className="relative bg-white shadow-lg rounded border border-secondary-200 w-[800px] h-[1035px] mx-auto transform transition-transform hover:scale-[1.01]">
              {/* This is a simplified preview - the actual PDF will have proper measurements */}
              <div className="absolute left-12 top-12 text-xs text-secondary-500">
                <div className="font-bold text-secondary-700 text-sm">{albumTitle || 'Album Title'}</div>
                <div className="text-secondary-500">{artistName || 'Artist Name'}</div>
              </div>
              
              {/* Front cover outside and inside */}
              <div className="absolute left-12 top-24 flex shadow-md">
                {images.frenteAfuera?.croppedImage && (
                  <img 
                    src={images.frenteAfuera.croppedImage}
                    alt="Front Cover Outside"
                    className="border border-secondary-300"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.FRENTE_AFUERA.width) / 2,
                      height: mmToPixels(DIMENSIONS.FRENTE_AFUERA.height) / 2
                    }}
                  />
                )}
                
                {images.frenteDentro?.croppedImage && (
                  <img 
                    src={images.frenteDentro.croppedImage}
                    alt="Front Cover Inside"
                    className="border border-secondary-300"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.FRENTE_DENTRO.width) / 2,
                      height: mmToPixels(DIMENSIONS.FRENTE_DENTRO.height) / 2
                    }}
                  />
                )}
              </div>
              
              {/* Disc */}
              {images.disco?.croppedImage && (
                <div 
                  className="absolute rounded-full overflow-hidden border border-secondary-300 shadow-md"
                  style={{ 
                    width: mmToPixels(DIMENSIONS.DISCO.diameter) / 2,
                    height: mmToPixels(DIMENSIONS.DISCO.diameter) / 2,
                    left: mmToPixels(2 * DIMENSIONS.FRENTE_AFUERA.width + DIMENSIONS.COMPONENT_SPACING) / 2 + 12,
                    top: 24 + mmToPixels(DIMENSIONS.COMPONENT_SPACING) / 2,
                  }}
                >
                  <img 
                    src={images.disco.croppedImage}
                    alt="CD Disc"
                    style={{ 
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  {/* Center hole */}
                  <div 
                    className="absolute bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.DISCO.holeSize) / 2,
                      height: mmToPixels(DIMENSIONS.DISCO.holeSize) / 2,
                    }}
                  />
                </div>
              )}
              
              {/* Back sections */}
              <div 
                className="absolute flex shadow-md"
                style={{ 
                  left: 12,
                  top: 24 + mmToPixels(DIMENSIONS.FRENTE_AFUERA.height + DIMENSIONS.COMPONENT_SPACING) / 2,
                }}
              >
                {/* Back outside main */}
                {images.traseraAfuera.main?.croppedImage && (
                  <img 
                    src={images.traseraAfuera.main.croppedImage}
                    alt="Back Cover Outside Main"
                    className="border border-secondary-300"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_AFUERA.main.width) / 2,
                      height: mmToPixels(DIMENSIONS.TRASERA_AFUERA.main.height) / 2
                    }}
                  />
                )}
                
                {/* Back outside side */}
                {images.traseraAfuera.side?.croppedImage && (
                  <img 
                    src={images.traseraAfuera.side.croppedImage}
                    alt="Back Cover Outside Side"
                    className="border border-secondary-300"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_AFUERA.side.width) / 2,
                      height: mmToPixels(DIMENSIONS.TRASERA_AFUERA.side.height) / 2
                    }}
                  />
                )}
                
                {/* Back inside side */}
                {images.traseraDentro.side?.croppedImage && (
                  <img 
                    src={images.traseraDentro.side.croppedImage}
                    alt="Back Cover Inside Side"
                    className="border border-secondary-300"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_DENTRO.side.width) / 2,
                      height: mmToPixels(DIMENSIONS.TRASERA_DENTRO.side.height) / 2
                    }}
                  />
                )}
                
                {/* Back inside main */}
                {images.traseraDentro.main?.croppedImage && (
                  <img 
                    src={images.traseraDentro.main.croppedImage}
                    alt="Back Cover Inside Main"
                    className="border border-secondary-300"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_DENTRO.main.width) / 2,
                      height: mmToPixels(DIMENSIONS.TRASERA_DENTRO.main.height) / 2
                    }}
                  />
                )}
              </div>
              
              {/* Footer text */}
              <div 
                className="absolute text-xs text-secondary-400"
                style={{ 
                  left: 12,
                  bottom: 12,
                }}
              >
                Generated with MiniCDWorld
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-secondary-600 bg-primary-50 border border-primary-100 rounded-lg p-4">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Note: This preview is scaled down. The actual PDF will maintain precise measurements for printing.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between">
        <button
          className="btn btn-outline flex items-center justify-center mb-4 sm:mb-0"
          onClick={handleBack}
        >
          <FaArrowLeft className="mr-2" /> Back to Upload
        </button>
        
        <button
          className="btn btn-primary flex items-center justify-center"
          onClick={handleContinue}
        >
          Continue to Download <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  )
}

export default PreviewPage 
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
  
  // Helper function to render a CD block
  const renderCDBlock = () => {
    return (
      <div className="bg-white border border-secondary-200 rounded-lg p-4 mb-4 relative">
        {/* Block outline */}
        <div className="border border-secondary-200 rounded p-4">
          {/* Top row: Front Cover Components (left) and CD Disc (right) */}
          <div className="flex flex-wrap mb-6">
            {/* Front Cover Components */}
            <div className="w-3/5 pr-4">
              <div className="text-xs font-bold text-secondary-600 mb-2">Front Cover Components</div>
              <div className="flex">
                {images.frenteAfuera?.croppedImage && (
                  <div className="relative border border-dashed border-secondary-400">
                    <img 
                      src={images.frenteAfuera.croppedImage}
                      alt="Front Cover Outside"
                      style={{ 
                        width: mmToPixels(DIMENSIONS.FRENTE_AFUERA.width) / 2.5,
                        height: mmToPixels(DIMENSIONS.FRENTE_AFUERA.height) / 2.5
                      }}
                    />
                  </div>
                )}
                
                {images.frenteDentro?.croppedImage && (
                  <div className="relative border border-dashed border-secondary-400">
                    <img 
                      src={images.frenteDentro.croppedImage}
                      alt="Front Cover Inside"
                      style={{ 
                        width: mmToPixels(DIMENSIONS.FRENTE_DENTRO.width) / 2.5,
                        height: mmToPixels(DIMENSIONS.FRENTE_DENTRO.height) / 2.5
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* CD Disc */}
            <div className="w-2/5">
              <div className="text-xs font-bold text-secondary-600 mb-2">CD Disc</div>
              {images.disco?.croppedImage && (
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="rounded-full overflow-hidden border border-dashed border-secondary-400">
                      <img 
                        src={images.disco.croppedImage}
                        alt="CD Disc"
                        style={{ 
                          width: mmToPixels(DIMENSIONS.DISCO.diameter) / 2.5,
                          height: mmToPixels(DIMENSIONS.DISCO.diameter) / 2.5,
                        }}
                      />
                    </div>
                    {/* Center hole */}
                    <div 
                      className="absolute bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        width: mmToPixels(DIMENSIONS.DISCO.holeSize) / 2.5,
                        height: mmToPixels(DIMENSIONS.DISCO.holeSize) / 2.5,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom row: Back Cover Components */}
          <div>
            <div className="text-xs font-bold text-secondary-600 mb-2">Back Cover Components</div>
            <div className="flex justify-center">
              {/* Back outside main */}
              {images.traseraAfuera.main?.croppedImage && (
                <div className="relative border border-dashed border-secondary-400">
                  <img 
                    src={images.traseraAfuera.main.croppedImage}
                    alt="Back Cover Outside Main"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_AFUERA.main.width) / 2.5,
                      height: mmToPixels(DIMENSIONS.TRASERA_AFUERA.main.height) / 2.5
                    }}
                  />
                </div>
              )}
              
              {/* Back outside side */}
              {images.traseraAfuera.side?.croppedImage && (
                <div className="relative border border-dashed border-secondary-400">
                  <img 
                    src={images.traseraAfuera.side.croppedImage}
                    alt="Back Cover Outside Side"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_AFUERA.side.width) / 2.5,
                      height: mmToPixels(DIMENSIONS.TRASERA_AFUERA.side.height) / 2.5
                    }}
                  />
                </div>
              )}
              
              {/* Back inside side */}
              {images.traseraDentro.side?.croppedImage && (
                <div className="relative border border-dashed border-secondary-400">
                  <img 
                    src={images.traseraDentro.side.croppedImage}
                    alt="Back Cover Inside Side"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_DENTRO.side.width) / 2.5,
                      height: mmToPixels(DIMENSIONS.TRASERA_DENTRO.side.height) / 2.5
                    }}
                  />
                </div>
              )}
              
              {/* Back inside main */}
              {images.traseraDentro.main?.croppedImage && (
                <div className="relative border border-dashed border-secondary-400">
                  <img 
                    src={images.traseraDentro.main.croppedImage}
                    alt="Back Cover Inside Main"
                    style={{ 
                      width: mmToPixels(DIMENSIONS.TRASERA_DENTRO.main.width) / 2.5,
                      height: mmToPixels(DIMENSIONS.TRASERA_DENTRO.main.height) / 2.5
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
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
            {[1, 2].map((num) => (
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
            <div className="relative bg-white shadow-lg rounded border border-secondary-200 w-[800px] mx-auto transform transition-transform hover:scale-[1.01]">
              {/* Header */}
              <div className="border-b border-secondary-200 p-3 flex justify-between items-center">
                <div className="text-xs font-bold">MiniCDWorld US Letter Printable Template</div>
                <div className="text-xs text-right">
                  <span>{albumTitle || 'Album Title'} - {artistName || 'Artist Name'}</span>
                </div>
              </div>
              
              {/* CD Blocks */}
              <div className="p-4">
                {renderCDBlock()}
                {cdsPerPage > 1 && renderCDBlock()}
              </div>
              
              {/* Footer */}
              <div className="border-t border-secondary-200 p-3">
                <div className="text-xs text-secondary-500">
                  Created with the tool made by Inaki Zamores and findable on: https://mini-cd-world.vercel.app/
                </div>
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
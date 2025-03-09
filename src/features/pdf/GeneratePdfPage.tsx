import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  selectTemplateState,
  prevStep,
  resetTemplate
} from '@features/template/templateSlice'
import PDFService from '@services/pdfService'
import { FaFilePdf, FaSpinner, FaArrowLeft, FaCheckCircle, FaRedo, FaDownload, FaPrint, FaInfoCircle } from 'react-icons/fa'

const GeneratePdfPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const templateData = useSelector(selectTemplateState)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleBack = () => {
    dispatch(prevStep())
    navigate('/preview')
  }
  
  const handleGeneratePdf = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      
      // Generate the PDF
      const pdfBlob = await PDFService.generatePDF(templateData)
      
      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
    } catch (err) {
      console.error('Error generating PDF:', err)
      setError('There was an error generating your PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleStartOver = () => {
    dispatch(resetTemplate())
    navigate('/')
  }
  
  const downloadFileName = templateData.albumTitle
    ? `${templateData.albumTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cd_template.pdf`
    : 'cd_template.pdf'
  
  // Check if required images are available
  const hasRequiredImages = 
    templateData.images.frenteAfuera?.croppedImage &&
    templateData.images.frenteDentro?.croppedImage &&
    templateData.images.disco?.croppedImage &&
    templateData.images.traseraAfuera.main?.croppedImage
  
  if (!hasRequiredImages) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FaInfoCircle className="text-3xl text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Missing Required Images</h1>
        <p className="text-secondary-600 mb-8 max-w-lg mx-auto">
          You need to upload all required images before generating a PDF.
          Please go back and complete the uploads.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/upload')}
        >
          Return to Upload Page
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Generate PDF Template</h1>
        <p className="text-secondary-600">
          Your CD template is ready! Generate a PDF to download and print.
        </p>
      </div>
      
      <div className="card mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gradient-to-r from-primary-50 to-primary-100 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary-200">
          <div>
            <h2 className="text-xl font-bold gradient-text">{templateData.albumTitle || 'Untitled Album'}</h2>
            <p className="text-secondary-600">{templateData.artistName || 'Unknown Artist'}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {templateData.cdsPerPage} {templateData.cdsPerPage === 1 ? 'CD' : 'CDs'} per page
            </div>
          </div>
          
          {!pdfUrl ? (
            <button
              className="btn btn-primary flex items-center mt-4 md:mt-0 px-6 py-3"
              onClick={handleGeneratePdf}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Generating PDF...
                </>
              ) : (
                <>
                  <FaFilePdf className="mr-2" /> Generate PDF
                </>
              )}
            </button>
          ) : (
            <a
              href={pdfUrl}
              download={downloadFileName}
              className="btn btn-primary flex items-center mt-4 md:mt-0 px-6 py-3 bg-green-600 hover:bg-green-700"
            >
              <FaDownload className="mr-2" /> Download PDF
            </a>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-start">
            <FaInfoCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">Please try again or check your images.</p>
            </div>
          </div>
        )}
        
        {pdfUrl && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center mb-8 animate-fade-in">
            <FaCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">PDF generated successfully!</p>
              <p className="text-green-700 text-sm mt-1">Your PDF is ready to download and print.</p>
            </div>
          </div>
        )}
        
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
          <h3 className="font-bold mb-4 flex items-center text-lg">
            <FaPrint className="mr-2 text-secondary-600" /> 
            Printing Instructions
          </h3>
          <ul className="space-y-3">
            {[
              'Print on US Letter size paper (8.5" × 11")',
              'Select "Actual size" in printer settings (not "Fit to page")',
              'Use high-quality paper for best results',
              'Cut along the dotted lines for precise dimensions',
              'For the disc, carefully cut out the center hole',
              'Fold along the connecting edges between front and back covers'
            ].map((instruction, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-700 text-sm font-bold">{index + 1}</span>
                </div>
                <span className="text-secondary-700">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row justify-between">
        <button
          className="btn btn-outline flex items-center justify-center mt-4 sm:mt-0"
          onClick={handleBack}
        >
          <FaArrowLeft className="mr-2" /> Back to Preview
        </button>
        
        <button
          className="btn btn-secondary flex items-center justify-center"
          onClick={handleStartOver}
        >
          <FaRedo className="mr-2" /> Create Another Template
        </button>
      </div>
    </div>
  )
}

export default GeneratePdfPage 
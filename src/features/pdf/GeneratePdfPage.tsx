import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  selectTemplateState,
  prevStep,
  resetTemplate
} from '@features/template/templateSlice'
import PDFService from '@services/pdfService'
import { FaFilePdf, FaSpinner, FaArrowLeft, FaCheckCircle, FaRedo } from 'react-icons/fa'

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
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Missing Required Images</h1>
        <p className="text-secondary-600 mb-8">
          You need to upload all required images before generating a PDF.
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Generate PDF Template</h1>
        <p className="text-secondary-600">
          Your CD template is ready! Generate a PDF to download and print.
        </p>
      </div>
      
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{templateData.albumTitle || 'Untitled Album'}</h2>
            <p className="text-secondary-600">{templateData.artistName || 'Unknown Artist'}</p>
            <p className="text-secondary-500 text-sm mt-1">{templateData.cdsPerPage} {templateData.cdsPerPage === 1 ? 'CD' : 'CDs'} per page</p>
          </div>
          
          {!pdfUrl ? (
            <button
              className="btn btn-primary flex items-center mt-4 md:mt-0"
              onClick={handleGeneratePdf}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Generating...
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
              className="btn btn-primary flex items-center mt-4 md:mt-0"
            >
              <FaFilePdf className="mr-2" /> Download PDF
            </a>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {pdfUrl && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center mb-6">
            <FaCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">PDF generated successfully!</p>
              <p className="text-green-700 text-sm mt-1">Your PDF is ready to download and print.</p>
            </div>
          </div>
        )}
        
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <h3 className="font-bold mb-2">Printing Instructions</h3>
          <ul className="list-disc list-inside text-secondary-700 space-y-1">
            <li>Print on US Letter size paper (8.5" × 11")</li>
            <li>Select "Actual size" in printer settings (not "Fit to page")</li>
            <li>Use high-quality paper for best results</li>
            <li>Cut along the dotted lines</li>
            <li>For the disc, carefully cut out the center hole</li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row justify-between">
        <button
          className="btn btn-outline flex items-center mt-4 sm:mt-0"
          onClick={handleBack}
        >
          <FaArrowLeft className="mr-2" /> Back to Preview
        </button>
        
        <button
          className="btn btn-secondary flex items-center"
          onClick={handleStartOver}
        >
          <FaRedo className="mr-2" /> Create Another Template
        </button>
      </div>
    </div>
  )
}

export default GeneratePdfPage 
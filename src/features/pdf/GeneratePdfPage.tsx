import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  selectTemplateState,
  prevStep,
  resetTemplate
} from '@features/template/templateSlice'
import PDFService, { PDFError, PDFErrorType } from '@services/pdfService'
import { FaFilePdf, FaSpinner, FaArrowLeft, FaCheckCircle, FaRedo, FaDownload, FaPrint, FaInfoCircle, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa'

// Add declaration for IE-specific msSaveOrOpenBlob
declare global {
  interface Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
  }
}

// Component to display detailed error messages based on error type
interface ErrorMessageProps {
  error: Error | null;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  // Default error message
  let title = 'Error al Generar PDF';
  let message = 'Hubo un error al generar tu PDF. Por favor, intenta de nuevo.';
  let helpText = '';
  let isWarning = false;

  // Determine specific error messages based on error type
  if (error instanceof PDFError) {
    switch (error.type) {
      case PDFErrorType.IMAGE_LOAD_ERROR:
        title = 'Error al Cargar Imágenes';
        message = 'No se pudieron cargar una o más imágenes para el PDF.';
        helpText = 'Verifica que tus imágenes estén en un formato compatible (JPG, PNG) y no sean demasiado grandes.';
        break;
      
      case PDFErrorType.IMAGE_PROCESS_ERROR:
        title = 'Error al Procesar Imágenes';
        message = 'Hubo un problema al procesar una o más imágenes para el PDF.';
        helpText = 'Intenta con imágenes de menor resolución o en un formato diferente.';
        break;
      
      case PDFErrorType.CANVAS_SECURITY_ERROR:
        title = 'Error de Seguridad';
        message = 'No se pudieron procesar imágenes de otros sitios web por restricciones de seguridad.';
        helpText = 'Usa imágenes almacenadas localmente en tu dispositivo en lugar de URLs externas.';
        break;
      
      case PDFErrorType.PDF_SIZE_LIMIT_ERROR:
        title = 'PDF Demasiado Grande';
        message = 'El PDF generado excede el tamaño máximo recomendado.';
        helpText = 'Usa imágenes más pequeñas o reduce la cantidad de CDs por página.';
        isWarning = true;
        break;
      
      case PDFErrorType.PDF_GENERATION_ERROR:
        title = 'Error al Generar PDF';
        message = 'No se pudo inicializar el generador de PDF.';
        helpText = 'Intenta recargar la página o usar un navegador diferente.';
        break;
      
      case PDFErrorType.MEMORY_ERROR:
        title = 'Memoria Insuficiente';
        message = 'Tu dispositivo no tiene suficiente memoria para generar el PDF.';
        helpText = 'Intenta cerrar otras aplicaciones o pestañas, usar imágenes más pequeñas, o reducir la cantidad de CDs por página.';
        break;
      
      default:
        // Use the specific error message if available
        message = error.message || message;
    }
  } else if (error) {
    // Use the generic error message if it's not a PDFError
    message = error.message || message;
  }

  return (
    <div className={`${isWarning ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-600'} p-4 rounded-lg mb-6 flex items-start`}>
      {isWarning ? 
        <FaExclamationTriangle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" /> : 
        <FaInfoCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
      }
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm mt-1">{message}</p>
        {helpText && <p className="text-sm mt-2 font-medium">{helpText}</p>}
        <button
          className={`mt-3 px-3 py-1 text-sm rounded-md ${isWarning ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
          onClick={onRetry}
        >
          Intentar Nuevamente
        </button>
      </div>
    </div>
  );
};

const GeneratePdfPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const templateData = useSelector(selectTemplateState)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [downloadAttempts, setDownloadAttempts] = useState(0)
  
  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])
  
  const handleBack = () => {
    dispatch(prevStep())
    navigate('/preview')
  }
  
  const handleGeneratePdf = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      setPdfUrl(null)
      setPdfBlob(null)
      
      // Generate the PDF
      const blob = await PDFService.generatePDF(templateData)
      setPdfBlob(blob)
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error('Error generating PDF:', err)
      setError(err instanceof Error ? err : new Error('Error desconocido al generar el PDF'))
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleDownloadPdf = () => {
    if (!pdfUrl || !pdfBlob) return
    
    // Increment download attempt counter to track potential issues
    setDownloadAttempts(prev => prev + 1)
    
    const downloadFileName = templateData.albumTitle
      ? `${templateData.albumTitle.replace(/[^a-zA-Z0-9]/gi, '_')}_MiniCDWorld_Plantilla.pdf`
      : 'MiniCDWorld_Plantilla.pdf'
    
    try {
      // Special handling for IE11
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(pdfBlob, downloadFileName)
        return
      }
      
      // For iOS Safari and other mobile browsers that have issues with direct download
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Safari on iOS has limited support for blob URLs and downloads
        // Opening in a new tab is more reliable for viewing
        window.open(pdfUrl, '_blank')
        return
      }
      
      // Standard download for modern browsers
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = downloadFileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    } catch (downloadErr) {
      console.error('Error during download:', downloadErr)
      
      // If download fails, provide fallback options
      if (downloadAttempts >= 3) {
        setError(new PDFError(
          'No se pudo descargar el PDF después de varios intentos. Intente abrir el PDF en una nueva pestaña y guardarlo manualmente.',
          PDFErrorType.UNKNOWN_ERROR
        ))
        
        // Provide a button to open in new tab as fallback
        window.open(pdfUrl, '_blank')
      } else {
        setError(new PDFError(
          'Error al descargar el PDF. Por favor, intente nuevamente.',
          PDFErrorType.UNKNOWN_ERROR
        ))
      }
    }
  }
  
  const handleStartOver = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }
  
  const handlePurchase = () => {
    window.open('https://mini-cd-world.vercel.app/purchase', '_blank')
  }
  
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
        <h1 className="text-3xl font-bold mb-4">Imágenes Requeridas Faltantes</h1>
        <p className="text-secondary-600 mb-8 max-w-lg mx-auto">
          Necesitas subir todas las imágenes requeridas antes de generar un PDF.
          Por favor, regresa y completa las cargas.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/upload')}
        >
          Volver a Subir Imágenes
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Generar Plantilla PDF</h1>
        <p className="text-secondary-600">
          ¡Tu plantilla de CD está lista! Genera un PDF para descargar e imprimir.
        </p>
      </div>
      
      <div className="card mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gradient-to-r from-primary-50 to-primary-100 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary-200">
          <div>
            <h2 className="text-xl font-bold gradient-text">{templateData.albumTitle || 'Álbum sin título'}</h2>
            <p className="text-secondary-600">{templateData.artistName || 'Artista desconocido'}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {templateData.cdsPerPage} {templateData.cdsPerPage === 1 ? 'CD' : 'CDs'} por página
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
                  <FaSpinner className="animate-spin mr-2" /> Generando PDF...
                </>
              ) : (
                <>
                  <FaFilePdf className="mr-2" /> Generar PDF
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownloadPdf}
              className="btn btn-primary flex items-center mt-4 md:mt-0 px-6 py-3 bg-green-600 hover:bg-green-700"
            >
              <FaDownload className="mr-2" /> Descargar PDF
            </button>
          )}
        </div>
        
        {error && <ErrorMessage error={error} onRetry={handleGeneratePdf} />}
        
        {pdfUrl && !error && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center mb-8 animate-fade-in">
            <FaCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">¡PDF generado exitosamente!</p>
              <p className="text-green-700 text-sm mt-1">Tu PDF está listo para descargar e imprimir.</p>
              {downloadAttempts > 0 && (
                <p className="text-green-700 text-sm mt-2">
                  Si tienes problemas para descargar, puedes también{' '}
                  <button 
                    className="text-green-800 font-medium underline"
                    onClick={() => window.open(pdfUrl, '_blank')}
                  >
                    abrir el PDF en una nueva pestaña
                  </button>
                  {' '}y guardarlo manualmente.
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold mb-4 flex items-center text-lg">
            <FaPrint className="mr-2 text-secondary-600" /> 
            Instrucciones de Impresión
          </h3>
          <ul className="space-y-3">
            {[
              'Imprimir en papel tamaño Carta (8.5" × 11")',
              'Seleccionar "Tamaño real" en configuración de impresora (no "Ajustar a página")',
              'Usar papel de alta calidad para mejores resultados',
              'Cortar a lo largo de las líneas punteadas para todos los componentes',
              'Para el disco CD, recortar cuidadosamente el orificio central',
              'Cada bloque contiene una plantilla de CD completa idéntica',
              'Si necesitas más de 2 CDs, simplemente imprime el PDF varias veces'
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
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
          <h3 className="font-bold mb-2 flex items-center text-lg justify-center">
            <FaShoppingCart className="mr-2 text-primary-600" /> 
            ¿Ya tienes tus llaveros para mini CD?
          </h3>
          <p className="text-secondary-700 mb-4">
            Coloca tus diseños impresos en nuestros llaveros para mini CD y productos exclusivos.
            ¡Haz tu pedido por MercadoLibre con envío a todo México!
          </p>
          <button
            className="btn btn-primary flex items-center mx-auto"
            onClick={handlePurchase}
          >
            <FaShoppingCart className="mr-2" /> Ver todas nuestras ofertas
          </button>
        </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row justify-between">
        <button
          className="btn btn-outline flex items-center justify-center mt-4 sm:mt-0"
          onClick={handleBack}
        >
          <FaArrowLeft className="mr-2" /> Volver a Vista Previa
        </button>
        
        <button
          className="btn btn-secondary flex items-center justify-center"
          onClick={handleStartOver}
        >
          <FaRedo className="mr-2" /> Crear Otra Plantilla
        </button>
      </div>
    </div>
  )
}

export default GeneratePdfPage 
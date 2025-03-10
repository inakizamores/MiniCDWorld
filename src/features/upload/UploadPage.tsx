import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  selectTemplateState,
  setFrenteAfuera,
  setFrenteDentro,
  setDisco,
  setTraseraAfueraMain,
  setTraseraAfueraSide,
  setTraseraDentroMain,
  setTraseraDentroSide,
  nextStep,
  prevStep 
} from '@features/template/templateSlice'
import { ASPECT_RATIOS, DIMENSIONS } from '@constants/dimensions'
import ImageUploadSection from './components/ImageUploadSection'
import InfoForm from './components/InfoForm'
import { FaArrowRight } from 'react-icons/fa'

// Define the animations as CSS classes
const animationStyles = `
  @keyframes pulse-subtle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 2s infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 1s ease-in;
  }
`;

const UploadPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { step, images } = useSelector(selectTemplateState)
  const [isPulsing, setIsPulsing] = useState(false)
  
  // Add animation styles to the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // If we're on step 1, show the info form
  if (step === 1) {
    return <InfoForm />
  }
  
  const handleBack = () => {
    dispatch(prevStep())
  }
  
  const handleContinue = () => {
    // Check if all required images are uploaded
    if (
      images.frenteAfuera?.croppedImage &&
      images.frenteDentro?.croppedImage &&
      images.disco?.croppedImage &&
      images.traseraAfuera.main?.croppedImage &&
      images.traseraAfuera.side?.croppedImage &&
      images.traseraDentro.main?.croppedImage &&
      images.traseraDentro.side?.croppedImage
    ) {
      dispatch(nextStep())
      navigate('/preview')
    }
  }
  
  const hasAllRequiredImages = 
    images.frenteAfuera?.croppedImage &&
    images.frenteDentro?.croppedImage &&
    images.disco?.croppedImage &&
    images.traseraAfuera.main?.croppedImage &&
    images.traseraAfuera.side?.croppedImage &&
    images.traseraDentro.main?.croppedImage &&
    images.traseraDentro.side?.croppedImage
  
  // Start pulsing animation when all images are uploaded
  useEffect(() => {
    if (hasAllRequiredImages) {
      const timer = setTimeout(() => {
        setIsPulsing(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsPulsing(false);
    }
  }, [hasAllRequiredImages]);
  
  // Function to create description with recommended resolution
  const createDescription = (mainText: string, resolution: string) => (
    <>
      <p>{mainText}</p>
      <p className="text-secondary-400 mt-1">{resolution}</p>
    </>
  )
  
  // Section component for better organization
  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b border-secondary-200 text-primary-700">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  )
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Upload CD Artwork</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Upload and crop your images for each part of the CD template.
          All images are required to proceed.
        </p>
      </div>
      
      {/* Front Cover Section */}
      <Section title="Front Cover Components">
        <ImageUploadSection
          title="Front Cover (Outside)"
          description={createDescription(
            "This will be the front cover of your CD booklet.",
            "Recommended resolution: 410 pixels × 410 pixels"
          )}
          dimensions={`${DIMENSIONS.FRENTE_AFUERA.width}mm × ${DIMENSIONS.FRENTE_AFUERA.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteAfuera}
          onImageSave={(image) => dispatch(setFrenteAfuera(image))}
        />
        
        <ImageUploadSection
          title="Front Cover (Inside)"
          description={createDescription(
            "This will be inside of the front cover.",
            "Recommended resolution: 410 pixels × 410 pixels"
          )}
          dimensions={`${DIMENSIONS.FRENTE_DENTRO.width}mm × ${DIMENSIONS.FRENTE_DENTRO.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteDentro}
          onImageSave={(image) => dispatch(setFrenteDentro(image))}
        />
      </Section>
      
      {/* Back Cover Section */}
      <Section title="Back Cover Components">
        <ImageUploadSection
          title="Back Cover (Outside Main)"
          description={createDescription(
            "The main part of the back cover.",
            "Recommended resolution: 500 pixels × 380 pixels"
          )}
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.main.width}mm × ${DIMENSIONS.TRASERA_AFUERA.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraAfuera.main}
          onImageSave={(image) => dispatch(setTraseraAfueraMain(image))}
        />
        
        <ImageUploadSection
          title="Back Cover (Outside Side)"
          description={createDescription(
            "The side part of the back cover.",
            "Recommended resolution: 40 pixels × 380 pixels"
          )}
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.side.width}mm × ${DIMENSIONS.TRASERA_AFUERA.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraAfuera.side}
          onImageSave={(image) => dispatch(setTraseraAfueraSide(image))}
        />
      </Section>
      
      {/* Inside Section */}
      <Section title="Inside Components">
        <ImageUploadSection
          title="Back Cover (Inside Side)"
          description={createDescription(
            "The side part of the inside back cover.",
            "Recommended resolution: 40 pixels × 380 pixels"
          )}
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.side.width}mm × ${DIMENSIONS.TRASERA_DENTRO.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraDentro.side}
          onImageSave={(image) => dispatch(setTraseraDentroSide(image))}
        />
        
        <ImageUploadSection
          title="Back Cover (Inside Main)"
          description={createDescription(
            "The main part of the inside back cover.",
            "Recommended resolution: 500 pixels × 380 pixels"
          )}
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.main.width}mm × ${DIMENSIONS.TRASERA_DENTRO.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraDentro.main}
          onImageSave={(image) => dispatch(setTraseraDentroMain(image))}
        />
      </Section>
      
      {/* CD Disc Section */}
      <Section title="CD Disc">
        <ImageUploadSection
          title="CD Disc"
          description={createDescription(
            "This will be printed on the CD itself.",
            "Recommended resolution: 400 pixels diameter with 60 pixels center hole"
          )}
          dimensions={`${DIMENSIONS.DISCO.diameter}mm diameter (with ${DIMENSIONS.DISCO.holeSize}mm center hole)`}
          aspectRatio={ASPECT_RATIOS.DISCO}
          currentImage={images.disco}
          onImageSave={(image) => dispatch(setDisco(image))}
        />
      </Section>
      
      <div className="flex flex-col items-center mt-12">
        <button
          className={`btn btn-primary px-8 py-3 flex items-center text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
            hasAllRequiredImages && isPulsing ? 'animate-pulse-subtle hover:animate-none' : ''
          }`}
          onClick={handleContinue}
          disabled={!hasAllRequiredImages}
        >
          {!hasAllRequiredImages ? 'Upload All Required Images' : 'Continue to Preview'} 
          {hasAllRequiredImages && <FaArrowRight className="ml-2" />}
        </button>
        
        {hasAllRequiredImages && isPulsing && (
          <p className="text-primary-600 text-sm mt-3 animate-fade-in">
            All images uploaded! Click to continue.
          </p>
        )}
        
        <button 
          className="btn btn-outline mt-4"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default UploadPage 
import React from 'react'
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

const UploadPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { step, images } = useSelector(selectTemplateState)
  
  // If we're on step 1, show the info form
  if (step === 1) {
    return <InfoForm />
  }
  
  const handleBack = () => {
    dispatch(prevStep())
  }
  
  const handleContinue = () => {
    // Check if at least the required images are uploaded
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
  
  const hasRequiredImages = 
    images.frenteAfuera?.croppedImage &&
    images.frenteDentro?.croppedImage &&
    images.disco?.croppedImage &&
    images.traseraAfuera.main?.croppedImage &&
    images.traseraAfuera.side?.croppedImage &&
    images.traseraDentro.main?.croppedImage &&
    images.traseraDentro.side?.croppedImage
  
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
          <span className="text-red-600 font-semibold"> All images are required.</span>
        </p>
      </div>
      
      {/* Front Cover Section */}
      <Section title="Front Cover Components">
        <ImageUploadSection
          title="Front Cover (Outside)"
          description="This will be the front cover of your CD booklet."
          dimensions={`${DIMENSIONS.FRENTE_AFUERA.width}mm × ${DIMENSIONS.FRENTE_AFUERA.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteAfuera}
          onImageSave={(image) => dispatch(setFrenteAfuera(image))}
          required={true}
        />
        
        <ImageUploadSection
          title="Front Cover (Inside)"
          description="This will be inside of the front cover."
          dimensions={`${DIMENSIONS.FRENTE_DENTRO.width}mm × ${DIMENSIONS.FRENTE_DENTRO.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteDentro}
          onImageSave={(image) => dispatch(setFrenteDentro(image))}
          required={true}
        />
      </Section>
      
      {/* Back Cover Section */}
      <Section title="Back Cover Components">
        <ImageUploadSection
          title="Back Cover (Outside Main)"
          description="The main part of the back cover."
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.main.width}mm × ${DIMENSIONS.TRASERA_AFUERA.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraAfuera.main}
          onImageSave={(image) => dispatch(setTraseraAfueraMain(image))}
          required={true}
        />
        
        <ImageUploadSection
          title="Back Cover (Outside Side)"
          description="The side part of the back cover."
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.side.width}mm × ${DIMENSIONS.TRASERA_AFUERA.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraAfuera.side}
          onImageSave={(image) => dispatch(setTraseraAfueraSide(image))}
          required={true}
        />
      </Section>
      
      {/* Inside Section */}
      <Section title="Inside Components">
        <ImageUploadSection
          title="Back Cover (Inside Main)"
          description="The main part of the inside back cover."
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.main.width}mm × ${DIMENSIONS.TRASERA_DENTRO.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraDentro.main}
          onImageSave={(image) => dispatch(setTraseraDentroMain(image))}
          required={true}
        />
        
        <ImageUploadSection
          title="Back Cover (Inside Side)"
          description="The side part of the inside back cover."
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.side.width}mm × ${DIMENSIONS.TRASERA_DENTRO.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraDentro.side}
          onImageSave={(image) => dispatch(setTraseraDentroSide(image))}
          required={true}
        />
      </Section>
      
      {/* CD Disc Section */}
      <Section title="CD Disc">
        <ImageUploadSection
          title="CD Disc"
          description="This will be printed on the CD itself."
          dimensions={`${DIMENSIONS.DISCO.diameter}mm diameter (with ${DIMENSIONS.DISCO.holeSize}mm center hole)`}
          aspectRatio={ASPECT_RATIOS.DISCO}
          currentImage={images.disco}
          onImageSave={(image) => dispatch(setDisco(image))}
          required={true}
        />
      </Section>
      
      <div className="flex justify-between mt-8">
        <button 
          className="btn btn-outline"
          onClick={handleBack}
        >
          Back
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!hasRequiredImages}
        >
          {!hasRequiredImages ? 'Upload All Required Images' : 'Continue to Preview'}
        </button>
      </div>
    </div>
  )
}

export default UploadPage 
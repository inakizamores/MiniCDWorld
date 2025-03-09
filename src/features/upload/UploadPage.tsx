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
      images.traseraAfuera.main?.croppedImage
    ) {
      dispatch(nextStep())
      navigate('/preview')
    }
  }
  
  const hasRequiredImages = 
    images.frenteAfuera?.croppedImage &&
    images.frenteDentro?.croppedImage &&
    images.disco?.croppedImage &&
    images.traseraAfuera.main?.croppedImage
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Upload CD Artwork</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Upload and crop your images for each part of the CD template.
          Images will be automatically resized to match the required dimensions.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Front outside */}
        <ImageUploadSection
          title="Front Cover (Outside)"
          description="This will be the front cover of your CD booklet."
          dimensions={`${DIMENSIONS.FRENTE_AFUERA.width}mm × ${DIMENSIONS.FRENTE_AFUERA.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteAfuera}
          onImageSave={(image) => dispatch(setFrenteAfuera(image))}
        />
        
        {/* Front inside */}
        <ImageUploadSection
          title="Front Cover (Inside)"
          description="This will be inside of the front cover."
          dimensions={`${DIMENSIONS.FRENTE_DENTRO.width}mm × ${DIMENSIONS.FRENTE_DENTRO.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteDentro}
          onImageSave={(image) => dispatch(setFrenteDentro(image))}
        />
        
        {/* Back outside main */}
        <ImageUploadSection
          title="Back Cover (Outside Main)"
          description="The main part of the back cover."
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.main.width}mm × ${DIMENSIONS.TRASERA_AFUERA.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraAfuera.main}
          onImageSave={(image) => dispatch(setTraseraAfueraMain(image))}
        />
        
        {/* Back outside side */}
        <ImageUploadSection
          title="Back Cover (Outside Side)"
          description="The side part of the back cover (optional)."
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.side.width}mm × ${DIMENSIONS.TRASERA_AFUERA.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraAfuera.side}
          onImageSave={(image) => dispatch(setTraseraAfueraSide(image))}
        />
        
        {/* Back inside main */}
        <ImageUploadSection
          title="Back Cover (Inside Main)"
          description="The main part of the inside back cover (optional)."
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.main.width}mm × ${DIMENSIONS.TRASERA_DENTRO.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraDentro.main}
          onImageSave={(image) => dispatch(setTraseraDentroMain(image))}
        />
        
        {/* Back inside side */}
        <ImageUploadSection
          title="Back Cover (Inside Side)"
          description="The side part of the inside back cover (optional)."
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.side.width}mm × ${DIMENSIONS.TRASERA_DENTRO.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraDentro.side}
          onImageSave={(image) => dispatch(setTraseraDentroSide(image))}
        />
        
        {/* Disc - Moved to the last position */}
        <ImageUploadSection
          title="CD Disc"
          description="This will be printed on the CD itself."
          dimensions={`${DIMENSIONS.DISCO.diameter}mm diameter (with ${DIMENSIONS.DISCO.holeSize}mm center hole)`}
          aspectRatio={ASPECT_RATIOS.DISCO}
          currentImage={images.disco}
          onImageSave={(image) => dispatch(setDisco(image))}
        />
      </div>
      
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
          {!hasRequiredImages ? 'Upload Required Images' : 'Continue to Preview'}
        </button>
      </div>
    </div>
  )
}

export default UploadPage 
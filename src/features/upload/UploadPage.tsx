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
        <h1 className="text-3xl font-bold mb-4">Subir Imágenes del CD</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Sube y recorta tus imágenes para cada parte de la plantilla del CD.
          Todas las imágenes son necesarias para continuar.
        </p>
      </div>
      
      {/* Front Cover Section */}
      <Section title="Componentes de Portada">
        <ImageUploadSection
          title="Portada (Exterior)"
          description={createDescription(
            "Esta será la portada frontal de tu folleto de CD.",
            "Resolución recomendada: 410 píxeles × 410 píxeles"
          )}
          dimensions={`${DIMENSIONS.FRENTE_AFUERA.width}mm × ${DIMENSIONS.FRENTE_AFUERA.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteAfuera}
          onImageSave={(image) => dispatch(setFrenteAfuera(image))}
        />
        
        <ImageUploadSection
          title="Portada (Interior)"
          description={createDescription(
            "Este será el interior de la portada frontal.",
            "Resolución recomendada: 410 píxeles × 410 píxeles"
          )}
          dimensions={`${DIMENSIONS.FRENTE_DENTRO.width}mm × ${DIMENSIONS.FRENTE_DENTRO.height}mm`}
          aspectRatio={ASPECT_RATIOS.FRENTE}
          currentImage={images.frenteDentro}
          onImageSave={(image) => dispatch(setFrenteDentro(image))}
        />
      </Section>
      
      {/* Back Cover Section */}
      <Section title="Componentes de Contraportada">
        <ImageUploadSection
          title="Contraportada (Exterior Principal)"
          description={createDescription(
            "La parte principal de la contraportada.",
            "Resolución recomendada: 500 píxeles × 380 píxeles"
          )}
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.main.width}mm × ${DIMENSIONS.TRASERA_AFUERA.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraAfuera.main}
          onImageSave={(image) => dispatch(setTraseraAfueraMain(image))}
        />
        
        <ImageUploadSection
          title="Contraportada (Exterior Lateral)"
          description={createDescription(
            "La parte lateral de la contraportada.",
            "Resolución recomendada: 40 píxeles × 380 píxeles"
          )}
          dimensions={`${DIMENSIONS.TRASERA_AFUERA.side.width}mm × ${DIMENSIONS.TRASERA_AFUERA.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraAfuera.side}
          onImageSave={(image) => dispatch(setTraseraAfueraSide(image))}
        />
      </Section>
      
      {/* Inside Section */}
      <Section title="Componentes Interiores">
        <ImageUploadSection
          title="Contraportada (Interior Lateral)"
          description={createDescription(
            "La parte lateral del interior de la contraportada.",
            "Resolución recomendada: 40 píxeles × 380 píxeles"
          )}
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.side.width}mm × ${DIMENSIONS.TRASERA_DENTRO.side.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_SIDE}
          currentImage={images.traseraDentro.side}
          onImageSave={(image) => dispatch(setTraseraDentroSide(image))}
        />
        
        <ImageUploadSection
          title="Contraportada (Interior Principal)"
          description={createDescription(
            "La parte principal del interior de la contraportada.",
            "Resolución recomendada: 500 píxeles × 380 píxeles"
          )}
          dimensions={`${DIMENSIONS.TRASERA_DENTRO.main.width}mm × ${DIMENSIONS.TRASERA_DENTRO.main.height}mm`}
          aspectRatio={ASPECT_RATIOS.TRASERA_MAIN}
          currentImage={images.traseraDentro.main}
          onImageSave={(image) => dispatch(setTraseraDentroMain(image))}
        />
      </Section>
      
      {/* CD Disc Section */}
      <Section title="Disco CD">
        <ImageUploadSection
          title="Disco CD"
          description={createDescription(
            "Esto se imprimirá en el propio CD.",
            "Resolución recomendada: 400 píxeles de diámetro con 60 píxeles de orificio central"
          )}
          dimensions={`${DIMENSIONS.DISCO.diameter}mm de diámetro (con ${DIMENSIONS.DISCO.holeSize}mm de orificio central)`}
          aspectRatio={ASPECT_RATIOS.DISCO}
          currentImage={images.disco}
          onImageSave={(image) => dispatch(setDisco(image))}
        />
      </Section>
      
      <div className="flex justify-between mt-8">
        <button 
          className="btn btn-outline"
          onClick={handleBack}
        >
          Atrás
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!hasAllRequiredImages}
        >
          {!hasAllRequiredImages ? 'Sube Todas las Imágenes Requeridas' : 'Continuar a Vista Previa'}
        </button>
      </div>
    </div>
  )
}

export default UploadPage 
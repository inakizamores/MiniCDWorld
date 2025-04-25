import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useSelector } from 'react-redux'
import { selectTemplateState } from '@features/template/templateSlice'
import ProgressStepper from '@components/ui/ProgressStepper'
import MobileAlert from '@components/ui/MobileAlert'

const Layout = () => {
  const { step } = useSelector(selectTemplateState)
  
  const steps = [
    { name: 'Información', description: 'Detalles del álbum' },
    { name: 'Subir', description: 'Subir imágenes' },
    { name: 'Vista Previa', description: 'Revisar plantilla' },
    { name: 'Generar', description: 'Descargar PDF' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow relative z-0 pt-4">
        <div className="container mx-auto px-4 py-4">
          <ProgressStepper steps={steps} currentStep={step} />
          
          <div className="mt-6 mb-32">
            <Outlet />
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Alerta móvil */}
      <MobileAlert />
    </div>
  )
}

export default Layout 
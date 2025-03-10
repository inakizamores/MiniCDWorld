import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useSelector } from 'react-redux'
import { selectTemplateState } from '@features/template/templateSlice'
import ProgressStepper from '@components/ui/ProgressStepper'

const Layout = () => {
  const { step } = useSelector(selectTemplateState)
  
  const steps = [
    { name: 'Information', description: 'Album details' },
    { name: 'Upload', description: 'Upload images' },
    { name: 'Preview', description: 'Review template' },
    { name: 'Generate', description: 'Download PDF' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow relative z-0 pt-4" style={{ paddingTop: 'calc(1rem * var(--spacing-scale))' }}>
        <div className="container mx-auto">
          <div style={{ padding: 'calc(1rem * var(--spacing-scale))' }}>
            <ProgressStepper steps={steps} currentStep={step} />
            
            <div className="mt-6" style={{ 
              marginTop: 'calc(1.5rem * var(--spacing-scale))',
              marginBottom: 'calc(8rem * var(--spacing-scale))'
            }}>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout 
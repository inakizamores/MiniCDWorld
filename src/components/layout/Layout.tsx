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
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <ProgressStepper steps={steps} currentStep={step} />
          
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout 
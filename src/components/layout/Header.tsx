import { Link, useNavigate } from 'react-router-dom'
import { FaCompactDisc } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { resetTemplate } from '@features/template/templateSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Handler to reset template state and navigate to upload page
  const handleCreateTemplate = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }
  
  return (
    <header className="bg-white backdrop-blur-sm bg-opacity-90 shadow-md sticky top-0 z-50 border-b border-secondary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-700 hover:text-primary-600 transition-colors">
            <div className="rounded-full bg-primary-100 p-2 flex items-center justify-center">
              <FaCompactDisc className="text-2xl text-primary-600" />
            </div>
            <span className="text-xl font-bold">MiniCDWorld</span>
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-6">
              <li className="hidden md:block">
                <Link 
                  to="/" 
                  className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Home
                </Link>
              </li>
              <li className="hidden md:block">
                <a 
                  href="https://github.com/inakizamores/MiniCDWorld" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
                >
                  GitHub
                </a>
              </li>
              <li>
                <button
                  onClick={handleCreateTemplate}
                  className="btn btn-primary flex items-center"
                >
                  Create Template
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 
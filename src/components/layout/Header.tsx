import { Link } from 'react-router-dom'
import { FaCompactDisc } from 'react-icons/fa'

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-700">
            <FaCompactDisc className="text-2xl" />
            <span className="text-xl font-bold">MiniCDWorld</span>
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/yourusername/mini-cd-world" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="btn btn-primary"
                >
                  Create Template
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 
import { FaHeart, FaGithub, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white">
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-3">MiniCDWorld</h3>
            <p className="text-secondary-300 max-w-md">
              Create stunning, print-ready CD templates with precise measurements.
              Upload your artwork, customize your design, and download a professional PDF.
            </p>
            
            <div className="mt-4 flex space-x-4 justify-center md:justify-start">
              <a 
                href="https://github.com/inakizamores/MiniCDWorld"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-300 hover:text-white transition-colors rounded-full bg-secondary-800 p-2 hover:bg-secondary-700"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
              <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-300 hover:text-white transition-colors rounded-full bg-secondary-800 p-2 hover:bg-secondary-700"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end mb-2">
              <p className="text-secondary-300 flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" /> by Iñaki Zamores
              </p>
            </div>
            <p className="text-secondary-400 text-sm">&copy; {currentYear} MiniCDWorld. All rights reserved.</p>
            <p className="text-secondary-500 text-xs mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
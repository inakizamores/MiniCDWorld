import { FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white mt-auto pt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-3">MiniCDWorld</h3>
            <p className="text-secondary-300 max-w-md">
              Create stunning, print-ready CD templates with precise measurements.
              Upload your artwork, customize your design, and download a professional PDF.
            </p>
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
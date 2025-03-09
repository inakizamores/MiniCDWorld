import { FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">MiniCDWorld</h3>
            <p className="text-secondary-300">Create printable CD templates with precise measurements</p>
          </div>
          
          <div className="text-center md:text-right text-secondary-300">
            <p className="flex items-center justify-center md:justify-end">
              Made with <FaHeart className="text-red-500 mx-1" /> by Your Name
            </p>
            <p>&copy; {currentYear} MiniCDWorld. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
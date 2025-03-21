import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white mt-auto pt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-3">MiniCDWorld</h3>
            <p className="text-secondary-300 max-w-md mb-4">
              Crea plantillas de CD impresionantes y listas para imprimir con medidas precisas.
              Sube tu arte, personaliza tu diseño y descarga un PDF profesional.
            </p>
            <div className="space-y-2">
              <Link to="/" className="text-secondary-300 hover:text-white block transition-colors">Inicio</Link>
              <Link to="/purchase" className="text-secondary-300 hover:text-white block transition-colors">Comprar</Link>
              <Link to="/nfc-tutorial" className="text-secondary-300 hover:text-white block transition-colors">Tutorial NFC</Link>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end mb-2">
              <p className="text-secondary-300 flex items-center">
                Hecho con <FaHeart className="text-red-500 mx-1" /> por Iñaki Zamores
              </p>
            </div>
            <p className="text-secondary-400 text-sm">&copy; {currentYear} MiniCDWorld. Todos los derechos reservados.</p>
            <p className="text-secondary-500 text-xs mt-1">Versión 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
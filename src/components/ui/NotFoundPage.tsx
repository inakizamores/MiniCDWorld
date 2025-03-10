import { Link } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'

const NotFoundPage = () => {
  return (
    <div className="py-16 text-center">
      <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 mb-6" />
      
      <h1 className="text-4xl font-bold mb-4">Página No Encontrada</h1>
      <p className="text-xl text-secondary-600 mb-8">
        Lo sentimos, no pudimos encontrar la página que estás buscando.
      </p>
      
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage 
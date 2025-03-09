import { Link } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'

const NotFoundPage = () => {
  return (
    <div className="py-16 text-center">
      <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 mb-6" />
      
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-secondary-600 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      
      <Link to="/" className="btn btn-primary">
        Go back home
      </Link>
    </div>
  )
}

export default NotFoundPage 
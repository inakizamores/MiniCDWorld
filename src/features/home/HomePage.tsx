import { useNavigate, Link } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf, FaArrowRight, FaShoppingCart, FaTag } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { resetTemplate } from '@features/template/templateSlice'
import { PACK_5_LLAVEROS, PACK_5_LLAVEROS_NFC, PACK_25_LLAVEROS, PACK_50_LLAVEROS } from '../../constants/productLinks'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Handler to reset template state and navigate to upload page
  const handleCreateTemplate = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }
  
  return (
    <div className="space-y-24">
      {/* Hero Section with gradient and animation */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 text-center relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl -z-10"></div>
        
        <div className="relative">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 mt-8">
              Crea Plantillas de <span className="gradient-text">CD Profesionales</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Genera plantillas de CD de alta calidad listas para imprimir con medidas precisas. 
              Sube tu arte, personaliza tu diseño y descarga un PDF listo para imprimir.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleCreateTemplate}
                className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2 group"
              >
                Crear Tu Plantilla
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#how-it-works" 
                className="btn btn-outline text-lg px-8 py-3"
              >
                Saber Más
              </a>
            </div>
            <div className="mt-4">
              <Link
                to="/purchase"
                className="btn btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2 inline-flex"
              >
                Compra los llaveros en blanco
                <FaShoppingCart className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works with hover effects */}
      <section id="how-it-works" className="py-16 bg-gradient-to-b from-white to-primary-50 rounded-none md:rounded-xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">¿Cómo Funciona?</h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Crea tu plantilla de CD personalizada en solo unos sencillos pasos
          </p>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaUpload className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Sube Tu Arte</h3>
              <p className="text-secondary-600 leading-relaxed">
                Sube tus imágenes para la portada del CD, la contraportada y el disco. Nuestra herramienta admite todos los formatos comunes de imagen.
              </p>
            </div>
            
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaCrop className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Recorta y Posiciona</h3>
              <p className="text-secondary-600 leading-relaxed">
                Ajusta tus imágenes para que encajen perfectamente dentro de las dimensiones de la plantilla de CD. Nuestras herramientas de recorte inteligente lo hacen fácil.
              </p>
            </div>
            
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaFilePdf className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Genera e Imprime</h3>
              <p className="text-secondary-600 leading-relaxed">
                Descarga tu plantilla en PDF, lista para imprimir en papel tamaño carta. Resultados de alta calidad en cada impresión.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mercado Libre E-commerce Section */}
      <section id="shop-products" className="py-16 bg-secondary-50 mx-0 md:mx-4 px-4 rounded-none md:rounded-xl">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Compra Productos Mini CD World</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-6">
              Adquiere nuestros llaveros Mini CD oficiales desde nuestra tienda en Mercado Libre
            </p>
            <Link 
              to="/purchase" 
              className="btn btn-primary inline-flex items-center px-6 py-3"
            >
              Ver todos los productos <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1: Pack 5 Llaveros En Blanco */}
            <Link 
              to={PACK_5_LLAVEROS}
              target="_blank"
              rel="noopener noreferrer" 
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>5 Unidades</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 5 Llaveros En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Llaveros Mini CD en formato en blanco. Perfectos para personalización.
                </p>
                <div className="bg-[#F2D900] text-black px-4 py-2 rounded flex items-center justify-center mt-auto font-medium group-hover:shadow-[0_0_15px_rgba(242,217,0,0.7)] transition-all duration-300 group-hover:scale-[1.03]">
                  <img src="/images/icons/MercadoLibreIcon.png" alt="Mercado Libre" className="w-7 h-7 mr-2" />
                  Comprar ahora
                </div>
              </div>
            </Link>
            
            {/* Product 2: Pack 5 Llaveros NFC En Blanco */}
            <Link 
              to={PACK_5_LLAVEROS_NFC}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>5 Unidades + NFC</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 5 Llaveros NFC En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Llaveros Mini CD con tecnología NFC. Vincula digitalmente a tu música.
                </p>
                <div className="bg-[#F2D900] text-black px-4 py-2 rounded flex items-center justify-center mt-auto font-medium group-hover:shadow-[0_0_15px_rgba(242,217,0,0.7)] transition-all duration-300 group-hover:scale-[1.03]">
                  <img src="/images/icons/MercadoLibreIcon.png" alt="Mercado Libre" className="w-7 h-7 mr-2" />
                  Comprar ahora
                </div>
              </div>
            </Link>
            
            {/* Product 3: Pack 25 Llaveros En Blanco */}
            <Link 
              to={PACK_25_LLAVEROS}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>25 Unidades</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 25 Llaveros En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Pack de 25 llaveros Mini CD en blanco. Ideal para eventos y promociones.
                </p>
                <div className="bg-[#F2D900] text-black px-4 py-2 rounded flex items-center justify-center mt-auto font-medium group-hover:shadow-[0_0_15px_rgba(242,217,0,0.7)] transition-all duration-300 group-hover:scale-[1.03]">
                  <img src="/images/icons/MercadoLibreIcon.png" alt="Mercado Libre" className="w-7 h-7 mr-2" />
                  Comprar ahora
                </div>
              </div>
            </Link>
            
            {/* Product 4: Pack 50 Llaveros En Blanco */}
            <Link 
              to={PACK_50_LLAVEROS}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>50 Unidades</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 50 Llaveros En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Pack mayorista de 50 llaveros Mini CD en blanco. El mejor valor para pedidos grandes.
                </p>
                <div className="bg-[#F2D900] text-black px-4 py-2 rounded flex items-center justify-center mt-auto font-medium group-hover:shadow-[0_0_15px_rgba(242,217,0,0.7)] transition-all duration-300 group-hover:scale-[1.03]">
                  <img src="/images/icons/MercadoLibreIcon.png" alt="Mercado Libre" className="w-7 h-7 mr-2" />
                  Comprar ahora
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section with gradient background */}
      <section className="py-16 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white mx-0 md:mx-4 px-4 shadow-lg rounded-none md:rounded-xl">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">¿Listo para Crear tu Plantilla de CD?</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Comienza a diseñar tus plantillas de CD personalizadas hoy con nuestra herramienta fácil de usar
          </p>
          <button 
            onClick={handleCreateTemplate}
            className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-10 py-3 shadow-lg hover:shadow-xl transition-all"
          >
            Empezar Ahora
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage 
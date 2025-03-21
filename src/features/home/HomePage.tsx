import { useNavigate, Link } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf, FaArrowRight, FaShoppingCart, FaTag, FaDownload } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { resetTemplate } from '@features/template/templateSlice'
import { PACK_5_LLAVEROS, PACK_5_LLAVEROS_NFC, PACK_25_LLAVEROS, PACK_50_LLAVEROS } from '../../constants/productLinks'
import { useState, useEffect } from 'react'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [blankTemplateModalOpen, setBlankTemplateModalOpen] = useState(false)
  
  // Effect to add/remove class to body when modal is open/closed
  useEffect(() => {
    if (blankTemplateModalOpen) {
      // When modal opens
      document.body.classList.add('modal-open');
    } else {
      // When modal closes
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [blankTemplateModalOpen]);
  
  // Handler to reset template state and navigate to upload page
  const handleCreateTemplate = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }

  // Handler to open the blank template modal
  const openBlankTemplateModal = () => {
    setBlankTemplateModalOpen(true);
  }

  // Handler to close the blank template modal
  const closeBlankTemplateModal = () => {
    setBlankTemplateModalOpen(false);
  }
  
  // Render blank template modal
  const renderBlankTemplateModal = () => {
    if (!blankTemplateModalOpen) return null;
    
    // Function to handle clicks on the overlay (area outside modal)
    const handleOverlayClick = (e: React.MouseEvent) => {
      // If the clicked element is the overlay itself, close the modal
      if (e.target === e.currentTarget) {
        closeBlankTemplateModal();
      }
    };
    
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4" 
        onClick={handleOverlayClick}
      >
        <div className="relative bg-white rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-4xl w-full max-h-[85vh] overflow-y-auto animate-scaleIn">
          <button 
            onClick={closeBlankTemplateModal}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-secondary-400 hover:text-secondary-600 z-10"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-700">Plantilla Mini CD en Blanco</h2>
            <p className="text-lg text-secondary-600 mb-6">
              Descarga nuestra plantilla completamente en blanco con las medidas exactas para crear tus propios diseños de Mini CD desde cero.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/images/templates/MCDK_BLANK_TEMPLATE.png" 
                  alt="Vista previa de plantilla en blanco" 
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Características:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Medidas exactas para impresión perfecta
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Formato US Letter (tamaño carta)
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Guías de recorte incluidas
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Compatible con cualquier software de edición
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="/images/templates/MCDK_BLANK_TEMPLATE.pdf" 
                    download="MCDK_BLANK_TEMPLATE.pdf"
                    className="btn btn-primary py-3 px-6 flex items-center justify-center"
                  >
                    <FaFilePdf className="mr-2" /> Descargar PDF
                  </a>
                  <a 
                    href="/images/templates/MCDK_BLANK_TEMPLATE.png" 
                    download="MCDK_BLANK_TEMPLATE.png"
                    className="btn btn-secondary py-3 px-6 flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" /> Descargar PNG
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
              <h4 className="font-bold text-secondary-800 mb-2">Consejo para la impresión:</h4>
              <p className="text-secondary-600">
                Para mejores resultados, imprima en papel fotográfico o papel de alta calidad a tamaño real (100%), sin ajustar a la página.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
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
          
          <div className="mt-10 border-t border-primary-400 pt-8">
            <h3 className="text-2xl font-bold mb-3 text-white">¿Prefieres hacerlo tú mismo?</h3>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-6">
              También tenemos una versión en blanco de la plantilla para que puedas personalizarla completamente por tu cuenta
            </p>
            <button 
              onClick={openBlankTemplateModal}
              className="btn bg-primary-50 text-primary-700 hover:bg-white text-lg px-8 py-3 shadow-md hover:shadow-lg transition-all"
            >
              Ver Plantilla en Blanco <FaDownload className="ml-2 inline-block" />
            </button>
          </div>
        </div>
      </section>

      {/* Render blank template modal */}
      {renderBlankTemplateModal()}
    </div>
  )
}

export default HomePage 
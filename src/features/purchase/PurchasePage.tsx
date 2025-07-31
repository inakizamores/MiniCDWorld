import React, { useState, useEffect } from 'react';
import { 
  FaTag, 
  FaCheckCircle, 
  FaCreditCard, 
  FaTruck, 
  FaQuestionCircle,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaBan
} from 'react-icons/fa';
import { PACK_5_LLAVEROS_NFC, PACK_10_LLAVEROS_NFC, PACK_20_LLAVEROS_NFC, PACK_30_LLAVEROS_NFC, PACK_40_LLAVEROS_NFC, PACK_5_LLAVEROS_NFC_FULL, isInStock } from '../../constants/productLinks';
import { Link } from 'react-router-dom';

const PurchasePage: React.FC = () => {
  // Estado para las preguntas frecuentes expandidas
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Estado para el producto seleccionado para el modal
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  
  // Efecto para agregar/quitar la clase al body cuando el modal está abierto/cerrado
  useEffect(() => {
    if (selectedProduct !== null) {
      // Cuando se abre el modal
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      // Cuando se cierra el modal
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    
    // Limpieza cuando el componente se desmonta
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);
  
  // Lista de productos
  const products = [
    {
      id: 1,
      title: "Pack 5 Llaveros En Blanco con NFC",
      description: "Llaveros Mini CD con tecnología NFC. Vincula digitalmente a tu música.",
      detailedDescription: "Combina lo físico con lo digital con nuestros llaveros Mini CD con chip NFC integrado. Programa fácilmente cada llavero para abrir enlaces web, playlists, perfiles de artistas o cualquier contenido digital cuando los escanean con un smartphone.",
      features: [
        "5 unidades con chip NFC",
        "Material: Acrílico de alta calidad",
        "Chip NFC reprogramable",
        "Compatible con la mayoría de smartphones",
        "Incluye guía de programación"
      ],
      price: "$349 MXN",
      url: PACK_5_LLAVEROS_NFC,
      badge: "5 Unidades + NFC",
      shipping: "Envío gratis por Mercado Envíos FULL",
      inStock: isInStock('PACK_5_LLAVEROS_NFC'),
      imageSrc: "/images/products/5PZ-NFC.jpg"
    },
    {
      id: 2,
      title: "Pack 10 Llaveros En Blanco con NFC",
      description: "Pack de 10 llaveros Mini CD con tecnología NFC. Ideal para proyectos medianos.",
      detailedDescription: "Perfecto para proyectos medianos, este pack de 10 llaveros Mini CD con NFC te ofrece una cantidad ideal para grupos pequeños o eventos. Cada llavero incluye chip NFC para vincular contenido digital, creando recuerdos únicos o artículos promocionales interactivos.",
      features: [
        "10 unidades con chip NFC",
        "Material: Acrílico de alta calidad",
        "Tamaño exacto de Mini CD",
        "Chips NFC reprogramables",
        "Compatible con la mayoría de smartphones",
        "Ideal para grupos pequeños"
      ],
      price: "$599 MXN",
      url: PACK_10_LLAVEROS_NFC,
      badge: "10 Unidades + NFC",
      shipping: "Envío gratis por Mercado Envíos FULL",
      inStock: isInStock('PACK_10_LLAVEROS_NFC'),
      imageSrc: "/images/products/10PZ-NFC.jpg"
    },
    {
      id: 3,
      title: "Pack 20 Llaveros En Blanco con NFC",
      description: "Pack de 20 llaveros Mini CD con tecnología NFC. Ideal para eventos y promociones.",
      detailedDescription: "Perfecto para eventos, promociones o tiendas, este pack de 20 llaveros Mini CD con NFC te ofrece la cantidad ideal para proyectos más grandes. Cada llavero incluye chip NFC para vincular contenido digital, creando recuerdos únicos o artículos promocionales interactivos.",
      features: [
        "20 unidades con chip NFC",
        "Material: Acrílico de alta calidad",
        "Tamaño exacto de Mini CD",
        "Chips NFC reprogramables",
        "Compatible con la mayoría de smartphones",
        "Ideal para merchandising interactivo"
      ],
      price: "$999 MXN",
      url: PACK_20_LLAVEROS_NFC,
      badge: "20 Unidades + NFC",
      shipping: "Envío gratis por Mercado Envíos FULL",
      inStock: isInStock('PACK_20_LLAVEROS_NFC'),
      imageSrc: "/images/products/20PZ-NFC.jpg"
    },
    {
      id: 4,
      title: "Pack 30 Llaveros En Blanco con NFC",
      description: "Pack de 30 llaveros Mini CD con tecnología NFC. Excelente para eventos grandes.",
      detailedDescription: "Ideal para eventos grandes, festivales o lanzamientos musicales. Este pack de 30 llaveros con tecnología NFC es perfecto para proyectos de gran escala. Cada llavero mantiene la misma calidad premium e incluye chip NFC para vincular contenido digital.",
      features: [
        "30 unidades con chip NFC",
        "Material: Acrílico de alta calidad",
        "Excelente precio por unidad",
        "Chips NFC reprogramables",
        "Compatible con la mayoría de smartphones",
        "Ideal para eventos grandes"
      ],
      price: "$1,399 MXN",
      url: PACK_30_LLAVEROS_NFC,
      badge: "30 Unidades + NFC",
      shipping: "Envío gratis por Mercado Envíos FULL",
      inStock: isInStock('PACK_30_LLAVEROS_NFC'),
      imageSrc: "/images/products/30PZ-NFC.jpg"
    },
    {
      id: 5,
      title: "Pack 40 Llaveros En Blanco con NFC",
      description: "Gran pack de 40 llaveros Mini CD con NFC. Mejor precio por unidad.",
      detailedDescription: "Nuestra opción más económica por unidad. Este pack de 40 llaveros con tecnología NFC es perfecto para proyectos grandes, festivales, lanzamientos musicales o tiendas. Cada llavero mantiene la misma calidad premium e incluye chip NFC para vincular contenido digital, todo con un increíble precio por volumen.",
      features: [
        "40 unidades con chip NFC",
        "Material: Acrílico de alta calidad",
        "Mejor precio por unidad",
        "Chips NFC reprogramables",
        "Compatible con la mayoría de smartphones",
        "Ideal para producciones a gran escala"
      ],
      price: "$1,799 MXN",
      url: PACK_40_LLAVEROS_NFC,
      badge: "40 Unidades + NFC",
      shipping: "Envío gratis por Mercado Envíos FULL",
      inStock: isInStock('PACK_40_LLAVEROS_NFC'),
      imageSrc: "/images/products/40PZ-NFC.jpg"
    },
    {
      id: 6,
      title: "Pack 5 Llaveros En Blanco con NFC - Envío FULL",
      description: "Llaveros Mini CD con tecnología NFC y envío FULL de Mercado Libre.",
      detailedDescription: "Combina lo físico con lo digital con nuestros llaveros Mini CD con chip NFC integrado y envío FULL de Mercado Libre. Programa fácilmente cada llavero para abrir enlaces web, playlists, perfiles de artistas o cualquier contenido digital cuando los escanean con un smartphone.",
      features: [
        "5 unidades con chip NFC",
        "Material: Acrílico de alta calidad",
        "Chip NFC reprogramable",
        "Compatible con la mayoría de smartphones",
        "Incluye guía de programación",
        "Envío FULL de Mercado Libre"
      ],
      price: "$349 MXN",
      url: PACK_5_LLAVEROS_NFC_FULL,
      badge: "5 Unidades + NFC + FULL",
      shipping: "Envío gratis por Mercado Envíos FULL",
      inStock: isInStock('PACK_5_LLAVEROS_NFC_FULL'),
      imageSrc: "/images/products/5PZ-NFC-FULL.jpg"
    }
  ];
  
  // Lista de preguntas frecuentes
  const faqs = [
    {
      question: "¿Qué son los llaveros Mini CD?",
      answer: "Los llaveros Mini CD son réplicas en miniatura de discos compactos que funcionan como llaveros. Tienen el tamaño exacto de un Mini CD y están diseñados para ser personalizados con nuestras plantillas. Son perfectos para fans de la música, coleccionistas, o como artículos promocionales."
    },
    {
      question: "¿Cómo personalizo mis llaveros?",
      answer: "Puedes personalizar tus llaveros utilizando nuestro generador de plantillas gratuito. Simplemente crea tu diseño, imprime la plantilla, recorta siguiendo las marcas y coloca el diseño en el llavero. Para mejores resultados, recomendamos usar papel fotográfico o adhesivo."
    },
    {
      question: "¿Cómo funcionan los llaveros con NFC?",
      answer: "Los llaveros con NFC contienen un chip que puede ser programado para abrir un enlace web cuando se escanea con un smartphone compatible. Puedes vincularlos a playlists de Spotify, perfiles de artistas, páginas web, o cualquier contenido digital que desees.",
      linkTo: "/nfc-tutorial",
      linkText: "Ver tutorial completo"
    },
    {
      question: "¿Cómo configuro un llavero con NFC?",
      answer: "Para configurar tu llavero NFC, necesitarás la aplicación NFC Tools disponible tanto para Android como iOS. Hemos creado un tutorial paso a paso que puedes encontrar en nuestra sección de Tutorial NFC. Allí explicamos todo el proceso de forma detallada con enlaces a las aplicaciones necesarias.",
      linkTo: "/nfc-tutorial",
      linkText: "Ver tutorial completo"
    }
  ];
  
  // Función para abrir el modal del producto
  const openProductModal = (productId: number) => {
    setSelectedProduct(productId);
  };
  
  // Función para cerrar el modal
  const closeProductModal = () => {
    setSelectedProduct(null);
  };
  
  // Renderizado del modal de producto
  const renderProductModal = () => {
    if (selectedProduct === null) return null;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return null;
    
    // Función para manejar clics en el overlay (área fuera del modal)
    const handleOverlayClick = (e: React.MouseEvent) => {
      // Si el elemento clickeado es el overlay mismo, cerrar el modal
      if (e.target === e.currentTarget) {
        closeProductModal();
      }
    };
    
    return (
      <div 
        className="fixed inset-0 z-[9999] modal-overlay flex items-center justify-center p-4 bg-black bg-opacity-80 animate-fadeIn" 
        onClick={handleOverlayClick}
      >
        <div className="relative bg-secondary-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto animate-scaleIn">
          <button 
            onClick={closeProductModal}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-secondary-400 hover:text-secondary-600 z-10"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row">
            {/* Imagen del producto */}
            <div className="md:w-2/5 bg-secondary-100 p-5 md:p-8 flex items-center justify-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
              <img 
                src={product.imageSrc} 
                alt={product.title} 
                className="w-full max-w-xs object-contain"
              />
            </div>
            
            {/* Detalles del producto */}
            <div className="md:w-3/5 p-6 md:p-8">
              <div className="mb-3 md:mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
                {product.inStock ? (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                    En stock
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    <FaBan className="mr-1 text-xs" /> Agotado
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{product.title}</h2>
              <p className="text-secondary-600 mb-4 md:mb-6 text-sm md:text-base">{product.detailedDescription}</p>
              
              <div className="mb-4 md:mb-6">
                <h3 className="font-bold text-base md:text-lg mb-2 md:mb-3">Características:</h3>
                <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {product.title.includes("NFC") && (
                <div className="bg-primary-50 p-4 rounded-lg mb-4 border border-primary-100">
                  <p className="text-primary-800 text-sm">
                    <strong>¿Cómo programar el chip NFC?</strong> Aprende a vincular música, playlists o cualquier contenido digital a tus llaveros.
                  </p>
                  <Link 
                    to="/nfc-tutorial"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-flex items-center"
                  >
                    Ver tutorial completo <FaArrowRight className="ml-1 text-xs" />
                  </Link>
                </div>
              )}
              
              {product.inStock ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center py-2 bg-[#F2D900] text-black font-medium rounded shadow-md hover:shadow-lg transition-all hover:shadow-[0_0_12px_rgba(242,217,0,0.5)] hover:scale-[1.02]"
                >
                  <img src="/images/icons/MercadoLibreIcon.png" alt="Mercado Libre" className="w-6 h-6 mr-2" /> Comprar ahora
                </a>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center py-2 bg-gray-200 text-gray-500 font-medium rounded cursor-not-allowed"
                >
                  <FaBan className="mr-2" /> Agotado
                </button>
              )}
              
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-secondary-200">
                <div className="flex items-center text-secondary-600 mb-1 md:mb-2 text-sm md:text-base">
                  <FaTruck className="mr-2 text-primary-500 flex-shrink-0" />
                  <span>{product.shipping}</span>
                </div>
                <div className="flex items-center text-secondary-600 text-sm md:text-base">
                  <FaCreditCard className="mr-2 text-primary-500 flex-shrink-0" />
                  <span>Múltiples métodos de pago disponibles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Productos Mini CD World <span className="text-xl md:text-2xl text-secondary-600 block mt-2">Disponibles exclusivamente en Mercado Libre</span></h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
          Descubre nuestra colección de llaveros Mini CD, el regalo perfecto para amantes de la música.
          Personalízalos con tus diseños favoritos o aprovecha nuestra tecnología NFC. 
          <span className="block mt-2 font-medium">Todas las compras se realizan de forma segura a través de Mercado Libre.</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#productos" className="btn btn-primary">
            Ver productos
          </a>
          <a href="/" className="btn btn-outline">
            Crear plantillas
          </a>
        </div>
      </div>
      
      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-primary-50 p-8 rounded-lg text-center">
          <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
            <FaCheckCircle className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Alta Calidad</h3>
          <p className="text-secondary-600">
            Fabricados con materiales premium y acabados profesionales para una larga durabilidad.
          </p>
        </div>
        
        <div className="bg-primary-50 p-8 rounded-lg text-center">
          <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
            <FaTruck className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Envío Gratis</h3>
          <p className="text-secondary-600">
            Enviamos a todo México con entrega rápida y seguimiento en línea sin costo adicional.
          </p>
        </div>
        
        <div className="bg-primary-50 p-8 rounded-lg text-center">
          <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
            <FaCreditCard className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Compra Segura</h3>
          <p className="text-secondary-600">
            Realiza tu compra con confianza a través de Mercado Libre con múltiples métodos de pago.
            Todas las transacciones son procesadas por Mercado Libre.
          </p>
        </div>
      </div>
      
      {/* Productos */}
      <div id="productos" className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nuestros Productos <span className="text-xl font-normal text-secondary-600 ml-2">| Compra segura por Mercado Libre</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>{product.badge}</span>
                <FaTag />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-secondary-50 rounded-lg mb-4 p-4 flex items-center justify-center">
                  <img 
                    src={product.imageSrc} 
                    alt={product.title}
                    className="h-40 object-contain"
                  />
                </div>
                
                <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                <p className="text-secondary-600 mb-4 flex-grow">{product.description}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-green-600">{product.shipping}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openProductModal(product.id)}
                      className="btn btn-outline flex-1 text-sm"
                    >
                      Ver detalles
                    </button>
                    {product.inStock ? (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#F2D900] text-black px-4 py-2 rounded flex-1 text-sm flex items-center justify-center font-medium hover:shadow-[0_0_12px_rgba(242,217,0,0.65)] transition-all duration-300 hover:scale-[1.02]"
                      >
                        <img src="/images/icons/MercadoLibreIcon.png" alt="Mercado Libre" className="w-6 h-6 mr-1" /> Comprar
                      </a>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-500 px-4 py-2 rounded flex-1 text-sm cursor-not-allowed"
                      >
                        <FaBan className="mr-2" /> Agotado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA - Creación de plantillas */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 md:p-12 text-white mb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold mb-4 text-white">¿Quieres personalizar tus llaveros?</h2>
            <p className="text-xl opacity-90 mb-6">
              Utiliza nuestro generador de plantillas gratuito para crear diseños personalizados 
              para tus llaveros Mini CD. Solo sube tus imágenes, ajusta el diseño y descarga el PDF listo para imprimir.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-50 hover:scale-105 transition-all duration-300"
            >
              Crear plantilla ahora <FaArrowRight className="ml-2" />
            </a>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <a href="/" className="group block cursor-pointer">
              <div className="bg-white p-2 rounded-lg shadow-xl transform rotate-3 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-105 group-hover:shadow-2xl">
                <img 
                  src="/images/products/ejemplo1.jpg" 
                  alt="Ejemplo de llaveros Mini CD personalizados"
                  className="rounded w-full max-w-xs"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Preguntas frecuentes */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-secondary-200 rounded-lg overflow-hidden"
            >
              <button 
                className="w-full p-4 text-left flex items-center justify-between bg-white hover:bg-secondary-50 transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span className="font-medium text-lg flex items-center">
                  <FaQuestionCircle className="text-primary-500 mr-3 flex-shrink-0" />
                  {faq.question}
                </span>
                {expandedFaq === index ? (
                  <FaMinus className="text-secondary-400" />
                ) : (
                  <FaPlus className="text-secondary-400" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 bg-secondary-50 border-t border-secondary-200">
                  <p className="text-secondary-700">{faq.answer}</p>
                  {faq.linkTo && (
                    <Link
                      to={faq.linkTo}
                      className="text-primary-600 hover:text-primary-700 font-medium mt-3 inline-flex items-center"
                    >
                      {faq.linkText} <FaArrowRight className="ml-1 text-xs" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Renderizar modal de producto si está abierto */}
      {renderProductModal()}
    </div>
  );
};

export default PurchasePage;
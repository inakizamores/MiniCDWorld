import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaDownload, FaCheckCircle, FaMobileAlt, FaLink } from 'react-icons/fa';

const NFCTutorialPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Tutorial NFC <span className="text-xl md:text-2xl text-secondary-600 block mt-2">Programa tus llaveros con tecnología NFC</span></h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
          Aprende a programar tus llaveros Mini CD con NFC para vincular música, playlists, perfiles de artistas o cualquier contenido digital.
        </p>
      </div>
      
      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-primary-50 p-8 rounded-lg text-center">
          <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
            <FaMobileAlt className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Fácil de Usar</h3>
          <p className="text-secondary-600">
            Programa tus etiquetas NFC con cualquier smartphone compatible en cuestión de segundos.
          </p>
        </div>
        
        <div className="bg-primary-50 p-8 rounded-lg text-center">
          <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
            <FaLink className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Vincula Contenido</h3>
          <p className="text-secondary-600">
            Conecta tus llaveros Mini CD a tus playlists favoritas, perfiles de artistas o cualquier enlace web.
          </p>
        </div>
        
        <div className="bg-primary-50 p-8 rounded-lg text-center">
          <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
            <FaDownload className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Apps Gratuitas</h3>
          <p className="text-secondary-600">
            Usa aplicaciones gratuitas disponibles para iOS y Android para programar tus etiquetas NFC.
          </p>
        </div>
      </div>
      
      {/* Tutorial Section */}
      <div className="max-w-4xl mx-auto mb-16 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-primary-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Guía para programar una etiqueta NFC para reproducir música en streaming</h2>
        </div>
        
        <div className="p-6 md:p-8">
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary-700">Introducción</h3>
            <p className="text-secondary-700 leading-relaxed">
              Una etiqueta NFC es un pequeño chip que almacena datos y los transmite de forma inalámbrica al acercar un dispositivo compatible. Esta tecnología funciona sin batería, activándose al estar cerca del celular. En esta guía aprenderás cómo programarla para reproducir música de cualquier plataforma de streaming (como Spotify, Apple Music, YouTube Music, etc.) usando la aplicación <strong>NFC Tools</strong>.
            </p>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary-700">Requisitos y aplicaciones necesarias</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span><strong>Teléfono compatible con NFC:</strong> iOS o Android.</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span><strong>Etiqueta NFC:</strong> Cualquier etiqueta regrabable.</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>
                  <strong>App NFC Tools:</strong><br />
                  <a 
                    href="https://apps.apple.com/us/app/nfc-tools/id1252962749" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline inline-flex items-center mt-1"
                  >
                    Descargar para iOS <FaArrowRight className="ml-1 text-xs" />
                  </a><br />
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.wakdev.wdnfc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline inline-flex items-center mt-1"
                  >
                    Descargar para Android <FaArrowRight className="ml-1 text-xs" />
                  </a>
                </span>
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary-700">Pasos para programar la etiqueta NFC</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-primary-400 pl-4 py-1">
                <h4 className="font-bold text-lg mb-2">1. Instalar la aplicación NFC Tools</h4>
                <p className="text-secondary-700">
                  Descarga e instala <strong>NFC Tools</strong> desde el App Store (iOS) o Google Play Store (Android) utilizando los enlaces anteriores.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-400 pl-4 py-1">
                <h4 className="font-bold text-lg mb-2">2. Obtener el enlace de la música</h4>
                <p className="text-secondary-700">
                  Abre la app de tu plataforma de streaming favorita (por ejemplo, Spotify, Apple Music, YouTube Music). Busca la canción, álbum o playlist que deseas programar. Usa la opción <strong>Compartir</strong> para copiar el enlace.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-400 pl-4 py-1">
                <h4 className="font-bold text-lg mb-2">3. Programar la etiqueta NFC</h4>
                <p className="text-secondary-700">
                  Abre <strong>NFC Tools</strong> en tu dispositivo. Selecciona la pestaña <strong>Escribir</strong>. Toca <strong>Añadir un registro</strong> y elige la opción <strong>URL/Enlace</strong>. Pega el enlace copiado de tu plataforma de streaming. Toca <strong>Escribir</strong> y acerca la etiqueta NFC a tu teléfono para grabar la información.
                </p>
              </div>
              
              <div className="border-l-4 border-primary-400 pl-4 py-1">
                <h4 className="font-bold text-lg mb-2">4. Probar la etiqueta</h4>
                <p className="text-secondary-700">
                  Una vez programada, acerca el teléfono a la etiqueta. El dispositivo debería abrir automáticamente la app de streaming y reproducir la música vinculada.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-xl font-bold mb-4 text-primary-700">Conclusión</h3>
            <p className="text-secondary-700 leading-relaxed">
              Con estos pasos, habrás configurado exitosamente una etiqueta NFC para reproducir música desde cualquier plataforma de streaming. Este proceso es rápido y sencillo, permitiéndote compartir tus playlists o canciones favoritas de manera interactiva. ¡Disfruta de la tecnología NFC y lleva tu música a otro nivel!
            </p>
          </section>
        </div>
      </div>
      
      {/* Products CTA */}
      <div className="bg-secondary-50 rounded-xl p-8 md:p-12 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">¿Necesitas llaveros con NFC?</h2>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
          Todos nuestros packs de llaveros incluyen tecnología NFC. ¡Compra ahora y comienza a crear experiencias interactivas!
        </p>
        <Link 
          to="/purchase" 
          className="btn btn-primary px-8 py-3 inline-flex items-center"
        >
          Ver productos con NFC <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default NFCTutorialPage; 
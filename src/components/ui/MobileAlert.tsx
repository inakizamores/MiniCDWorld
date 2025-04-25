import { useState, useEffect } from 'react';
import { FaDesktop, FaCopy, FaTimes } from 'react-icons/fa';

const STORAGE_KEY = 'mobile-alert-dismissed';
const AUTO_DISMISS_TIMEOUT = 30000; // 30 segundos

const MobileAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    // Verificar si es un dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Verificar si el usuario ya cerró la alerta anteriormente
    const alertDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    // Mostrar alerta solo en dispositivos móviles y si no fue cerrada anteriormente
    if (isMobile && !alertDismissed) {
      // Pequeño retraso para no mostrar inmediatamente al cargar
      const timer = setTimeout(() => {
        setShowAlert(true);
        
        // Auto-cerrar después de 30 segundos
        setTimeout(() => {
          setShowAlert(false);
        }, AUTO_DISMISS_TIMEOUT);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Cuenta regresiva
  useEffect(() => {
    if (!showAlert) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [showAlert]);
  
  // Copiar la URL actual al portapapeles
  const copyUrlToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
      });
  };
  
  // Cerrar la alerta y guardar la preferencia
  const dismissAlert = () => {
    setShowAlert(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };
  
  if (!showAlert) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 animate-fadeIn">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">{timeLeft}s</span>
        <button 
          onClick={dismissAlert}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Cerrar alerta"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <FaDesktop className="h-6 w-6 text-primary-600" />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Experiencia mejorada en escritorio
          </h3>
          
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <p>Esta aplicación funciona bien en dispositivos móviles, pero la experiencia es mejor en un ordenador de escritorio.</p>
            
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={copyUrlToClipboard}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <span className="flex items-center gap-1.5">✓ Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-1.5" /> Copiar enlace para escritorio
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={dismissAlert}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors w-full sm:w-auto"
              >
                No mostrar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAlert; 
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que resetea el scroll al principio de la página cuando cambia la ruta
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando cambia la ruta, resetea el scroll al principio de la página
    window.scrollTo(0, 0);
  }, [pathname]);

  // Este componente no renderiza nada visible
  return null;
};

export default ScrollToTop; 
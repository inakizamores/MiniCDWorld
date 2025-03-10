import { useEffect } from 'react';

/**
 * Hook to handle dynamic viewport scaling based on device resolution
 */
const useViewportScaling = () => {
  useEffect(() => {
    // Function to update CSS variables based on viewport size
    const updateScaling = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      // Get the device pixel ratio
      const pixelRatio = window.devicePixelRatio || 1;
      
      let textScale = 1;
      let uiScale = 1;
      let spacingScale = 1;
      let fontSize = 16;
      
      // 4K+ screens
      if (width >= 3000) {
        textScale = 1.4;
        uiScale = 1.3;
        spacingScale = 1.3;
        fontSize = 18;
      } 
      // Very large screens (2560×1600, etc.)
      else if (width >= 2300 && width < 3000) {
        textScale = 1.2;
        uiScale = 1.15;
        spacingScale = 1.2;
        fontSize = 17;
      }
      // Large screens (1800-2299px)
      else if (width >= 1800 && width < 2300) {
        textScale = 1.1;
        uiScale = 1.05;
        spacingScale = 1.1;
        fontSize = 16;
      }
      // Default screens (1200-1799px)
      else if (width >= 1200 && width < 1800) {
        textScale = 1;
        uiScale = 1;
        spacingScale = 1;
        fontSize = 16;
      }
      // Small screens (768-1199px)
      else if (width >= 768 && width < 1200) {
        textScale = 0.95;
        uiScale = 0.95;
        spacingScale = 0.9;
        fontSize = 15;
      }
      // Mobile screens
      else {
        textScale = 0.85;
        uiScale = 0.9;
        spacingScale = 0.85;
        fontSize = 14;
      }
      
      // Adjust for unusual aspect ratios
      if (ratio > 2.1) { // Ultra-wide monitors
        textScale *= 0.9;
        spacingScale *= 1.1;
      } else if (ratio < 1) { // Portrait orientation
        textScale *= 0.9;
        uiScale *= 0.95;
      }
      
      // Adjust for high-DPI screens
      if (pixelRatio > 1.5) {
        textScale *= 1 + (pixelRatio - 1) * 0.1;
      }
      
      // Set CSS variables
      document.documentElement.style.setProperty('--text-scale', textScale.toString());
      document.documentElement.style.setProperty('--ui-scale', uiScale.toString());
      document.documentElement.style.setProperty('--spacing-scale', spacingScale.toString());
      document.documentElement.style.fontSize = `${fontSize}px`;
    };
    
    // Initial update
    updateScaling();
    
    // Update on resize
    window.addEventListener('resize', updateScaling);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateScaling);
    };
  }, []);
};

export default useViewportScaling; 
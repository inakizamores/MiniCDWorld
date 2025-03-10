// All dimensions in millimeters
export const DIMENSIONS = {
  // Front sections
  FRENTE_AFUERA: { width: 41, height: 41 },
  FRENTE_DENTRO: { width: 41, height: 41 },
  
  // Disc with circular dimensions
  DISCO: { 
    diameter: 40, 
    holeSize: 6 
  },
  
  // Back sections
  TRASERA_AFUERA: {
    main: { width: 50, height: 38 },
    side: { width: 4, height: 38 }
  },
  TRASERA_DENTRO: {
    main: { width: 50, height: 38 },
    side: { width: 4, height: 38 }
  },
  
  // US Letter in mm
  US_LETTER: {
    width: 215.9,
    height: 279.4
  },
  
  // Margins for the page
  PAGE_MARGIN: 12.7, // 0.5 inches
  
  // Component spacing
  COMPONENT_SPACING: 5,
}

// Aspect ratios for cropping validation
export const ASPECT_RATIOS = {
  FRENTE: 1, // 1:1 (square)
  TRASERA_MAIN: 50/38, // ~1.32:1
  TRASERA_SIDE: 4/38, // ~0.11:1
  DISCO: 1, // 1:1 (circle)
}

// Base conversion factor - will be adjusted by screen DPI
const BASE_PIXELS_PER_MM = 3.78;

// Get device pixel ratio to adjust scaling for high-DPI displays
const getDevicePixelRatio = (): number => {
  if (typeof window !== 'undefined' && window.devicePixelRatio) {
    // Device pixel ratio is available
    return window.devicePixelRatio;
  }
  return 1; // Default for SSR or if not available
};

// Calculate screen width-based scaling factor
const getScreenScalingFactor = (): number => {
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth;
    
    // Scale factor based on screen width
    if (screenWidth >= 3840) { // 4K displays
      return 1.5; // Increase size on 4K
    } else if (screenWidth >= 2560) { // 1440p displays
      return 1.0; // Reference size (looks good here)
    } else if (screenWidth >= 1920) { // 1080p displays
      return 0.9; 
    } else if (screenWidth <= 1440) { // MacBooks, smaller displays
      return 0.75; // Reduce size on small screens
    }
  }
  return 1; // Default fallback
};

// Dynamically calculated pixels per mm based on device and screen
export const getPixelsPerMM = (): number => {
  const dprFactor = 1 / Math.max(0.75, Math.min(getDevicePixelRatio(), 2)); // Normalize DPR impact
  const screenFactor = getScreenScalingFactor();
  
  return BASE_PIXELS_PER_MM * screenFactor * dprFactor;
};

// Function to convert mm to pixels for display
export const mmToPixels = (mm: number): number => {
  return mm * getPixelsPerMM();
};

// Function to convert pixels to mm for PDF
export const pixelsToMm = (pixels: number): number => {
  return pixels / getPixelsPerMM();
}; 
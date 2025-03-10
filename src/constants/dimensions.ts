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

// Pixel per mm conversion (used for preview)
export const PIXELS_PER_MM = 3.78;

// Function to convert mm to pixels for display
export const mmToPixels = (mm: number) => mm * PIXELS_PER_MM;

// Function to convert pixels to mm for PDF
export const pixelsToMm = (pixels: number) => pixels / PIXELS_PER_MM; 
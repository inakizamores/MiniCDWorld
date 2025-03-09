// Reorder the image types to move DISCO to the last position
const imageTypes = [
  { id: 'FRENTE_AFUERA', label: 'Front Outside', dimensions: '41mm × 41mm' },
  { id: 'FRENTE_DENTRO', label: 'Front Inside', dimensions: '41mm × 41mm' },
  { id: 'TRASERA_AFUERA_MAIN', label: 'Back Outside (Main)', dimensions: '50mm × 38mm' },
  { id: 'TRASERA_AFUERA_SIDE', label: 'Back Outside (Side)', dimensions: '4mm × 38mm' },
  { id: 'TRASERA_ADENTRO_SIDE', label: 'Back Inside (Side)', dimensions: '4mm × 38mm' },
  { id: 'TRASERA_ADENTRO_MAIN', label: 'Back Inside (Main)', dimensions: '50mm × 38mm' },
  // Moved to the end
  { id: 'DISCO', label: 'CD Disc', dimensions: '40mm diameter (6mm inner hole)' },
]; 
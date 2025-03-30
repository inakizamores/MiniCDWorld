import { jsPDF } from 'jspdf'
import { TemplateState } from '@features/template/templateSlice'
import { DIMENSIONS } from '@constants/dimensions'

// This augments the jsPDF type to include the polygon method
declare module 'jspdf' {
  interface jsPDF {
    polygon: (points: number[], style: string) => jsPDF;
  }
}

// Maximum image size in pixels (width or height) for optimizing file size
const MAX_IMAGE_DIMENSION = 1200;
// Maximum PDF size in bytes (50MB) to prevent browser issues
const MAX_PDF_SIZE = 50 * 1024 * 1024;

// Specific error types to provide better user feedback
export enum PDFErrorType {
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  IMAGE_PROCESS_ERROR = 'IMAGE_PROCESS_ERROR',
  CANVAS_SECURITY_ERROR = 'CANVAS_SECURITY_ERROR',
  PDF_SIZE_LIMIT_ERROR = 'PDF_SIZE_LIMIT_ERROR',
  PDF_GENERATION_ERROR = 'PDF_GENERATION_ERROR',
  MEMORY_ERROR = 'MEMORY_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class PDFError extends Error {
  type: PDFErrorType;
  
  constructor(message: string, type: PDFErrorType = PDFErrorType.UNKNOWN_ERROR) {
    super(message);
    this.type = type;
    this.name = 'PDFError';
  }
}

class PDFService {
  private createNewPDF() {
    try {
      // Create a new PDF with US Letter dimensions
      return new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
        compress: true // Enable compression for smaller file size
      })
    } catch (error) {
      console.error('Error creating PDF object:', error);
      throw new PDFError(
        'No se pudo inicializar el generador de PDF. Por favor, intente de nuevo.',
        PDFErrorType.PDF_GENERATION_ERROR
      );
    }
  }

  // Helper function to resize images to optimize PDF size
  private optimizeImage(imageDataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create an image to get dimensions
      const img = new Image();
      
      // Set timeout to handle stalled image loading
      const timeout = setTimeout(() => {
        reject(new PDFError(
          'Tiempo de espera agotado al cargar la imagen. La imagen puede ser demasiado grande o haber problemas de conexión.',
          PDFErrorType.IMAGE_LOAD_ERROR
        ));
      }, 15000); // 15 seconds timeout
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          // If image is small enough, return original
          if (img.width <= MAX_IMAGE_DIMENSION && img.height <= MAX_IMAGE_DIMENSION) {
            resolve(imageDataUrl);
            return;
          }

          // Calculate new dimensions while maintaining aspect ratio
          let newWidth = img.width;
          let newHeight = img.height;
          
          if (img.width > img.height && img.width > MAX_IMAGE_DIMENSION) {
            newWidth = MAX_IMAGE_DIMENSION;
            newHeight = (img.height * MAX_IMAGE_DIMENSION) / img.width;
          } else if (img.height > MAX_IMAGE_DIMENSION) {
            newHeight = MAX_IMAGE_DIMENSION;
            newWidth = (img.width * MAX_IMAGE_DIMENSION) / img.height;
          }

          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Draw and resize image on canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(imageDataUrl); // Fallback to original if canvas context fails
            return;
          }
          
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          try {
            // Get optimized image data
            // Use lower quality for JPEG compression (0.8 = 80% quality)
            const optimizedImage = canvas.toDataURL('image/jpeg', 0.8);
            resolve(optimizedImage);
          } catch (err) {
            // Handle security error (tainted canvas) from cross-origin images
            console.warn('Canvas security error, likely due to CORS:', err);
            reject(new PDFError(
              'Error de seguridad al procesar la imagen. La imagen puede provenir de otro dominio sin permisos CORS.',
              PDFErrorType.CANVAS_SECURITY_ERROR
            ));
          }
        } catch (error) {
          console.error('Error optimizing image:', error);
          reject(new PDFError(
            'Error al procesar la imagen. Intente con una imagen más pequeña o en otro formato.',
            PDFErrorType.IMAGE_PROCESS_ERROR
          ));
        }
      };
      
      img.onerror = (err) => {
        clearTimeout(timeout);
        // If optimization fails, reject with error
        console.warn('Image load failed:', err);
        reject(new PDFError(
          'No se pudo cargar la imagen. Verifique que la imagen esté en un formato válido.',
          PDFErrorType.IMAGE_LOAD_ERROR
        ));
      };
      
      try {
        img.src = imageDataUrl;
      } catch (error) {
        clearTimeout(timeout);
        reject(new PDFError(
          'Error al procesar la imagen. El formato puede no ser compatible.',
          PDFErrorType.IMAGE_LOAD_ERROR
        ));
      }
    });
  }

  private async drawImage(
    doc: jsPDF,
    imageDataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (!imageDataUrl) return

    try {
      // Optimize image before adding to PDF
      const optimizedImage = await this.optimizeImage(imageDataUrl);
      
      // jsPDF expects base64 data without the data URL prefix
      const base64Data = optimizedImage.split(',')[1]
      doc.addImage(base64Data, 'JPEG', x, y, width, height)
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      
      // Try with original image as fallback
      if (!(error instanceof PDFError && error.type === PDFErrorType.CANVAS_SECURITY_ERROR)) {
        try {
          // Fallback to original method if optimization fails
          const base64Data = imageDataUrl.split(',')[1]
          doc.addImage(base64Data, 'JPEG', x, y, width, height)
        } catch (fallbackError) {
          console.error('Fallback image addition also failed:', fallbackError);
          // Create a placeholder with error message instead of failing completely
          doc.setFillColor(240, 240, 240);
          doc.rect(x, y, width, height, 'F');
          doc.setTextColor(200, 0, 0);
          doc.setFontSize(8);
          doc.text('Error: Imagen no disponible', x + width/2, y + height/2, {align: 'center'});
        }
      } else {
        // For security errors, we need to show a placeholder
        doc.setFillColor(240, 240, 240);
        doc.rect(x, y, width, height, 'F');
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(8);
        doc.text('Error CORS: Imagen restringida', x + width/2, y + height/2, {align: 'center'});
        throw error; // Re-throw to handle at higher level
      }
    }
  }

  private drawCircle(
    doc: jsPDF,
    x: number,
    y: number,
    radius: number,
    filled: boolean = false
  ) {
    // Use built-in jsPDF circle method instead of polygon
    if (filled) {
      doc.setFillColor(0, 0, 0)
      doc.circle(x, y, radius, 'F')
    } else {
      doc.setDrawColor(0, 0, 0)
      doc.circle(x, y, radius, 'S')
    }
  }

  private async drawCircularImage(
    doc: jsPDF,
    imageDataUrl: string,
    centerX: number,
    centerY: number,
    diameter: number,
    holeSize: number
  ) {
    if (!imageDataUrl) return
    
    // First add the circular image
    await this.drawImage(
      doc, 
      imageDataUrl, 
      centerX - diameter / 2, 
      centerY - diameter / 2, 
      diameter, 
      diameter
    )
    
    // Then draw the center hole
    this.drawCircle(
      doc,
      centerX,
      centerY,
      holeSize / 2,
      true // filled black circle
    )
    
    // Draw outer circle (dotted line for cutting)
    doc.setDrawColor(0, 0, 0)
    doc.setLineDashPattern([1, 1], 0)
    this.drawCircle(
      doc,
      centerX,
      centerY,
      diameter / 2
    )
    doc.setLineDashPattern([], 0) // Reset line style
  }

  private drawRect(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    dashed: boolean = false
  ) {
    if (dashed) {
      doc.setDrawColor(0, 0, 0)
      doc.setLineDashPattern([1, 1], 0)
    } else {
      doc.setDrawColor(200, 200, 200) // Light gray
      doc.setLineWidth(0.2)
    }
    
    doc.rect(x, y, width, height, 'S')
    
    if (dashed) {
      doc.setLineDashPattern([], 0) // Reset line style
    }
    doc.setLineWidth(0.1) // Reset line width
  }
  
  private drawHeader(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    albumTitle: string,
    artistName: string
  ) {
    const headerHeight = 10
    
    // Draw header section
    doc.setDrawColor(255, 255, 255) // White (invisible border)
    doc.setLineWidth(0.1)
    doc.rect(x, y, width, headerHeight, 'S')
    
    // Left side text: MiniCDWorld US Letter Printable Template
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text('MiniCDWorld Plantilla Imprimible Tamaño Carta', x + 5, y + headerHeight/2 + 1)
    
    // Right side text: Album Title - Artist Name
    const rightText = `${albumTitle || 'Álbum sin título'} - ${artistName || 'Artista desconocido'}`
    doc.setFontSize(8)
    doc.text(rightText, x + width - 5, y + headerHeight/2 + 1, { align: 'right' })
    
    return headerHeight
  }
  
  private drawFooter(
    doc: jsPDF,
    x: number,
    y: number,
    width: number
  ) {
    const footerHeight = 8
    
    // Draw footer section
    doc.setDrawColor(255, 255, 255) // White (invisible border)
    doc.setLineWidth(0.1)
    doc.rect(x, y, width, footerHeight, 'S')
    
    // Footer text
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100) // Dark gray
    doc.text('Creado con la herramienta hecha por Iñaki Zamores y disponible en: https://mini-cd-world.vercel.app/', 
      x + 5, y + footerHeight/2 + 1, { align: 'left' })
    
    return footerHeight
  }
  
  private async drawCDBlock(
    doc: jsPDF,
    templateData: TemplateState,
    x: number,
    y: number,
    blockWidth: number,
    blockHeight: number
  ) {
    const { images } = templateData
    
    // Draw block outline
    this.drawRect(doc, x, y, blockWidth, blockHeight)
    
    // Set section title style
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    
    // Section spacing - reduced padding for tighter layout
    const sectionPadding = 5
    
    // Calculate y positions for different sections
    let currentY = y + sectionPadding
    
    // --- TOP ROW: FRONT COVER COMPONENTS (LEFT) AND CD DISC (RIGHT) ---
    
    // FRONT COVER COMPONENTS (LEFT SIDE)
    const frontSectionWidth = blockWidth * 0.6 // 60% of block width for front covers
    
    doc.text('Componentes de Portada', x + sectionPadding, currentY)
    currentY += 4
    
    // Position the front covers
    const frontCoverX = x + (frontSectionWidth - (DIMENSIONS.FRENTE_AFUERA.width + DIMENSIONS.FRENTE_DENTRO.width)) / 2
    
    // Draw crop outlines for front covers
    if (images.frenteAfuera?.croppedImage) {
      this.drawRect(doc, frontCoverX, currentY, DIMENSIONS.FRENTE_AFUERA.width, DIMENSIONS.FRENTE_AFUERA.height, true)
      await this.drawImage(
        doc,
        images.frenteAfuera.croppedImage,
        frontCoverX,
        currentY,
        DIMENSIONS.FRENTE_AFUERA.width,
        DIMENSIONS.FRENTE_AFUERA.height
      )
    }
    
    if (images.frenteDentro?.croppedImage) {
      this.drawRect(doc, frontCoverX + DIMENSIONS.FRENTE_AFUERA.width, currentY, DIMENSIONS.FRENTE_DENTRO.width, DIMENSIONS.FRENTE_DENTRO.height, true)
      await this.drawImage(
        doc,
        images.frenteDentro.croppedImage,
        frontCoverX + DIMENSIONS.FRENTE_AFUERA.width,
        currentY,
        DIMENSIONS.FRENTE_DENTRO.width,
        DIMENSIONS.FRENTE_DENTRO.height
      )
    }
    
    // CD DISC (RIGHT SIDE)
    const discSectionX = x + frontSectionWidth + sectionPadding
    const discSectionWidth = blockWidth - frontSectionWidth - sectionPadding * 2
    
    doc.text('Disco CD', discSectionX, y + sectionPadding)
    
    // Center the disc in its section
    if (images.disco?.croppedImage) {
      const discCenterX = discSectionX + discSectionWidth / 2
      const discCenterY = currentY + DIMENSIONS.DISCO.diameter / 2 + 4
      
      await this.drawCircularImage(
        doc,
        images.disco.croppedImage,
        discCenterX,
        discCenterY,
        DIMENSIONS.DISCO.diameter,
        DIMENSIONS.DISCO.holeSize
      )
    }
    
    // --- BOTTOM ROW: BACK COVER COMPONENTS ---
    
    // Move to back cover components section (below front covers and disc)
    currentY += Math.max(DIMENSIONS.FRENTE_AFUERA.height, DIMENSIONS.DISCO.diameter) + sectionPadding
    
    doc.text('Componentes de Contraportada', x + sectionPadding, currentY)
    currentY += 4
    
    // Center the back covers in the full width
    const backCoverFullWidth = DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + 
                             DIMENSIONS.TRASERA_DENTRO.side.width + DIMENSIONS.TRASERA_DENTRO.main.width
    const backCoverX = x + (blockWidth - backCoverFullWidth) / 2
    
    // Back Outside (Main + Side) with crop outlines
    if (images.traseraAfuera.main?.croppedImage) {
      this.drawRect(doc, backCoverX, currentY, DIMENSIONS.TRASERA_AFUERA.main.width, DIMENSIONS.TRASERA_AFUERA.main.height, true)
      await this.drawImage(
        doc,
        images.traseraAfuera.main.croppedImage,
        backCoverX,
        currentY,
        DIMENSIONS.TRASERA_AFUERA.main.width,
        DIMENSIONS.TRASERA_AFUERA.main.height
      )
    }
    
    if (images.traseraAfuera.side?.croppedImage) {
      this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width, currentY, DIMENSIONS.TRASERA_AFUERA.side.width, DIMENSIONS.TRASERA_AFUERA.side.height, true)
      await this.drawImage(
        doc,
        images.traseraAfuera.side.croppedImage,
        backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width,
        currentY,
        DIMENSIONS.TRASERA_AFUERA.side.width,
        DIMENSIONS.TRASERA_AFUERA.side.height
      )
    }
    
    // Back Inside (Side + Main) with crop outlines
    if (images.traseraDentro.side?.croppedImage) {
      this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width, currentY, 
        DIMENSIONS.TRASERA_DENTRO.side.width, DIMENSIONS.TRASERA_DENTRO.side.height, true)
      await this.drawImage(
        doc,
        images.traseraDentro.side.croppedImage,
        backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width,
        currentY,
        DIMENSIONS.TRASERA_DENTRO.side.width,
        DIMENSIONS.TRASERA_DENTRO.side.height
      )
    }
    
    if (images.traseraDentro.main?.croppedImage) {
      this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width, 
        currentY, DIMENSIONS.TRASERA_DENTRO.main.width, DIMENSIONS.TRASERA_DENTRO.main.height, true)
      await this.drawImage(
        doc,
        images.traseraDentro.main.croppedImage,
        backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width,
        currentY,
        DIMENSIONS.TRASERA_DENTRO.main.width,
        DIMENSIONS.TRASERA_DENTRO.main.height
      )
    }
  }

  public async generatePDF(templateData: TemplateState): Promise<Blob> {
    let doc: jsPDF | null = null;
    
    try {
      // Check if we have enough memory (rough estimate)
      const roughImageSizeEstimate = Object.values(templateData.images)
        .reduce((size, img) => {
          // Handle different types of image objects in the template
          if (typeof img === 'object' && img !== null) {
            if ('croppedImage' in img && img.croppedImage) {
              // Handle direct ImageSection objects
              return size + (img.croppedImage.length * 0.75); // base64 is ~33% larger than binary
            } else if ('main' in img || 'side' in img) {
              // Handle nested structure for trailer sections
              let nestedSize = 0;
              
              // Check main property
              if ('main' in img && img.main && 'croppedImage' in img.main && img.main.croppedImage) {
                nestedSize += img.main.croppedImage.length * 0.75;
              }
              
              // Check side property
              if ('side' in img && img.side && 'croppedImage' in img.side && img.side.croppedImage) {
                nestedSize += img.side.croppedImage.length * 0.75;
              }
              
              return size + nestedSize;
            }
          }
          return size;
        }, 0);
      
      // If rough estimate exceeds threshold, warn about potential issues
      if (roughImageSizeEstimate > MAX_PDF_SIZE) {
        console.warn('Warning: PDF may exceed size limits, could cause performance issues');
      }
      
      doc = this.createNewPDF();
      const { cdsPerPage: rawCdsPerPage, albumTitle, artistName } = templateData;
      
      // Ensure cdsPerPage is only 1 or 2
      const cdsPerPage = rawCdsPerPage > 2 ? 2 : rawCdsPerPage;
      
      // Get page dimensions and calculate margins
      const pageWidth = DIMENSIONS.US_LETTER.width;
      const pageHeight = DIMENSIONS.US_LETTER.height;
      const margin = DIMENSIONS.PAGE_MARGIN;
      
      // Calculate available area
      const availWidth = pageWidth - 2 * margin;
      const availHeight = pageHeight - 2 * margin;
      
      // HEADER
      const headerHeight = this.drawHeader(doc, margin, margin, availWidth, albumTitle, artistName);
      
      // FOOTER
      const footerHeight = this.drawFooter(doc, margin, pageHeight - margin - 8, availWidth);
      
      // Calculate available area for CD blocks
      const blocksAreaHeight = availHeight - headerHeight - footerHeight;
      
      // Calculate block dimensions
      const blockHeight = blocksAreaHeight / (cdsPerPage === 1 ? 1 : 2);
      const blockPadding = 10; // padding between blocks
      
      try {
        if (cdsPerPage === 1) {
          // Draw single CD block centered
          await this.drawCDBlock(
            doc,
            templateData,
            margin,
            margin + headerHeight + blockPadding,
            availWidth,
            blockHeight - blockPadding * 2
          );
        } else {
          // Draw first CD block
          await this.drawCDBlock(
            doc, 
            templateData,
            margin, 
            margin + headerHeight + blockPadding / 2,
            availWidth,
            blockHeight - blockPadding
          );
          
          // Draw second CD block (identical to first)
          await this.drawCDBlock(
            doc,
            templateData,
            margin,
            margin + headerHeight + blockHeight,
            availWidth,
            blockHeight - blockPadding
          );
        }
      } catch (blockError) {
        console.error('Error drawing CD blocks:', blockError);
        
        // Add error explanation to PDF instead of failing completely
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(12);
        doc.text('Hubo un problema al generar algunas partes del PDF.', margin + availWidth/2, margin + headerHeight + 40, {align: 'center'});
        doc.setFontSize(10);
        doc.text('Por favor, verifica tus imágenes e intenta nuevamente.', margin + availWidth/2, margin + headerHeight + 50, {align: 'center'});
        
        if (blockError instanceof PDFError) {
          doc.text(`Error específico: ${blockError.message}`, margin + availWidth/2, margin + headerHeight + 60, {align: 'center'});
        }
      }
      
      // Set PDF metadata for better identification
      doc.setProperties({
        title: `${albumTitle || 'Mini CD World'} - Plantilla`,
        subject: 'Mini CD World Template',
        author: 'Mini CD World',
        keywords: 'mini, cd, template, plantilla',
        creator: 'Mini CD World Generator'
      });
      
      try {
        // Return the generated PDF as a blob
        const pdfBlob = doc.output('blob');
        
        // Check blob size limits
        if (pdfBlob.size > MAX_PDF_SIZE) {
          console.warn(`PDF size (${pdfBlob.size} bytes) exceeds recommended limit of ${MAX_PDF_SIZE} bytes`);
          // We still return it but log warning for potential issues
        }
        
        return pdfBlob;
      } catch (outputError) {
        console.error('Error creating PDF blob:', outputError);
        throw new PDFError(
          'Error al generar el archivo PDF. El archivo puede ser demasiado grande.',
          PDFErrorType.PDF_SIZE_LIMIT_ERROR
        );
      }
    } catch (error) {
      console.error('Error in PDF generation:', error);
      
      // Create a minimal error PDF if possible
      if (doc) {
        try {
          // Try to generate a simple error PDF
          doc.deletePage(1);
          doc.addPage();
          doc.setTextColor(200, 0, 0);
          doc.setFontSize(16);
          doc.text('Error al generar el PDF', 105, 50, {align: 'center'});
          doc.setFontSize(12);
          
          let errorMessage = 'Ocurrió un error inesperado.';
          let errorType = PDFErrorType.UNKNOWN_ERROR;
          
          if (error instanceof PDFError) {
            errorMessage = error.message;
            errorType = error.type;
          } else if (error instanceof Error) {
            errorMessage = `Error: ${error.message}`;
          }
          
          doc.text(errorMessage, 105, 70, {align: 'center'});
          doc.setFontSize(10);
          doc.text('Por favor, intente nuevamente o contacte a soporte.', 105, 85, {align: 'center'});
          
          return doc.output('blob');
        } catch (fallbackError) {
          console.error('Error creating fallback error PDF:', fallbackError);
        }
      }
      
      // If everything fails, propagate the error
      if (error instanceof PDFError) {
        throw error;
      } else if (error instanceof Error) {
        // Memory error detection based on error message patterns
        if (error.message.includes('out of memory') || 
            error.message.includes('allocation failed') ||
            error.message.includes('heap') ||
            error.message.toLowerCase().includes('memory')) {
          throw new PDFError(
            'No hay suficiente memoria para generar el PDF. Intente con menos imágenes o imágenes más pequeñas.',
            PDFErrorType.MEMORY_ERROR
          );
        }
        throw new PDFError(error.message, PDFErrorType.UNKNOWN_ERROR);
      }
      
      throw new PDFError(
        'Error desconocido al generar el PDF. Por favor, intente de nuevo.',
        PDFErrorType.UNKNOWN_ERROR
      );
    }
  }
}

export default new PDFService() 
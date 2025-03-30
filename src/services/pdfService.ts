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

// Progress tracking stages
export enum PDFGenerationStage {
  INITIALIZING = 'initializing',
  ANALYZING_IMAGES = 'analyzing_images',
  OPTIMIZING_IMAGES = 'optimizing_images',
  CREATING_PDF = 'creating_pdf',
  DRAWING_HEADER = 'drawing_header',
  DRAWING_FRONT_COVERS = 'drawing_front_covers',
  DRAWING_DISC = 'drawing_disc',
  DRAWING_BACK_COVERS = 'drawing_back_covers',
  DRAWING_FOOTER = 'drawing_footer',
  FINALIZING = 'finalizing',
  COMPLETE = 'complete',
  ERROR = 'error'
}

// Progress callback type
export type ProgressCallback = (progress: number, stage: PDFGenerationStage, detail?: string) => void;

// Specific error types to provide better user feedback
export enum PDFErrorType {
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  IMAGE_PROCESS_ERROR = 'IMAGE_PROCESS_ERROR',
  CANVAS_SECURITY_ERROR = 'CANVAS_SECURITY_ERROR',
  PDF_SIZE_LIMIT_ERROR = 'PDF_SIZE_LIMIT_ERROR',
  PDF_GENERATION_ERROR = 'PDF_GENERATION_ERROR',
  MEMORY_ERROR = 'MEMORY_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DEVICE_CAPABILITY_ERROR = 'DEVICE_CAPABILITY_ERROR',
  WORKER_ERROR = 'WORKER_ERROR',
  SERVICE_WORKER_ERROR = 'SERVICE_WORKER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class PDFError extends Error {
  type: PDFErrorType;
  detail?: any;
  recoverable: boolean;
  
  constructor(
    message: string, 
    type: PDFErrorType = PDFErrorType.UNKNOWN_ERROR, 
    detail?: any, 
    recoverable: boolean = false
  ) {
    super(message);
    this.type = type;
    this.detail = detail;
    this.recoverable = recoverable;
    this.name = 'PDFError';
  }
}

class PDFService {
  private webWorker: Worker | null = null;
  private workerPromises: Map<string, { resolve: Function, reject: Function }> = new Map();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private webpSupported: boolean | null = null;
  private deviceCapabilities: {
    isCapable: boolean,
    reason?: string,
    warnings: string[],
    memoryLimited: boolean
  } | null = null;
  
  constructor() {
    // Initialize service worker for PDF caching
    this.initServiceWorker();
    
    // Check WebP support
    this.checkWebPSupport();
    
    // Assess device capabilities
    this.assessDeviceCapabilities();
  }
  
  // Initialize service worker for PDF caching
  private async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/pdf-sw.js');
        console.log('PDF Service Worker registered:', this.serviceWorkerRegistration);
      } catch (error) {
        console.error('PDF Service Worker registration failed:', error);
      }
    }
  }
  
  // Initialize Web Worker for image processing
  private initWebWorker() {
    if (window.Worker && !this.webWorker) {
      try {
        this.webWorker = new Worker('/pdf-worker.js');
        
        // Set up message handling
        this.webWorker.onmessage = (event) => {
          if (event.data && event.data.id && this.workerPromises.has(event.data.id)) {
            const { resolve, reject } = this.workerPromises.get(event.data.id)!;
            
            if (event.data.status === 'success') {
              resolve(event.data.result);
            } else {
              reject(new PDFError(
                event.data.error?.message || 'Error en el trabajador web',
                PDFErrorType.WORKER_ERROR,
                event.data.error
              ));
            }
            
            this.workerPromises.delete(event.data.id);
          }
        };
        
        this.webWorker.onerror = (error) => {
          console.error('PDF Worker error:', error);
          // Resolve all pending promises with error
          this.workerPromises.forEach(({ reject }) => {
            reject(new PDFError(
              'Error en el procesamiento en segundo plano',
              PDFErrorType.WORKER_ERROR,
              error
            ));
          });
          this.workerPromises.clear();
          this.webWorker = null;
        };
        
        // Ping worker to ensure it's running
        this.callWorker('ping', {}).catch(error => {
          console.error('Worker ping failed:', error);
          this.webWorker = null;
        });
      } catch (error) {
        console.error('Failed to initialize web worker:', error);
        this.webWorker = null;
      }
    }
  }
  
  // Send a task to the Web Worker and return a promise
  private callWorker(action: string, data: any): Promise<any> {
    // Initialize worker if not already done
    if (!this.webWorker) {
      this.initWebWorker();
    }
    
    // If worker initialization failed or is not supported, throw error
    if (!this.webWorker) {
      return Promise.reject(new PDFError(
        'El procesamiento en segundo plano no está disponible',
        PDFErrorType.WORKER_ERROR
      ));
    }
    
    return new Promise((resolve, reject) => {
      // Generate unique ID for this request
      const id = `${action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store promise handlers
      this.workerPromises.set(id, { resolve, reject });
      
      // Send message to worker
      this.webWorker!.postMessage({ action, id, ...data });
      
      // Set timeout to prevent hanging promises
      setTimeout(() => {
        if (this.workerPromises.has(id)) {
          const handlers = this.workerPromises.get(id)!;
          handlers.reject(new PDFError(
            'Tiempo de espera agotado en el procesamiento en segundo plano',
            PDFErrorType.WORKER_ERROR
          ));
          this.workerPromises.delete(id);
        }
      }, 30000); // 30 second timeout
    });
  }
  
  // Check if WebP format is supported
  private async checkWebPSupport() {
    try {
      if (typeof createImageBitmap !== 'undefined') {
        // Modern method using createImageBitmap
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const webpData = canvas.toDataURL('image/webp');
          this.webpSupported = webpData.indexOf('data:image/webp') === 0;
        } else {
          this.webpSupported = false;
        }
      } else {
        // Fallback method
        const webpImg = new Image();
        webpImg.onload = () => { this.webpSupported = true; };
        webpImg.onerror = () => { this.webpSupported = false; };
        webpImg.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      }
    } catch (error) {
      console.error('WebP support check failed:', error);
      this.webpSupported = false;
    }
  }
  
  // Detect network connectivity
  private checkNetworkConnectivity(): boolean {
    return navigator.onLine;
  }
  
  // Assess device capabilities for PDF generation
  private assessDeviceCapabilities() {
    try {
      const warnings: string[] = [];
      let isCapable = true;
      let reason: string | undefined;
      let memoryLimited = false;
      
      // Check for required browser features
      const requiredFeatures = {
        blob: typeof Blob !== 'undefined',
        urlCreateObject: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
        canvas: typeof document !== 'undefined' && typeof document.createElement === 'function',
      };
      
      // Check if any required features are missing
      const missingFeatures = Object.entries(requiredFeatures)
        .filter(([_, hasFeature]) => !hasFeature)
        .map(([name]) => name);
        
      if (missingFeatures.length > 0) {
        isCapable = false;
        reason = `Navegador no compatible. Características faltantes: ${missingFeatures.join(', ')}`;
      }
      
      // Check device memory (if available)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        if (memory && memory < 4) {
          warnings.push(`Memoria del dispositivo limitada (${memory}GB)`);
          memoryLimited = true;
        }
      }
      
      // Check for low-memory devices based on user agent
      const userAgent = navigator.userAgent.toLowerCase();
      if (
        /iphone|ipod|android 4|android 5|android 6/.test(userAgent) || 
        (/ipad/.test(userAgent) && !/ipad pro/.test(userAgent))
      ) {
        warnings.push('Dispositivo potencialmente con memoria limitada');
        memoryLimited = true;
      }
      
      // Save capabilities assessment
      this.deviceCapabilities = {
        isCapable,
        reason,
        warnings,
        memoryLimited
      };
      
      return this.deviceCapabilities;
    } catch (error) {
      console.error('Error assessing device capabilities:', error);
      return {
        isCapable: true, // Assume capable by default
        warnings: ['Error al evaluar capacidades del dispositivo'],
        memoryLimited: false
      };
    }
  }
  
  // Get optimal image format based on browser support
  private getOptimalImageFormat(): string {
    return this.webpSupported ? 'image/webp' : 'image/jpeg';
  }
  
  // Get optimal image quality based on device capabilities
  private getOptimalImageQuality(): number {
    if (this.deviceCapabilities?.memoryLimited) {
      return 0.7; // Lower quality for limited memory devices
    }
    return 0.85; // Higher quality for capable devices
  }

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

  // Helper function to resize images to optimize PDF size - now with web worker support
  private async optimizeImage(imageDataUrl: string): Promise<string> {
    if (!imageDataUrl) {
      throw new PDFError(
        'Imagen no proporcionada para optimización',
        PDFErrorType.IMAGE_LOAD_ERROR
      );
    }
    
    try {
      // First try with web worker if available
      if (this.webWorker) {
        try {
          const result = await this.callWorker('optimizeImage', {
            imageDataUrl,
            preferredFormat: this.getOptimalImageFormat(),
            quality: this.getOptimalImageQuality()
          });
          
          if (result && result.dataUrl) {
            console.log(
              `Image optimized: ${Math.round((1 - result.optimizedSize / result.originalSize) * 100)}% reduction ` +
              `(${Math.round(result.originalSize / 1024)}KB → ${Math.round(result.optimizedSize / 1024)}KB)`
            );
            return result.dataUrl;
          }
          
          // If worker response doesn't contain expected data
          throw new Error('Invalid worker response');
        } catch (workerError) {
          console.warn('Web worker optimization failed, falling back to main thread:', workerError);
          // Continue to fallback optimization
        }
      }
      
      // Fallback: Main thread optimization
      return new Promise((resolve, reject) => {
        // Set timeout to handle stalled image loading
        const timeout = setTimeout(() => {
          reject(new PDFError(
            'Tiempo de espera agotado al cargar la imagen. La imagen puede ser demasiado grande o haber problemas de conexión.',
            PDFErrorType.IMAGE_LOAD_ERROR
          ));
        }, 15000); // 15 seconds timeout
        
        // Create an image to get dimensions
        const img = new Image();
        
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
              // Get optimized image data - use WebP if supported
              const format = this.getOptimalImageFormat();
              const quality = this.getOptimalImageQuality();
              const optimizedImage = canvas.toDataURL(format, quality);
              resolve(optimizedImage);
            } catch (canvasError) {
              // Handle security error (tainted canvas) from cross-origin images
              console.warn('Canvas security error, likely due to CORS:', canvasError);
              
              // Try JPEG if WebP failed
              if (format !== 'image/jpeg') {
                try {
                  const jpegImage = canvas.toDataURL('image/jpeg', quality);
                  resolve(jpegImage);
                  return;
                } catch (jpegError) {
                  // If both formats fail, it's likely a CORS issue
                  reject(new PDFError(
                    'Error de seguridad al procesar la imagen. La imagen puede provenir de otro dominio sin permisos CORS.',
                    PDFErrorType.CANVAS_SECURITY_ERROR,
                    canvasError,
                    true
                  ));
                  return;
                }
              }
              
              reject(new PDFError(
                'Error de seguridad al procesar la imagen. La imagen puede provenir de otro dominio sin permisos CORS.',
                PDFErrorType.CANVAS_SECURITY_ERROR,
                canvasError,
                true
              ));
            }
          } catch (error) {
            console.error('Error optimizing image:', error);
            reject(new PDFError(
              'Error al procesar la imagen. Intente con una imagen más pequeña o en otro formato.',
              PDFErrorType.IMAGE_PROCESS_ERROR,
              error,
              true
            ));
          }
        };
        
        img.onerror = (err) => {
          clearTimeout(timeout);
          // If optimization fails, reject with error
          console.warn('Image load failed:', err);
          reject(new PDFError(
            'No se pudo cargar la imagen. Verifique que la imagen esté en un formato válido.',
            PDFErrorType.IMAGE_LOAD_ERROR,
            err
          ));
        };
        
        try {
          img.src = imageDataUrl;
        } catch (error) {
          clearTimeout(timeout);
          reject(new PDFError(
            'Error al procesar la imagen. El formato puede no ser compatible.',
            PDFErrorType.IMAGE_LOAD_ERROR,
            error
          ));
        }
      });
    } catch (error) {
      // Final fallback - return original if everything fails
      console.error('All image optimization approaches failed:', error);
      
      // Only throw the error if it's not recoverable
      if (error instanceof PDFError && !error.recoverable) {
        throw error;
      }
      
      // Otherwise return the original image
      return imageDataUrl;
    }
  }

  // Enhanced image drawing with more comprehensive error handling and improved logging
  private async drawImage(
    doc: jsPDF,
    imageDataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
    onProgress?: ProgressCallback,
    section?: string
  ) {
    if (!imageDataUrl) return

    try {
      // Report progress if callback is provided
      if (onProgress) {
        onProgress(0.1, PDFGenerationStage.OPTIMIZING_IMAGES, section);
      }
      
      // Optimize image before adding to PDF
      const optimizedImage = await this.optimizeImage(imageDataUrl);
      
      // Report progress
      if (onProgress) {
        onProgress(0.5, PDFGenerationStage.CREATING_PDF, section);
      }
      
      // jsPDF expects base64 data without the data URL prefix
      const base64Data = optimizedImage.split(',')[1];
      
      try {
        doc.addImage(base64Data, 'JPEG', x, y, width, height);
        
        // Report completion
        if (onProgress) {
          onProgress(1.0, PDFGenerationStage.CREATING_PDF, section);
        }
      } catch (addImageError) {
        console.error('Error adding image to PDF:', addImageError);
        throw new PDFError(
          'Error al añadir imagen al PDF',
          PDFErrorType.PDF_GENERATION_ERROR,
          addImageError,
          true // Recoverable
        );
      }
    } catch (error) {
      console.error('Error processing image for PDF:', error);
      
      // Try with original image as fallback
      if (!(error instanceof PDFError && error.type === PDFErrorType.CANVAS_SECURITY_ERROR)) {
        try {
          // Fallback to original method if optimization fails
          const base64Data = imageDataUrl.split(',')[1]
          doc.addImage(base64Data, 'JPEG', x, y, width, height)
          
          // Report completion with fallback
          if (onProgress) {
            onProgress(1.0, PDFGenerationStage.CREATING_PDF, `${section} (fallback)`);
          }
          
          return; // Successfully added with fallback
        } catch (fallbackError) {
          console.error('Fallback image addition also failed:', fallbackError);
        }
      }
      
      // Create a placeholder with error message if all attempts fail
      doc.setFillColor(240, 240, 240);
      doc.rect(x, y, width, height, 'F');
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(8);
      
      let errorMessage = 'Error: Imagen no disponible';
      if (error instanceof PDFError && error.type === PDFErrorType.CANVAS_SECURITY_ERROR) {
        errorMessage = 'Error CORS: Imagen restringida';
      }
      
      doc.text(errorMessage, x + width/2, y + height/2, {align: 'center'});
      
      // Report completion with error placeholder
      if (onProgress) {
        onProgress(1.0, PDFGenerationStage.CREATING_PDF, `${section} (placeholder)`);
      }
      
      // Re-throw non-recoverable errors
      if (error instanceof PDFError && !error.recoverable) {
        throw error;
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
    try {
      if (filled) {
        doc.setFillColor(0, 0, 0)
        doc.circle(x, y, radius, 'F')
      } else {
        doc.setDrawColor(0, 0, 0)
        doc.circle(x, y, radius, 'S')
      }
    } catch (error) {
      console.error('Error drawing circle:', error);
      // Don't throw, consider this non-critical
    }
  }

  private async drawCircularImage(
    doc: jsPDF,
    imageDataUrl: string,
    centerX: number,
    centerY: number,
    diameter: number,
    holeSize: number,
    onProgress?: ProgressCallback
  ) {
    if (!imageDataUrl) return
    
    try {
      if (onProgress) {
        onProgress(0, PDFGenerationStage.DRAWING_DISC, 'disc_image');
      }
      
      // First add the circular image
      await this.drawImage(
        doc, 
        imageDataUrl, 
        centerX - diameter / 2, 
        centerY - diameter / 2, 
        diameter, 
        diameter,
        onProgress,
        'disc_image'
      );
      
      if (onProgress) {
        onProgress(0.7, PDFGenerationStage.DRAWING_DISC, 'disc_hole');
      }
      
      // Then draw the center hole
      this.drawCircle(
        doc,
        centerX,
        centerY,
        holeSize / 2,
        true // filled black circle
      );
      
      // Draw outer circle (dotted line for cutting)
      doc.setDrawColor(0, 0, 0);
      doc.setLineDashPattern([1, 1], 0);
      this.drawCircle(
        doc,
        centerX,
        centerY,
        diameter / 2
      );
      doc.setLineDashPattern([], 0); // Reset line style
      
      if (onProgress) {
        onProgress(1, PDFGenerationStage.DRAWING_DISC, 'disc_complete');
      }
    } catch (error) {
      console.error('Error drawing circular image:', error);
      
      // Create a placeholder disc if image fails
      doc.setFillColor(240, 240, 240);
      doc.circle(centerX, centerY, diameter / 2, 'F');
      
      // Add text to indicate error
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(8);
      doc.text('Imagen del disco no disponible', centerX, centerY - 5, {align: 'center'});
      
      // Still draw the center hole and outer circle
      this.drawCircle(doc, centerX, centerY, holeSize / 2, true);
      doc.setDrawColor(0, 0, 0);
      doc.setLineDashPattern([1, 1], 0);
      this.drawCircle(doc, centerX, centerY, diameter / 2);
      doc.setLineDashPattern([], 0);
      
      if (onProgress) {
        onProgress(1, PDFGenerationStage.DRAWING_DISC, 'disc_error_placeholder');
      }
      
      // Only re-throw non-recoverable errors
      if (error instanceof PDFError && !error.recoverable) {
        throw error;
      }
    }
  }

  private drawRect(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    dashed: boolean = false
  ) {
    try {
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
    } catch (error) {
      console.error('Error drawing rectangle:', error);
      // Don't throw, consider this non-critical
    }
  }
  
  private drawHeader(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    albumTitle: string,
    artistName: string,
    onProgress?: ProgressCallback
  ) {
    try {
      if (onProgress) {
        onProgress(0, PDFGenerationStage.DRAWING_HEADER);
      }
      
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
      
      if (onProgress) {
        onProgress(1, PDFGenerationStage.DRAWING_HEADER);
      }
      
      return headerHeight
    } catch (error) {
      console.error('Error drawing header:', error);
      
      // Create a simple fallback header if there's an error
      try {
        const headerHeight = 10;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text('MiniCDWorld Template', x + 5, y + headerHeight/2 + 1);
        
        if (onProgress) {
          onProgress(1, PDFGenerationStage.DRAWING_HEADER, 'header_fallback');
        }
        
        return headerHeight;
      } catch (fallbackError) {
        console.error('Even fallback header failed:', fallbackError);
        return 10; // Return default height
      }
    }
  }
  
  private drawFooter(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    onProgress?: ProgressCallback
  ) {
    try {
      if (onProgress) {
        onProgress(0, PDFGenerationStage.DRAWING_FOOTER);
      }
      
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
      
      if (onProgress) {
        onProgress(1, PDFGenerationStage.DRAWING_FOOTER);
      }
      
      return footerHeight
    } catch (error) {
      console.error('Error drawing footer:', error);
      
      // Simple fallback footer
      try {
        const footerHeight = 8;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text('mini-cd-world.vercel.app', x + 5, y + footerHeight/2 + 1);
        
        if (onProgress) {
          onProgress(1, PDFGenerationStage.DRAWING_FOOTER, 'footer_fallback');
        }
        
        return footerHeight;
      } catch (fallbackError) {
        console.error('Even fallback footer failed:', fallbackError);
        return 8; // Return default height
      }
    }
  }
  
  // Enhanced CD block drawing with section-specific error recovery
  private async drawCDBlock(
    doc: jsPDF,
    templateData: TemplateState,
    x: number,
    y: number,
    blockWidth: number,
    blockHeight: number,
    onProgress?: ProgressCallback
  ) {
    const { images } = templateData
    
    try {
      // Report progress
      if (onProgress) {
        onProgress(0, PDFGenerationStage.CREATING_PDF, 'block_outline');
      }
      
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
      if (onProgress) {
        onProgress(0.1, PDFGenerationStage.DRAWING_FRONT_COVERS, 'front_covers_start');
      }
      
      // FRONT COVER COMPONENTS (LEFT SIDE)
      const frontSectionWidth = blockWidth * 0.6 // 60% of block width for front covers
      
      doc.text('Componentes de Portada', x + sectionPadding, currentY)
      currentY += 4
      
      // Position the front covers
      const frontCoverX = x + (frontSectionWidth - (DIMENSIONS.FRENTE_AFUERA.width + DIMENSIONS.FRENTE_DENTRO.width)) / 2
      
      // Draw crop outlines for front covers - use try/catch for each component to allow partial recovery
      let frontCoverSuccess = true;
      
      // Front outside cover
      try {
        if (images.frenteAfuera?.croppedImage) {
          this.drawRect(doc, frontCoverX, currentY, DIMENSIONS.FRENTE_AFUERA.width, DIMENSIONS.FRENTE_AFUERA.height, true)
          
          if (onProgress) {
            onProgress(0.15, PDFGenerationStage.DRAWING_FRONT_COVERS, 'frente_afuera');
          }
          
          await this.drawImage(
            doc,
            images.frenteAfuera.croppedImage,
            frontCoverX,
            currentY,
            DIMENSIONS.FRENTE_AFUERA.width,
            DIMENSIONS.FRENTE_AFUERA.height,
            onProgress,
            'frente_afuera'
          )
        } else {
          // Draw placeholder if image is missing
          this.drawRect(doc, frontCoverX, currentY, DIMENSIONS.FRENTE_AFUERA.width, DIMENSIONS.FRENTE_AFUERA.height, true);
          doc.setFillColor(240, 240, 240);
          doc.rect(frontCoverX, currentY, DIMENSIONS.FRENTE_AFUERA.width, DIMENSIONS.FRENTE_AFUERA.height, 'F');
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(7);
          doc.text('Portada Exterior', frontCoverX + DIMENSIONS.FRENTE_AFUERA.width/2, currentY + DIMENSIONS.FRENTE_AFUERA.height/2, {align: 'center'});
        }
      } catch (error) {
        console.error('Error drawing front outside cover:', error);
        frontCoverSuccess = false;
        
        // Draw placeholder
        this.drawRect(doc, frontCoverX, currentY, DIMENSIONS.FRENTE_AFUERA.width, DIMENSIONS.FRENTE_AFUERA.height, true);
        doc.setFillColor(240, 240, 240);
        doc.rect(frontCoverX, currentY, DIMENSIONS.FRENTE_AFUERA.width, DIMENSIONS.FRENTE_AFUERA.height, 'F');
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(7);
        doc.text('Error: Portada', frontCoverX + DIMENSIONS.FRENTE_AFUERA.width/2, currentY + DIMENSIONS.FRENTE_AFUERA.height/2, {align: 'center'});
      }
      
      // Front inside cover
      try {
        if (images.frenteDentro?.croppedImage) {
          this.drawRect(doc, frontCoverX + DIMENSIONS.FRENTE_AFUERA.width, currentY, DIMENSIONS.FRENTE_DENTRO.width, DIMENSIONS.FRENTE_DENTRO.height, true)
          
          if (onProgress) {
            onProgress(0.25, PDFGenerationStage.DRAWING_FRONT_COVERS, 'frente_dentro');
          }
          
          await this.drawImage(
            doc,
            images.frenteDentro.croppedImage,
            frontCoverX + DIMENSIONS.FRENTE_AFUERA.width,
            currentY,
            DIMENSIONS.FRENTE_DENTRO.width,
            DIMENSIONS.FRENTE_DENTRO.height,
            onProgress,
            'frente_dentro'
          )
        } else {
          // Draw placeholder if image is missing
          this.drawRect(doc, frontCoverX + DIMENSIONS.FRENTE_AFUERA.width, currentY, DIMENSIONS.FRENTE_DENTRO.width, DIMENSIONS.FRENTE_DENTRO.height, true);
          doc.setFillColor(240, 240, 240);
          doc.rect(frontCoverX + DIMENSIONS.FRENTE_AFUERA.width, currentY, DIMENSIONS.FRENTE_DENTRO.width, DIMENSIONS.FRENTE_DENTRO.height, 'F');
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(7);
          doc.text('Portada Interior', frontCoverX + DIMENSIONS.FRENTE_AFUERA.width + DIMENSIONS.FRENTE_DENTRO.width/2, currentY + DIMENSIONS.FRENTE_DENTRO.height/2, {align: 'center'});
        }
      } catch (error) {
        console.error('Error drawing front inside cover:', error);
        frontCoverSuccess = false;
        
        // Draw placeholder
        this.drawRect(doc, frontCoverX + DIMENSIONS.FRENTE_AFUERA.width, currentY, DIMENSIONS.FRENTE_DENTRO.width, DIMENSIONS.FRENTE_DENTRO.height, true);
        doc.setFillColor(240, 240, 240);
        doc.rect(frontCoverX + DIMENSIONS.FRENTE_AFUERA.width, currentY, DIMENSIONS.FRENTE_DENTRO.width, DIMENSIONS.FRENTE_DENTRO.height, 'F');
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(7);
        doc.text('Error: Interior', frontCoverX + DIMENSIONS.FRENTE_AFUERA.width + DIMENSIONS.FRENTE_DENTRO.width/2, currentY + DIMENSIONS.FRENTE_DENTRO.height/2, {align: 'center'});
      }
      
      if (onProgress) {
        onProgress(0.3, PDFGenerationStage.DRAWING_FRONT_COVERS, frontCoverSuccess ? 'front_covers_complete' : 'front_covers_partial');
      }
      
      // CD DISC (RIGHT SIDE)
      let discSuccess = true;
      try {
        const discSectionX = x + frontSectionWidth + sectionPadding
        const discSectionWidth = blockWidth - frontSectionWidth - sectionPadding * 2
        
        doc.text('Disco CD', discSectionX, y + sectionPadding)
        
        // Center the disc in its section
        if (images.disco?.croppedImage) {
          const discCenterX = discSectionX + discSectionWidth / 2
          const discCenterY = currentY + DIMENSIONS.DISCO.diameter / 2 + 4
          
          if (onProgress) {
            onProgress(0.4, PDFGenerationStage.DRAWING_DISC, 'disc_start');
          }
          
          await this.drawCircularImage(
            doc,
            images.disco.croppedImage,
            discCenterX,
            discCenterY,
            DIMENSIONS.DISCO.diameter,
            DIMENSIONS.DISCO.holeSize,
            onProgress
          )
        } else {
          // Draw placeholder if disc image is missing
          const discCenterX = discSectionX + discSectionWidth / 2;
          const discCenterY = currentY + DIMENSIONS.DISCO.diameter / 2 + 4;
          
          doc.setFillColor(240, 240, 240);
          doc.circle(discCenterX, discCenterY, DIMENSIONS.DISCO.diameter / 2, 'F');
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(8);
          doc.text('Imagen del Disco', discCenterX, discCenterY, {align: 'center'});
          
          // Still draw the center hole and cutting line
          doc.setFillColor(0, 0, 0);
          doc.circle(discCenterX, discCenterY, DIMENSIONS.DISCO.holeSize / 2, 'F');
          doc.setDrawColor(0, 0, 0);
          doc.setLineDashPattern([1, 1], 0);
          doc.circle(discCenterX, discCenterY, DIMENSIONS.DISCO.diameter / 2, 'S');
          doc.setLineDashPattern([], 0);
        }
      } catch (error) {
        console.error('Error drawing CD disc:', error);
        discSuccess = false;
        
        // We'll continue with back covers despite disc error
      }
      
      if (onProgress) {
        onProgress(0.5, PDFGenerationStage.DRAWING_BACK_COVERS, 'back_covers_start');
      }
      
      // --- BOTTOM ROW: BACK COVER COMPONENTS ---
      let backCoverSuccess = true;
      
      try {
        // Move to back cover components section (below front covers and disc)
        currentY += Math.max(DIMENSIONS.FRENTE_AFUERA.height, DIMENSIONS.DISCO.diameter) + sectionPadding
        
        doc.text('Componentes de Contraportada', x + sectionPadding, currentY)
        currentY += 4
        
        // Center the back covers in the full width
        const backCoverFullWidth = DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + 
                               DIMENSIONS.TRASERA_DENTRO.side.width + DIMENSIONS.TRASERA_DENTRO.main.width
        const backCoverX = x + (blockWidth - backCoverFullWidth) / 2
        
        // Back Outside (Main) with crop outlines
        try {
          if (images.traseraAfuera.main?.croppedImage) {
            this.drawRect(doc, backCoverX, currentY, DIMENSIONS.TRASERA_AFUERA.main.width, DIMENSIONS.TRASERA_AFUERA.main.height, true)
            
            if (onProgress) {
              onProgress(0.6, PDFGenerationStage.DRAWING_BACK_COVERS, 'trasera_afuera_main');
            }
            
            await this.drawImage(
              doc,
              images.traseraAfuera.main.croppedImage,
              backCoverX,
              currentY,
              DIMENSIONS.TRASERA_AFUERA.main.width,
              DIMENSIONS.TRASERA_AFUERA.main.height,
              onProgress,
              'trasera_afuera_main'
            )
          } else {
            // Draw placeholder if image is missing
            this.drawRect(doc, backCoverX, currentY, DIMENSIONS.TRASERA_AFUERA.main.width, DIMENSIONS.TRASERA_AFUERA.main.height, true);
            doc.setFillColor(240, 240, 240);
            doc.rect(backCoverX, currentY, DIMENSIONS.TRASERA_AFUERA.main.width, DIMENSIONS.TRASERA_AFUERA.main.height, 'F');
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(7);
            doc.text('Contraportada Principal', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width/2, currentY + DIMENSIONS.TRASERA_AFUERA.main.height/2, {align: 'center'});
          }
        } catch (error) {
          console.error('Error drawing back outside main:', error);
          backCoverSuccess = false;
          
          // Draw placeholder
          this.drawRect(doc, backCoverX, currentY, DIMENSIONS.TRASERA_AFUERA.main.width, DIMENSIONS.TRASERA_AFUERA.main.height, true);
          doc.setFillColor(240, 240, 240);
          doc.rect(backCoverX, currentY, DIMENSIONS.TRASERA_AFUERA.main.width, DIMENSIONS.TRASERA_AFUERA.main.height, 'F');
          doc.setTextColor(200, 0, 0);
          doc.setFontSize(7);
          doc.text('Error: Contraportada', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width/2, currentY + DIMENSIONS.TRASERA_AFUERA.main.height/2, {align: 'center'});
        }
        
        // Back Outside (Side) with crop outlines
        try {
          if (images.traseraAfuera.side?.croppedImage) {
            this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width, currentY, DIMENSIONS.TRASERA_AFUERA.side.width, DIMENSIONS.TRASERA_AFUERA.side.height, true)
            
            if (onProgress) {
              onProgress(0.7, PDFGenerationStage.DRAWING_BACK_COVERS, 'trasera_afuera_side');
            }
            
            await this.drawImage(
              doc,
              images.traseraAfuera.side.croppedImage,
              backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width,
              currentY,
              DIMENSIONS.TRASERA_AFUERA.side.width,
              DIMENSIONS.TRASERA_AFUERA.side.height,
              onProgress,
              'trasera_afuera_side'
            )
          } else {
            // Draw placeholder
            this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width, currentY, DIMENSIONS.TRASERA_AFUERA.side.width, DIMENSIONS.TRASERA_AFUERA.side.height, true);
            doc.setFillColor(240, 240, 240);
            doc.rect(backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width, currentY, DIMENSIONS.TRASERA_AFUERA.side.width, DIMENSIONS.TRASERA_AFUERA.side.height, 'F');
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(7);
            doc.text('Lateral', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width/2, currentY + DIMENSIONS.TRASERA_AFUERA.side.height/2, {align: 'center'});
          }
        } catch (error) {
          console.error('Error drawing back outside side:', error);
          backCoverSuccess = false;
          
          // Draw placeholder
          this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width, currentY, DIMENSIONS.TRASERA_AFUERA.side.width, DIMENSIONS.TRASERA_AFUERA.side.height, true);
          doc.setFillColor(240, 240, 240);
          doc.rect(backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width, currentY, DIMENSIONS.TRASERA_AFUERA.side.width, DIMENSIONS.TRASERA_AFUERA.side.height, 'F');
          doc.setTextColor(200, 0, 0);
          doc.setFontSize(7);
          doc.text('Error', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width/2, currentY + DIMENSIONS.TRASERA_AFUERA.side.height/2, {align: 'center'});
        }
        
        // Back Inside (Side) with crop outlines
        try {
          if (images.traseraDentro.side?.croppedImage) {
            this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width, currentY, 
              DIMENSIONS.TRASERA_DENTRO.side.width, DIMENSIONS.TRASERA_DENTRO.side.height, true)
            
            if (onProgress) {
              onProgress(0.8, PDFGenerationStage.DRAWING_BACK_COVERS, 'trasera_dentro_side');
            }
            
            await this.drawImage(
              doc,
              images.traseraDentro.side.croppedImage,
              backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width,
              currentY,
              DIMENSIONS.TRASERA_DENTRO.side.width,
              DIMENSIONS.TRASERA_DENTRO.side.height,
              onProgress,
              'trasera_dentro_side'
            )
          } else {
            // Draw placeholder
            this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width, currentY, 
              DIMENSIONS.TRASERA_DENTRO.side.width, DIMENSIONS.TRASERA_DENTRO.side.height, true);
            doc.setFillColor(240, 240, 240);
            doc.rect(backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width, currentY, 
              DIMENSIONS.TRASERA_DENTRO.side.width, DIMENSIONS.TRASERA_DENTRO.side.height, 'F');
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(7);
            doc.text('Lateral', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width/2, 
              currentY + DIMENSIONS.TRASERA_DENTRO.side.height/2, {align: 'center'});
          }
        } catch (error) {
          console.error('Error drawing back inside side:', error);
          backCoverSuccess = false;
          
          // Draw placeholder
          this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width, currentY, 
            DIMENSIONS.TRASERA_DENTRO.side.width, DIMENSIONS.TRASERA_DENTRO.side.height, true);
          doc.setFillColor(240, 240, 240);
          doc.rect(backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width, currentY, 
            DIMENSIONS.TRASERA_DENTRO.side.width, DIMENSIONS.TRASERA_DENTRO.side.height, 'F');
          doc.setTextColor(200, 0, 0);
          doc.setFontSize(7);
          doc.text('Error', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width/2, 
            currentY + DIMENSIONS.TRASERA_DENTRO.side.height/2, {align: 'center'});
        }
        
        // Back Inside (Main) with crop outlines
        try {
          if (images.traseraDentro.main?.croppedImage) {
            this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width, 
              currentY, DIMENSIONS.TRASERA_DENTRO.main.width, DIMENSIONS.TRASERA_DENTRO.main.height, true)
            
            if (onProgress) {
              onProgress(0.9, PDFGenerationStage.DRAWING_BACK_COVERS, 'trasera_dentro_main');
            }
            
            await this.drawImage(
              doc,
              images.traseraDentro.main.croppedImage,
              backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width,
              currentY,
              DIMENSIONS.TRASERA_DENTRO.main.width,
              DIMENSIONS.TRASERA_DENTRO.main.height,
              onProgress,
              'trasera_dentro_main'
            )
          } else {
            // Draw placeholder
            this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width, 
              currentY, DIMENSIONS.TRASERA_DENTRO.main.width, DIMENSIONS.TRASERA_DENTRO.main.height, true);
            doc.setFillColor(240, 240, 240);
            doc.rect(backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width, 
              currentY, DIMENSIONS.TRASERA_DENTRO.main.width, DIMENSIONS.TRASERA_DENTRO.main.height, 'F');
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(7);
            doc.text('Interior Principal', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width + DIMENSIONS.TRASERA_DENTRO.main.width/2, 
              currentY + DIMENSIONS.TRASERA_DENTRO.main.height/2, {align: 'center'});
          }
        } catch (error) {
          console.error('Error drawing back inside main:', error);
          backCoverSuccess = false;
          
          // Draw placeholder
          this.drawRect(doc, backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width, 
            currentY, DIMENSIONS.TRASERA_DENTRO.main.width, DIMENSIONS.TRASERA_DENTRO.main.height, true);
          doc.setFillColor(240, 240, 240);
          doc.rect(backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width, 
            currentY, DIMENSIONS.TRASERA_DENTRO.main.width, DIMENSIONS.TRASERA_DENTRO.main.height, 'F');
          doc.setTextColor(200, 0, 0);
          doc.setFontSize(7);
          doc.text('Error: Interior', backCoverX + DIMENSIONS.TRASERA_AFUERA.main.width + DIMENSIONS.TRASERA_AFUERA.side.width + DIMENSIONS.TRASERA_DENTRO.side.width + DIMENSIONS.TRASERA_DENTRO.main.width/2, 
            currentY + DIMENSIONS.TRASERA_DENTRO.main.height/2, {align: 'center'});
        }
      } catch (error) {
        console.error('Error in back cover section:', error);
        backCoverSuccess = false;
        
        // Even if the entire back cover section fails, we don't throw
        // Just report progress and continue
      }
      
      if (onProgress) {
        onProgress(1, PDFGenerationStage.DRAWING_BACK_COVERS, 
          backCoverSuccess ? 'back_covers_complete' : 'back_covers_partial');
      }
      
      // Return information about any component failures
      return {
        success: frontCoverSuccess && discSuccess && backCoverSuccess,
        frontCoverSuccess,
        discSuccess,
        backCoverSuccess
      };
    } catch (error) {
      console.error('Critical error in CD block drawing:', error);
      
      // Try to add error text to the document
      try {
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(10);
        doc.text('Error al generar componentes del CD', x + blockWidth/2, y + blockHeight/2, {align: 'center'});
        doc.setFontSize(8);
        doc.text('Intente con imágenes más pequeñas o diferentes formatos', x + blockWidth/2, y + blockHeight/2 + 10, {align: 'center'});
      } catch (textError) {
        // Ignore text error
      }
      
      // Re-throw only if it's a critical error
      if (error instanceof PDFError && !error.recoverable) {
        throw error;
      }
      
      // Return failure information
      return {
        success: false,
        frontCoverSuccess: false,
        discSuccess: false,
        backCoverSuccess: false,
        error
      };
    }
  }

  public async generatePDF(templateData: TemplateState, progressCallback?: ProgressCallback): Promise<Blob> {
    let doc: jsPDF | null = null;
    
    try {
      // Check if we're online
      if (!this.checkNetworkConnectivity()) {
        // We can still proceed, but warn the user
        console.warn('Offline mode detected. Some features may be limited.');
        
        if (progressCallback) {
          progressCallback(0, PDFGenerationStage.INITIALIZING, 'offline_mode');
        }
      }
      
      // Check device capabilities
      if (!this.deviceCapabilities) {
        this.assessDeviceCapabilities();
      }
      
      // Warn if device has limited capabilities
      if (this.deviceCapabilities && !this.deviceCapabilities.isCapable) {
        throw new PDFError(
          this.deviceCapabilities.reason || 'Este dispositivo puede no ser compatible con la generación de PDF',
          PDFErrorType.DEVICE_CAPABILITY_ERROR
        );
      }
      
      if (progressCallback) {
        progressCallback(0.05, PDFGenerationStage.INITIALIZING);
      }
      
      // Check if web worker is available
      if (!this.webWorker) {
        this.initWebWorker();
      }
      
      if (progressCallback) {
        progressCallback(0.1, PDFGenerationStage.ANALYZING_IMAGES);
      }
      
      // Check if we have enough memory (rough estimate)
      const roughImageSizeEstimate = Object.values(templateData.images)
        .reduce((size, img) => {
          // Handle different types of image objects in the template
          if (typeof img === 'object' && img !== null) {
            // First check if it has croppedImage property
            if (img && 'croppedImage' in img && typeof img.croppedImage === 'string') {
              // Handle direct ImageSection objects
              return size + (img.croppedImage.length * 0.75); // base64 is ~33% larger than binary
            } 
            // Then check if it has main or side properties (nested structure)
            else if (img && ('main' in img || 'side' in img)) {
              let nestedSize = 0;
              
              // Check main property
              if ('main' in img && img.main && 
                  typeof img.main === 'object' && img.main !== null && 
                  'croppedImage' in img.main && 
                  typeof img.main.croppedImage === 'string') {
                nestedSize += img.main.croppedImage.length * 0.75;
              }
              
              // Check side property
              if ('side' in img && img.side && 
                  typeof img.side === 'object' && img.side !== null &&
                  'croppedImage' in img.side && 
                  typeof img.side.croppedImage === 'string') {
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
        
        if (progressCallback) {
          progressCallback(0.15, PDFGenerationStage.ANALYZING_IMAGES, 'large_images_detected');
        }
      }
      
      if (progressCallback) {
        progressCallback(0.2, PDFGenerationStage.INITIALIZING, 'creating_pdf');
      }
      
      try {
        doc = this.createNewPDF();
      } catch (initError) {
        console.error('Error creating PDF object:', initError);
        
        if (progressCallback) {
          progressCallback(0.2, PDFGenerationStage.ERROR, 'pdf_initialization_failed');
        }
        
        throw new PDFError(
          'No se pudo crear el documento PDF. Su navegador puede no ser compatible.',
          PDFErrorType.PDF_GENERATION_ERROR,
          initError
        );
      }
      
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
      
      if (progressCallback) {
        progressCallback(0.25, PDFGenerationStage.DRAWING_HEADER);
      }
      
      // HEADER
      const headerHeight = this.drawHeader(doc, margin, margin, availWidth, albumTitle, artistName, progressCallback);
      
      if (progressCallback) {
        progressCallback(0.3, PDFGenerationStage.DRAWING_FOOTER);
      }
      
      // FOOTER
      const footerHeight = this.drawFooter(doc, margin, pageHeight - margin - 8, availWidth, progressCallback);
      
      // Calculate available area for CD blocks
      const blocksAreaHeight = availHeight - headerHeight - footerHeight;
      
      // Calculate block dimensions
      const blockHeight = blocksAreaHeight / (cdsPerPage === 1 ? 1 : 2);
      const blockPadding = 10; // padding between blocks
      
      let blockResults = [];
      
      try {
        if (progressCallback) {
          progressCallback(0.35, PDFGenerationStage.CREATING_PDF, 'drawing_cd_blocks');
        }
        
        if (cdsPerPage === 1) {
          // Draw single CD block centered
          if (progressCallback) {
            progressCallback(0.4, PDFGenerationStage.CREATING_PDF, 'drawing_single_block');
          }
          
          const result = await this.drawCDBlock(
            doc,
            templateData,
            margin,
            margin + headerHeight + blockPadding,
            availWidth,
            blockHeight - blockPadding * 2,
            progressCallback
          );
          
          blockResults.push(result);
        } else {
          // Draw first CD block
          if (progressCallback) {
            progressCallback(0.4, PDFGenerationStage.CREATING_PDF, 'drawing_first_block');
          }
          
          const result1 = await this.drawCDBlock(
            doc, 
            templateData,
            margin, 
            margin + headerHeight + blockPadding / 2,
            availWidth,
            blockHeight - blockPadding,
            (progress, stage, detail) => {
              // Adjust progress to fit within the 40-70% range for the first block
              if (progressCallback) {
                progressCallback(0.4 + progress * 0.3, stage, `block1_${detail || ''}`);
              }
            }
          );
          
          blockResults.push(result1);
          
          // Draw second CD block (identical to first)
          if (progressCallback) {
            progressCallback(0.7, PDFGenerationStage.CREATING_PDF, 'drawing_second_block');
          }
          
          const result2 = await this.drawCDBlock(
            doc,
            templateData,
            margin,
            margin + headerHeight + blockHeight,
            availWidth,
            blockHeight - blockPadding,
            (progress, stage, detail) => {
              // Adjust progress to fit within the 70-90% range for the second block
              if (progressCallback) {
                progressCallback(0.7 + progress * 0.2, stage, `block2_${detail || ''}`);
              }
            }
          );
          
          blockResults.push(result2);
        }
      } catch (blockError) {
        console.error('Error drawing CD blocks:', blockError);
        
        if (progressCallback) {
          progressCallback(0.9, PDFGenerationStage.ERROR, 'block_drawing_error');
        }
        
        // Add error explanation to PDF instead of failing completely
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(12);
        doc.text('Hubo un problema al generar algunas partes del PDF.', margin + availWidth/2, margin + headerHeight + 40, {align: 'center'});
        doc.setFontSize(10);
        doc.text('Por favor, verifica tus imágenes e intenta nuevamente.', margin + availWidth/2, margin + headerHeight + 50, {align: 'center'});
        
        if (blockError instanceof PDFError) {
          doc.text(`Error específico: ${blockError.message}`, margin + availWidth/2, margin + headerHeight + 60, {align: 'center'});
          
          // Only throw if it's a non-recoverable error
          if (!blockError.recoverable) {
            throw blockError;
          }
        }
      }
      
      if (progressCallback) {
        progressCallback(0.95, PDFGenerationStage.FINALIZING);
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
        // Report completion
        if (progressCallback) {
          progressCallback(0.98, PDFGenerationStage.FINALIZING, 'generating_blob');
        }
        
        // Return the generated PDF as a blob
        const pdfBlob = doc.output('blob');
        
        // Check blob size limits
        if (pdfBlob.size > MAX_PDF_SIZE) {
          console.warn(`PDF size (${pdfBlob.size} bytes) exceeds recommended limit of ${MAX_PDF_SIZE} bytes`);
          // We still return it but log warning for potential issues
        }
        
        // Final success report
        if (progressCallback) {
          progressCallback(1.0, PDFGenerationStage.COMPLETE, `size_${pdfBlob.size}`);
        }
        
        return pdfBlob;
      } catch (outputError) {
        console.error('Error creating PDF blob:', outputError);
        
        if (progressCallback) {
          progressCallback(0.98, PDFGenerationStage.ERROR, 'blob_generation_failed');
        }
        
        throw new PDFError(
          'Error al generar el archivo PDF. El archivo puede ser demasiado grande.',
          PDFErrorType.PDF_SIZE_LIMIT_ERROR,
          outputError
        );
      }
    } catch (error) {
      console.error('Error in PDF generation:', error);
      
      if (progressCallback) {
        progressCallback(1.0, PDFGenerationStage.ERROR, error instanceof PDFError ? error.type : 'unknown_error');
      }
      
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
          
          if (error instanceof PDFError) {
            errorMessage = error.message;
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
            PDFErrorType.MEMORY_ERROR,
            error
          );
        }
        throw new PDFError(error.message, PDFErrorType.UNKNOWN_ERROR, error);
      }
      
      throw new PDFError(
        'Error desconocido al generar el PDF. Por favor, intente de nuevo.',
        PDFErrorType.UNKNOWN_ERROR,
        error
      );
    }
  }
}

export default new PDFService() 
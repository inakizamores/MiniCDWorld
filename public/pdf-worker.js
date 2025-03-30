// PDF Worker for offloading heavy image processing tasks
// This runs in a separate thread to prevent UI freezing

// Maximum image size for optimization
const MAX_IMAGE_DIMENSION = 1200;

// Function to check WebP support
function getOptimalImageFormat() {
  // Web workers don't have direct access to canvas API, so we'll use JPEG by default
  // The main thread will pass format information if needed
  return 'image/jpeg';
}

// Main handler for image optimization
function optimizeImage(imageDataUrl, preferredFormat = 'image/jpeg', quality = 0.8) {
  return new Promise((resolve, reject) => {
    try {
      // Create an image to get dimensions
      const img = new Image();
      
      img.onload = () => {
        try {
          // If image is small enough, return original
          if (img.width <= MAX_IMAGE_DIMENSION && img.height <= MAX_IMAGE_DIMENSION) {
            resolve({
              optimized: false,
              dataUrl: imageDataUrl,
              originalSize: imageDataUrl.length,
              optimizedSize: imageDataUrl.length
            });
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
            throw new Error('Failed to get canvas context');
          }
          
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          try {
            // Get optimized image data with specified format and quality
            const optimizedImage = canvas.toDataURL(preferredFormat, quality);
            
            resolve({
              optimized: true,
              dataUrl: optimizedImage,
              originalSize: imageDataUrl.length,
              optimizedSize: optimizedImage.length,
              width: newWidth,
              height: newHeight,
              format: preferredFormat
            });
          } catch (err) {
            // Fall back to JPEG if the preferred format fails
            if (preferredFormat !== 'image/jpeg') {
              const fallbackImage = canvas.toDataURL('image/jpeg', quality);
              resolve({
                optimized: true,
                dataUrl: fallbackImage,
                originalSize: imageDataUrl.length,
                optimizedSize: fallbackImage.length,
                width: newWidth,
                height: newHeight,
                format: 'image/jpeg'
              });
            } else {
              throw err;
            }
          }
        } catch (processingError) {
          reject({
            error: 'IMAGE_PROCESS_ERROR',
            message: processingError.message || 'Error processing image',
            originalSize: imageDataUrl.length
          });
        }
      };
      
      img.onerror = (err) => {
        reject({
          error: 'IMAGE_LOAD_ERROR',
          message: 'Failed to load image',
          details: err
        });
      };
      
      img.src = imageDataUrl;
    } catch (error) {
      reject({
        error: 'WORKER_ERROR',
        message: error.message || 'Unknown error in worker'
      });
    }
  });
}

// Calculate estimated PDF size based on images
function estimatePdfSize(images) {
  try {
    let totalSize = 0;
    
    // Base PDF size without images (headers, structure, etc)
    const basePdfSize = 50 * 1024; // 50KB approx
    
    // Add size for each image (compressed estimation)
    if (Array.isArray(images)) {
      images.forEach(img => {
        if (img && img.dataUrl) {
          // Estimate that PDF storage will be ~70% of the optimized image size
          totalSize += img.dataUrl.length * 0.7;
        }
      });
    }
    
    return {
      estimatedSize: Math.round(basePdfSize + totalSize),
      baseSize: basePdfSize,
      imageSize: Math.round(totalSize)
    };
  } catch (error) {
    return {
      error: 'ESTIMATION_ERROR',
      message: error.message
    };
  }
}

// Event listener for messages from the main thread
self.addEventListener('message', async event => {
  if (!event.data) return;
  
  try {
    const { action, id, ...data } = event.data;
    
    switch (action) {
      case 'optimizeImage':
        try {
          const result = await optimizeImage(
            data.imageDataUrl, 
            data.preferredFormat, 
            data.quality
          );
          self.postMessage({ 
            id, 
            action: 'optimizeImage', 
            status: 'success', 
            result 
          });
        } catch (error) {
          self.postMessage({ 
            id, 
            action: 'optimizeImage', 
            status: 'error', 
            error 
          });
        }
        break;
        
      case 'estimatePdfSize':
        try {
          const result = estimatePdfSize(data.images);
          self.postMessage({ 
            id, 
            action: 'estimatePdfSize', 
            status: 'success', 
            result 
          });
        } catch (error) {
          self.postMessage({ 
            id, 
            action: 'estimatePdfSize', 
            status: 'error', 
            error 
          });
        }
        break;
        
      case 'ping':
        // Simple ping to check if worker is running
        self.postMessage({ 
          id, 
          action: 'ping', 
          status: 'success',
          timestamp: Date.now() 
        });
        break;
        
      default:
        self.postMessage({ 
          id, 
          action,
          status: 'error', 
          error: { 
            message: `Unknown action: ${action}` 
          } 
        });
    }
  } catch (error) {
    self.postMessage({ 
      id: event.data.id || 'unknown', 
      status: 'error', 
      error: { 
        message: error.message || 'Unknown worker error'
      } 
    });
  }
}); 
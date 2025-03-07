const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Ensure BLOB_READ_WRITE_TOKEN is set
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN environment variable is not set in index.js');
  // Force-set the token if not found in environment variables
  process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_k7IKI2WMluAdFGjc_Rb0QB423TfWWgHhpfVRza3onYvtCxZ';
  console.log('BLOB_READ_WRITE_TOKEN was hardcoded for this session in index.js');
} else {
  console.log('BLOB_READ_WRITE_TOKEN is set in index.js, length:', process.env.BLOB_READ_WRITE_TOKEN.length);
}

const { put, get, del } = require('@vercel/blob');

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Shared in-memory storage for template metadata
// In a real production app, you would use a database instead
const templateCache = global.templateCache || {};
global.templateCache = templateCache;

// PDF constants
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CD_CASE = {
  width: 4.75 * 72,
  height: 4.75 * 72,
  spine: 0.375 * 72
};

// Root endpoint to provide API information
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'MiniCDWorld API is running',
    endpoints: {
      upload: '/api/upload',
      generate: '/api/generate',
      status: '/api/status/:templateId',
      download: '/api/download/:templateId'
    }
  });
});

// Generate PDF endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { templateId, perPage = 1 } = req.body;

    // Check if template exists
    if (!templateCache[templateId]) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Update template status
    templateCache[templateId].status = 'generating';

    // Get the template data
    const templateData = templateCache[templateId];
    
    // Check if using legacy/fallback upload
    if (templateData.usingLegacyUpload) {
      console.log(`Template ${templateId} is using legacy upload, cannot generate PDF`);
      
      // Update status and return an error
      templateCache[templateId].status = 'error';
      templateCache[templateId].error = 'PDF generation not available in fallback mode';
      
      return res.status(400).json({
        success: false,
        message: 'PDF generation is not available in fallback mode.',
        error: 'Vercel Blob storage not configured properly'
      });
    }
    
    // Use blobUrls from templateCache for direct upload flow
    const imageUrls = templateData.blobUrls || {};
    
    // Generate PDF
    const pdfBuffer = await generatePDFTemplate(imageUrls, templateData.text, parseInt(perPage));
    
    // Upload PDF to Vercel Blob
    try {
      const pdfBlobName = `${templateId}/cd_template.pdf`;
      const pdfBlob = await put(pdfBlobName, pdfBuffer, {
        contentType: 'application/pdf',
        access: 'public'
      });
      
      // Store the PDF URL in the cache
      templateCache[templateId].pdfUrl = pdfBlob.url;
      templateCache[templateId].status = 'completed';
    } catch (uploadError) {
      console.error('Error uploading PDF to Vercel Blob:', uploadError);
      
      // Update status to indicate PDF is ready but not uploaded
      templateCache[templateId].status = 'generated_locally';
      templateCache[templateId].error = 'PDF generated but not uploaded to Blob storage';
      
      return res.status(500).json({
        success: false,
        message: 'PDF was generated but could not be stored due to Blob storage issues',
        error: uploadError.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      pdfUrl: `/api/download/${templateId}`
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Update template status to error
    if (templateId && templateCache[templateId]) {
      templateCache[templateId].status = 'error';
      templateCache[templateId].error = error.message;
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
});

// Get template status endpoint
app.get('/api/status/:templateId', (req, res) => {
  const { templateId } = req.params;
  
  if (!templateCache[templateId]) {
    return res.status(404).json({
      success: false,
      message: 'Template not found'
    });
  }
  
  return res.status(200).json({
    success: true,
    status: templateCache[templateId].status,
    error: templateCache[templateId].error || null
  });
});

// Download PDF endpoint
app.get('/api/download/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    
    if (!templateCache[templateId] || !templateCache[templateId].pdfUrl) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found or not generated yet'
      });
    }
    
    // Redirect to the Blob URL for download
    return res.redirect(templateCache[templateId].pdfUrl);
    
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Error downloading PDF',
      error: error.message
    });
  }
});

/**
 * Generate a PDF template with the provided images and text
 * @param {Object} imageUrls - Object containing Blob URLs for the uploaded images
 * @param {Object} text - Object containing text for album title, etc.
 * @param {Number} perPage - Number of CD templates per page (1-3)
 * @returns {Promise<Buffer>} - PDF content as a buffer
 */
async function generatePDFTemplate(imageUrls, text, perPage = 1) {
  // Validate perPage value
  if (perPage < 1 || perPage > 3) {
    throw new Error('Number of CDs per page must be between 1 and 3');
  }

  console.log('Starting PDF generation with', Object.keys(imageUrls).length, 'images');
  
  // Create a new PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 36, left: 36, right: 36, bottom: 36 },
    bufferPages: true
  });

  // Create a buffer to store the PDF
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  try {
    // Process each requested template per page
    const templatesPerPage = Math.min(perPage, 3);

    // Calculate spacing and position for templates
    const availableWidth = PAGE_WIDTH - 72; // 72 points margin (36 on each side)
    const availableHeight = PAGE_HEIGHT - 72; // 72 points margin (36 on each side)
    
    // Add page instructions
    doc.font('Helvetica')
       .fontSize(10)
       .text('CD Template - Cut along the outlines', 36, 18, { align: 'center' });
    
    for (let i = 0; i < templatesPerPage; i++) {
      // Position the template centered horizontally
      const xPosition = (PAGE_WIDTH - CD_CASE.width) / 2;
      
      // Calculate vertical position based on template number
      const templateHeight = CD_CASE.height;
      const spacing = (availableHeight - (templateHeight * templatesPerPage)) / (templatesPerPage + 1);
      const yPosition = 36 + spacing + (i * (templateHeight + spacing));
      
      console.log(`Adding template ${i+1} at position (${xPosition}, ${yPosition})`);
      
      // Add template components
      await addCDTemplate(doc, xPosition, yPosition, imageUrls, text);
    }

    // Finalize the PDF
    doc.end();

    // Return a Promise that resolves with the PDF buffer
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        console.log(`PDF generation completed, size: ${pdfBuffer.length} bytes`);
        resolve(pdfBuffer);
      });
    });
  } catch (error) {
    // Handle errors during PDF generation
    console.error('Error in PDF generation:', error);
    doc.end(); // Make sure to end the document even on error
    throw error;
  }
}

/**
 * Add a CD template at the specified position
 * @param {PDFDocument} doc - The PDF document
 * @param {Number} x - X position for the template
 * @param {Number} y - Y position for the template
 * @param {Object} imageUrls - Object containing Blob URLs for the images
 * @param {Object} text - Object containing text data
 */
async function addCDTemplate(doc, x, y, imageUrls, text) {
  try {
    // Draw guidelines for the CD case
    doc.rect(x, y, CD_CASE.width, CD_CASE.height)
       .lineWidth(0.5)
       .dash(3, { space: 2 })
       .stroke('#333333');
    
    // Reset dash pattern
    doc.undash();
    
    // Draw dividing lines for quadrants
    doc.moveTo(x + CD_CASE.width / 2, y)
       .lineTo(x + CD_CASE.width / 2, y + CD_CASE.height)
       .moveTo(x, y + CD_CASE.height / 2)
       .lineTo(x + CD_CASE.width, y + CD_CASE.height / 2)
       .lineWidth(0.25)
       .dash(1, { space: 1 })
       .stroke('#999999');
    
    // Reset dash pattern again
    doc.undash();
    
    // Process and place each image based on the template layout
    const quadrantWidth = CD_CASE.width / 2;
    const quadrantHeight = CD_CASE.height / 2;
    
    // Draw labels for each quadrant
    doc.font('Helvetica')
       .fontSize(6)
       .fillColor('#999999');
    
    doc.text('Front Cover Outside', x + 2, y + 2, { width: quadrantWidth - 4 });
    doc.text('Front Cover Inside', x + quadrantWidth + 2, y + 2, { width: quadrantWidth - 4 });
    doc.text('Back Cover', x + 2, y + quadrantHeight + 2, { width: quadrantWidth - 4 });
    doc.text('CD Label', x + quadrantWidth + 2, y + quadrantHeight + 2, { width: quadrantWidth - 4 });
    
    // Place each image with error handling
    const placementPromises = [];
    
    // Front cover outside (top-left)
    if (imageUrls.frontCoverOutside) {
      placementPromises.push(
        placeImageFromUrl(doc, imageUrls.frontCoverOutside, x + 2, y + 10, quadrantWidth - 4, quadrantHeight - 12)
      );
    }
    
    // Front cover inside (top-right)
    if (imageUrls.frontCoverInside) {
      placementPromises.push(
        placeImageFromUrl(doc, imageUrls.frontCoverInside, x + quadrantWidth + 2, y + 10, quadrantWidth - 4, quadrantHeight - 12)
      );
    }
    
    // Back cover (bottom-left)
    if (imageUrls.backCover) {
      placementPromises.push(
        placeImageFromUrl(doc, imageUrls.backCover, x + 2, y + quadrantHeight + 10, quadrantWidth - 4, quadrantHeight - 12)
      );
    }
    
    // CD image (bottom-right)
    if (imageUrls.cdImage) {
      placementPromises.push(
        placeImageFromUrl(doc, imageUrls.cdImage, x + quadrantWidth + 2, y + quadrantHeight + 10, quadrantWidth - 4, quadrantHeight - 12)
      );
    }
    
    // Wait for all image placements to complete
    await Promise.all(placementPromises);
    
    // Add text elements in a more prominent way
    if (text && text.albumTitle) {
      // Save current graphics state
      doc.save();
      
      // Transparent overlay for text background
      doc.rect(x + 10, y + CD_CASE.height - 80, CD_CASE.width - 20, 70)
         .fillOpacity(0.7)
         .fill('#ffffff');
      
      // Reset opacity for text
      doc.fillOpacity(1);
      
      // Album title
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .fillColor('#000000')
         .text(text.albumTitle || '', x + 15, y + CD_CASE.height - 75, { 
           width: CD_CASE.width - 30,
           align: 'center'
         });
      
      // Artist name
      if (text.artistName) {
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#333333')
           .text(text.artistName, x + 15, y + CD_CASE.height - 55, { 
             width: CD_CASE.width - 30,
             align: 'center'
           });
      }
      
      // Designer info
      if (text.designerInfo) {
        doc.font('Helvetica')
           .fontSize(8)
           .fillColor('#666666')
           .text(`Design: ${text.designerInfo}`, x + 15, y + CD_CASE.height - 35, { 
             width: CD_CASE.width - 30,
             align: 'center'
           });
      }
      
      // Additional text
      if (text.additionalText) {
        doc.font('Helvetica')
           .fontSize(8)
           .fillColor('#666666')
           .text(text.additionalText, x + 15, y + CD_CASE.height - 20, { 
             width: CD_CASE.width - 30,
             align: 'center'
           });
      }
      
      // Restore graphics state
      doc.restore();
    }
  } catch (error) {
    console.error('Error adding template components:', error);
    // Don't throw the error, just log it and continue
    // This prevents one template issue from breaking the entire PDF
    
    // Add error indication to the template
    doc.rect(x, y, CD_CASE.width, CD_CASE.height)
       .fillAndStroke('#ffeeee', '#ff6666');
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .fillColor('#cc0000')
       .text('Error creating template', x + 20, y + CD_CASE.height / 2 - 10, {
         width: CD_CASE.width - 40,
         align: 'center'
       });
  }
}

/**
 * Place an image from URL at the specified position in the document
 * @param {PDFDocument} doc - The PDF document
 * @param {String} imageUrl - URL of the image in Vercel Blob storage
 * @param {Number} x - X position
 * @param {Number} y - Y position
 * @param {Number} width - Width to resize the image to
 * @param {Number} height - Height to resize the image to
 */
async function placeImageFromUrl(doc, imageUrl, x, y, width, height) {
  if (!imageUrl) {
    // Draw a placeholder for missing image
    drawPlaceholder(doc, x, y, width, height, 'No Image');
    return;
  }
  
  try {
    console.log(`Processing image: ${imageUrl ? imageUrl.substring(0, 50) + '...' : 'undefined'}`);
    
    // Set fetch timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Fetch the image from Blob storage
    const response = await fetch(imageUrl, { 
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' } // Prevent caching issues
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Received empty image data');
    }
    
    const imageBuffer = Buffer.from(arrayBuffer);
    
    console.log(`Image downloaded, size: ${imageBuffer.length} bytes.`);

    try {
      // Process with sharp for better reliability
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ 
          width: Math.round(width), 
          height: Math.round(height), 
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFormat('jpeg')
        .toBuffer();
      
      // Add the image to the PDF
      doc.image(resizedImageBuffer, x, y, { 
        width: width, 
        height: height,
        align: 'center',
        valign: 'center'
      });
      
      console.log(`Image added to PDF at position (${x}, ${y})`);
    } catch (sharpError) {
      console.error('Error processing image with sharp:', sharpError);
      
      // Fallback: try using PDFKit directly if sharp fails
      try {
        doc.image(imageBuffer, x, y, { width, height });
        console.log('Image added using PDFKit fallback');
      } catch (pdfkitError) {
        console.error('PDFKit fallback also failed:', pdfkitError);
        throw pdfkitError;
      }
    }
  } catch (error) {
    console.error('Error processing image URL:', error);
    
    // Draw a placeholder for the failed image
    drawPlaceholder(doc, x, y, width, height, 'Image Error');
  }
}

/**
 * Draw a placeholder rectangle for missing or error images
 * @param {PDFDocument} doc - The PDF document
 * @param {Number} x - X position
 * @param {Number} y - Y position
 * @param {Number} width - Width of placeholder
 * @param {Number} height - Height of placeholder
 * @param {String} message - Message to display in placeholder
 */
function drawPlaceholder(doc, x, y, width, height, message) {
  // Save current graphics state
  doc.save();
  
  // Draw placeholder rectangle
  doc.rect(x, y, width, height)
     .fillAndStroke('#f0f0f0', '#cccccc');
  
  // Add placeholder text
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor('#999999')
     .text(message, x, y + height/2 - 5, {
       width: width,
       align: 'center'
     });
  
  // Restore graphics state
  doc.restore();
}

// Export the server as a serverless function
module.exports = serverless(app); 
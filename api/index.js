const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
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

  // Create a new PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 36, left: 36, right: 36, bottom: 36 }
  });

  // Create a buffer to store the PDF
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  // Process each requested template per page
  const templatesPerPage = Math.min(perPage, 3);

  // Calculate spacing and position for templates
  const availableWidth = PAGE_WIDTH - 72; // 72 points margin (36 on each side)
  const availableHeight = PAGE_HEIGHT - 72; // 72 points margin (36 on each side)
  
  let yOffset = 36; // Start from top margin
  
  // Add each template to the page
  for (let i = 0; i < templatesPerPage; i++) {
    // Position the template centered horizontally
    const xPosition = (PAGE_WIDTH - CD_CASE.width) / 2;
    
    // Calculate vertical position based on template number
    const templateHeight = CD_CASE.height;
    const spacing = (availableHeight - (templateHeight * templatesPerPage)) / (templatesPerPage + 1);
    const yPosition = yOffset + spacing + (i * (templateHeight + spacing));
    
    // Add template components
    await addCDTemplate(doc, xPosition, yPosition, imageUrls, text);
  }

  // Finalize the PDF
  doc.end();

  // Return a Promise that resolves with the PDF buffer
  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
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
  // Draw guidelines for the CD case
  doc.rect(x, y, CD_CASE.width, CD_CASE.height)
     .stroke('#cccccc');
  
  // Process and place each image based on the template layout
  try {
    // Front cover outside
    if (imageUrls.frontCoverOutside) {
      await placeImageFromUrl(doc, imageUrls.frontCoverOutside, x, y, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Front cover inside
    if (imageUrls.frontCoverInside) {
      await placeImageFromUrl(doc, imageUrls.frontCoverInside, x + CD_CASE.width / 2, y, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Back cover
    if (imageUrls.backCover) {
      await placeImageFromUrl(doc, imageUrls.backCover, x, y + CD_CASE.height / 2, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // CD image
    if (imageUrls.cdImage) {
      await placeImageFromUrl(doc, imageUrls.cdImage, x + CD_CASE.width / 2, y + CD_CASE.height / 2, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Add text elements
    if (text.albumTitle) {
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text(text.albumTitle, x + 10, y + 10, { width: CD_CASE.width - 20 });
    }
    
    if (text.artistName) {
      doc.font('Helvetica')
         .fontSize(10)
         .text(text.artistName, x + 10, y + 30, { width: CD_CASE.width - 20 });
    }
    
    if (text.designerInfo) {
      doc.font('Helvetica')
         .fontSize(8)
         .text(`Design: ${text.designerInfo}`, x + 10, y + 50, { width: CD_CASE.width - 20 });
    }
    
    if (text.additionalText) {
      doc.font('Helvetica')
         .fontSize(8)
         .text(text.additionalText, x + 10, y + 70, { width: CD_CASE.width - 20 });
    }
  } catch (error) {
    console.error('Error adding template components:', error);
    throw error;
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
  try {
    // Fetch the image from Blob storage
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    
    // Resize and optimize the image using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: Math.round(width), height: Math.round(height), fit: 'cover' })
      .toBuffer();
    
    // Add the image to the PDF
    doc.image(resizedImageBuffer, x, y, { width, height });
  } catch (error) {
    console.error('Error processing image URL:', error);
    // Draw a placeholder instead
    doc.rect(x, y, width, height)
       .fillAndStroke('#f0f0f0', '#cccccc');
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#999999')
       .text('Image Error', x + width/2 - 20, y + height/2 - 5);
  }
}

// Export the server as a serverless function
module.exports = serverless(app); 
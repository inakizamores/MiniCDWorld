const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// In-memory storage for template data (for the session)
const templateCache = {};

// Configure memory storage for uploads
const storage = multer.memoryStorage();

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Configure upload settings
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: fileFilter
});

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

// Upload files endpoint
app.post('/api/upload', upload.fields([
  { name: 'frontCoverOutside', maxCount: 1 },
  { name: 'frontCoverInside', maxCount: 1 },
  { name: 'backCover', maxCount: 1 },
  { name: 'cdImage', maxCount: 1 },
  { name: 'additionalImage1', maxCount: 1 },
  { name: 'additionalImage2', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    // Generate a unique ID for this template
    const templateId = uuidv4();

    // Store file buffers and form data in the cache
    templateCache[templateId] = {
      files: req.files,
      text: req.body,
      status: 'uploaded',
      createdAt: Date.now()
    };

    // Automatically clean up this template after 30 minutes
    setTimeout(() => {
      if (templateCache[templateId]) {
        delete templateCache[templateId];
      }
    }, 30 * 60 * 1000);

    // Return success response with templateId
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      templateId: templateId
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message
    });
  }
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
    
    // Generate PDF
    const pdfBuffer = await generatePDFTemplate(templateData.files, templateData.text, parseInt(perPage));
    
    // Store the PDF buffer in the cache
    templateCache[templateId].pdfBuffer = pdfBuffer;
    templateCache[templateId].status = 'completed';

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      pdfUrl: `/api/download/${templateId}`
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Update template status to error
    if (req.body.templateId && templateCache[req.body.templateId]) {
      templateCache[req.body.templateId].status = 'error';
      templateCache[req.body.templateId].error = error.message;
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
    
    if (!templateCache[templateId] || !templateCache[templateId].pdfBuffer) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found or not generated yet'
      });
    }
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cd_template_${templateId}.pdf`);
    
    // Send the PDF buffer
    res.send(templateCache[templateId].pdfBuffer);
    
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
 * @param {Object} files - Object containing file buffers from multer
 * @param {Object} text - Object containing text for album title, etc.
 * @param {Number} perPage - Number of CD templates per page (1-3)
 * @returns {Promise<Buffer>} - PDF content as a buffer
 */
async function generatePDFTemplate(files, text, perPage = 1) {
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
    await addCDTemplate(doc, xPosition, yPosition, files, text);
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
 * @param {Object} files - Object containing file buffers
 * @param {Object} text - Object containing text data
 */
async function addCDTemplate(doc, x, y, files, text) {
  // Draw guidelines for the CD case
  doc.rect(x, y, CD_CASE.width, CD_CASE.height)
     .stroke('#cccccc');
  
  // Process and place each image based on the template layout
  try {
    // Front cover outside
    if (files.frontCoverOutside && files.frontCoverOutside.length > 0) {
      await placeImageFromBuffer(doc, files.frontCoverOutside[0].buffer, x, y, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Front cover inside
    if (files.frontCoverInside && files.frontCoverInside.length > 0) {
      await placeImageFromBuffer(doc, files.frontCoverInside[0].buffer, x + CD_CASE.width / 2, y, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Back cover
    if (files.backCover && files.backCover.length > 0) {
      await placeImageFromBuffer(doc, files.backCover[0].buffer, x, y + CD_CASE.height / 2, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // CD image
    if (files.cdImage && files.cdImage.length > 0) {
      await placeImageFromBuffer(doc, files.cdImage[0].buffer, x + CD_CASE.width / 2, y + CD_CASE.height / 2, CD_CASE.width / 2, CD_CASE.height / 2);
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
 * Place an image from buffer at the specified position in the document
 * @param {PDFDocument} doc - The PDF document
 * @param {Buffer} imageBuffer - Image data as buffer
 * @param {Number} x - X position
 * @param {Number} y - Y position
 * @param {Number} width - Width to resize the image to
 * @param {Number} height - Height to resize the image to
 */
async function placeImageFromBuffer(doc, imageBuffer, x, y, width, height) {
  try {
    // Resize and optimize the image using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: Math.round(width), height: Math.round(height), fit: 'cover' })
      .toBuffer();
    
    // Add the image to the PDF
    doc.image(resizedImageBuffer, x, y, { width, height });
  } catch (error) {
    console.error('Error processing image buffer:', error);
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
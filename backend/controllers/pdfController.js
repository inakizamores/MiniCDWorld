const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { generatePDFTemplate } = require('../utils/pdfGenerator');
const s3Storage = require('../utils/s3Storage');
const { v4: uuidv4 } = require('uuid');

// In-memory cache for template data
// In a production environment with multiple instances, you might want to use
// a distributed cache like Redis, but for simplicity we'll use a local object
const templateCache = {};

// Add a cache expiration (30 minutes)
const CACHE_EXPIRATION_MS = 30 * 60 * 1000;

// Setup cache cleanup (runs every 10 minutes)
setInterval(() => {
  const now = Date.now();
  Object.keys(templateCache).forEach(key => {
    if (now - templateCache[key].createdAt > CACHE_EXPIRATION_MS) {
      delete templateCache[key];
    }
  });
}, 10 * 60 * 1000);

/**
 * Handle file uploads from the client
 */
exports.uploadFiles = async (req, res) => {
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
    
    // Store file data and metadata in the cache
    templateCache[templateId] = {
      files: req.files, // Contains file buffers from multer's memoryStorage
      text: req.body,
      status: 'uploaded',
      createdAt: Date.now()
    };

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
};

/**
 * Generate PDF from uploaded files and text
 */
exports.generatePDF = async (req, res) => {
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
    
    // Generate PDF using the utility function
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
};

/**
 * Get template generation status
 */
exports.getTemplateStatus = (req, res) => {
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
};

/**
 * Download the generated PDF
 */
exports.downloadPDF = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    // Check if template exists and has a PDF
    if (!templateCache[templateId] || !templateCache[templateId].pdfBuffer) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found or not generated yet'
      });
    }
    
    // Set headers for PDF download
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
}; 
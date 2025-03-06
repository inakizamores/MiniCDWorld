const path = require('path');
const PDFDocument = require('pdfkit');
const { generatePDFTemplate } = require('../utils/pdfGenerator');
const storage = require('../utils/storage');
const { v4: uuidv4 } = require('uuid');

// For serverless environment, use an object for in-memory cache
// In production, you might want to use a database or Redis
const templateCache = {};

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
    const uploadedFiles = {};

    // Process and store each file
    for (const fieldName in req.files) {
      const files = req.files[fieldName];
      
      if (files.length > 0) {
        const file = files[0];
        
        // Upload file to storage (S3 or local based on environment)
        const fileUrl = await storage.uploadFile(
          file.buffer, // Using multer's memory storage for serverless
          file.originalname,
          'uploads'
        );
        
        // Store file URL
        uploadedFiles[fieldName] = fileUrl;
      }
    }
    
    // Store file URLs and form data in the cache
    templateCache[templateId] = {
      files: uploadedFiles,
      text: req.body,
      status: 'uploaded',
      createdAt: new Date()
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
    const pdfStream = await generatePDFTemplate(templateData.files, templateData.text, parseInt(perPage));
    
    // Upload PDF to storage
    const pdfUrl = await storage.uploadFile(
      pdfStream,
      `cd_template_${templateId}.pdf`,
      'output'
    );
    
    // Update template with PDF info
    templateCache[templateId].pdfUrl = pdfUrl;
    templateCache[templateId].status = 'completed';

    // Return success with PDF URL
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
    
    // Check if template exists and is completed
    if (!templateCache[templateId] || templateCache[templateId].status !== 'completed') {
      return res.status(404).json({
        success: false,
        message: 'PDF not found or not completed'
      });
    }
    
    // Get the PDF URL
    const pdfUrl = templateCache[templateId].pdfUrl;
    
    // Get the PDF content
    const pdfBuffer = await storage.getFile(pdfUrl);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cd_template_${templateId}.pdf`);
    
    // Send the PDF
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Error downloading PDF',
      error: error.message
    });
  }
}; 
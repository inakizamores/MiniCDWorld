const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { generatePDFTemplate } = require('../utils/pdfGenerator');
const s3Storage = require('../utils/s3Storage');
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
    
    // Upload files to S3 and store their S3 paths
    const s3Files = {};
    for (const fieldName in req.files) {
      const fileArray = req.files[fieldName];
      s3Files[fieldName] = [];
      
      for (const file of fileArray) {
        // Upload file to S3
        const s3Key = `uploads/${templateId}/${fieldName}/${path.basename(file.path)}`;
        const s3Url = await s3Storage.uploadFile(file.path, s3Key);
        
        // Add S3 information to the files object
        s3Files[fieldName].push({
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          s3Key: s3Key,
          s3Url: s3Url
        });
        
        // Delete local file after upload
        fs.unlinkSync(file.path);
      }
    }
    
    // Store file paths and form data in the cache
    templateCache[templateId] = {
      files: s3Files,
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
    const { pdfBuffer, pdfFilename } = await generatePDFTemplate(templateData.files, templateData.text, parseInt(perPage));
    
    // Upload PDF to S3
    const s3Key = `output/${templateId}/${pdfFilename}`;
    const s3Url = await s3Storage.uploadBuffer(pdfBuffer, s3Key, 'application/pdf');
    
    // Update template with PDF info
    templateCache[templateId].pdfKey = s3Key;
    templateCache[templateId].pdfUrl = s3Url;
    templateCache[templateId].status = 'completed';

    // Return the PDF URL
    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      templateId: templateId,
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
 * Download generated PDF
 */
exports.downloadPDF = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    if (!templateCache[templateId] || !templateCache[templateId].pdfKey) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }
    
    // Get the S3 signed URL
    const signedUrl = s3Storage.getSignedUrl(templateCache[templateId].pdfKey, 300); // 5 minutes expiry
    
    // Redirect to the signed URL
    return res.redirect(signedUrl);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return res.status(500).json({
      success: false, 
      message: 'Error downloading PDF',
      error: error.message
    });
  }
}; 
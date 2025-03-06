const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../middleware/fileUpload');

// Route for uploading images and text data
router.post('/upload', upload.fields([
  { name: 'frontCoverOutside', maxCount: 1 },
  { name: 'frontCoverInside', maxCount: 1 },
  { name: 'backCover', maxCount: 1 },
  { name: 'cdImage', maxCount: 1 },
  { name: 'additionalImage1', maxCount: 1 },
  { name: 'additionalImage2', maxCount: 1 }
]), pdfController.uploadFiles);

// Route for generating PDF
router.post('/generate', pdfController.generatePDF);

// Route to get template status
router.get('/status/:templateId', pdfController.getTemplateStatus);

// Route to download the generated PDF
router.get('/download/:templateId', pdfController.downloadPDF);

module.exports = router; 
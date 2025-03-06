const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const storage = require('./storage');

// PDF page dimensions (A4 size)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// CD case dimensions (in points, 1 inch = 72 points)
const CD_CASE = {
  width: 4.75 * 72, // 4.75 inches in points
  height: 4.75 * 72, // 4.75 inches in points
  spine: 0.375 * 72 // 3/8 inch in points
};

/**
 * Generate a PDF template with the provided images and text
 * @param {Object} files - Object containing file URLs for each section
 * @param {Object} text - Object containing text for album title, etc.
 * @param {Number} perPage - Number of CD templates per page (1-3)
 * @returns {Buffer} - PDF content as a buffer
 */
exports.generatePDFTemplate = async (files, text, perPage = 1) => {
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
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

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
      resolve(Buffer.concat(buffers));
    });
  });
};

/**
 * Add a CD template at the specified position
 * @param {PDFDocument} doc - The PDF document
 * @param {Number} x - X position for the template
 * @param {Number} y - Y position for the template
 * @param {Object} files - Object containing file URLs
 * @param {Object} text - Object containing text data
 */
async function addCDTemplate(doc, x, y, files, text) {
  // Draw guidelines for the CD case (for debugging)
  doc.rect(x, y, CD_CASE.width, CD_CASE.height)
     .stroke('#cccccc');
  
  // Process and place each image based on the template layout
  try {
    // Front cover outside
    if (files.frontCoverOutside) {
      await placeImage(doc, files.frontCoverOutside, x, y, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Front cover inside
    if (files.frontCoverInside) {
      await placeImage(doc, files.frontCoverInside, x + CD_CASE.width / 2, y, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // Back cover
    if (files.backCover) {
      await placeImage(doc, files.backCover, x, y + CD_CASE.height / 2, CD_CASE.width / 2, CD_CASE.height / 2);
    }
    
    // CD image
    if (files.cdImage) {
      await placeImage(doc, files.cdImage, x + CD_CASE.width / 2, y + CD_CASE.height / 2, CD_CASE.width / 2, CD_CASE.height / 2);
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
 * Place an image at the specified position in the document
 * @param {PDFDocument} doc - The PDF document
 * @param {String} imageUrl - URL or path to the image file
 * @param {Number} x - X position
 * @param {Number} y - Y position
 * @param {Number} width - Width to resize the image to
 * @param {Number} height - Height to resize the image to
 */
async function placeImage(doc, imageUrl, x, y, width, height) {
  try {
    // Get the image from storage
    const imageBuffer = await storage.getFile(imageUrl);
    
    // Resize and optimize the image using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: Math.round(width), height: Math.round(height), fit: 'cover' })
      .toBuffer();
    
    // Add the image to the PDF
    doc.image(resizedImageBuffer, x, y, { width, height });
    
  } catch (error) {
    console.error(`Error processing image ${imageUrl}:`, error);
    // Draw a placeholder instead
    doc.rect(x, y, width, height)
       .fillAndStroke('#f0f0f0', '#cccccc');
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#999999')
       .text('Image Error', x + width/2 - 20, y + height/2 - 5);
  }
} 
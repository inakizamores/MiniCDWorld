const s3Storage = require('./s3Storage');

// Clean up templates older than a certain time (e.g., 24 hours)
const cleanupTemplates = async (templateCache, maxAgeHours = 24) => {
  const now = new Date();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  
  for (const templateId in templateCache) {
    const template = templateCache[templateId];
    const createdAt = new Date(template.createdAt);
    
    // Check if template is older than max age
    if (now - createdAt > maxAgeMs) {
      try {
        // Delete files from S3
        if (template.files) {
          for (const fieldName in template.files) {
            for (const file of template.files[fieldName]) {
              if (file.s3Key) {
                await s3Storage.deleteFile(file.s3Key);
              }
            }
          }
        }
        
        // Delete PDF from S3
        if (template.pdfKey) {
          await s3Storage.deleteFile(template.pdfKey);
        }
        
        // Remove template from cache
        delete templateCache[templateId];
        console.log(`Cleaned up template ${templateId}`);
      } catch (error) {
        console.error(`Error cleaning up template ${templateId}:`, error);
      }
    }
  }
};

module.exports = {
  cleanupTemplates
}; 
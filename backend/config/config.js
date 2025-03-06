// Configuration settings loaded from environment variables
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // File upload limits
  maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  
  // Template settings
  pdfMargin: 36, // PDF margin in points (1/2 inch)
  
  // Paths
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  outputDir: process.env.OUTPUT_DIR || 'output',
  
  // CORS settings
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

module.exports = config; 
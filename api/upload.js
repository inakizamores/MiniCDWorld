// This file specifically handles the /api/upload endpoint
const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { put } = require('@vercel/blob');

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
    console.log('Handling OPTIONS request for upload endpoint');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

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

// Configure upload settings with smaller size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Reduced to 2MB file size limit
  },
  fileFilter: fileFilter
});

// In-memory storage for template metadata (shared between serverless invocations via module scope)
const templateCache = {};

// Upload files endpoint - optimized to prevent timeouts
app.post('/api/upload', upload.fields([
  { name: 'frontCoverOutside', maxCount: 1 },
  { name: 'frontCoverInside', maxCount: 1 },
  { name: 'backCover', maxCount: 1 },
  { name: 'cdImage', maxCount: 1 },
  { name: 'additionalImage1', maxCount: 1 },
  { name: 'additionalImage2', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Upload endpoint called');
    console.log('Request files:', Object.keys(req.files || {}));
    
    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    // Generate a unique ID for this template
    const templateId = uuidv4();
    
    // Return the templateId immediately to prevent timeout
    // while processing continues in the background
    res.status(200).json({
      success: true,
      message: 'Upload processing started',
      templateId: templateId
    });
    
    // Continue processing uploads in the background
    // This is an optimization for serverless environments
    (async () => {
      try {
        // Upload each file to Vercel Blob storage
        const blobPromises = [];
        const blobUrls = {};
        
        for (const fieldName in req.files) {
          const file = req.files[fieldName][0];
          // Resize the image before uploading to reduce processing time
          if (file.size > 500 * 1024) {
            // If we had sharp imported here, we could resize, but for simplicity we'll just upload directly
          }
          
          // Upload to Vercel Blob with a unique path
          const blobName = `${templateId}/${fieldName}-${Date.now()}.${file.originalname.split('.').pop()}`;
          const blob = put(blobName, file.buffer, {
            contentType: file.mimetype,
            access: 'public', // Make it publicly accessible
          });
          
          blobPromises.push(
            blob.then(result => {
              blobUrls[fieldName] = result.url;
            })
          );
        }
        
        // Wait for all blob uploads to complete
        await Promise.all(blobPromises);
        
        // Store template metadata in the cache
        templateCache[templateId] = {
          blobUrls: blobUrls,
          text: req.body,
          status: 'uploaded',
          createdAt: Date.now()
        };
        
        console.log(`Background upload processing completed for templateId: ${templateId}`);
      } catch (error) {
        console.error('Error in background upload processing:', error);
        // We can't respond to the client here since we already sent the response
        // But we can update the template status for status checks
        if (templateCache[templateId]) {
          templateCache[templateId].status = 'error';
          templateCache[templateId].error = error.message;
        }
      }
    })();
    
  } catch (error) {
    console.error('Error starting upload process:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing upload',
      error: error.message
    });
  }
});

// Status check endpoint specifically for this upload handler
app.get('/api/upload/status/:templateId', (req, res) => {
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
    urls: templateCache[templateId].blobUrls,
    error: templateCache[templateId].error || null
  });
});

// Also create a simplified route for testing
app.post('/upload', (req, res) => {
  console.log('Basic upload route hit');
  return res.status(200).json({
    success: true,
    message: 'Upload API test endpoint is running'
  });
});

// This route is to test if the service is running
app.get('/api/upload', (req, res) => {
  console.log('GET to upload endpoint');
  res.status(200).json({ message: 'Upload API is running' });
});

// Add a catch-all route for debugging
app.all('*', (req, res) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  res.status(200).json({ 
    message: 'Upload API catchall route',
    method: req.method,
    path: req.path
  });
});

// Export the server as a serverless function
module.exports = serverless(app); 
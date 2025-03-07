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
  console.log(`[Upload API] Received ${req.method} request to ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    console.log('[Upload API] Handling OPTIONS request');
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

// Configure upload settings
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: fileFilter
});

// In-memory storage for template metadata (shared between serverless invocations via module scope)
const templateCache = {};
global.templateCache = templateCache;

// Custom route for the root path (which will match /api/upload)
app.post('/', upload.fields([
  { name: 'frontCoverOutside', maxCount: 1 },
  { name: 'frontCoverInside', maxCount: 1 },
  { name: 'backCover', maxCount: 1 },
  { name: 'cdImage', maxCount: 1 },
  { name: 'additionalImage1', maxCount: 1 },
  { name: 'additionalImage2', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('[Upload API] Processing upload request');
    
    // Check if files were uploaded
    if (!req.files) {
      console.log('[Upload API] No files in request');
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    console.log(`[Upload API] Received ${Object.keys(req.files).length} file types`);

    // Generate a unique ID for this template
    const templateId = uuidv4();
    
    // Upload each file to Vercel Blob storage
    const blobPromises = [];
    const blobUrls = {};
    
    for (const fieldName in req.files) {
      const file = req.files[fieldName][0];
      // Upload to Vercel Blob with a unique path
      const blobName = `${templateId}/${fieldName}-${Date.now()}.${file.originalname.split('.').pop()}`;
      console.log(`[Upload API] Uploading ${fieldName} to Blob storage: ${blobName}`);
      
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
    console.log('[Upload API] All files uploaded to Blob storage');
    
    // Store template metadata in the cache
    templateCache[templateId] = {
      blobUrls: blobUrls,
      text: req.body,
      status: 'uploaded',
      createdAt: Date.now()
    };
    
    console.log(`[Upload API] Template metadata stored with ID: ${templateId}`);
    
    // Return success response with templateId
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      templateId: templateId
    });
  } catch (error) {
    console.error('[Upload API] Error uploading files:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message
    });
  }
});

// This route is to test if the service is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Upload API is running' });
});

// Fallback for any other request method
app.all('*', (req, res) => {
  console.log(`[Upload API] Received unhandled ${req.method} request`);
  res.status(200).json({ message: 'Upload API received request' });
});

// Export the server as a serverless function
module.exports = serverless(app); 
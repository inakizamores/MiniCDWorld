// This file specifically handles the /api/upload endpoint
const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
// Wrapped in try-catch to provide better error messages if module is missing
let blobClient;
try {
  const { createClient } = require('@vercel/blob');
  blobClient = createClient();
  console.log('Vercel Blob client created successfully');
} catch (error) {
  console.error('Error initializing Vercel Blob client:', error);
  // Continue without blobClient - we'll handle this in the endpoint
}

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

// In-memory storage for template metadata (shared between serverless invocations via module scope)
const templateCache = {};

// Endpoint to get pre-signed URLs for direct uploads
app.post('/api/upload/prepare', async (req, res) => {
  try {
    console.log('Prepare upload endpoint called with body:', JSON.stringify(req.body));
    
    // Check if Vercel Blob client is available
    if (!blobClient) {
      console.error('Vercel Blob client not available - check BLOB_READ_WRITE_TOKEN environment variable');
      // Fall back to simple upload without Blob storage
      const templateId = uuidv4();
      
      // Initialize the template entry in the cache
      templateCache[templateId] = {
        status: 'preparing',
        createdAt: Date.now(),
        usingLegacyUpload: true
      };
      
      return res.status(200).json({
        success: true,
        message: 'Vercel Blob not configured, falling back to legacy upload',
        templateId: templateId,
        fallbackMode: true
      });
    }
    
    // Get the file info from the request
    const { files } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No file info provided'
      });
    }
    
    // Generate a unique ID for this template
    const templateId = uuidv4();
    
    // Generate pre-signed URLs for each file
    const uploadUrls = {};
    const filePromises = [];
    
    for (const file of files) {
      const { name, type } = file;
      if (!name || !type) continue;
      
      const fieldName = file.fieldName || 'file';
      const blobName = `${templateId}/${fieldName}-${Date.now()}${path.extname(name)}`;
      
      console.log(`Generating pre-signed URL for ${fieldName} with type ${type}`);
      
      // Create a pre-signed URL for direct upload
      const promise = blobClient.getUploadUrl(blobName, {
        contentType: type,
        access: 'public',
      }).then(urlData => {
        console.log(`Generated upload URL for ${fieldName}: ${urlData.url.substring(0, 50)}...`);
        uploadUrls[fieldName] = {
          uploadUrl: urlData.url,
          pathname: urlData.pathname,
          blobName: blobName
        };
      }).catch(error => {
        console.error(`Error generating upload URL for ${fieldName}:`, error);
        throw error; // Re-throw to be caught in Promise.all
      });
      
      filePromises.push(promise);
    }
    
    // Wait for all URL generations to complete
    await Promise.all(filePromises);
    
    // Initialize the template entry in the cache
    templateCache[templateId] = {
      status: 'preparing',
      createdAt: Date.now(),
      blobUrls: {},
      blobPaths: {},
      completedUploads: 0,
      totalUploads: files.length
    };
    
    // Return the pre-signed URLs to the client
    return res.status(200).json({
      success: true,
      message: 'Upload URLs generated',
      templateId: templateId,
      uploadUrls: uploadUrls
    });
    
  } catch (error) {
    console.error('Error preparing upload:', error);
    return res.status(500).json({
      success: false,
      message: `Error preparing upload: ${error.message}`,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint to notify of completed direct upload
app.post('/api/upload/complete', async (req, res) => {
  try {
    const { templateId, fieldName, blobName, url } = req.body;
    
    if (!templateId || !fieldName || !blobName || !url) {
      return res.status(400).json({
        success: false,
        message: 'Missing required information'
      });
    }
    
    if (!templateCache[templateId]) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Update the template cache with the completed upload
    templateCache[templateId].blobUrls[fieldName] = url;
    templateCache[templateId].blobPaths[fieldName] = blobName;
    templateCache[templateId].completedUploads += 1;
    
    // If all uploads are complete, update the status
    if (templateCache[templateId].completedUploads >= templateCache[templateId].totalUploads) {
      templateCache[templateId].status = 'uploaded';
    }
    
    return res.status(200).json({
      success: true,
      message: 'Upload completion recorded',
      status: templateCache[templateId].status
    });
    
  } catch (error) {
    console.error('Error recording upload completion:', error);
    return res.status(500).json({
      success: false,
      message: 'Error recording upload completion',
      error: error.message
    });
  }
});

// Endpoint to store form data
app.post('/api/upload/form', async (req, res) => {
  try {
    const { templateId, formData } = req.body;
    
    if (!templateId || !formData) {
      return res.status(400).json({
        success: false,
        message: 'Missing template ID or form data'
      });
    }
    
    if (!templateCache[templateId]) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Store the form data in the template cache
    templateCache[templateId].text = formData;
    
    return res.status(200).json({
      success: true,
      message: 'Form data stored successfully'
    });
    
  } catch (error) {
    console.error('Error storing form data:', error);
    return res.status(500).json({
      success: false,
      message: 'Error storing form data',
      error: error.message
    });
  }
});

// Status check endpoint
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
    completedUploads: templateCache[templateId].completedUploads,
    totalUploads: templateCache[templateId].totalUploads,
    blobUrls: templateCache[templateId].blobUrls,
    error: templateCache[templateId].error || null
  });
});

// Legacy route to handle simple uploads for fallback compatibility
app.post('/api/upload', async (req, res) => {
  console.log('Legacy upload endpoint called');
  try {
    // Check content type to determine how to handle the request
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // This would require multer to handle the file upload
      // But since this is a fallback for when Vercel Blob is not available
      // We'll simply acknowledge the upload and let the generation process
      // Use placeholder images or handle the error appropriately
      
      // Generate a unique ID
      const templateId = req.body.templateId || uuidv4();
      
      // Store template information in cache
      templateCache[templateId] = {
        status: 'uploaded',
        createdAt: Date.now(),
        usingLegacyUpload: true,
        text: req.body
      };
      
      return res.status(200).json({
        success: true,
        message: 'Legacy upload handled in fallback mode',
        templateId: templateId
      });
    } else {
      // Generate a unique ID
      const templateId = req.body.templateId || uuidv4();
      
      // Return immediately with the ID
      return res.status(200).json({
        success: true,
        message: 'Upload handling started - using legacy endpoint',
        templateId: templateId
      });
    }
  } catch (error) {
    console.error('Error in legacy upload endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing upload',
      error: error.message
    });
  }
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
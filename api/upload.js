// This file specifically handles the /api/upload endpoint
const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { put, createClient } = require('@vercel/blob');

const app = express();
const blobClient = createClient();

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
    console.log('Prepare upload endpoint called');
    
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
      
      // Create a pre-signed URL for direct upload
      const promise = blobClient.getUploadUrl(blobName, {
        contentType: type,
        access: 'public',
      }).then(urlData => {
        uploadUrls[fieldName] = {
          uploadUrl: urlData.url,
          pathname: urlData.pathname,
          blobName: blobName
        };
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
      message: 'Error preparing upload',
      error: error.message
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
    // Generate a unique ID
    const templateId = uuidv4();
    
    // Return immediately with the ID
    return res.status(200).json({
      success: true,
      message: 'Upload handling started - using legacy endpoint',
      templateId: templateId
    });
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
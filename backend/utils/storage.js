const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const config = require('../config/config');

// Configure AWS with environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// S3 bucket name
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'minicdworld';

// Check if we should use S3 or local storage
const useS3 = process.env.STORAGE_TYPE === 's3';

/**
 * Upload a file to storage (S3 or local)
 * @param {Buffer|String} fileContent - File content or file path
 * @param {String} fileName - Original file name
 * @param {String} folder - Folder to store in (uploads or output)
 * @returns {Promise<String>} - URL or path to the stored file
 */
async function uploadFile(fileContent, fileName, folder = 'uploads') {
  // Generate a unique file name to prevent conflicts
  const uniqueFileName = `${folder}/${Date.now()}-${uuidv4()}${path.extname(fileName)}`;
  
  if (useS3) {
    // If fileContent is a file path, read the file
    const content = typeof fileContent === 'string' 
      ? fs.readFileSync(fileContent) 
      : fileContent;

    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: content,
      ContentType: getContentType(fileName)
    };

    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Return the URL
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  } else {
    // Use local storage (for development)
    const storageDir = path.join(__dirname, '..', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const localPath = path.join(storageDir, path.basename(uniqueFileName));
    
    // If fileContent is a Buffer, write it to the file
    if (Buffer.isBuffer(fileContent)) {
      fs.writeFileSync(localPath, fileContent);
    } else {
      // If fileContent is a path, copy the file
      fs.copyFileSync(fileContent, localPath);
    }

    // Return path relative to the workspace
    return `/${folder}/${path.basename(uniqueFileName)}`;
  }
}

/**
 * Get a file from storage (S3 or local)
 * @param {String} fileUrl - URL or path to the file
 * @returns {Promise<Buffer>} - File content as Buffer
 */
async function getFile(fileUrl) {
  if (useS3) {
    // Extract the key from the URL
    const key = fileUrl.split('/').slice(3).join('/');
    
    // Get from S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    try {
      const data = await s3.getObject(params).promise();
      return data.Body;
    } catch (error) {
      console.error('S3 download error:', error);
      throw error;
    }
  } else {
    // Get from local storage
    const localPath = path.join(__dirname, '..', fileUrl);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    } else {
      throw new Error(`File not found: ${localPath}`);
    }
  }
}

/**
 * Get content type based on file extension
 * @param {String} fileName - File name
 * @returns {String} - Content type
 */
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf'
  };

  return types[ext] || 'application/octet-stream';
}

module.exports = {
  uploadFile,
  getFile
}; 
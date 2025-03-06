const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET;

/**
 * Upload a file to S3
 * @param {string} filePath - Local file path
 * @param {string} key - S3 object key (path in bucket)
 * @returns {Promise<string>} - S3 URL of the uploaded file
 */
const uploadFile = async (filePath, key) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: getContentType(filePath)
    };
    
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

/**
 * Upload file buffer to S3
 * @param {Buffer} fileBuffer - File contents as buffer
 * @param {string} key - S3 object key (path in bucket)
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - S3 URL of the uploaded file
 */
const uploadBuffer = async (fileBuffer, key, contentType) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType
    };
    
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading buffer to S3:', error);
    throw error;
  }
};

/**
 * Get a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<AWS.S3.GetObjectOutput>} - S3 object data
 */
const getFile = async (key) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };
    
    return await s3.getObject(params).promise();
  } catch (error) {
    console.error('Error getting file from S3:', error);
    throw error;
  }
};

/**
 * Generate a signed URL for temporary access to an S3 object
 * @param {string} key - S3 object key
 * @param {number} expirySeconds - Seconds until URL expires (default: 60)
 * @returns {string} - Signed URL
 */
const getSignedUrl = (key, expirySeconds = 60) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expirySeconds
  };
  
  return s3.getSignedUrl('getObject', params);
};

/**
 * Delete a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<AWS.S3.DeleteObjectOutput>}
 */
const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };
    
    return await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

/**
 * Get content type based on file extension
 * @param {string} filePath - Path to file
 * @returns {string} - Content type
 */
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.txt': 'text/plain'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};

module.exports = {
  uploadFile,
  uploadBuffer,
  getFile,
  getSignedUrl,
  deleteFile
}; 
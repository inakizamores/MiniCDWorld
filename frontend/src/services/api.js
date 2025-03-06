import axios from 'axios';

// Determine if we're in production
const isProd = process.env.NODE_ENV === 'production';

// Set the base URL depending on environment
const BASE_URL = isProd ? '/api' : '/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API functions for template operations
const templateService = {
  // Upload files and form data
  uploadFiles: async (formData) => {
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  // Generate PDF from uploaded files
  generatePDF: async (templateId, perPage = 1) => {
    try {
      const response = await api.post('/generate', { templateId, perPage });
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },

  // Check template generation status
  getTemplateStatus: async (templateId) => {
    try {
      const response = await api.get(`/status/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking template status:', error);
      throw error;
    }
  },

  // Get download URL for a template
  getDownloadUrl: (templateId) => {
    return `${BASE_URL}/download/${templateId}`;
  }
};

export default templateService; 
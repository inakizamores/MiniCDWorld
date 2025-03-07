import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';

function TemplateEditor({ setTemplateId, setGenerationStatus }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    albumTitle: '',
    artistName: '',
    designerInfo: '',
    additionalText: '',
    perPage: 1
  });
  
  const [images, setImages] = useState({
    frontCoverOutside: null,
    frontCoverInside: null,
    backCover: null,
    cdImage: null,
    additionalImage1: null,
    additionalImage2: null
  });
  
  const [previews, setPreviews] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageDrop = (acceptedFiles, fieldName) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews({
        ...previews,
        [fieldName]: previewUrl
      });
      
      // Store file
      setImages({
        ...images,
        [fieldName]: file
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);
    
    // Validate required fields
    if (!images.frontCoverOutside || !images.backCover || !images.cdImage) {
      setUploadError('Please upload at least the Front Cover, Back Cover, and CD Image.');
      return;
    }
    
    if (!formData.albumTitle) {
      setUploadError('Please enter an Album Title.');
      return;
    }
    
    // Create form data for upload
    const uploadData = new FormData();
    
    // Add images
    for (const key in images) {
      if (images[key]) {
        uploadData.append(key, images[key]);
      }
    }
    
    // Add text fields
    for (const key in formData) {
      uploadData.append(key, formData[key]);
    }
    
    try {
      setIsUploading(true);
      setGenerationStatus('uploading');
      
      // Step 1: Upload files
      console.log('Starting file upload...');
      const uploadResponse = await axios.post('/api/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout
      });
      
      const { templateId } = uploadResponse.data;
      console.log('Received template ID:', templateId);
      
      // Set the template ID right away
      setTemplateId(templateId);
      
      // Step 2: Poll for upload completion
      setGenerationStatus('processing');
      console.log('Polling for upload status...');
      
      let uploadComplete = false;
      let retryCount = 0;
      const maxRetries = 30; // Maximum number of status check retries
      
      while (!uploadComplete && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
        
        try {
          const statusResponse = await axios.get(`/api/upload/status/${templateId}`);
          console.log('Status check:', statusResponse.data);
          
          if (statusResponse.data.status === 'uploaded') {
            uploadComplete = true;
          } else if (statusResponse.data.status === 'error') {
            throw new Error(statusResponse.data.error || 'Error uploading files');
          }
          
          retryCount++;
        } catch (statusError) {
          console.error('Error checking upload status:', statusError);
          retryCount++;
          // Continue polling even if there's an error checking status
        }
      }
      
      if (!uploadComplete) {
        throw new Error('Upload process timed out. Please try again.');
      }
      
      // Step 3: Generate PDF
      console.log('Starting PDF generation...');
      setGenerationStatus('generating');
      const generateResponse = await axios.post('/api/generate', {
        templateId,
        perPage: formData.perPage
      });
      
      setGenerationStatus('completed');
      
      // Navigate to the result page
      navigate('/result');
      
    } catch (error) {
      console.error('Error processing template:', error);
      setUploadError(error.response?.data?.message || error.message || 'An error occurred while processing your request.');
      setGenerationStatus('error');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="form-container">
      <h2>Create Your CD Template</h2>
      
      {uploadError && (
        <div className="error">{uploadError}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Album Information</h3>
          
          <div className="input-group">
            <label htmlFor="albumTitle">Album Title*</label>
            <input
              type="text"
              id="albumTitle"
              name="albumTitle"
              value={formData.albumTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="artistName">Artist Name</label>
            <input
              type="text"
              id="artistName"
              name="artistName"
              value={formData.artistName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="designerInfo">Designer Info</label>
            <input
              type="text"
              id="designerInfo"
              name="designerInfo"
              value={formData.designerInfo}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="additionalText">Additional Text</label>
            <textarea
              id="additionalText"
              name="additionalText"
              value={formData.additionalText}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="input-group">
            <label htmlFor="perPage">CDs per Page (1-3)</label>
            <input
              type="number"
              id="perPage"
              name="perPage"
              min="1"
              max="3"
              value={formData.perPage}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>CD Case Images</h3>
          
          <div className="input-group">
            <label>Front Cover (Outside)*</label>
            <Dropzone onDrop={(files) => handleImageDrop(files, 'frontCoverOutside')}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                  {previews.frontCoverOutside && (
                    <img 
                      src={previews.frontCoverOutside} 
                      alt="Front Cover Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          
          <div className="input-group">
            <label>Front Cover (Inside)</label>
            <Dropzone onDrop={(files) => handleImageDrop(files, 'frontCoverInside')}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                  {previews.frontCoverInside && (
                    <img 
                      src={previews.frontCoverInside} 
                      alt="Inside Cover Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          
          <div className="input-group">
            <label>Back Cover*</label>
            <Dropzone onDrop={(files) => handleImageDrop(files, 'backCover')}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                  {previews.backCover && (
                    <img 
                      src={previews.backCover} 
                      alt="Back Cover Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          
          <div className="input-group">
            <label>CD Image*</label>
            <Dropzone onDrop={(files) => handleImageDrop(files, 'cdImage')}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                  {previews.cdImage && (
                    <img 
                      src={previews.cdImage} 
                      alt="CD Image Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          
          <div className="input-group">
            <label>Additional Image 1</label>
            <Dropzone onDrop={(files) => handleImageDrop(files, 'additionalImage1')}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                  {previews.additionalImage1 && (
                    <img 
                      src={previews.additionalImage1} 
                      alt="Additional Image 1 Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          
          <div className="input-group">
            <label>Additional Image 2</label>
            <Dropzone onDrop={(files) => handleImageDrop(files, 'additionalImage2')}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & drop an image here, or click to select</p>
                  {previews.additionalImage2 && (
                    <img 
                      src={previews.additionalImage2} 
                      alt="Additional Image 2 Preview" 
                      className="preview-image" 
                    />
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        </div>
        
        <div className="form-section">
          <button 
            type="submit" 
            className="button" 
            disabled={isUploading}
          >
            {isUploading ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TemplateEditor; 
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
    
    try {
      setIsUploading(true);
      setGenerationStatus('preparing');
      
      // Step 1: Prepare upload by getting pre-signed URLs
      console.log('Preparing upload...');
      
      // Create file info array for pre-signed URL request
      const fileInfoArray = [];
      for (const [fieldName, file] of Object.entries(images)) {
        if (file) {
          fileInfoArray.push({
            name: file.name,
            type: file.type,
            fieldName
          });
        }
      }
      
      // Get pre-signed URLs for direct upload
      const prepareResponse = await axios.post('/api/upload/prepare', {
        files: fileInfoArray
      }, { timeout: 10000 }); // Short timeout for this request
      
      const { templateId, uploadUrls } = prepareResponse.data;
      console.log('Received template ID and upload URLs', templateId);
      
      // Set the template ID right away
      setTemplateId(templateId);
      setGenerationStatus('uploading');
      
      // Step 2: Upload files directly to Vercel Blob using pre-signed URLs
      console.log('Starting direct uploads...');
      const uploadPromises = [];
      
      for (const [fieldName, file] of Object.entries(images)) {
        if (file && uploadUrls[fieldName]) {
          const urlInfo = uploadUrls[fieldName];
          
          // Upload directly to Vercel Blob
          const uploadPromise = fetch(urlInfo.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
            },
            body: file
          }).then(async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Direct upload failed: ${errorText}`);
            }
            
            // Notify backend of completed upload
            return axios.post('/api/upload/complete', {
              templateId,
              fieldName,
              blobName: urlInfo.blobName,
              url: response.url || urlInfo.uploadUrl.split('?')[0] // Get the URL without query params
            });
          });
          
          uploadPromises.push(uploadPromise);
        }
      }
      
      // Upload files in parallel
      console.log('Uploading files in parallel...');
      await Promise.all(uploadPromises);
      
      // Step 3: Submit form data
      console.log('Submitting form data...');
      await axios.post('/api/upload/form', {
        templateId,
        formData
      });
      
      setGenerationStatus('processing');
      
      // Step 4: Generate PDF
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
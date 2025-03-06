import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const UploadForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    albumTitle: '',
    artistName: '',
    designerInfo: '',
    additionalText: '',
    perPage: 1
  });
  
  // State for file uploads
  const [files, setFiles] = useState({
    frontCoverOutside: null,
    frontCoverInside: null,
    backCover: null,
    cdImage: null,
    additionalImage1: null,
    additionalImage2: null
  });

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file drops for each section
  const handleFileDrop = (acceptedFiles, section) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles({
        ...files,
        [section]: acceptedFiles[0]
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create form data for submission
    const submitData = new FormData();
    
    // Add text fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Add files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        submitData.append(key, files[key]);
      }
    });

    try {
      // Upload files first
      const uploadResponse = await axios.post('/api/upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.data.success) {
        // Generate PDF with the template ID
        const generateResponse = await axios.post('/api/generate', {
          templateId: uploadResponse.data.templateId,
          perPage: formData.perPage
        });

        if (generateResponse.data.success) {
          // Navigate to result page
          navigate(`/result/${uploadResponse.data.templateId}`);
        } else {
          setError('Error generating PDF template');
        }
      } else {
        setError('Error uploading files');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Render file preview
  const renderPreview = (file) => {
    if (!file) return null;
    
    return (
      <div className="file-preview">
        <img 
          src={URL.createObjectURL(file)} 
          alt="Preview" 
          style={{ width: '100%', maxHeight: '100px', objectFit: 'cover' }} 
        />
      </div>
    );
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h2>Create CD Template</h2>
      
      {/* Text inputs */}
      <div className="form-group">
        <label htmlFor="albumTitle">Album Title</label>
        <input
          type="text"
          id="albumTitle"
          name="albumTitle"
          value={formData.albumTitle}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="artistName">Artist Name</label>
        <input
          type="text"
          id="artistName"
          name="artistName"
          value={formData.artistName}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="designerInfo">Designer Information</label>
        <input
          type="text"
          id="designerInfo"
          name="designerInfo"
          value={formData.designerInfo}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="additionalText">Additional Text</label>
        <textarea
          id="additionalText"
          name="additionalText"
          value={formData.additionalText}
          onChange={handleInputChange}
          rows="3"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="perPage">CDs per Page</label>
        <select
          id="perPage"
          name="perPage"
          value={formData.perPage}
          onChange={handleInputChange}
        >
          <option value="1">1 CD per page</option>
          <option value="2">2 CDs per page</option>
          <option value="3">3 CDs per page</option>
        </select>
      </div>
      
      {/* File uploads */}
      <h3 className="mt-4">Upload Images</h3>
      
      <div className="form-group">
        <label>Front Cover (Outside)</label>
        <Dropzone onDrop={(files) => handleFileDrop(files, 'frontCoverOutside')}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {files.frontCoverOutside ? 
                renderPreview(files.frontCoverOutside) : 
                <p>Drag & drop an image here, or click to select</p>
              }
            </div>
          )}
        </Dropzone>
      </div>
      
      <div className="form-group">
        <label>Front Cover (Inside)</label>
        <Dropzone onDrop={(files) => handleFileDrop(files, 'frontCoverInside')}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {files.frontCoverInside ? 
                renderPreview(files.frontCoverInside) : 
                <p>Drag & drop an image here, or click to select</p>
              }
            </div>
          )}
        </Dropzone>
      </div>
      
      <div className="form-group">
        <label>Back Cover</label>
        <Dropzone onDrop={(files) => handleFileDrop(files, 'backCover')}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {files.backCover ? 
                renderPreview(files.backCover) : 
                <p>Drag & drop an image here, or click to select</p>
              }
            </div>
          )}
        </Dropzone>
      </div>
      
      <div className="form-group">
        <label>CD Image</label>
        <Dropzone onDrop={(files) => handleFileDrop(files, 'cdImage')}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {files.cdImage ? 
                renderPreview(files.cdImage) : 
                <p>Drag & drop an image here, or click to select</p>
              }
            </div>
          )}
        </Dropzone>
      </div>
      
      <div className="form-group">
        <label>Additional Image 1 (Optional)</label>
        <Dropzone onDrop={(files) => handleFileDrop(files, 'additionalImage1')}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {files.additionalImage1 ? 
                renderPreview(files.additionalImage1) : 
                <p>Drag & drop an image here, or click to select</p>
              }
            </div>
          )}
        </Dropzone>
      </div>
      
      <div className="form-group">
        <label>Additional Image 2 (Optional)</label>
        <Dropzone onDrop={(files) => handleFileDrop(files, 'additionalImage2')}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {files.additionalImage2 ? 
                renderPreview(files.additionalImage2) : 
                <p>Drag & drop an image here, or click to select</p>
              }
            </div>
          )}
        </Dropzone>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message mt-3 mb-3" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      
      {/* Submit button */}
      <button 
        type="submit" 
        className="btn btn-primary mt-3" 
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Template'}
      </button>
    </form>
  );
};

export default UploadForm; 
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResultPage = () => {
  const { templateId } = useParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    // Check template status when component mounts
    checkTemplateStatus();
  }, [templateId]);

  const checkTemplateStatus = async () => {
    try {
      const response = await axios.get(`/api/status/${templateId}`);
      
      if (response.data.success) {
        if (response.data.status === 'completed') {
          setStatus('completed');
          setPdfUrl(`/api/download/${templateId}`);
        } else if (response.data.status === 'error') {
          setStatus('error');
          setError(response.data.error || 'An error occurred during template generation');
        } else {
          // Still processing, check again in 2 seconds
          setStatus('processing');
          setTimeout(checkTemplateStatus, 2000);
        }
      } else {
        setStatus('error');
        setError(response.data.message || 'Failed to get template status');
      }
    } catch (error) {
      console.error('Error checking template status:', error);
      setStatus('error');
      setError(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
      case 'processing':
        return (
          <div className="text-center">
            <div className="spinner"></div>
            <h3>Generating your CD template...</h3>
            <p>This may take a few moments. Please wait.</p>
          </div>
        );
      
      case 'completed':
        return (
          <div className="text-center">
            <h2>Your CD Template is Ready!</h2>
            <p>Your custom CD template has been generated successfully.</p>
            <a 
              href={pdfUrl} 
              className="btn btn-primary download-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
            <div className="mt-4">
              <Link to="/editor" className="btn btn-secondary">Create Another Template</Link>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <h2>Oops! Something went wrong</h2>
            <p className="error-message" style={{ color: 'red' }}>
              {error || 'An error occurred while generating your template.'}
            </p>
            <div className="mt-4">
              <Link to="/editor" className="btn btn-primary">Try Again</Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="result-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultPage; 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResultPage({ templateId, generationStatus }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(generationStatus || 'generating');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // If no templateId, redirect to editor
    if (!templateId) {
      navigate('/editor');
      return;
    }
    
    // If status is not already completed, check status periodically
    if (status !== 'completed') {
      const checkStatus = async () => {
        try {
          const response = await axios.get(`/api/status/${templateId}`);
          setStatus(response.data.status);
          
          if (response.data.error) {
            setError(response.data.error);
          }
        } catch (error) {
          console.error('Error checking status:', error);
          setStatus('error');
          setError(error.response?.data?.message || 'An error occurred while checking the status.');
        }
      };
      
      // Check immediately
      checkStatus();
      
      // Then check every 2 seconds until completed or error
      const intervalId = setInterval(() => {
        if (status === 'completed' || status === 'error') {
          clearInterval(intervalId);
        } else {
          checkStatus();
        }
      }, 2000);
      
      return () => clearInterval(intervalId);
    }
  }, [templateId, navigate, status]);
  
  return (
    <div className="result-container">
      <h2>Your CD Template</h2>
      
      <div className={`result-status status-${status}`}>
        {status === 'generating' && (
          <>
            <h3>Generating your PDF...</h3>
            <p>This may take a few moments. Please wait.</p>
          </>
        )}
        
        {status === 'completed' && (
          <>
            <h3>PDF Generated Successfully!</h3>
            <p>Your CD template is ready to download.</p>
            
            <a 
              href={`/api/download/${templateId}`} 
              className="download-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h3>Error Generating PDF</h3>
            <p>{error || 'There was an error generating your PDF. Please try again.'}</p>
          </>
        )}
      </div>
      
      <div style={{ marginTop: '2rem'
} 
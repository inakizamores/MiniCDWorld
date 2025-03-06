import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">MiniCDWorld</h1>
        <h2 className="hero-subtitle">Create Beautiful CD Templates in Minutes</h2>
        <Link to="/editor" className="btn btn-primary">Get Started</Link>
      </section>
      
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📷</div>
          <h3>Upload Your Images</h3>
          <p>Upload images for each part of your CD case: front cover, back cover, CD label, and more.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">✏️</div>
          <h3>Add Your Text</h3>
          <p>Customize your CD template with album title, artist name, and additional information.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Generate PDF</h3>
          <p>Get a print-ready PDF with your custom CD template, with options for multiple CDs per page.</p>
        </div>
      </section>
      
      <section className="how-it-works mt-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="steps">
          <ol>
            <li>Upload your images for each part of the CD case</li>
            <li>Enter your album title, artist name, and other text</li>
            <li>Choose how many CD templates you want per page</li>
            <li>Generate your custom PDF template</li>
            <li>Download and print your template</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
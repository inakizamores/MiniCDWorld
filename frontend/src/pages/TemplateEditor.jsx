import React from 'react';
import UploadForm from '../components/UploadForm';

const TemplateEditor = () => {
  return (
    <div className="container">
      <h1 className="text-center mb-4">Create Your CD Template</h1>
      <p className="text-center mb-4">
        Upload your images and enter text to create a custom CD template.
        You can choose how many CD templates to include per page.
      </p>
      
      <div className="editor-container">
        <UploadForm />
        
        <div className="preview-container">
          <h2>Instructions</h2>
          <div className="instructions">
            <h3>Required Images</h3>
            <ul>
              <li><strong>Front Cover (Outside):</strong> The main cover image that will appear on the front of your CD case.</li>
              <li><strong>Front Cover (Inside):</strong> The image that will appear on the inside of the front cover.</li>
              <li><strong>Back Cover:</strong> The image for the back of the CD case, typically containing track listings.</li>
              <li><strong>CD Image:</strong> The image that will be printed on the CD itself.</li>
            </ul>
            
            <h3 className="mt-3">Optional Images</h3>
            <ul>
              <li><strong>Additional Images:</strong> You can include up to two additional images for inserts or other parts of the CD package.</li>
            </ul>
            
            <h3 className="mt-3">Text Fields</h3>
            <ul>
              <li><strong>Album Title:</strong> The name of your album or CD.</li>
              <li><strong>Artist Name:</strong> The name of the artist or band.</li>
              <li><strong>Designer Info:</strong> Credit for the designer or creator of the artwork.</li>
              <li><strong>Additional Text:</strong> Any other text you want to include on your CD template.</li>
            </ul>
            
            <h3 className="mt-3">Template Options</h3>
            <ul>
              <li><strong>CDs per Page:</strong> Choose how many CD templates to include on each page of the PDF (1-3).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor; 
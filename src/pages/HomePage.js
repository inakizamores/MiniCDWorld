import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <h2>Welcome to MiniCDWorld</h2>
      <p>
        Design your own custom CD case templates with our easy-to-use tool.
        Upload images for each part of the CD case, add your album information,
        and download a printable PDF template.
      </p>
      <Link to="/editor" className="get-started-button">
        Get Started
      </Link>
    </div>
  );
}

export default HomePage; 
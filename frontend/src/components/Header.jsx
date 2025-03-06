import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">MiniCDWorld</Link>
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/editor" className="nav-link">Create Template</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Import pages
import HomePage from './pages/HomePage';
import TemplateEditor from './pages/TemplateEditor';
import ResultPage from './pages/ResultPage';

// Import components
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<TemplateEditor />} />
            <Route path="/result/:templateId" element={<ResultPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} MiniCDWorld - CD Template Generator</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TemplateEditor from './pages/TemplateEditor';
import ResultPage from './pages/ResultPage';
import './App.css';

function App() {
  const [templateId, setTemplateId] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(null);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>MiniCDWorld</h1>
          <p>Create and print your own CD case templates</p>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/editor" 
              element={
                <TemplateEditor 
                  setTemplateId={setTemplateId} 
                  setGenerationStatus={setGenerationStatus} 
                />
              } 
            />
            <Route 
              path="/result" 
              element={
                <ResultPage 
                  templateId={templateId} 
                  generationStatus={generationStatus}
                />
              } 
            />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>&copy; {new Date().getFullYear()} MiniCDWorld</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 
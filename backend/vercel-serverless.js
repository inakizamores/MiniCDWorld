// Serverless entry point for Vercel
const app = require('./server');

// Export a serverless handler
module.exports = (req, res) => {
  // Set CORS headers for serverless function
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // If the request is for a PDF download, make sure to handle the binary response
  if (req.url && req.url.startsWith('/api/download/')) {
    // Add the appropriate content type and handle binary responses
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cd_template.pdf');
  }

  // Forward the request to the Express app
  return app(req, res);
}; 
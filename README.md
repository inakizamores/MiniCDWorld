# MiniCDWorld - CD Template Generator

MiniCDWorld is a web application that allows users to create custom CD case templates by uploading images and entering text. The application generates a printable PDF template with precise measurements for CD cases.

## Features

- Upload images for different parts of a CD case (front cover, back cover, CD image, etc.)
- Enter album title, artist name, and other text information
- Choose the number of CD templates per page (up to 3)
- Generate a printable PDF template
- Responsive design for desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- React Dropzone for file uploads
- CSS for styling (with Flexbox and Grid)

### Backend
- Node.js with Express
- Multer for file uploads (memory storage)
- PDFKit for PDF generation
- Sharp for image processing

## Project Structure

The project is organized into two main directories:

- `frontend/`: Contains the React application
- `backend/`: Contains the Express server and API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/minicdworld.git
   cd minicdworld
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

This application is designed to be deployed to Vercel using serverless functions. See the [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) file for detailed deployment instructions.

## Key Features Explained

### In-Memory Processing

The application uses in-memory processing for handling file uploads and PDF generation. Files are stored in memory for the duration of the user session, and PDFs are generated on-demand and streamed directly to the user.

### PDF Generation

PDFs are generated using PDFKit with precise measurements for CD cases. The application supports:
- 1-3 templates per page
- Custom text for album title, artist name, etc.
- Image placement for front cover, back cover, CD image, etc.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [PDFKit](https://pdfkit.org/) for PDF generation
- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [React Dropzone](https://react-dropzone.js.org/) for file uploads 
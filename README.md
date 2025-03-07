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
- Vercel Blob for file storage
- Serverless functions for API endpoints

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

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Vercel Blob token to `.env.local`

4. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

5. Install frontend dependencies:
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

### Vercel Blob Storage

The application uses Vercel Blob for storing uploaded images and generated PDFs. This provides several advantages:
- Scalable storage solution for files
- Improved performance and reliability
- Better handling of larger files
- Persistent storage across serverless function executions

To use Vercel Blob:
1. Create a Vercel account and set up a project
2. Navigate to Storage → Blob in your Vercel dashboard
3. Create a new Blob store
4. Copy the BLOB_READ_WRITE_TOKEN to your environment variables

### Serverless Architecture

The application is built with a serverless architecture in mind:
- API endpoints are implemented as serverless functions
- Files are stored in Vercel Blob, not on the filesystem
- State management is handled through Vercel Blob and client-side state

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
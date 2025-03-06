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
- Multer for file uploads
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

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
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

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
OUTPUT_DIR=output
```

## API Endpoints

- `POST /api/upload`: Upload images and text data
- `POST /api/generate`: Generate PDF template
- `GET /api/status/:templateId`: Check template generation status
- `GET /api/download/:templateId`: Download generated PDF

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [PDFKit](https://pdfkit.org/) for PDF generation
- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [React Dropzone](https://react-dropzone.js.org/) for file uploads 
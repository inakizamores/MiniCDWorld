# CD Template Generator

A modern web application for creating printable CD templates with custom artwork. Upload images, add album information, and generate professional print-ready PDF templates for CD covers, labels, and packaging.

## Features

- **Custom Artwork Upload**: Upload images for all 7 parts of your CD package with precise specifications
- **Image Cropping**: Interactive cropping interface for each image with correct aspect ratios
- **Accurate Measurements**: Templates use precise industry-standard measurements for CD packaging
- **Multiple Templates per Page**: Choose to print 1-3 CD templates per page
- **High-Quality PDFs**: Generate print-ready PDF templates with proper bleed areas and cut marks
- **Modern UI**: User-friendly interface built with React and Tailwind CSS

## Tech Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistent storage
- **PDF Generation**: React-PDF
- **Image Storage**: Vercel Blob
- **Image Cropping**: React Image Crop

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Vercel account (for deployment and Blob storage)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/your-username/cd-template-generator.git
   cd cd-template-generator
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Create a Vercel Blob store and add your token to `.env.local`

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### 1. Create a Vercel Blob Store

1. Login to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage -> Create a new Blob store
3. Copy the provided `BLOB_READ_WRITE_TOKEN`

### 2. Deploy with Vercel CLI

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel
```

### 3. Deploy via Vercel Dashboard

1. Push your code to a GitHub repository
2. Import the project into Vercel:
   - Go to the [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - Add `BLOB_READ_WRITE_TOKEN` with your token value
   - Click "Deploy"

### 4. Verify Deployment

- Once deployed, verify that all features work correctly:
  - Image uploads and cropping
  - PDF generation
  - Form submissions

## CD Template Specifications

Our template includes 7 distinct components:

1. **FRENTE_AFUERA** (Front Exterior): 41mm × 41mm
2. **FRENTE_DENTRO** (Front Interior): 41mm × 41mm
3. **DISCO** (CD Label): 40mm diameter with 6mm center hole
4. **TRASERA_AFUERA Left**: 50mm × 38mm
5. **TRASERA_AFUERA Right**: 4mm × 38mm
6. **TRASERA_DENTRO Left**: 4mm × 38mm
7. **TRASERA_DENTRO Right**: 50mm × 38mm

All components follow specific measurements to ensure precise printing results.

## Usage Instructions

1. **Start Creating**: Click "Start Creating" on the homepage
2. **Add Album Info**: Enter album title, artist name, and release year
3. **Upload Images**: Upload your artwork for each part of the CD package
4. **Set Layout Options**: Choose how many templates to print per page
5. **Generate & Download**: Generate a preview and download your PDF template

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
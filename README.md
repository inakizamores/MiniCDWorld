# CD Template Generator

A web application to generate printable CD templates with precise measurements. Upload your artwork, enter album information, and download a perfectly formatted PDF ready for printing.

## Features

- Upload and crop images for different CD components (front, back, disc)
- Automatic image processing to match required dimensions
- Title and album information integration
- High-quality PDF generation with precise measurements
- Multiple CDs per page option (1-3 per US Letter page)
- Responsive design works on desktop and tablet devices

## Technical Stack

- React with TypeScript
- Vite for fast development and builds
- TailwindCSS for styling
- jsPDF for PDF generation
- React-Cropper for image manipulation

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```

## CD Template Specifications

The application generates templates with the following components:

- **FRENTE_AFUERA** (Front Outside): 41mm × 41mm
- **FRENTE_DENTRO** (Front Inside): 41mm × 41mm
- **DISCO** (Disc): 40mm diameter with 6mm center hole
- **TRASERA_AFUERA** (Back Outside): Combined 54mm × 38mm (split into 50mm and 4mm sections)
- **TRASERA_ADENTRO** (Back Inside): Combined 54mm × 38mm (split into 4mm and 50mm sections)

All measurements are precise for printing on US Letter paper.

## License

[MIT License](LICENSE)

## Author

Your Name 
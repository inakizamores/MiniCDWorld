import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>CD Template Generator</title>
        <meta name="description" content="Generate printable CD templates with your custom artwork" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container-custom py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Create Custom CD Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design professional CD packaging with your artwork. Upload images, add album information,
            and download print-ready PDF templates.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/editor" className="btn-primary text-lg px-8 py-3">
              Start Creating
            </Link>
            <Link href="/help" className="btn-outline text-lg px-8 py-3">
              How It Works
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Artwork</h3>
            <p className="text-gray-600">
              Upload custom images for each part of your CD package with precise specifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customize Your Template</h3>
            <p className="text-gray-600">
              Add album title, artist name, and choose how many CDs to print per page.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-primary-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download & Print</h3>
            <p className="text-gray-600">
              Generate print-ready PDF templates with accurate measurements for professional results.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-100 to-secondary-100 p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Exact Specifications</h2>
              <p className="text-lg mb-6">
                Our templates use precise measurements for each CD component:
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                <li>Front covers: 41mm × 41mm</li>
                <li>CD label: 40mm diameter with 6mm center hole</li>
                <li>Back covers: Custom sections with exact measurements</li>
              </ul>
              <Link href="/help" className="btn-primary">
                View All Specifications
              </Link>
            </div>
            <div className="md:w-1/2 md:pl-12">
              {/* Placeholder for a preview image */}
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">CD Template Preview</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container-custom text-center text-gray-600">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <Link href="/editor" className="hover:text-primary-600">Create Template</Link>
            <Link href="/help" className="hover:text-primary-600">Help & Instructions</Link>
          </div>
          <p>© {new Date().getFullYear()} CD Template Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 
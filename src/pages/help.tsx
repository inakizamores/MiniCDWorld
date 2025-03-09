import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Help() {
  const [markdownContent, setMarkdownContent] = useState('');
  
  useEffect(() => {
    fetch('/templates/cd-template-instructions.md')
      .then(response => response.text())
      .then(text => {
        setMarkdownContent(text);
      })
      .catch(error => {
        console.error('Error fetching instructions:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Help & Instructions | CD Template Generator</title>
        <meta name="description" content="Instructions and help for using the CD Template Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container-custom py-10">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-primary-600 hover:text-primary-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
          
          <Link href="/editor" className="btn-primary">
            Create Template
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">CD Template Help</h1>
          
          <div className="grid md:grid-cols-5 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#components" className="text-primary-600 hover:text-primary-700">
                    CD Components
                  </a>
                </li>
                <li>
                  <a href="#measurements" className="text-primary-600 hover:text-primary-700">
                    Measurements
                  </a>
                </li>
                <li>
                  <a href="#printing" className="text-primary-600 hover:text-primary-700">
                    Printing Guidelines
                  </a>
                </li>
                <li>
                  <a href="#assembly" className="text-primary-600 hover:text-primary-700">
                    Assembly Instructions
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-primary-600 hover:text-primary-700">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-4">
              <div id="components" className="mb-10">
                <h2 className="text-2xl font-bold mb-4">CD Template Components</h2>
                <p className="text-gray-700 mb-4">
                  Our CD template consists of five main components that you'll need to provide images for:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Front Section</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>FRENTE_AFUERA</strong>: The exterior front cover (41mm × 41mm)</li>
                      <li><strong>FRENTE_DENTRO</strong>: The interior front cover (41mm × 41mm)</li>
                    </ul>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">CD Label</h3>
                    <ul className="list-disc pl-5">
                      <li><strong>DISCO</strong>: The circular label for the CD itself (40mm diameter)</li>
                    </ul>
                  </div>
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Back Section</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>TRASERA_AFUERA</strong>: The exterior back cover (54mm × 38mm total)</li>
                      <li><strong>TRASERA_DENTRO</strong>: The interior back cover (54mm × 38mm total)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div id="measurements" className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Exact Measurements</h2>
                <p className="text-gray-700 mb-4">
                  These measurements are critical for proper printing. All components will be placed according to these exact dimensions:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Component</th>
                        <th className="border border-gray-300 p-2">Width</th>
                        <th className="border border-gray-300 p-2">Height</th>
                        <th className="border border-gray-300 p-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">FRENTE_AFUERA</td>
                        <td className="border border-gray-300 p-2">41mm</td>
                        <td className="border border-gray-300 p-2">41mm</td>
                        <td className="border border-gray-300 p-2">Front exterior</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">FRENTE_DENTRO</td>
                        <td className="border border-gray-300 p-2">41mm</td>
                        <td className="border border-gray-300 p-2">41mm</td>
                        <td className="border border-gray-300 p-2">Front interior</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">DISCO</td>
                        <td className="border border-gray-300 p-2">40mm</td>
                        <td className="border border-gray-300 p-2">40mm</td>
                        <td className="border border-gray-300 p-2">Circular with 6mm center hole</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">TRASERA_AFUERA</td>
                        <td className="border border-gray-300 p-2">54mm total (50mm + 4mm)</td>
                        <td className="border border-gray-300 p-2">38mm</td>
                        <td className="border border-gray-300 p-2">Split into two sections</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">TRASERA_DENTRO</td>
                        <td className="border border-gray-300 p-2">54mm total (4mm + 50mm)</td>
                        <td className="border border-gray-300 p-2">38mm</td>
                        <td className="border border-gray-300 p-2">Split into two sections</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div id="printing" className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Printing Guidelines</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use high-resolution images (300 DPI or higher) for the best quality</li>
                  <li>Print on US Letter size paper (8.5" × 11" or 215.9mm × 279.4mm)</li>
                  <li>Thick cardstock paper (220-250 gsm) is recommended for durability</li>
                  <li>Do not scale or resize the PDF when printing</li>
                  <li>Check your printer settings to ensure actual size printing</li>
                  <li>You can print up to 3 CD templates per page</li>
                </ul>
              </div>
              
              <div id="assembly" className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Assembly Instructions</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Print the template following the guidelines above</li>
                  <li>Cut out each component along the dotted lines</li>
                  <li>For the CD label (DISCO), carefully cut around the circle</li>
                  <li>Fold the front covers (FRENTE sections) together</li>
                  <li>Fold the back covers (TRASERA sections) together</li>
                  <li>Assemble all pieces to form your complete CD package</li>
                </ol>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                  <p className="text-yellow-700">
                    <strong>Tip:</strong> Use a ruler and paper scorer to create clean fold lines before folding.
                  </p>
                </div>
              </div>
              
              <div id="faq" className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">What paper type should I use?</h3>
                    <p className="text-gray-700">We recommend cardstock paper between 220-250 gsm for durability.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Can I print this on a standard home printer?</h3>
                    <p className="text-gray-700">Yes, any printer that can handle cardstock and print accurately will work.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">What if my images aren't the exact dimensions?</h3>
                    <p className="text-gray-700">Our system will crop your images to fit the required dimensions, but for best results, prepare images with the correct aspect ratio.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">How do I cut the center hole in the CD label?</h3>
                    <p className="text-gray-700">You can use a small circle cutter, craft knife, or precision scissors. The template will mark the hole with a black circle.</p>
                  </div>
                </div>
              </div>
              
              {/* Raw markdown content for reference */}
              {markdownContent && (
                <div className="mt-10 pt-6 border-t">
                  <h2 className="text-xl font-bold mb-4">Detailed Instructions</h2>
                  <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
                    {markdownContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
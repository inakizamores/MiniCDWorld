import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTemplateStore } from '@/lib/store';
import { generatePDFBlob } from '@/lib/pdf-generator';

export default function Preview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the store for state management
  const { 
    albumTitle, 
    artistName, 
    releaseYear,
    frenteAfuera,
    frenteDentro,
    disco,
    traseraAfueraLeft,
    traseraAfueraRight,
    traseraDentroLeft,
    traseraDentroRight,
    numCDsPerPage,
    pdfUrl,
    setPdfUrl
  } = useTemplateStore();

  useEffect(() => {
    const generatePDF = async () => {
      try {
        setLoading(true);
        
        // Check if all required images are provided
        const missingImages = [];
        if (!frenteAfuera) missingImages.push('Front Cover Exterior (FRENTE_AFUERA)');
        if (!frenteDentro) missingImages.push('Front Cover Interior (FRENTE_DENTRO)');
        if (!disco) missingImages.push('CD Label (DISCO)');
        if (!traseraAfueraLeft) missingImages.push('Back Cover Exterior - Left (TRASERA_AFUERA Left)');
        if (!traseraAfueraRight) missingImages.push('Back Cover Exterior - Right (TRASERA_AFUERA Right)');
        if (!traseraDentroLeft) missingImages.push('Back Cover Interior - Left (TRASERA_DENTRO Left)');
        if (!traseraDentroRight) missingImages.push('Back Cover Interior - Right (TRASERA_DENTRO Right)');

        if (missingImages.length > 0) {
          setError(`Missing required images: ${missingImages.join(', ')}. Please go back and upload all images.`);
          setLoading(false);
          return;
        }

        // Generate PDF
        const pdfBlob = await generatePDFBlob({
          albumTitle: albumTitle || 'Untitled Album',
          artistName: artistName || 'Unknown Artist',
          releaseYear: releaseYear || undefined,
          frenteAfuera: frenteAfuera || undefined,
          frenteDentro: frenteDentro || undefined,
          disco: disco || undefined,
          traseraAfueraLeft: traseraAfueraLeft || undefined,
          traseraAfueraRight: traseraAfueraRight || undefined,
          traseraDentroLeft: traseraDentroLeft || undefined,
          traseraDentroRight: traseraDentroRight || undefined,
          numCDsPerPage,
        });
        
        // Convert Blob to URL
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setError('Failed to generate PDF. Please try again.');
        setLoading(false);
      }
    };

    generatePDF();
  }, [
    albumTitle, artistName, releaseYear, 
    frenteAfuera, frenteDentro, disco,
    traseraAfueraLeft, traseraAfueraRight,
    traseraDentroLeft, traseraDentroRight,
    numCDsPerPage, setPdfUrl
  ]);

  const handleEditTemplate = () => {
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Preview CD Template | CD Template Generator</title>
        <meta name="description" content="Preview and download your CD template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container-custom py-10">
        <div className="mb-8">
          <Link href="/editor" className="text-primary-600 hover:text-primary-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Editor
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Your CD Template</h1>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-lg">Generating your CD template...</p>
            </div>
          ) : error ? (
            <div className="py-10">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
              </div>
              <button 
                onClick={handleEditTemplate}
                className="btn-primary w-full"
              >
                Back to Editor
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center">
                  {/* Template summary */}
                  <div className="mb-4 text-center">
                    <h2 className="text-xl font-semibold">{albumTitle}</h2>
                    <p className="text-gray-600">{artistName} {releaseYear ? `(${releaseYear})` : ''}</p>
                    <p className="text-sm text-gray-500 mt-2">{numCDsPerPage} {numCDsPerPage === 1 ? 'CD' : 'CDs'} per page</p>
                  </div>
                  
                  {/* Image Preview Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-2xl">
                    <div className="aspect-square border rounded-md overflow-hidden bg-white p-2">
                      <p className="text-xs text-center mb-1">Front Exterior</p>
                      {frenteAfuera && <img src={frenteAfuera} alt="Front Exterior" className="w-full h-full object-contain" />}
                    </div>
                    
                    <div className="aspect-square border rounded-md overflow-hidden bg-white p-2">
                      <p className="text-xs text-center mb-1">Front Interior</p>
                      {frenteDentro && <img src={frenteDentro} alt="Front Interior" className="w-full h-full object-contain" />}
                    </div>
                    
                    <div className="aspect-square border rounded-full overflow-hidden bg-white p-2">
                      <p className="text-xs text-center mb-1">CD Label</p>
                      {disco && <img src={disco} alt="CD Label" className="w-full h-full object-contain" />}
                    </div>
                  </div>
                  
                  {/* This would be replaced with an actual PDF preview */}
                  <div className="w-full aspect-[1.414] max-w-2xl bg-white shadow-md relative rounded overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      PDF Preview
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <a 
                  href={pdfUrl || '#'} 
                  download={`${albumTitle.replace(/\s+/g, '-').toLowerCase() || 'cd'}-template.pdf`}
                  className="btn-primary flex-1 flex justify-center items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </a>
                <button 
                  onClick={handleEditTemplate}
                  className="btn-outline flex-1 flex justify-center items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Template
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="btn-secondary flex-1 flex justify-center items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                  Create New Template
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 
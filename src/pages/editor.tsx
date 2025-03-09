import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTemplateStore } from '@/lib/store';

// Image upload component
import ImageUploader from '@/components/form/ImageUploader';

export default function Editor() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Use the global store
  const { 
    albumTitle, artistName, releaseYear,
    frenteAfuera, frenteDentro, disco,
    traseraAfueraLeft, traseraAfueraRight,
    traseraDentroLeft, traseraDentroRight,
    numCDsPerPage,
    setAlbumInfo, setImage, setNumCDsPerPage
  } = useTemplateStore();

  const totalSteps = 3;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and go to preview
      router.push('/preview');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'albumTitle' || name === 'artistName' || name === 'releaseYear') {
      setAlbumInfo(
        name === 'albumTitle' ? value : albumTitle,
        name === 'artistName' ? value : artistName,
        name === 'releaseYear' ? value : releaseYear
      );
    }
  };

  const handleImageUpload = (imageType: string, imageUrl: string) => {
    setImage(imageType, imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create CD Template | CD Template Generator</title>
        <meta name="description" content="Create your custom CD template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container-custom py-10">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Create Your CD Template</h1>
          
          {/* Progress indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold 
                      ${currentStep > index ? 'bg-primary-600' : currentStep === index + 1 ? 'bg-primary-500' : 'bg-gray-300'}`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-sm mt-2 text-gray-600">
                    {index === 0 ? 'Album Info' : index === 1 ? 'Upload Images' : 'Layout Options'}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-4">
              <div className="absolute h-1 bg-gray-200 w-full"></div>
              <div 
                className="absolute h-1 bg-primary-500 transition-all" 
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Album Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Album Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="albumTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Album Title
                  </label>
                  <input
                    type="text"
                    id="albumTitle"
                    name="albumTitle"
                    value={albumTitle}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter album title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="artistName" className="block text-sm font-medium text-gray-700 mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    id="artistName"
                    name="artistName"
                    value={artistName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter artist name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Release Year
                  </label>
                  <input
                    type="text"
                    id="releaseYear"
                    name="releaseYear"
                    value={releaseYear}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter release year"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Image Uploads */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Upload Your Artwork</h2>
              
              <div className="border-b pb-4 mb-6">
                <h3 className="text-lg font-medium mb-4">Front Cover Section (41mm × 41mm each)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ImageUploader 
                      label="Frente Afuera (Front Exterior)" 
                      description="41mm × 41mm - Will appear on the left side"
                      onChange={(url) => handleImageUpload('frenteAfuera', url)}
                      value={frenteAfuera}
                      componentType="frenteAfuera"
                    />
                  </div>
                  <div>
                    <ImageUploader 
                      label="Frente Dentro (Front Interior)" 
                      description="41mm × 41mm - Will appear on the right side"
                      onChange={(url) => handleImageUpload('frenteDentro', url)}
                      value={frenteDentro}
                      componentType="frenteDentro"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-4 mb-6">
                <h3 className="text-lg font-medium mb-4">CD Label (40mm diameter)</h3>
                <div className="max-w-xs mx-auto">
                  <ImageUploader 
                    label="Disco (CD Label)" 
                    description="Will be cropped to a 40mm circle with 6mm center hole"
                    onChange={(url) => handleImageUpload('disco', url)}
                    value={disco}
                    isCircular={true}
                    componentType="disco"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Back Cover Section (38mm height)</h3>
                <p className="text-sm text-gray-500 mb-4">TRASERA_AFUERA (Back Exterior) - Two parts:</p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <ImageUploader 
                      label="Left Section" 
                      description="50mm × 38mm - Main back cover area"
                      onChange={(url) => handleImageUpload('traseraAfueraLeft', url)}
                      value={traseraAfueraLeft}
                      aspectRatio={50/38}
                      componentType="traseraAfueraLeft"
                    />
                  </div>
                  <div>
                    <ImageUploader 
                      label="Right Section" 
                      description="4mm × 38mm - Thin right edge"
                      onChange={(url) => handleImageUpload('traseraAfueraRight', url)}
                      value={traseraAfueraRight}
                      aspectRatio={4/38}
                      componentType="traseraAfueraRight"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">TRASERA_DENTRO (Back Interior) - Two parts:</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ImageUploader 
                      label="Left Section" 
                      description="4mm × 38mm - Thin left edge"
                      onChange={(url) => handleImageUpload('traseraDentroLeft', url)}
                      value={traseraDentroLeft}
                      aspectRatio={4/38}
                      componentType="traseraDentroLeft"
                    />
                  </div>
                  <div>
                    <ImageUploader 
                      label="Right Section" 
                      description="50mm × 38mm - Main inside back cover area"
                      onChange={(url) => handleImageUpload('traseraDentroRight', url)}
                      value={traseraDentroRight}
                      aspectRatio={50/38}
                      componentType="traseraDentroRight"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Layout Options */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Layout Options</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of CDs per page
                </label>
                <div className="flex space-x-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex-1">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="numCDsPerPage"
                          value={num}
                          checked={numCDsPerPage === num}
                          onChange={() => setNumCDsPerPage(num)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 font-medium">{num} {num === 1 ? 'CD' : 'CDs'}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`btn ${currentStep === 1 ? 'bg-gray-200 cursor-not-allowed' : 'btn-outline'}`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary"
            >
              {currentStep === totalSteps ? 'Generate Preview' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 
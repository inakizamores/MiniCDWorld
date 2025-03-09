import { Link } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Create Professional CD Templates
        </h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
          Generate high-quality, printable CD templates with precise measurements. 
          Upload your artwork, customize your design, and download a print-ready PDF.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/upload" className="btn btn-primary text-lg px-6 py-3">
            Create Your Template
          </Link>
          <a 
            href="#how-it-works" 
            className="btn btn-outline text-lg px-6 py-3"
          >
            Learn More
          </a>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Create your custom CD template in just a few simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaUpload className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Upload Your Artwork</h3>
            <p className="text-secondary-600">
              Upload your images for the CD cover, back, and the CD itself
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaCrop className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Crop & Position</h3>
            <p className="text-secondary-600">
              Adjust your images to fit perfectly within the CD template dimensions
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaFilePdf className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Generate & Print</h3>
            <p className="text-secondary-600">
              Download your PDF template, ready for printing on US Letter paper
            </p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-secondary-50 -mx-4 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Everything you need to create professional CD templates
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="mr-4 text-primary-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Precise Measurements</h3>
                <p className="text-secondary-600">All templates follow industry standard measurements for CD packaging</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-primary-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Advanced Image Cropping</h3>
                <p className="text-secondary-600">Intelligent cropping tools to ensure your artwork fits perfectly</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-primary-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Print-Ready PDFs</h3>
                <p className="text-secondary-600">Download high-quality, print-ready PDF files optimized for US Letter paper</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-primary-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Multiple CDs Per Page</h3>
                <p className="text-secondary-600">Choose to print 1-3 CDs per page to save paper and reduce waste</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Create Your CD Template?</h2>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-8">
          Start designing your custom CD templates today with our easy-to-use tool
        </p>
        <Link to="/upload" className="btn btn-primary text-lg px-8 py-3">
          Get Started Now
        </Link>
      </section>
    </div>
  )
}

export default HomePage 
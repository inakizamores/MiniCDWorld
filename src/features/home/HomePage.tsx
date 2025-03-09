import { Link } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf, FaArrowRight, FaCheck } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section with gradient and animation */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Create Professional <span className="gradient-text">CD Templates</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Generate high-quality, printable CD templates with precise measurements. 
              Upload your artwork, customize your design, and download a print-ready PDF.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/upload" className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2 group">
                Create Your Template
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#how-it-works" 
                className="btn btn-outline text-lg px-8 py-3"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works with hover effects */}
      <section id="how-it-works" className="py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Create your custom CD template in just a few simple steps
          </p>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaUpload className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload Your Artwork</h3>
              <p className="text-secondary-600 leading-relaxed">
                Upload your images for the CD cover, back, and the CD itself. Our tool supports all common image formats.
              </p>
            </div>
            
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaCrop className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Crop & Position</h3>
              <p className="text-secondary-600 leading-relaxed">
                Adjust your images to fit perfectly within the CD template dimensions. Our smart cropping tools make it easy.
              </p>
            </div>
            
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaFilePdf className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Generate & Print</h3>
              <p className="text-secondary-600 leading-relaxed">
                Download your PDF template, ready for printing on US Letter paper. High-quality output every time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with cards */}
      <section className="py-16 bg-secondary-50 -mx-4 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Everything you need to create professional CD templates
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Precise Measurements</h3>
                <p className="text-secondary-600 leading-relaxed">All templates follow industry standard measurements for CD packaging, ensuring perfect results every time.</p>
              </div>
            </div>
            
            <div className="flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Advanced Image Cropping</h3>
                <p className="text-secondary-600 leading-relaxed">Intelligent cropping tools that help ensure your artwork fits perfectly within the required dimensions.</p>
              </div>
            </div>
            
            <div className="flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Print-Ready PDFs</h3>
                <p className="text-secondary-600 leading-relaxed">Download high-quality, print-ready PDF files optimized for US Letter paper with cutting guides included.</p>
              </div>
            </div>
            
            <div className="flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Multiple CDs Per Page</h3>
                <p className="text-secondary-600 leading-relaxed">Choose to print 1-3 CDs per page to save paper and reduce waste. Perfect for small batches.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with gradient background */}
      <section className="py-16 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white -mx-4 px-4 shadow-lg">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Create Your CD Template?</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Start designing your custom CD templates today with our easy-to-use tool
          </p>
          <Link to="/upload" className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-10 py-3 shadow-lg hover:shadow-xl transition-all">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage 
import { useNavigate } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf, FaArrowRight, FaCheck, FaShoppingCart, FaTag, FaExternalLinkAlt } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { resetTemplate } from '@features/template/templateSlice'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Handler to reset template state and navigate to upload page
  const handleCreateTemplate = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }
  
  return (
    <div className="space-y-24">
      {/* Hero Section with gradient and animation */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 text-center relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl -z-10"></div>
        
        <div className="relative">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 mt-8">
              Create Professional <span className="gradient-text">CD Templates</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Generate high-quality, printable CD templates with precise measurements. 
              Upload your artwork, customize your design, and download a print-ready PDF.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleCreateTemplate}
                className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2 group"
              >
                Create Your Template
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#shop-products"
                className="btn btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2"
              >
                Compra los llaveros en blanco
                <FaShoppingCart className="ml-2" />
              </a>
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
      <section id="how-it-works" className="py-16 bg-gradient-to-b from-white to-primary-50 rounded-none md:rounded-xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Create your custom CD template in just a few simple steps
          </p>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaUpload className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload Your Artwork</h3>
              <p className="text-secondary-600 leading-relaxed">
                Upload your images for the CD cover, back, and the CD itself. Our tool supports all common image formats.
              </p>
            </div>
            
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-lg">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaCrop className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Crop & Position</h3>
              <p className="text-secondary-600 leading-relaxed">
                Adjust your images to fit perfectly within the CD template dimensions. Our smart cropping tools make it easy.
              </p>
            </div>
            
            <div className="card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-lg">
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
      
      {/* Mercado Libre E-commerce Section */}
      <section id="shop-products" className="py-16 bg-secondary-50 mx-0 md:mx-4 px-4 rounded-none md:rounded-xl">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Shop Mini CD World Products</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Purchase our official Mini CD keychains from our Mercado Libre store
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1: Pack 5 Llaveros En Blanco */}
            <a 
              href="https://articulo.mercadolibre.com.mx/MLM-3387017600-pack-5-llaveros-en-blanco-mini-cd-disco-album-musical-_JM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>5 Units</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 5 Llaveros En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Mini CD keychains in blank format. Perfect for customization.
                </p>
                <div className="flex items-center justify-center mt-auto text-primary-600 font-medium group-hover:text-primary-700">
                  Shop on Mercado Libre <FaExternalLinkAlt className="ml-2 text-sm" />
                </div>
              </div>
            </a>
            
            {/* Product 2: Pack 5 Llaveros NFC En Blanco */}
            <a 
              href="https://www.mercadolibre.com.mx/pack-5-llaveros-nfc-en-blanco--mini-cd-disco-album-musical/up/MLMU3045065414" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>5 Units + NFC</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 5 Llaveros NFC En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Mini CD keychains with NFC technology. Link to your music digitally.
                </p>
                <div className="flex items-center justify-center mt-auto text-primary-600 font-medium group-hover:text-primary-700">
                  Shop on Mercado Libre <FaExternalLinkAlt className="ml-2 text-sm" />
                </div>
              </div>
            </a>
            
            {/* Product 3: Pack 25 Llaveros En Blanco */}
            <a 
              href="https://articulo.mercadolibre.com.mx/MLM-3529953576-pack-25-llaveros-en-blanco-mini-cd-disco-album-musical-_JM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>25 Units</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 25 Llaveros En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Bulk pack of 25 blank Mini CD keychains. Great for events and promotions.
                </p>
                <div className="flex items-center justify-center mt-auto text-primary-600 font-medium group-hover:text-primary-700">
                  Shop on Mercado Libre <FaExternalLinkAlt className="ml-2 text-sm" />
                </div>
              </div>
            </a>
            
            {/* Product 4: Pack 50 Llaveros En Blanco */}
            <a 
              href="https://articulo.mercadolibre.com.mx/MLM-2215776613-pack-50-llaveros-en-blanco-mini-cd-disco-album-musical-_JM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>50 Units</span>
                <FaTag />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-center mb-2">Pack 50 Llaveros En Blanco</h3>
                <p className="text-secondary-600 text-center mb-4 flex-grow">
                  Wholesale pack of 50 blank Mini CD keychains. Best value for large orders.
                </p>
                <div className="flex items-center justify-center mt-auto text-primary-600 font-medium group-hover:text-primary-700">
                  Shop on Mercado Libre <FaExternalLinkAlt className="ml-2 text-sm" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* CTA Section with gradient background */}
      <section className="py-16 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white mx-0 md:mx-4 px-4 shadow-lg rounded-none md:rounded-xl">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Create Your CD Template?</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Start designing your custom CD templates today with our easy-to-use tool
          </p>
          <button 
            onClick={handleCreateTemplate}
            className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-10 py-3 shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage 
import { useNavigate } from 'react-router-dom'
import { FaUpload, FaCrop, FaFilePdf, FaArrowRight, FaCheck, FaCompactDisc } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { resetTemplate } from '@features/template/templateSlice'
import { useEffect, useState, useRef } from 'react'

// Helper function to check if element is in viewport
const useInViewport = (ref: React.RefObject<HTMLElement>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isIntersecting;
};

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Refs for sections to animate when they come into view
  const howItWorksRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  
  // Check if sections are in viewport
  const howItWorksInView = useInViewport(howItWorksRef);
  const featuresInView = useInViewport(featuresRef);
  const ctaInView = useInViewport(ctaRef);
  
  // Animation for spinning disc in hero section
  const [spin, setSpin] = useState(false);
  
  useEffect(() => {
    // Start spinning animation after a short delay
    const timer = setTimeout(() => {
      setSpin(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handler to reset template state and navigate to upload page
  const handleCreateTemplate = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }

  // CSS for animations
  const animationClasses = {
    fadeInUp: "opacity-0 translate-y-10 transition-all duration-1000",
    fadeInActive: "opacity-100 translate-y-0",
    staggered: (delay: string) => `transition-all duration-700 delay-${delay}`,
    spinDisc: "transition-transform duration-[3000ms] ease-in-out",
    spinActive: "rotate-[360deg]"
  };
  
  return (
    <div className="space-y-24">
      {/* Hero Section with gradient and animation */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 text-center relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl -z-10 animate-pulse-slow animation-delay-1000"></div>
        
        {/* Floating CD icon */}
        <div className={`absolute top-20 right-[10%] text-primary-300 opacity-70 hidden lg:block ${animationClasses.spinDisc} ${spin ? animationClasses.spinActive : ''}`}>
          <FaCompactDisc className="text-7xl" />
        </div>
        
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
                className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2 group hover:scale-105 transition-transform shadow-md hover:shadow-lg"
              >
                Create Your Template
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <a 
                href="#how-it-works" 
                className="btn btn-outline text-lg px-8 py-3 hover:bg-secondary-50 hover:border-primary-400 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works with hover effects and animations */}
      <section 
        id="how-it-works" 
        ref={howItWorksRef}
        className={`py-16 bg-gradient-to-b from-white to-primary-50 rounded-none md:rounded-xl ${animationClasses.fadeInUp} ${howItWorksInView ? animationClasses.fadeInActive : ''}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Create your custom CD template in just a few simple steps
          </p>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`card text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-xl rounded-lg bg-white ${howItWorksInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('100')}`}>
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-200">
                <FaUpload className="text-3xl text-primary-600 transition-all duration-300 group-hover:text-primary-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300">1. Upload Your Artwork</h3>
              <p className="text-secondary-600 leading-relaxed">
                Upload your images for the CD cover, back, and the CD itself. Our tool supports all common image formats.
              </p>
            </div>
            
            <div className={`card text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-xl rounded-lg bg-white ${howItWorksInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('200')}`}>
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-200">
                <FaCrop className="text-3xl text-primary-600 transition-all duration-300 group-hover:text-primary-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300">2. Crop & Position</h3>
              <p className="text-secondary-600 leading-relaxed">
                Adjust your images to fit perfectly within the CD template dimensions. Our smart cropping tools make it easy.
              </p>
            </div>
            
            <div className={`card text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-xl rounded-lg bg-white ${howItWorksInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('300')}`}>
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-200">
                <FaFilePdf className="text-3xl text-primary-600 transition-all duration-300 group-hover:text-primary-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300">3. Generate & Print</h3>
              <p className="text-secondary-600 leading-relaxed">
                Download your PDF template, ready for printing on US Letter paper. High-quality output every time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with cards and animations */}
      <section 
        ref={featuresRef}
        className={`py-16 bg-secondary-50 mx-0 md:mx-4 px-4 rounded-none md:rounded-xl ${animationClasses.fadeInUp} ${featuresInView ? animationClasses.fadeInActive : ''}`}
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Everything you need to create professional CD templates
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className={`flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary-50 hover:-translate-y-1 ${featuresInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('100')}`}>
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Precise Measurements</h3>
                <p className="text-secondary-600 leading-relaxed">All templates follow industry standard measurements for CD packaging, ensuring perfect results every time.</p>
              </div>
            </div>
            
            <div className={`flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary-50 hover:-translate-y-1 ${featuresInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('200')}`}>
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Advanced Image Cropping</h3>
                <p className="text-secondary-600 leading-relaxed">Intelligent cropping tools that help ensure your artwork fits perfectly within the required dimensions.</p>
              </div>
            </div>
            
            <div className={`flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary-50 hover:-translate-y-1 ${featuresInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('300')}`}>
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Print-Ready PDFs</h3>
                <p className="text-secondary-600 leading-relaxed">Download high-quality, print-ready PDF files optimized for US Letter paper with cutting guides included.</p>
              </div>
            </div>
            
            <div className={`flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary-50 hover:-translate-y-1 ${featuresInView ? animationClasses.fadeInActive : ''} ${animationClasses.fadeInUp} ${animationClasses.staggered('400')}`}>
              <div className="mr-5 text-primary-600">
                <div className="bg-primary-100 rounded-full p-3 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
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
      
      {/* CTA Section with gradient background and animations */}
      <section 
        ref={ctaRef}
        className={`py-16 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white mx-0 md:mx-4 px-4 shadow-lg rounded-none md:rounded-xl ${animationClasses.fadeInUp} ${ctaInView ? animationClasses.fadeInActive : ''}`}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Create Your CD Template?</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Start designing your custom CD templates today with our easy-to-use tool
          </p>
          <button 
            onClick={handleCreateTemplate}
            className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-10 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:text-primary-600 animate-bounce-subtle animation-delay-2000"
          >
            Get Started Now
          </button>
        </div>
      </section>
      
      {/* Add animation styles to document */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(-3px); }
            50% { transform: translateY(0); }
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 6s infinite;
          }
          
          .animate-bounce-subtle {
            animation: bounce-subtle 2s infinite;
          }
          
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .delay-100 {
            transition-delay: 100ms;
          }
          
          .delay-200 {
            transition-delay: 200ms;
          }
          
          .delay-300 {
            transition-delay: 300ms;
          }
          
          .delay-400 {
            transition-delay: 400ms;
          }
        `
      }} />
    </div>
  )
}

export default HomePage 
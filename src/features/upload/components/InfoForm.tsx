import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setAlbumTitle, 
  setArtistName, 
  selectTemplateState, 
  nextStep 
} from '@features/template/templateSlice'
import { FaArrowRight } from 'react-icons/fa'

// Define the animations as CSS classes
const animationStyles = `
  @keyframes pulse-subtle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 2s infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 1s ease-in;
  }
`;

const InfoForm: React.FC = () => {
  const dispatch = useDispatch()
  const { albumTitle, artistName } = useSelector(selectTemplateState)
  const [isPulsing, setIsPulsing] = useState(false)
  
  // Add animation styles to the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Start pulsing animation after a short delay once form fields are populated
  useEffect(() => {
    if (albumTitle.trim() && artistName.trim()) {
      const timer = setTimeout(() => {
        setIsPulsing(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsPulsing(false);
    }
  }, [albumTitle, artistName]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(nextStep())
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Enter CD Information</h1>
        <p className="text-secondary-600">
          Start by providing basic information about your CD
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="mb-6">
          <label htmlFor="albumTitle" className="block text-secondary-700 font-medium mb-2">
            Album Title
          </label>
          <input
            type="text"
            id="albumTitle"
            value={albumTitle}
            onChange={(e) => dispatch(setAlbumTitle(e.target.value))}
            className="input"
            placeholder="Enter album title"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="artistName" className="block text-secondary-700 font-medium mb-2">
            Artist Name
          </label>
          <input
            type="text"
            id="artistName"
            value={artistName}
            onChange={(e) => dispatch(setArtistName(e.target.value))}
            className="input"
            placeholder="Enter artist name"
            required
          />
        </div>
        
        <div className="flex flex-col items-center mt-10">
          <button
            type="submit"
            className={`btn btn-primary px-8 py-3 flex items-center text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
              isPulsing ? 'animate-pulse-subtle hover:animate-none' : ''
            }`}
          >
            Continue to Uploads <FaArrowRight className="ml-2" />
          </button>
          
          {isPulsing && (
            <p className="text-primary-600 text-sm mt-3 animate-fade-in">
              Ready to proceed! Click the button to continue.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default InfoForm 
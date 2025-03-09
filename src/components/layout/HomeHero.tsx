import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetTemplate } from '@features/template/templateSlice'

const HomeHero: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Handler to reset template state and navigate to upload page
  const handleCreateTemplate = () => {
    dispatch(resetTemplate())
    navigate('/upload')
  }
  
  return (
    <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg cta-card">
      <h2 className="text-2xl font-bold mb-3">Ready to Create Your CD Template?</h2>
      <p className="mb-6">Start designing your custom CD templates today with our easy-to-use tool</p>
      <button
        onClick={handleCreateTemplate}
        className="bg-white text-blue-600 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
      >
        Get Started Now
      </button>
    </div>
  )
}

export default HomeHero 
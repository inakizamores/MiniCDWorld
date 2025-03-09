import React from 'react'
import { Link } from 'react-router-dom'

const HomeHero: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg cta-card">
      <h2 className="text-2xl font-bold mb-3">Ready to Create Your CD Template?</h2>
      <p className="mb-6">Start designing your custom CD templates today with our easy-to-use tool</p>
      <Link to="/upload" className="bg-white text-blue-600 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors">
        Get Started Now
      </Link>
    </div>
  )
}

export default HomeHero 
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setAlbumTitle, 
  setArtistName, 
  selectTemplateState, 
  nextStep 
} from '@features/template/templateSlice'

const InfoForm: React.FC = () => {
  const dispatch = useDispatch()
  const { albumTitle, artistName } = useSelector(selectTemplateState)
  
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
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Continue to Uploads
          </button>
        </div>
      </form>
    </div>
  )
}

export default InfoForm 
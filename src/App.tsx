import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import HomePage from '@features/home/HomePage'
import UploadPage from '@features/upload/UploadPage'
import PreviewPage from '@features/preview/PreviewPage'
import GeneratePdfPage from '@features/pdf/GeneratePdfPage'
import useViewportScaling from '@hooks/useViewportScaling'

const App: React.FC = () => {
  // Apply viewport scaling
  useViewportScaling();
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="generate" element={<GeneratePdfPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App 
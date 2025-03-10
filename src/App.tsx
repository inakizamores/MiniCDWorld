import { Routes, Route } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import HomePage from '@features/home/HomePage'
import UploadPage from '@features/upload/UploadPage'
import PreviewPage from '@features/preview/PreviewPage'
import GeneratePdfPage from '@features/pdf/GeneratePdfPage'
import PurchasePage from '@features/purchase/PurchasePage'
import NotFoundPage from '@components/ui/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="generate" element={<GeneratePdfPage />} />
        <Route path="purchase" element={<PurchasePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App 
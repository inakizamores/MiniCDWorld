import { Routes, Route } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import HomePage from '@features/home/HomePage'
import UploadPage from '@features/upload/UploadPage'
import PreviewPage from '@features/preview/PreviewPage'
import GeneratePdfPage from '@features/pdf/GeneratePdfPage'
import PurchasePage from '@features/purchase/PurchasePage'
import NFCTutorialPage from '@features/nfc/NFCTutorialPage'
import NotFoundPage from '@components/ui/NotFoundPage'
import ScrollToTop from '@components/ui/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="preview" element={<PreviewPage />} />
          <Route path="generate" element={<GeneratePdfPage />} />
          <Route path="purchase" element={<PurchasePage />} />
          <Route path="nfc-tutorial" element={<NFCTutorialPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App 
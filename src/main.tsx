import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import { store } from './store'
import './styles/globals.css'
import './styles/modal.css'

// Remove redundant font preloading - already in index.html

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
) 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PdfProvider } from './context/PdfProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PdfProvider>
      <App />
    </PdfProvider>
  </StrictMode>,
)

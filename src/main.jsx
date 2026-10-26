import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LangProvider from './context/LangProvider'
import QuoteProvider from './context/QuoteProvider'
import CatalogProvider from './context/CatalogProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <CatalogProvider>
          <QuoteProvider>
            <App />
          </QuoteProvider>
        </CatalogProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>,
)

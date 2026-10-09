import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import QuoteDrawer from './components/QuoteDrawer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import Collections from './pages/Collections'
import Category from './pages/Category'
import Product from './pages/Product'
import NotFound from './pages/NotFound'
import { useLang } from './context/lang'
import { useQuote } from './context/quote'

// El panel se carga aparte para no sumar peso al sitio público.
const Admin = lazy(() => import('./admin/Admin'))

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<Site />} />
    </Routes>
  )
}

function Site() {
  const { t } = useLang()
  const { isOpen } = useQuote()

  return (
    <>
      <a href="#contenido" className="sr-only">
        {t.skip}
      </a>
      <ScrollManager />
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colecciones" element={<Collections />} />
          <Route path="/colecciones/:catId" element={<Category />} />
          <Route path="/producto/:prodId" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {isOpen && <QuoteDrawer />}
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/catalog'
import { CatalogContext } from './catalog'

// Productos estáticos de catalog.js con la forma que devuelve /api/products.
const FALLBACK = PRODUCTS.map((p) => ({ ...p, featured: true, desc: { es: '', en: '' }, frames: [], uphs: [] }))

// Carga los productos publicados desde /api/products. Si la API no responde
// (p. ej. `vite dev` sin .env.local) usa el catálogo estático.
export default function CatalogProvider({ children }) {
  const [products, setProducts] = useState(null)

  useEffect(() => {
    let alive = true
    fetch('/api/products', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((list) => Array.isArray(list) ? list : Promise.reject(new Error('respuesta inválida')))
      .catch((err) => {
        console.warn('Catálogo estático: /api/products no disponible', err)
        return FALLBACK
      })
      .then((list) => alive && setProducts(list))
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => {
    const list = products || []
    const featured = list.filter((p) => p.featured)
    return {
      products: list,
      ready: products !== null,
      featured: (featured.length ? featured : list).slice(0, 8),
      findProduct: (id) => list.find((p) => p.id === id),
      productsIn: (catId) => list.filter((p) => p.cat === catId),
    }
  }, [products])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

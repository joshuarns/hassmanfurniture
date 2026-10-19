import { createContext, useContext } from 'react'

export const CatalogContext = createContext(null)

// { products, ready, findProduct(id), productsIn(catId), featured }
export const useCatalog = () => useContext(CatalogContext)

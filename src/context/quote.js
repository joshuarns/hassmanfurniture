import { createContext, useContext } from 'react'

export const QuoteContext = createContext(null)

// { items, count, add, remove, clear, isOpen, open, close }
export const useQuote = () => useContext(QuoteContext)

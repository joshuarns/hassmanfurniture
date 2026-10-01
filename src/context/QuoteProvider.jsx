import { useCallback, useEffect, useMemo, useState } from 'react'
import { QuoteContext } from './quote'

const KEY = 'hassman-quote'

function readItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// Lista de piezas a cotizar: { prod, frame, uph, qty }. Se guarda en localStorage.
export default function QuoteProvider({ children }) {
  const [items, setItems] = useState(readItems)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // sin persistencia
    }
  }, [items])

  const add = useCallback((item) => {
    setItems((list) => {
      const i = list.findIndex((q) => q.prod === item.prod && q.frame === item.frame && q.uph === item.uph)
      if (i < 0) return [...list, item]
      const next = [...list]
      next[i] = { ...next[i], qty: next[i].qty + item.qty }
      return next
    })
  }, [])

  const remove = useCallback((index) => setItems((list) => list.filter((_, j) => j !== index)), [])
  const clear = useCallback(() => setItems([]), [])
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  const count = items.reduce((a, q) => a + q.qty, 0)

  const value = useMemo(
    () => ({ items, count, add, remove, clear, isOpen, open, close }),
    [items, count, add, remove, clear, isOpen, open, close],
  )

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

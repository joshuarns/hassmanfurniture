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

// Lista de piezas a cotizar: { prod, variant, frame, uph, color, qty } (variant y color pueden ser null). Se guarda en localStorage.
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
      const same = (q) => ['prod', 'variant', 'frame', 'uph', 'color'].every((k) => (q[k] ?? null) === (item[k] ?? null))
      const i = list.findIndex(same)
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

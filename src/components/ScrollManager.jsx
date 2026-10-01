import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Al cambiar de ruta sube al inicio; si hay #ancla, desplaza hasta la sección.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
    }, 30)
    return () => clearTimeout(id)
  }, [pathname, hash])

  return null
}

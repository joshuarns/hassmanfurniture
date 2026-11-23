import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger, scrollTo } from '../lib/motion'

// Al cambiar de ruta sube al inicio; si hay #ancla, desplaza hasta la sección.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollTo(0, { immediate: true })
      return
    }
    const id = setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) scrollTo(el)
    }, 60)
    return () => clearTimeout(id)
  }, [pathname, hash])

  // Tras cambiar de página, las posiciones de los disparadores cambian.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(id)
  }, [pathname])

  return null
}

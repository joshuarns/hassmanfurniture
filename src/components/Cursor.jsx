import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { finePointer, gsap, reducedMotion } from '../lib/motion'
import './Cursor.css'

// Cursor de acompañamiento: un punto que se expande con una etiqueta sobre
// elementos con data-cursor="Ver". Sólo con mouse y sin movimiento reducido.
export default function Cursor() {
  const [enabled] = useState(() => finePointer() && !reducedMotion())
  const [hovered, setHovered] = useState({ label: '', path: '' })
  const dot = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled) return
    const el = dot.current
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    const move = (e) => {
      x(e.clientX)
      y(e.clientY)
      el.classList.add('is-visible')
    }
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor]')
      setHovered({ label: target ? target.dataset.cursor : '', path: window.location.pathname })
    }
    const leave = () => el.classList.remove('is-visible')
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  // Al navegar, el elemento bajo el cursor ya no existe: la etiqueta sólo vale en su ruta.
  const label = hovered.path === pathname ? hovered.label : ''

  if (!enabled) return null
  return (
    <div ref={dot} className={`cursor ${label ? 'is-label' : ''}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}

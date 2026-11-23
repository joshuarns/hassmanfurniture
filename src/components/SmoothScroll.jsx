import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger, gsap, reducedMotion, setLenis } from '../lib/motion'

// Scroll suave con Lenis, sincronizado con el reloj de GSAP y ScrollTrigger.
export default function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.95 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Recalcula posiciones cuando terminan de cargar fuentes e imágenes.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}

import { useEffect } from 'react'
import { getLenis } from '../lib/motion'

// Bloquea el scroll del body (y detiene Lenis) mientras `active` sea true.
export default function useLockBody(active) {
  useEffect(() => {
    if (!active) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    getLenis()?.stop()
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      getLenis()?.start()
    }
  }, [active])
}

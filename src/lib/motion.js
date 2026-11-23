import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Instancia global de Lenis (null si no hay scroll suave).
let lenis = null
export const setLenis = (l) => {
  lenis = l
}
export const getLenis = () => lenis

/** Desplaza a un elemento, selector o posición; inmediato si `immediate`. */
export function scrollTo(target, { offset = 0, immediate = false } = {}) {
  if (lenis) return lenis.scrollTo(target, { offset, immediate, duration: 1.6 })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  const top = typeof el === 'number' ? el : (el?.getBoundingClientRect().top ?? 0) + window.scrollY
  window.scrollTo({ top: top + offset, behavior: immediate ? 'auto' : 'smooth' })
}

// La intro avisa cuando termina para que el hero arranque su animación.
let resolveIntro
export const introDone = new Promise((r) => {
  resolveIntro = r
})
export const finishIntro = () => resolveIntro()

export const EASE = 'expo.out'

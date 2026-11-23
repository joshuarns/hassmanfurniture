import { useRef, useState } from 'react'
import { finishIntro, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './Intro.css'

const KEY = 'hassman-intro'
const WORD = 'HASSMAN'

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

// Cortina de entrada: la marca aparece letra por letra, una línea se traza y el telón sube.
// Una vez por sesión; se omite con movimiento reducido.
export default function Intro() {
  const [show] = useState(() => !seen() && !reducedMotion())
  const [done, setDone] = useState(false)
  const root = useRef(null)

  useGSAP(
    () => {
      if (!show) {
        finishIntro()
        return
      }
      document.documentElement.style.overflow = 'hidden'
      const end = () => {
        try {
          sessionStorage.setItem(KEY, '1')
        } catch {
          // sin almacenamiento: se mostrará otra vez
        }
        document.documentElement.style.overflow = ''
        setDone(true)
      }
      const tl = gsap.timeline({ onComplete: end })
      tl.from('.intro__letter', { yPercent: 120, duration: 1.3, ease: 'expo.out', stagger: 0.06 })
        .from('.intro__tag', { opacity: 0, y: 10, duration: 1, ease: 'power2.out' }, '-=0.7')
        .from('.intro__line', { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, '-=0.9')
        .to('.intro__brand, .intro__tag, .intro__line', { opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.25')
        .to(root.current, { yPercent: -100, duration: 1.3, ease: 'expo.inOut' }, '-=0.1')
        .add(finishIntro, '-=0.75')
    },
    { scope: root },
  )

  if (!show || done) return null

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__brand">
        {WORD.split('').map((l, i) => (
          <span key={i} className="intro__mask">
            <span className="intro__letter">{l}</span>
          </span>
        ))}
      </div>
      <span className="intro__line" />
      <span className="intro__tag">Furniture</span>
    </div>
  )
}

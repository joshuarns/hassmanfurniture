import { EASE, ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion'

// Animaciones de entrada declarativas dentro de `scope`:
//   data-reveal="up"    sube y aparece
//   data-reveal="mask"  cada `.mask > span` emerge desde abajo (titulares por línea)
//   data-reveal="clip"  la imagen se descubre de abajo hacia arriba
//   data-reveal="fade"  sólo aparece
//   data-parallax="12"  desplazamiento vertical (yPercent) ligado al scroll
//   data-delay="0.2"    retraso opcional
// El contenido es visible sin JS; GSAP sólo fija el estado inicial al montarse.
export default function useReveals(scope, deps = []) {
  useGSAP(
    () => {
      if (reducedMotion()) return
      const q = gsap.utils.selector(scope)
      const at = (el, start = 'top 88%') => ({ trigger: el, start, once: true })
      const delay = (el) => Number(el.dataset.delay || 0)

      q('[data-reveal="up"]').forEach((el) =>
        gsap.from(el, { y: 56, opacity: 0, duration: 1.6, ease: EASE, delay: delay(el), scrollTrigger: at(el) }),
      )
      q('[data-reveal="fade"]').forEach((el) =>
        gsap.from(el, { opacity: 0, duration: 1.8, ease: 'power2.out', delay: delay(el), scrollTrigger: at(el) }),
      )
      q('[data-reveal="mask"]').forEach((el) =>
        gsap.from(el.querySelectorAll('.mask > span'), {
          yPercent: 112,
          duration: 1.7,
          ease: EASE,
          stagger: 0.1,
          delay: delay(el),
          scrollTrigger: at(el, 'top 92%'),
        }),
      )
      q('[data-reveal="clip"]').forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: at(el, 'top 85%'), delay: delay(el) })
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' })
        const img = el.querySelector('img')
        if (img) {
          // Una transición CSS sobre transform (zoom al pasar el mouse) pelearía con la animación.
          img.style.transition = 'none'
          tl.from(img, { scale: 1.35, duration: 2.4, ease: EASE, clearProps: 'transform,transition' }, 0)
        }
      })
      q('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax || 10)
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      ScrollTrigger.refresh()
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}

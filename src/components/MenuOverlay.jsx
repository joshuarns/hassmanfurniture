import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, CONTACT, pad } from '../data/catalog'
import { LANGS } from '../i18n/translations'
import { useLang } from '../context/lang'
import useLockBody from '../hooks/useLockBody'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import './MenuOverlay.css'

// Menú a pantalla completa: lista monumental de colecciones con vista previa de la imagen.
export default function MenuOverlay({ onClose }) {
  const { lang, setLang, t, label } = useLang()
  const root = useRef(null)
  const tl = useRef(null)
  const [active, setActive] = useState(CATEGORIES[0].id)

  useLockBody(true)

  useGSAP(
    () => {
      const quick = reducedMotion()
      tl.current = gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(root.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: quick ? 0.01 : 1.1, ease: 'expo.inOut' })
        .from('.menu__item .mask > span', { yPercent: 110, duration: quick ? 0.01 : 1.3, stagger: 0.05 }, '-=0.45')
        .from('.menu__fade', { opacity: 0, y: 16, duration: quick ? 0.01 : 1, stagger: 0.08 }, '-=1')
    },
    { scope: root },
  )

  const close = () => {
    if (!tl.current) return onClose()
    tl.current.timeScale(1.8).reverse()
    tl.current.eventCallback('onReverseComplete', onClose)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const current = CATEGORIES.find((c) => c.id === active)

  return (
    <div className="menu" ref={root} role="dialog" aria-modal="true" aria-label={t.menu}>
      <div className="menu__top">
        <button type="button" className="menu__close" onClick={close} autoFocus>
          <span aria-hidden="true" className="menu__x" />
          {t.close}
        </button>
        <span className="wordmark">Hassman</span>
        <div className="menu__langs">
          {LANGS.map((l) => (
            <button key={l} type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="menu__body">
        <nav className="menu__list" aria-label={t.nav_collections}>
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.id}
              to={`/colecciones/${c.id}`}
              className={`menu__item ${c.id === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(c.id)}
              onFocus={() => setActive(c.id)}
              onClick={onClose}
            >
              <span className="menu__num numeral">{pad(i + 1)}</span>
              <span className="mask">
                <span>
                  <span className="menu__name">{label(c)}</span>
                </span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="menu__preview menu__fade" aria-hidden="true">
          {CATEGORIES.map((c) => (
            <img key={c.id} src={c.img} alt="" className={c.id === active ? 'is-active' : ''} loading="lazy" />
          ))}
          <span className="menu__caption caps">{label(current.sub)}</span>
        </div>
      </div>

      <div className="menu__foot">
        <div className="menu__links menu__fade">
          <Link to="/colecciones" onClick={onClose}>
            {t.nav_collections}
          </Link>
          <Link to="/#estudio" onClick={onClose}>
            {t.nav_studio}
          </Link>
          <Link to="/#proyectos" onClick={onClose}>
            {t.nav_trade}
          </Link>
          <Link to="/#contacto" onClick={onClose}>
            {t.nav_contact}
          </Link>
        </div>
        <div className="menu__contact menu__fade">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          {CONTACT.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

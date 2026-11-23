import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LANGS } from '../i18n/translations'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import MenuOverlay from './MenuOverlay'
import './Header.css'

// Encabezado fijo: transparente sobre el hero de la portada, blanco al bajar,
// y se oculta al desplazarse hacia abajo para dejar respirar las imágenes.
export default function Header() {
  const { lang, setLang, t } = useLang()
  const quote = useQuote()
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const overHero = pathname === '/'

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > (overHero ? window.innerHeight * 0.85 : 10))
      setHidden(y > 240 && y > last + 2)
      if (y < last - 2) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  const tone = overHero && !solid ? 'hd--over' : 'hd--solid'

  return (
    <>
      <header className={`hd ${tone} ${hidden && !menu ? 'hd--hidden' : ''}`}>
        <div className="hd__bar">
          <div className="hd__side">
            <button type="button" className="hd__btn hd__menu" aria-expanded={menu} onClick={() => setMenu(true)}>
              <span className="hd__burger" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="hd__label">{t.menu}</span>
            </button>
            <Link to="/colecciones" className="hd__btn hd__hide-md">
              {t.nav_collections}
            </Link>
          </div>

          <Link to="/" className="wordmark" aria-label="Hassman Furniture">
            Hassman
          </Link>

          <div className="hd__side hd__side--end">
            <div className="hd__langs hd__hide-sm" role="group" aria-label="Idioma / Language">
              {LANGS.map((l) => (
                <button key={l} type="button" className="hd__btn" aria-pressed={l === lang} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button type="button" className="hd__btn hd__hide-md" onClick={quote.open}>
              {t.appointment}
            </button>
            <button type="button" className="hd__btn" onClick={quote.open}>
              <span className="hd__hide-sm">{t.selection}</span>
              <span className="hd__count">{quote.count}</span>
            </button>
          </div>
        </div>
      </header>
      {menu && <MenuOverlay onClose={() => setMenu(false)} />}
    </>
  )
}

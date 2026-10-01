import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, FEATURED_PRODUCT, GROUPS, UPLOADS } from '../data/catalog'
import { LANGS } from '../i18n/translations'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import { BagIcon } from './Icons'
import './Header.css'

const FEATURE_IMG = UPLOADS + '2023/12/TAD-1.jpg'

export default function Header() {
  const { lang, setLang, t, label } = useLang()
  const quote = useQuote()
  const [mega, setMega] = useState(false)
  const headerRef = useRef(null)

  const close = () => setMega(false)
  // En escritorio el mega menú se abre al pasar el mouse; en táctil, con toque.
  const hoverOpen = (e) => e.pointerType === 'mouse' && setMega(true)
  const hoverClose = (e) => e.pointerType === 'mouse' && setMega(false)

  useEffect(() => {
    if (!mega) return
    const onKey = (e) => e.key === 'Escape' && setMega(false)
    const onDown = (e) => !headerRef.current?.contains(e.target) && setMega(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [mega])

  return (
    <header className="header" ref={headerRef} onPointerLeave={hoverClose}>
      <div className="header__bar">
        <Link to="/" className="brand" onClick={close} onPointerEnter={hoverClose}>
          HASSMAN
        </Link>

        <nav className="header__nav scroll-x" aria-label="Principal">
          <button
            type="button"
            className={`header__link ${mega ? 'is-active' : ''}`}
            aria-expanded={mega}
            aria-controls="mega-menu"
            // Con mouse ya se abrió al pasar encima: el clic no debe cerrarlo. Táctil/teclado alternan.
            onClick={(e) => (e.nativeEvent.pointerType === 'mouse' ? setMega(true) : setMega((m) => !m))}
            onPointerEnter={hoverOpen}
          >
            {t.nav_collections}
          </button>
          <Link to="/colecciones/oficina" className="header__link" onClick={close} onPointerEnter={hoverClose}>
            {t.seating}
          </Link>
          <Link to="/#estudio" className="header__link" onClick={close} onPointerEnter={hoverClose}>
            {t.nav_studio}
          </Link>
          <Link to="/#proyectos" className="header__link" onClick={close} onPointerEnter={hoverClose}>
            {t.nav_trade}
          </Link>
          <Link to="/#contacto" className="header__link" onClick={close} onPointerEnter={hoverClose}>
            {t.nav_contact}
          </Link>
        </nav>

        <div className="header__langs" role="group" aria-label="Idioma / Language">
          {LANGS.map((l) => (
            <button key={l} type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="header__quote"
          aria-label={`${t.quote_btn}${quote.count ? ` (${quote.count})` : ''}`}
          onClick={() => {
            close()
            quote.open()
          }}
        >
          <BagIcon />
          <span>{quote.count || ''}</span>
        </button>
      </div>

      {mega && (
        <div className="mega" id="mega-menu">
          <div className="mega__inner">
            {GROUPS.map((g) => (
              <div key={g} className="mega__group">
                <span className="mega__title">{t[g]}</span>
                {CATEGORIES.filter((c) => c.group === g).map((c) => (
                  <Link key={c.id} to={`/colecciones/${c.id}`} className="mega__link" onClick={close}>
                    {label(c)}
                  </Link>
                ))}
              </div>
            ))}
            <Link to={`/producto/${FEATURED_PRODUCT}`} className="mega__feature" onClick={close}>
              <div className="media media--contain mega__feature-img">
                <img src={FEATURE_IMG} alt="Tad" />
              </div>
              <span>{t.mega_feature} ›</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

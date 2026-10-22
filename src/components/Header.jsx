import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LANGS } from '../i18n/translations'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import MenuDrawer from './MenuDrawer'
import './Header.css'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const quote = useQuote()
  const [menu, setMenu] = useState(false)

  return (
    <header className="hd">
      <div className="hd__bar">
        <nav className="hd__side ui" aria-label="Principal">
          <button type="button" className="hd__menu" aria-expanded={menu} onClick={() => setMenu(true)}>
            <span className="hd__burger" aria-hidden="true">
              <span />
              <span />
            </span>
            {t.menu}
          </button>
          <Link to="/colecciones" className="hd__hide-sm">
            {t.nav_collections}
          </Link>
        </nav>

        <Link to="/" className="brand" aria-label="Hassman Furniture">
          HASSMAN
        </Link>

        <div className="hd__side hd__side--end ui">
          <div className="hd__langs" role="group" aria-label="Idioma / Language">
            {LANGS.map((l, i) => (
              <span key={l}>
                {i > 0 && <span className="hd__sep">·</span>}
                <button type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <Link to="/#contacto" className="hd__hide-sm">
            {t.nav_contact}
          </Link>
          <button type="button" className="hd__quote" onClick={quote.open}>
            {t.quote_btn} <span className="tnum">({quote.count})</span>
          </button>
        </div>
      </div>

      {menu && <MenuDrawer onClose={() => setMenu(false)} />}
    </header>
  )
}

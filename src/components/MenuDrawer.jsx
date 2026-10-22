import { Link } from 'react-router-dom'
import { CATEGORIES, GROUPS } from '../data/catalog'
import { LANGS } from '../i18n/translations'
import { useLang } from '../context/lang'
import Drawer from './Drawer'
import './MenuDrawer.css'

export default function MenuDrawer({ onClose }) {
  const { lang, setLang, t, label } = useLang()

  return (
    <Drawer side="left" label={t.menu} onClose={onClose} head={<span className="brand">HASSMAN</span>}>
      <nav className="dw__body menu" aria-label={t.menu}>
        {GROUPS.map((g) => (
          <div key={g} className="menu__group">
            <span className="caps">{t[g]}</span>
            {CATEGORIES.filter((c) => c.group === g).map((c) => (
              <Link key={c.id} to={`/colecciones/${c.id}`} className="menu__item" onClick={onClose}>
                <span className="menu__name">{label(c)}</span>
                <span className="menu__sub">{label(c.sub)}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className="menu__group menu__group--plain">
          <Link to="/colecciones" className="menu__name" onClick={onClose}>
            {t.nav_collections}
          </Link>
          <Link to="/#estudio" className="menu__name" onClick={onClose}>
            {t.nav_studio}
          </Link>
          <Link to="/#proyectos" className="menu__name" onClick={onClose}>
            {t.nav_trade}
          </Link>
          <Link to="/#contacto" className="menu__name" onClick={onClose}>
            {t.nav_contact}
          </Link>
        </div>

        <div className="menu__langs ui">
          {LANGS.map((l) => (
            <button key={l} type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </Drawer>
  )
}

import { Link } from 'react-router-dom'
import { CATEGORIES, CONTACT, GROUPS } from '../data/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import './Footer.css'

export default function Footer() {
  const { t, label } = useLang()
  const { open: openQuote } = useQuote()

  return (
    <footer id="contacto" className="ft dark">
      <div className="ft__inner">
        <div className="ft__top">
          <div className="ft__intro">
            <p className="caps muted">{t.footer_contact}</p>
            <a className="ft__mail" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            <button type="button" className="link" onClick={openQuote}>
              {t.visit_cta} <span className="arrow" />
            </button>
          </div>
          {GROUPS.map((g) => (
            <nav key={g} className="ft__col" aria-label={t[g]}>
              <span className="caps muted">{t[g]}</span>
              {CATEGORIES.filter((c) => c.group === g).map((c) => (
                <Link key={c.id} to={`/colecciones/${c.id}`}>
                  {label(c)}
                </Link>
              ))}
            </nav>
          ))}
          <nav className="ft__col" aria-label="Social">
            <span className="caps muted">Social</span>
            {CONTACT.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="ft__brand" aria-hidden="true">
          Hassman
        </div>

        <div className="ft__bottom caps">
          <span>{t.rights}</span>
          <span>{t.meta3}</span>
        </div>
      </div>
    </footer>
  )
}

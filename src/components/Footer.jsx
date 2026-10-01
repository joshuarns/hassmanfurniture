import { Link } from 'react-router-dom'
import { CATEGORIES, CONTACT, GROUPS } from '../data/catalog'
import { useLang } from '../context/lang'
import './Footer.css'

export default function Footer() {
  const { t, label } = useLang()

  return (
    <footer id="contacto" className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__col">
            <span className="brand">HASSMAN</span>
            <span className="footer__muted">{t.footer_tag}</span>
          </div>
          {GROUPS.map((g) => (
            <div key={g} className="footer__col">
              <span className="footer__title">{t[g]}</span>
              {CATEGORIES.filter((c) => c.group === g).map((c) => (
                <Link key={c.id} to={`/colecciones/${c.id}`}>
                  {label(c)}
                </Link>
              ))}
            </div>
          ))}
          <div className="footer__col">
            <span className="footer__title">{t.footer_contact}</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            {CONTACT.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer__bottom">
          <span>{t.rights}</span>
          <span>{t.meta3}</span>
        </div>
      </div>
    </footer>
  )
}

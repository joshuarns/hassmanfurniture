import { Link } from 'react-router-dom'
import { CATEGORIES, CONTACT, GROUPS } from '../data/catalog'
import { useLang } from '../context/lang'
import './Footer.css'

export default function Footer() {
  const { t, label } = useLang()

  return (
    <footer id="contacto" className="ft">
      <div className="wrap ft__inner">
        <div className="ft__cols">
          <div className="ft__col ft__col--brand">
            <span className="brand">HASSMAN</span>
            <p>{t.footer_tag}</p>
          </div>
          {GROUPS.map((g) => (
            <div key={g} className="ft__col">
              <span className="ft__label">{t[g]}</span>
              {CATEGORIES.filter((c) => c.group === g).map((c) => (
                <Link key={c.id} to={`/colecciones/${c.id}`}>
                  {label(c)}
                </Link>
              ))}
            </div>
          ))}
          <div className="ft__col">
            <span className="ft__label">{t.footer_contact}</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            {CONTACT.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="ft__bottom">
          <span>{t.rights}</span>
          <span>{t.meta3}</span>
        </div>
      </div>
    </footer>
  )
}

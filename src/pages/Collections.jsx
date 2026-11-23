import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, GROUPS, pad } from '../data/catalog'
import { useLang } from '../context/lang'
import Lines from '../components/Lines'
import { rich } from '../lib/rich'
import useReveals from '../hooks/useReveals'
import './Page.css'

export default function Collections() {
  const { t, lang, label } = useLang()
  const [filter, setFilter] = useState('all')
  const root = useRef(null)
  useReveals(root, [filter, lang])

  const shown = GROUPS.filter((g) => filter === 'all' || g === filter)

  return (
    <div ref={root}>
      <header className="page-head">
        <p className="caps kicker muted" data-reveal="fade">
          Hassman
        </p>
        <Lines as="h1" className="t-mega" lines={[t.coll_page_l1, rich(t.coll_page_l2)]} />
        <div className="page-head__meta">
          <p className="t-lead" data-reveal="up">
            {t.coll_lead}
          </p>
          <span className="numeral" style={{ fontSize: 56, lineHeight: 1 }} data-reveal="fade">
            {pad(CATEGORIES.length)}
          </span>
        </div>
      </header>

      <div className="tabs" role="group" aria-label={t.categories}>
        {['all', ...GROUPS].map((id) => (
          <button key={id} type="button" className="tab" aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {t[id]}
          </button>
        ))}
      </div>

      <div className="wrap page-body">
        {shown.map((g) => {
          const cats = CATEGORIES.filter((c) => c.group === g)
          return (
            <section key={g} className="cc-group">
              <header className="row-head">
                <Lines className="t-title" lines={[rich(`*${t[g]}*`)]} />
                <span className="caps muted">{t.count(cats.length)}</span>
              </header>
              <div className="cc-grid">
                {cats.map((c) => (
                  <Link key={c.id} to={`/colecciones/${c.id}`} className="cc" data-cursor={t.discover}>
                    <div className="ph cc__img zoom" data-reveal="clip">
                      <img src={c.img} alt="" loading="lazy" />
                    </div>
                    <div className="cc__cap" data-reveal="up">
                      <span className="numeral">{pad(CATEGORIES.indexOf(c) + 1)}</span>
                      <span className="cc__name">{label(c)}</span>
                      <span className="caps muted cc__sub">{label(c.sub)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

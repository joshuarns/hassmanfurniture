import { useState } from 'react'
import { CATEGORIES, GROUPS } from '../data/catalog'
import { useLang } from '../context/lang'
import CategoryPanel from '../components/CategoryPanel'
import './Page.css'

export default function Collections() {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')

  const shown = GROUPS.filter((g) => filter === 'all' || g === filter)

  return (
    <>
      <header className="page-head">
        <h1 className="t-page">{t.coll_title}</h1>
        <p className="t-lead">{t.coll_lead}</p>
      </header>

      <div className="tabs" role="group" aria-label={t.categories}>
        {['all', ...GROUPS].map((id) => (
          <button key={id} type="button" className="tab" aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {t[id]}
          </button>
        ))}
      </div>

      <div className="wrap page-body">
        {shown.map((g) => (
          <section key={g} className="group">
            <div className="section-head">
              <h2 className="t-title">{t[g]}</h2>
            </div>
            <div className="grid-panels">
              {CATEGORIES.filter((c) => c.group === g).map((c) => (
                <CategoryPanel key={c.id} category={c} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

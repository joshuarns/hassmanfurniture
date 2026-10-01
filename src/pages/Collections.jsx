import { useState } from 'react'
import { CATEGORIES, GROUPS, pad } from '../data/catalog'
import { useLang } from '../context/lang'
import CategoryCard from '../components/CategoryCard'
import './Collections.css'

export default function Collections() {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')

  const filters = [
    ['all', t.all, CATEGORIES.length],
    ...GROUPS.map((g) => [g, t[g], CATEGORIES.filter((c) => c.group === g).length]),
  ]
  const shown = GROUPS.filter((g) => filter === 'all' || g === filter)

  return (
    <section className="container page collections">
      <h1 className="page-title">{t.coll_title}</h1>

      <div className="collections__filters">
        {filters.map(([id, name, n]) => (
          <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {name}
            <span className="chip__count">{pad(n)}</span>
          </button>
        ))}
      </div>

      <div className="collections__groups">
        {shown.map((g) => (
          <div key={g} className="collections__group">
            <h2>{t[g]}</h2>
            <div className="collections__grid">
              {CATEGORIES.filter((c) => c.group === g).map((c) => (
                <CategoryCard key={c.id} category={c} variant="wide" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

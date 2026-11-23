import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, findCategory } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import Lines from '../components/Lines'
import useReveals from '../hooks/useReveals'
import NotFound from './NotFound'
import './Page.css'

export default function Category() {
  const { catId } = useParams()
  const { t, lang, label } = useLang()
  const { open: openQuote } = useQuote()
  const { productsIn, ready } = useCatalog()
  const root = useRef(null)
  const cat = findCategory(catId)
  const products = cat ? productsIn(cat.id) : []
  useReveals(root, [catId, lang, products.length, ready])

  if (!cat) return <NotFound />

  return (
    <div ref={root}>
      <header className="page-head">
        <nav className="crumbs caps" aria-label="Breadcrumb" data-reveal="fade">
          <Link to="/colecciones">{t.coll_title}</Link>
          <span>/</span>
          <span>{t[cat.group]}</span>
        </nav>
        <Lines key={cat.id} as="h1" className="t-mega" lines={[label(cat)]} />
        <div className="page-head__meta">
          <p className="caps muted" data-reveal="fade">
            {label(cat.sub)}
          </p>
          {products.length > 0 && (
            <span className="caps" data-reveal="fade">
              {t.pieces_n(products.length)}
            </span>
          )}
        </div>
      </header>

      <nav className="tabs" aria-label={t.categories}>
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/colecciones/${c.id}`} className="tab" aria-current={c.id === cat.id ? 'page' : undefined}>
            {label(c)}
          </Link>
        ))}
      </nav>

      {products.length > 0 ? (
        <div className="wrap page-body">
          <div className="grid-products grid-products--3">
            {products.map((p, i) => (
              <div key={p.id} data-reveal="up" data-delay={(i % 3) * 0.12}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        ready && (
          <div className="page-body">
            <div className="split">
              <div className="split__img ph" data-reveal="clip">
                <img src={cat.img} alt={label(cat)} />
              </div>
              <div className="split__panel">
                <p className="caps kicker muted">{t[cat.group]}</p>
                <h2 className="t-title">
                  <em>{label(cat)}</em>
                </h2>
                <p>{t.cat_empty}</p>
                <button type="button" className="btn" onClick={openQuote}>
                  {t.cta_catalogue}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

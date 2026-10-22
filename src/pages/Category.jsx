import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, findCategory, productsIn } from '../data/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import './Page.css'

export default function Category() {
  const { catId } = useParams()
  const { t, label } = useLang()
  const { open: openQuote } = useQuote()
  const cat = findCategory(catId)

  if (!cat) return <NotFound />

  const products = productsIn(cat.id)

  return (
    <>
      <header className="page-head">
        <Link to="/colecciones" className="back">
          ‹ {t.all_coll}
        </Link>
        <h1 className="t-page">{label(cat)}</h1>
        <p className="caps">{label(cat.sub)}</p>
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
          <div className="grid-products grid-products--5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : (
        <div className="page-body">
          <div className="split">
            <div className="split__img ph">
              <img src={cat.img} alt={label(cat)} />
            </div>
            <div className="split__panel">
              <span className="caps">{t[cat.group]}</span>
              <h2 className="t-title">{label(cat)}.</h2>
              <p>{t.cat_empty}</p>
              <button type="button" className="btn" onClick={openQuote}>
                {t.cta_catalogue}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

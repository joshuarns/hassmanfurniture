import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, findCategory } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import './Category.css'

export default function Category() {
  const { catId } = useParams()
  const { t, label } = useLang()
  const { open: openQuote } = useQuote()
  const { productsIn, ready } = useCatalog()
  const cat = findCategory(catId)

  if (!cat) return <NotFound />

  const products = productsIn(cat.id)

  return (
    <section className="container page category">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">{t.home}</Link>
        <span>›</span>
        <Link to="/colecciones">{t.coll_title}</Link>
        <span>›</span>
        <span>{t[cat.group]}</span>
      </nav>

      <div className="category__head">
        <h1>{label(cat)}</h1>
        {products.length > 0 && <span>{t.count(products.length)}</span>}
      </div>

      <div className="category__chips scroll-x">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/colecciones/${c.id}`}
            className="chip"
            aria-current={c.id === cat.id ? 'page' : undefined}
          >
            {label(c)}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="product-grid category__grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        ready && (
          <div className="category__empty">
            <div className="media category__empty-img">
              <img src={cat.img} alt={label(cat)} />
            </div>
            <div className="category__empty-card">
              <p>{t.cat_empty}</p>
              <button type="button" className="btn btn-primary" onClick={openQuote}>
                {t.cta_catalogue}
              </button>
            </div>
          </div>
        )
      )}
    </section>
  )
}

import { Link } from 'react-router-dom'
import { findCategory, framesOf } from '../data/catalog'
import { useLang } from '../context/lang'
import './ProductCard.css'

// Tarjeta de producto. `compact` oculta la línea de acabados (se usa en "relacionados").
export default function ProductCard({ product, compact = false }) {
  const { t, label } = useLang()
  const cat = findCategory(product.cat)
  const frames = framesOf(product)

  return (
    <Link to={`/producto/${product.id}`} className={`product-card ${compact ? 'product-card--compact' : ''}`}>
      <div className="media media--contain product-card__media">
        <img src={product.imgs[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        {!compact && (
          <>
            <span className="product-card__kicker">
              {label(cat)} · {t.finishes(frames.length)}
            </span>
            <div className="product-card__dots" aria-hidden="true">
              {frames.map((f) => (
                <span key={f.id} style={{ background: f.color }} />
              ))}
            </div>
          </>
        )}
      </div>
    </Link>
  )
}

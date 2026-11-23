import { Link } from 'react-router-dom'
import { findCategory, framesOf } from '../data/catalog'
import { useLang } from '../context/lang'
import './ProductCard.css'

// Tarjeta de producto editorial: imagen 3:4, nombre en serif y dato en versalitas.
export default function ProductCard({ product, index }) {
  const { t, label } = useLang()
  const cat = findCategory(product.cat)

  return (
    <Link to={`/producto/${product.id}`} className="pc" data-cursor={t.discover}>
      <div className="ph pc__img zoom">
        <img src={product.imgs[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="pc__info">
        <span className="pc__name">
          {index !== undefined && <span className="numeral pc__num">{String(index + 1).padStart(2, '0')}</span>}
          {product.name}
        </span>
        <span className="pc__sub caps muted">{cat ? label(cat) : t.finishes(framesOf(product).length)}</span>
      </div>
    </Link>
  )
}

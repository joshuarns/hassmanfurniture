import { Link } from 'react-router-dom'
import { FRAMES } from '../data/catalog'
import { useLang } from '../context/lang'
import './ProductCard.css'

// `variant`: 'grid' (pie en versalitas, como las grillas de Indigoff) o 'feature' (nombre grande + acabados).
export default function ProductCard({ product, variant = 'grid' }) {
  const { t } = useLang()

  return (
    <Link to={`/producto/${product.id}`} className={`pc pc--${variant} zoom`}>
      <div className="ph pc__img">
        <img src={product.imgs[0]} alt={product.name} loading="lazy" />
      </div>
      {variant === 'feature' ? (
        <div className="pc__info">
          <span className="pc__name">{product.name}</span>
          <span className="pc__sub">{t.finishes(FRAMES.length)}</span>
        </div>
      ) : (
        <span className="pc__caption">{product.name}</span>
      )}
    </Link>
  )
}

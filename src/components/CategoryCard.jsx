import { Link } from 'react-router-dom'
import { useLang } from '../context/lang'
import './CategoryCard.css'

// Tarjeta de categoría. `variant`: 'square' (tira del home) o 'wide' (índice de colecciones).
export default function CategoryCard({ category, variant = 'square' }) {
  const { label } = useLang()
  const name = label(category)

  return (
    <Link to={`/colecciones/${category.id}`} className={`cat-card cat-card--${variant}`}>
      <div className="media cat-card__media">
        <img src={category.img} alt={name} loading="lazy" />
      </div>
      <span className="cat-card__name">{variant === 'wide' ? `${name} ›` : name}</span>
    </Link>
  )
}

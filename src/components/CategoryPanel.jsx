import { Link } from 'react-router-dom'
import { useLang } from '../context/lang'
import './CategoryPanel.css'

// Foto a sangre con degradado y texto encima (patrón de Indigoff).
export default function CategoryPanel({ category, className = '' }) {
  const { t, label } = useLang()

  return (
    <Link to={`/colecciones/${category.id}`} className={`cp ph zoom ${className}`}>
      <img src={category.img} alt="" loading="lazy" />
      <span className="scrim" />
      <span className="cp__label">
        <span className="cp__name">{label(category)}</span>
        <span className="cp__sub">{label(category.sub)}</span>
        <span className="cp__cta">{t.explore}</span>
      </span>
    </Link>
  )
}

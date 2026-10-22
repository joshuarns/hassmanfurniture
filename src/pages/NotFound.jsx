import { Link } from 'react-router-dom'
import { useLang } from '../context/lang'
import './Page.css'

export default function NotFound() {
  const { t } = useLang()
  return (
    <header className="page-head" style={{ minHeight: '60vh', justifyContent: 'center' }}>
      <h1 className="t-page">404</h1>
      <p className="t-lead">{t.not_found}</p>
      <Link to="/" className="link-line">
        {t.home}
      </Link>
    </header>
  )
}

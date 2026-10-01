import { Link } from 'react-router-dom'
import { useLang } from '../context/lang'

export default function NotFound() {
  const { t } = useLang()
  return (
    <section className="container page" style={{ minHeight: '50vh' }}>
      <h1 className="page-title">404</h1>
      <p style={{ fontSize: 19, margin: '20px 0 28px' }}>{t.not_found}</p>
      <Link to="/" className="btn btn-primary">
        {t.home}
      </Link>
    </section>
  )
}

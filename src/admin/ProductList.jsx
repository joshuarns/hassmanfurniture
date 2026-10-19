import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/catalog'
import { api, formatDate, formatMoney, useAdmin } from './api'

const TABS = [
  ['all', 'Todos'],
  ['publish', 'Publicados'],
  ['draft', 'Borradores'],
]

const catName = (id) => CATEGORIES.find((c) => c.id === id)?.es || id

export default function ProductList() {
  const { expire } = useAdmin()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(state?.notice || '')
  const [tab, setTab] = useState('all')
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    api('/products')
      .then(setProducts)
      .catch((err) => (err.status === 401 ? expire() : setError(err.message)))
  }, [expire])

  const fail = (err) => (err.status === 401 ? expire() : setError(err.message))

  const counts = useMemo(() => {
    const list = products || []
    return { all: list.length, publish: list.filter((p) => p.status === 'publish').length, draft: list.filter((p) => p.status === 'draft').length }
  }, [products])

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (products || []).filter(
      (p) =>
        (tab === 'all' || p.status === tab) &&
        (!cat || p.cat === cat) &&
        (!needle || p.name.toLowerCase().includes(needle) || p.sku?.toLowerCase().includes(needle) || p.id.includes(needle)),
    )
  }, [products, tab, cat, q])

  const replace = (next) => setProducts((list) => list.map((p) => (p.id === next.id ? next : p)))

  const toggleFeatured = async (p) => {
    replace({ ...p, featured: !p.featured })
    try {
      replace(await api(`/products/${p.id}`, { method: 'PUT', body: { ...p, featured: !p.featured } }))
    } catch (err) {
      replace(p)
      fail(err)
    }
  }

  const remove = async (p) => {
    if (!confirm(`¿Borrar “${p.name}” definitivamente?`)) return
    try {
      await api(`/products/${p.id}`, { method: 'DELETE' })
      setProducts((list) => list.filter((x) => x.id !== p.id))
      setNotice(`“${p.name}” se borró.`)
    } catch (err) {
      fail(err)
    }
  }

  return (
    <>
      <header className="adm-head">
        <h1>Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary adm-btn">
          Añadir nuevo
        </Link>
      </header>

      {notice && (
        <p className="adm-notice" role="status">
          {notice}
          <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice('')}>
            ×
          </button>
        </p>
      )}
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}

      <div className="adm-toolbar">
        <div className="adm-tabs" role="tablist">
          {TABS.map(([id, text]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
              {text} <span>({counts[id]})</span>
            </button>
          ))}
        </div>
        <div className="adm-filters">
          <select className="input adm-input-sm" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.es}
              </option>
            ))}
          </select>
          <input className="input adm-input-sm" type="search" placeholder="Buscar productos" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar productos" />
        </div>
      </div>

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="adm-col-img">
                <span className="sr-only">Imagen</span>
              </th>
              <th>Nombre</th>
              <th>SKU</th>
              <th>Inventario</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th className="adm-col-star" title="Destacado">
                ★
              </th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {!products && !error && (
              <tr>
                <td colSpan={8} className="adm-table__empty">
                  Cargando…
                </td>
              </tr>
            )}
            {products && visible.length === 0 && (
              <tr>
                <td colSpan={8} className="adm-table__empty">
                  No hay productos que coincidan.
                </td>
              </tr>
            )}
            {visible.map((p) => (
              <tr key={p.id} onClick={(e) => !e.target.closest('a, button') && navigate(`/admin/productos/${p.id}`)}>
                <td className="adm-col-img">
                  <div className="adm-thumb">{p.imgs[0] && <img src={p.imgs[0]} alt="" loading="lazy" />}</div>
                </td>
                <td className="adm-col-name">
                  <Link to={`/admin/productos/${p.id}`}>{p.name}</Link>
                  {p.status === 'draft' && <span className="adm-badge">Borrador</span>}
                  <div className="adm-row-actions">
                    <Link to={`/admin/productos/${p.id}`}>Editar</Link>
                    {p.status === 'publish' && (
                      <a href={`/producto/${p.id}`} target="_blank" rel="noreferrer">
                        Ver
                      </a>
                    )}
                    <button type="button" className="adm-danger" onClick={() => remove(p)}>
                      Borrar
                    </button>
                  </div>
                </td>
                <td data-label="SKU">{p.sku || '—'}</td>
                <td data-label="Inventario">
                  <Stock p={p} />
                </td>
                <td data-label="Precio">
                  <Price p={p} />
                </td>
                <td data-label="Categoría">{catName(p.cat)}</td>
                <td className="adm-col-star">
                  <button
                    type="button"
                    className="adm-star"
                    aria-pressed={p.featured}
                    aria-label={p.featured ? `Quitar ${p.name} de destacados` : `Destacar ${p.name}`}
                    onClick={() => toggleFeatured(p)}
                  >
                    {p.featured ? '★' : '☆'}
                  </button>
                </td>
                <td data-label="Fecha" className="adm-col-date">
                  {p.status === 'publish' ? 'Publicado' : 'Modificado'}{' '}
                  <br />
                  {formatDate(p.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Stock({ p }) {
  if (!p.manageStock) return <span className="adm-stock adm-stock--in">Hay existencias</span>
  if (p.stock > 0) return <span className="adm-stock adm-stock--in">Hay existencias ({p.stock})</span>
  return <span className="adm-stock adm-stock--out">Agotado</span>
}

function Price({ p }) {
  if (p.price === null) return '—'
  if (p.salePrice === null) return formatMoney(p.price)
  return (
    <>
      <del>{formatMoney(p.price)}</del> <ins>{formatMoney(p.salePrice)}</ins>
    </>
  )
}

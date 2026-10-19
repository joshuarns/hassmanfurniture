import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { AdminContext, api } from './api'
import Login from './Login'
import ProductList from './ProductList'
import ProductEdit from './ProductEdit'
import './admin.css'

// Panel de administración (/admin). Pide sesión y monta las pantallas de productos.
export default function Admin() {
  const [session, setSession] = useState(null) // null = verificando

  const check = useCallback(() => {
    api('/session')
      .then(setSession)
      .catch(() => setSession({ admin: false, error: true }))
  }, [])

  useEffect(() => {
    check()
    const prev = document.title
    document.title = 'Panel · Hassman Furniture'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    return () => {
      document.title = prev
      robots.remove()
    }
  }, [check])

  const ctx = useMemo(
    () => ({
      uploads: Boolean(session?.uploads),
      expire: () => setSession((s) => ({ ...s, admin: false, expired: true })),
      logout: () => api('/logout', { method: 'POST' }).finally(() => setSession((s) => ({ ...s, admin: false }))),
    }),
    [session?.uploads],
  )

  if (!session) return <div className="adm-boot" aria-busy="true" />
  if (!session.admin) return <Login offline={session.error} expired={session.expired} onLogin={check} />

  return (
    <AdminContext.Provider value={ctx}>
      <div className="adm">
        <aside className="adm-side">
          <Link to="/admin" className="adm-side__brand">
            Hassman<span>Panel</span>
          </Link>
          <nav className="adm-side__nav">
            <NavLink to="/admin/productos" end>
              Todos los productos
            </NavLink>
            <NavLink to="/admin/productos/nuevo">Añadir nuevo</NavLink>
          </nav>
          <div className="adm-side__foot">
            <a href="/" target="_blank" rel="noreferrer">
              Ver sitio ↗
            </a>
            <button type="button" onClick={ctx.logout}>
              Cerrar sesión
            </button>
          </div>
        </aside>
        <main className="adm-main">
          <Routes>
            <Route index element={<Navigate to="productos" replace />} />
            <Route path="productos" element={<ProductList />} />
            <Route path="productos/nuevo" element={<ProductEdit />} />
            <Route path="productos/:id" element={<ProductEdit />} />
            <Route path="*" element={<Navigate to="productos" replace />} />
          </Routes>
        </main>
      </div>
    </AdminContext.Provider>
  )
}

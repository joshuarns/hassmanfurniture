import { createContext, useContext } from 'react'

// Llamadas a /api/admin/*. Lanza un Error con `status` y `fields` (errores por campo).
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api/admin' + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`)
    err.status = res.status
    err.fields = data.fields || {}
    throw err
  }
  return data
}

export const AdminContext = createContext(null)

// { uploads, logout, expire } — expire() regresa al login cuando la sesión caducó.
export const useAdmin = () => useContext(AdminContext)

export const CURRENCY = 'MXN'
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: CURRENCY })
export const formatMoney = (n) => (n === null || n === undefined ? '' : money.format(n))

const date = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
export const formatDate = (iso) => (iso ? date.format(new Date(iso)) : '')

export const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

import { CATEGORIES, FRAMES, UPHOLSTERIES } from '../../src/data/catalog.js'

const STATUSES = ['draft', 'publish']
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const num = (v) => (v === null || v === undefined ? null : Number(v))

// Fila de Postgres → objeto completo para el panel.
export const toAdmin = (r) => ({
  id: r.id,
  name: r.name,
  cat: r.cat,
  status: r.status,
  featured: r.featured,
  sku: r.sku,
  price: num(r.price),
  salePrice: num(r.sale_price),
  manageStock: r.manage_stock,
  stock: r.stock,
  descEs: r.desc_es,
  descEn: r.desc_en,
  frames: r.frames,
  uphs: r.uphs,
  imgs: r.imgs,
  sort: r.sort,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
})

// Fila de Postgres → objeto público para el sitio (sin datos internos de inventario).
export const toPublic = (r) => ({
  id: r.id,
  name: r.name,
  cat: r.cat,
  featured: r.featured,
  sku: r.sku,
  price: num(r.price),
  salePrice: num(r.sale_price),
  inStock: !r.manage_stock || r.stock > 0,
  desc: { es: r.desc_es, en: r.desc_en },
  frames: r.frames,
  uphs: r.uphs,
  imgs: r.imgs,
})

const optText = (v) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s || null
}

const optMoney = (v, label, errors) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  if (!Number.isFinite(n) || n < 0) errors[label] = 'Debe ser un número mayor o igual a 0'
  return Math.round(n * 100) / 100
}

const subset = (list, allowed) => [...new Set(Array.isArray(list) ? list : [])].filter((x) => allowed.includes(x))

// Valida y normaliza el cuerpo de un alta/edición. Devuelve { data, errors }.
export function validate(body, { isNew }) {
  const errors = {}
  const b = body && typeof body === 'object' ? body : {}

  const id = typeof b.id === 'string' ? b.id.trim().toLowerCase() : ''
  if (isNew && !SLUG.test(id)) errors.id = 'Usa sólo minúsculas, números y guiones'

  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (!name) errors.name = 'El nombre es obligatorio'

  if (!CATEGORIES.some((c) => c.id === b.cat)) errors.cat = 'Elige una categoría'

  const status = STATUSES.includes(b.status) ? b.status : 'draft'

  const price = optMoney(b.price, 'price', errors)
  const salePrice = optMoney(b.salePrice, 'salePrice', errors)
  if (salePrice !== null && price !== null && salePrice >= price) errors.salePrice = 'Debe ser menor al precio normal'

  const manageStock = Boolean(b.manageStock)
  let stock = null
  if (manageStock) {
    stock = Number(b.stock ?? 0)
    if (!Number.isInteger(stock) || stock < 0) errors.stock = 'Debe ser un entero mayor o igual a 0'
  }

  const imgs = (Array.isArray(b.imgs) ? b.imgs : []).filter((u) => typeof u === 'string' && /^https?:\/\//.test(u))
  if (status === 'publish' && imgs.length === 0) errors.imgs = 'Agrega al menos una imagen para publicar'

  const data = {
    id,
    name,
    cat: b.cat,
    status,
    featured: Boolean(b.featured),
    sku: optText(b.sku),
    price,
    salePrice,
    manageStock,
    stock,
    descEs: typeof b.descEs === 'string' ? b.descEs.trim() : '',
    descEn: typeof b.descEn === 'string' ? b.descEn.trim() : '',
    frames: subset(b.frames, FRAMES.map((f) => f.id)),
    uphs: subset(b.uphs, UPHOLSTERIES.map((u) => u.id)),
    imgs: [...new Set(imgs)],
  }
  return { data, errors: Object.keys(errors).length ? errors : null }
}

// Orden de columnas compartido por INSERT y UPDATE (`sort` lo asigna el alta).
export const COLUMNS = ['name', 'cat', 'status', 'featured', 'sku', 'price', 'sale_price', 'manage_stock', 'stock', 'desc_es', 'desc_en', 'frames', 'uphs', 'imgs']

export const values = (d) => [d.name, d.cat, d.status, d.featured, d.sku, d.price, d.salePrice, d.manageStock, d.stock, d.descEs, d.descEn, d.frames, d.uphs, d.imgs]

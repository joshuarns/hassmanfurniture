import { requireAdmin } from '../../_lib/auth.js'
import { db } from '../../_lib/db.js'
import { fail, json, readJson, safe } from '../../_lib/http.js'
import { COLUMNS, toAdmin, validate, values } from '../../_lib/products.js'

const NO_STORE = { 'Cache-Control': 'no-store' }
const idOf = (request) => decodeURIComponent(new URL(request.url).pathname.split('/').pop())

// GET /api/admin/products/:id
export const GET = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  const { rows } = await db().query('SELECT * FROM products WHERE id = $1', [idOf(request)])
  return rows[0] ? json(toAdmin(rows[0]), 200, NO_STORE) : fail(404, 'No existe el producto')
})

// PUT /api/admin/products/:id — edición completa. El slug no cambia (las cotizaciones guardadas lo usan).
export const PUT = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  const { data, errors } = validate(await readJson(request), { isNew: false })
  if (errors) return fail(422, 'Revisa los campos marcados', { fields: errors })

  const sets = COLUMNS.map((c, i) => `${c} = $${i + 2}`).join(', ')
  const { rows } = await db().query(`UPDATE products SET ${sets}, updated_at = now() WHERE id = $1 RETURNING *`, [idOf(request), ...values(data)])
  return rows[0] ? json(toAdmin(rows[0]), 200, NO_STORE) : fail(404, 'No existe el producto')
})

// DELETE /api/admin/products/:id
export const DELETE = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  const { rowCount } = await db().query('DELETE FROM products WHERE id = $1', [idOf(request)])
  return rowCount ? json({ ok: true }) : fail(404, 'No existe el producto')
})

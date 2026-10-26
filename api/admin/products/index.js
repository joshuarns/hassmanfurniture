import { requireAdmin } from '../../_lib/auth.js'
import { db } from '../../_lib/db.js'
import { fail, json, readJson, safe } from '../../_lib/http.js'
import { COLUMNS, toAdmin, validate, values } from '../../_lib/products.js'

const NO_STORE = { 'Cache-Control': 'no-store' }

// GET /api/admin/products — todos, incluidos borradores.
export const GET = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  const { rows } = await db().query('SELECT * FROM products ORDER BY sort, created_at')
  return json(rows.map(toAdmin), 200, NO_STORE)
})

// POST /api/admin/products — alta.
export const POST = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  const { data, errors } = validate(await readJson(request), { isNew: true })
  if (errors) return fail(422, 'Revisa los campos marcados', { fields: errors })

  // Los nuevos van al final del orden.
  const cols = ['id', ...COLUMNS]
  const params = cols.map((_, i) => `$${i + 1}`).join(', ')
  const { rows } = await db().query(
    `INSERT INTO products (${cols.join(', ')}, sort) VALUES (${params}, (SELECT coalesce(max(sort), -1) + 1 FROM products)) RETURNING *`,
    [data.id, ...values(data)],
  )
  return json(toAdmin(rows[0]), 201, NO_STORE)
})

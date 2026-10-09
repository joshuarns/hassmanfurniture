import { db } from './_lib/db.js'
import { json, safe } from './_lib/http.js'
import { toPublic } from './_lib/products.js'

// GET /api/products — catálogo público (sólo publicados).
export const GET = safe(async () => {
  const { rows } = await db().query("SELECT * FROM products WHERE status = 'publish' ORDER BY sort, created_at")
  return json(rows.map(toPublic), 200, { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' })
})

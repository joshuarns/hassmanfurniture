import { isAdmin } from '../_lib/auth.js'
import { json, safe } from '../_lib/http.js'

// GET /api/admin/session → { admin: boolean, uploads: boolean }
export const GET = safe(async (request) =>
  json({ admin: isAdmin(request), uploads: Boolean(process.env.BLOB_READ_WRITE_TOKEN) }, 200, { 'Cache-Control': 'no-store' }),
)

import { clearCookie } from '../_lib/auth.js'
import { json } from '../_lib/http.js'

// POST /api/admin/logout
export const POST = (request) => json({ ok: true }, 200, { 'Set-Cookie': clearCookie(request) })

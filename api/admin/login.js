import { checkPassword, sessionCookie } from '../_lib/auth.js'
import { fail, json, readJson, safe } from '../_lib/http.js'

// POST /api/admin/login { password }
export const POST = safe(async (request) => {
  const body = await readJson(request)
  if (!checkPassword(body?.password)) {
    await new Promise((r) => setTimeout(r, 600)) // frena intentos por fuerza bruta
    return fail(401, 'Contraseña incorrecta')
  }
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request) })
})

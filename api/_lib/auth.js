import { createHmac, timingSafeEqual } from 'node:crypto'
import { ConfigError, fail } from './http.js'

// Sesión de administrador: cookie HttpOnly firmada con HMAC. Sin tabla de usuarios;
// la contraseña vive en ADMIN_PASSWORD y la firma en SESSION_SECRET.
const COOKIE = 'hf_admin'
const MAX_AGE = 60 * 60 * 24 * 7

const secret = () => {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new ConfigError('falta SESSION_SECRET o tiene menos de 32 caracteres')
  return s
}

const sign = (value) => createHmac('sha256', secret()).update(value).digest('base64url')

const sameText = (a, b) => {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new ConfigError('falta ADMIN_PASSWORD')
  return typeof password === 'string' && sameText(password, expected)
}

const cookieAttrs = (request, maxAge) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

export function sessionCookie(request) {
  const payload = String(Date.now() + MAX_AGE * 1000)
  return `${COOKIE}=${payload}.${sign(payload)}; ${cookieAttrs(request, MAX_AGE)}`
}

export const clearCookie = (request) => `${COOKIE}=; ${cookieAttrs(request, 0)}`

export function isAdmin(request) {
  const raw = request.headers.get('cookie') || ''
  const token = raw
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(COOKIE + '='))
    ?.slice(COOKIE.length + 1)
  if (!token) return false
  const [exp, sig] = token.split('.')
  return Boolean(exp && sig) && sameText(sig, sign(exp)) && Number(exp) > Date.now()
}

// Devuelve una respuesta 401 si no hay sesión, o null si puede continuar.
export const requireAdmin = (request) => (isAdmin(request) ? null : fail(401, 'No autorizado'))

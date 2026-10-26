import { requireAdmin } from '../_lib/auth.js'
import { ExtractError, MAX_BYTES, MEDIA_TYPES, extractProduct } from '../_lib/extract.js'
import { fail, json, readJson, safe } from '../_lib/http.js'

// Sólo se leen archivos subidos a nuestro Vercel Blob (evita que el servidor descargue URLs arbitrarias).
const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/

const baseType = (t) => String(t || '').split(';')[0].trim().toLowerCase()

// POST /api/admin/import — { url } de Vercel Blob, o { data, mediaType } en base64 (sin Blob, archivos chicos).
// Responde { draft, notes, sheet } para abrir el editor con el producto prellenado.
export const POST = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await readJson(request)
  if (!body) return fail(400, 'Cuerpo inválido')

  let data
  let mediaType
  let sheet = null

  if (body.url) {
    let url
    try {
      url = new URL(body.url)
    } catch {
      return fail(400, 'URL inválida')
    }
    if (url.protocol !== 'https:' || !BLOB_HOST.test(url.hostname)) return fail(400, 'El archivo debe estar en el almacenamiento del sitio')
    const res = await fetch(url)
    if (!res.ok) return fail(502, 'No se pudo descargar el archivo subido')
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > MAX_BYTES) return fail(413, 'El archivo pesa más de 20 MB')
    data = buf.toString('base64')
    mediaType = baseType(res.headers.get('content-type'))
    sheet = url.href
  } else {
    data = typeof body.data === 'string' ? body.data : ''
    mediaType = baseType(body.mediaType)
    if (!data) return fail(400, 'Falta el archivo')
    if (data.length * 0.75 > MAX_BYTES) return fail(413, 'El archivo pesa más de 20 MB')
  }

  if (!MEDIA_TYPES.includes(mediaType)) return fail(415, 'Usa un PDF o una imagen JPG, PNG o WebP')

  try {
    const { draft, notes } = await extractProduct({ data, mediaType })
    return json({ draft: { ...draft, sheet }, notes })
  } catch (err) {
    if (err instanceof ExtractError) return fail(err.status, err.message)
    throw err
  }
})

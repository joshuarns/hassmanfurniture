import { handleUpload } from '@vercel/blob/client'
import { requireAdmin } from '../_lib/auth.js'
import { fail, json, readJson, safe } from '../_lib/http.js'

// POST /api/admin/upload — emite tokens para que el navegador suba imágenes directo a Vercel Blob.
// No se usa onUploadCompleted, así que todas las llamadas vienen del panel con sesión.
export const POST = safe(async (request) => {
  const denied = requireAdmin(request)
  if (denied) return denied
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fail(503, 'Falta BLOB_READ_WRITE_TOKEN')
  const body = await readJson(request)
  if (!body) return fail(400, 'Cuerpo inválido')
  const result = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
      maximumSizeInBytes: 10 * 1024 * 1024,
      addRandomSuffix: true,
    }),
  })
  return json(result)
})

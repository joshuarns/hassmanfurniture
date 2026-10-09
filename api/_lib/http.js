export const json = (data, status = 200, headers = {}) => Response.json(data, { status, headers })

export const fail = (status, error, extra = {}) => json({ error, ...extra }, status)

// Envuelve un handler para que los errores inesperados regresen 500 en JSON.
export const safe = (fn) => async (request) => {
  try {
    return await fn(request)
  } catch (err) {
    console.error(err)
    if (err.code === '23505') return fail(409, 'Ya existe un producto con ese slug o SKU')
    return fail(500, 'Error interno')
  }
}

export async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

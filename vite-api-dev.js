import { existsSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { loadEnv } from 'vite'

// Sólo en `vite dev`: sirve /api/* con los mismos handlers que Vercel (export GET/POST/...),
// así no hace falta `vercel dev`. Las variables salen de .env.local.
export default function apiDev() {
  let root
  return {
    name: 'hassman-api-dev',
    apply: 'serve',
    configResolved(config) {
      root = config.root
      Object.assign(process.env, loadEnv(config.mode, root, ''))
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`)
        if (!url.pathname.startsWith('/api/')) return next()

        const file = resolve(join(root, url.pathname))
        if (!file) return send(res, Response.json({ error: 'No encontrado' }, { status: 404 }))

        try {
          const mod = await server.ssrLoadModule('/' + relative(root, file))
          const handler = mod[req.method]
          if (!handler) return send(res, Response.json({ error: 'Método no permitido' }, { status: 405 }))
          const chunks = []
          for await (const c of req) chunks.push(c)
          const body = chunks.length && !['GET', 'HEAD'].includes(req.method) ? Buffer.concat(chunks) : undefined
          const request = new Request(url, { method: req.method, headers: req.headers, body })
          send(res, await handler(request))
        } catch (err) {
          server.ssrFixStacktrace(err)
          console.error(err)
          send(res, Response.json({ error: err.message }, { status: 500 }))
        }
      })
    },
  }
}

// /api/a/b → api/a/b.js | api/a/b/index.js | api/a/[param].js
function resolve(path) {
  for (const f of [path + '.js', join(path, 'index.js')]) if (existsSync(f)) return f
  const dir = join(path, '..')
  if (!existsSync(dir)) return null
  const dyn = readdirSync(dir).find((f) => /^\[[^\]]+\]\.js$/.test(f))
  return dyn ? join(dir, dyn) : null
}

async function send(res, response) {
  res.statusCode = response.status
  response.headers.forEach((v, k) => k !== 'set-cookie' && res.setHeader(k, v))
  const cookies = response.headers.getSetCookie()
  if (cookies.length) res.setHeader('set-cookie', cookies)
  res.end(Buffer.from(await response.arrayBuffer()))
}

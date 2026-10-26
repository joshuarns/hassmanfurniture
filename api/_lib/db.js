import pg from 'pg'
import { ConfigError } from './http.js'

// Un pool por instancia de la función. En Vercel usar la cadena *pooled* de Neon (DATABASE_URL).
let pool

export function db() {
  if (!pool) {
    // DATABASE_URL (prefijo elegido al conectar Neon) o POSTGRES_URL (nombre que también crea la integración).
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!url) throw new ConfigError('falta POSTGRES_URL (conectar Neon en Storage)')
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url) || !url.includes('@')
    pool = new pg.Pool({ connectionString: url, max: 3, ssl: local ? false : { rejectUnauthorized: false } })
  }
  return pool
}

// Crea la tabla y, si está vacía, carga los productos actuales de src/data/catalog.js.
// Uso: node --env-file=.env.local scripts/db-setup.js
import { readFile } from 'node:fs/promises'
import { db } from '../api/_lib/db.js'
import { PRODUCTS } from '../src/data/catalog.js'

const pool = db()
await pool.query(await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8'))

const { rows } = await pool.query('SELECT count(*)::int AS n FROM products')
if (rows[0].n === 0) {
  for (const [i, p] of PRODUCTS.entries()) {
    await pool.query("INSERT INTO products (id, name, cat, status, imgs, sort) VALUES ($1, $2, $3, 'publish', $4, $5)", [p.id, p.name, p.cat, p.imgs, i])
  }
  console.log(`Tabla creada y ${PRODUCTS.length} productos cargados.`)
} else {
  console.log(`Tabla lista (${rows[0].n} productos, no se cargó nada).`)
}
await pool.end()

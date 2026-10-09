# Hassman Furniture

Sitio de catálogo con solicitud de cotización, bilingüe (ES/EN). React 19 + Vite + React Router.
Basado en el diseño "Hassman Home v2" (design system Modernist: Archivo, rojo `#ec3013` sobre gris claro).

```bash
npm install
cp .env.example .env.local   # y llenar valores
npm run db:setup             # crea la tabla y carga los productos iniciales
npm run dev                  # sitio + /api en http://localhost:5173
npm run build                # genera /dist para publicar
```

Sin `.env.local` el sitio funciona igual con el catálogo estático, pero `/admin` no.

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Home (hero, tiles, categorías, sillería, estudio `#estudio`, sectores `#proyectos`) |
| `/colecciones` | Índice de colecciones con filtro Asientos / Mesas |
| `/colecciones/:catId` | Categoría (p. ej. `/colecciones/oficina`) |
| `/producto/:prodId` | Ficha de producto con configurador (p. ej. `/producto/tad`) |
| `/admin` | Panel para crear y editar productos (pide contraseña) |

## Editar contenido

| Qué | Dónde |
| --- | --- |
| Productos | Panel `/admin` (se guardan en Postgres) |
| Categorías, acabados, correo y redes | `src/data/catalog.js` |
| Textos en español e inglés | `src/i18n/translations.js` |
| Colores, tipografía, radios | variables en `:root` de `src/index.css` |

Las imágenes se cargan desde `hassmanfurniture.com/wp-content/uploads/`.

## Panel de productos (`/admin`)

Tipo WooCommerce: listado con filtros (estado, categoría, búsqueda) y editor con nombre, slug,
descripción ES/EN, precio y precio rebajado, SKU, inventario, acabados permitidos, categoría,
imágenes (subida a Vercel Blob o por URL), borrador/publicado y destacado (sale en la portada).

- **API**: funciones de Vercel en `api/` (`/api/products` público; `/api/admin/*` con sesión).
  En desarrollo las sirve `vite-api-dev.js`, no hace falta `vercel dev`.
- **Base de datos**: Postgres (Neon en producción). Esquema en `db/schema.sql`.
- **Sesión**: una sola contraseña (`ADMIN_PASSWORD`), cookie HttpOnly firmada con `SESSION_SECRET`.
- Si la API falla, el sitio usa los productos de `src/data/catalog.js` como respaldo.
- Los precios se guardan pero el sitio no los muestra (trabaja por cotización).

### Publicar en Vercel

1. En el proyecto de Vercel → **Storage**: conectar **Neon** (agrega `DATABASE_URL`) y **Blob** (agrega `BLOB_READ_WRITE_TOKEN`).
2. **Settings → Environment Variables**: agregar `ADMIN_PASSWORD` y `SESSION_SECRET` (`openssl rand -base64 48`).
3. Crear la tabla una vez: `vercel env pull .env.local` y `npm run db:setup`.
4. Redeploy.

## Cotización

La lista de piezas y el idioma se guardan en `localStorage`. El formulario **aún no envía** a ningún lado:
conectar en `onSubmit` de `src/components/QuoteDrawer.jsx` (hay un `TODO`).

## Estructura

```
api/            funciones serverless (productos, login, subida de imágenes)
db/             esquema SQL
scripts/        db-setup.js
src/
  admin/        panel /admin (listado, editor, imágenes)
  components/   Header (mega menú), Footer, QuoteDrawer, ProductCard, CategoryCard
  pages/        Home, Collections, Category, Product, NotFound
  context/      idioma, catálogo (CatalogProvider) y cotización
  data/         catálogo editable
  i18n/         traducciones
```

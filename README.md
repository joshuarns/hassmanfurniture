# Hassman Furniture

Sitio de catálogo con solicitud de cotización, bilingüe (ES/EN). React 19 + Vite + React Router.
Diseño en la línea de Indigoff: blanco, tinta `#111` y crema `#f4f1eb`, cero radios, Archivo ligero para títulos,
IBM Plex Sans para texto y Jost en versalitas para la interfaz.

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera /dist para publicar
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Home (hero, tiles, categorías, sillería, estudio `#estudio`, sectores `#proyectos`) |
| `/colecciones` | Índice de colecciones con filtro Asientos / Mesas |
| `/colecciones/:catId` | Categoría (p. ej. `/colecciones/oficina`) |
| `/producto/:prodId` | Ficha de producto con configurador (p. ej. `/producto/tad`) |

## Editar contenido

| Qué | Dónde |
| --- | --- |
| Categorías, productos, acabados, correo y redes | `src/data/catalog.js` |
| Textos en español e inglés | `src/i18n/translations.js` |
| Colores, tipografía, espaciados | variables en `:root` de `src/index.css` |

Las imágenes se cargan desde `hassmanfurniture.com/wp-content/uploads/`.

## Cotización

La lista de piezas y el idioma se guardan en `localStorage`. El formulario **aún no envía** a ningún lado:
conectar en `onSubmit` de `src/components/QuoteDrawer.jsx` (hay un `TODO`).

## Estructura

```
src/
  components/   Header, MenuDrawer, Drawer, Footer, QuoteDrawer, ProductCard, CategoryPanel
  pages/        Home, Collections, Category, Product, NotFound
  context/      idioma (LangProvider) y cotización (QuoteProvider)
  data/         catálogo editable
  i18n/         traducciones
```

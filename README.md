# Hassman Furniture

Sitio de catálogo con solicitud de cotización, bilingüe (ES/EN). React 19 + Vite + React Router.
Basado en el diseño "Hassman Home v2" (design system Modernist: Archivo, rojo `#ec3013` sobre gris claro).

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
| Colores, tipografía, radios | variables en `:root` de `src/index.css` |

Las imágenes se cargan desde `hassmanfurniture.com/wp-content/uploads/`.

## Cotización

La lista de piezas y el idioma se guardan en `localStorage`. El formulario **aún no envía** a ningún lado:
conectar en `onSubmit` de `src/components/QuoteDrawer.jsx` (hay un `TODO`).

## Estructura

```
src/
  components/   Header (mega menú), Footer, QuoteDrawer, ProductCard, CategoryCard
  pages/        Home, Collections, Category, Product, NotFound
  context/      idioma (LangProvider) y cotización (QuoteProvider)
  data/         catálogo editable
  i18n/         traducciones
```

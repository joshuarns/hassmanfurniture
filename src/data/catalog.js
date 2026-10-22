// Catálogo: categorías, productos y acabados. Editar aquí.
// Las imágenes vienen del WordPress actual de Hassman.
export const UPLOADS = 'https://hassmanfurniture.com/wp-content/uploads/'

export const GROUPS = ['seating', 'tables']

export const CATEGORIES = [
  { id: 'oficina', group: 'seating', en: 'Office Chairs', es: 'Sillas de oficina', sub: { es: 'Operativa · Ejecutiva · Juntas', en: 'Task · Executive · Meeting' }, img: '2023/09/Captura-de-Pantalla-2023-07-05-a-las-13.36-8-1024x683.jpg' },
  { id: 'lounge', group: 'seating', en: 'Lounge Chairs', es: 'Sillones lounge', sub: { es: 'Lobby · Suite · Sala', en: 'Lobby · Suite · Living' }, img: '2023/09/20230630092345_42099-2-1024x683.jpg' },
  { id: 'sillas', group: 'seating', en: 'Chairs', es: 'Sillas', sub: { es: 'Comedor · Visita · Cafetería', en: 'Dining · Guest · Café' }, img: '2023/09/Captura-de-Pantalla-2022-11-10-a-las-11.49-1-1024x683.jpg' },
  { id: 'bancos', group: 'seating', en: 'Stools', es: 'Bancos altos', sub: { es: 'Barra · Isla · Cafetería', en: 'Bar · Island · Café' }, img: '2025/02/Stools_HassmanFurniture.png' },
  { id: 'sofas', group: 'seating', en: 'Sofas', es: 'Sofás', sub: { es: 'Lobby · Recepción · Residencial', en: 'Lobby · Reception · Residential' }, img: '2023/09/20220325062906_15836-1024x683.jpg' },
  { id: 'escritorios', group: 'tables', en: 'Desks', es: 'Escritorios', sub: { es: 'Operativo · Ejecutivo · Bench', en: 'Task · Executive · Bench' }, img: '2025/02/Captura-de-Pantalla-2025-02-25-a-las-16.12.48.png' },
  { id: 'juntas', group: 'tables', en: 'Meeting Room', es: 'Sala de juntas', sub: { es: 'Juntas · Consejo · Colaboración', en: 'Meeting · Board · Collaboration' }, img: '2023/09/Captura-de-Pantalla-2022-11-14-a-las-17.56-1024x684.jpg' },
  { id: 'mesas', group: 'tables', en: 'Side & Coffee Tables', es: 'Mesas auxiliares y de centro', sub: { es: 'Centro · Auxiliar · Lounge', en: 'Coffee · Side · Lounge' }, img: '2023/09/20220412113110_35675-1024x684.jpg' },
].map((c) => ({ ...c, img: UPLOADS + c.img }))

// [id, nombre, imagen principal, imagen secundaria]
export const PRODUCTS = [
  ['tad', 'Tad', '2023/12/TAD-1.jpg', '2023/12/TAD.jpg'],
  ['naab', 'Naab', '2023/12/NAAB-1.jpg', '2023/12/NAAB.jpg'],
  ['mik', 'Mik', '2023/12/MIK-1.jpg', '2023/12/MIK.jpg'],
  ['hal', 'Hal', '2023/12/HAL-1.jpg', '2023/12/HAL.jpg'],
  ['enzo', 'Enzo', '2023/12/ENZO-2.jpg', '2023/12/ENZO.jpg'],
  ['deo', 'Deo', '2023/12/DEO-1.jpg', '2023/12/DEO.jpg'],
  ['caly', 'Caly', '2024/11/Caly_2.0.png', '2026/02/caly.jpg'],
  ['anca', 'Anca', '2023/12/ANCA-1.jpg', '2023/12/ANCA.jpg'],
].map(([id, name, a, b]) => ({ id, name, cat: 'oficina', imgs: [UPLOADS + a, UPLOADS + b] }))

export const FRAMES = [
  { id: 'black', en: 'Black', es: 'Negro', color: '#1c1b1a' },
  { id: 'graphite', en: 'Graphite', es: 'Grafito', color: '#5b5854' },
  { id: 'alu', en: 'Polished aluminium', es: 'Aluminio pulido', color: '#c3c1bd' },
  { id: 'white', en: 'White', es: 'Blanco', color: '#f7f6f3' },
]

export const UPHOLSTERIES = [
  { id: 'leather', en: 'Leather', es: 'Piel' },
  { id: 'fabric', en: 'Fabric', es: 'Tela' },
  { id: 'mesh', en: 'Mesh', es: 'Malla' },
]

export const HOME_IMAGES = {
  hero: UPLOADS + '2023/09/20220325062906_15836.jpg',
  heroFallback: UPLOADS + '2023/09/20220325062906_15836-1024x683.jpg',
  heroTile: UPLOADS + '2023/09/Captura-de-Pantalla-2023-07-05-a-las-13.36-8.jpg',
}

export const FEATURED_PRODUCT = 'tad'

export const CONTACT = {
  email: 'info@hassmanfurniture.com',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/hassman.furniture' },
    { label: 'Facebook', href: 'https://www.facebook.com/Hassman.furniture' },
  ],
}

export const findCategory = (id) => CATEGORIES.find((c) => c.id === id)
export const findProduct = (id) => PRODUCTS.find((p) => p.id === id)
export const productsIn = (catId) => PRODUCTS.filter((p) => p.cat === catId)
export const pad = (n) => String(n).padStart(2, '0')

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import { CATEGORIES, FRAMES, UPHOLSTERIES } from '../../src/data/catalog.js'
import { ConfigError } from './http.js'
import { slugify } from './products.js'

// Lee una ficha técnica (PDF o imagen) con Claude y la convierte en un borrador de producto.

export const MEDIA_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_BYTES = 20 * 1024 * 1024

const MODEL = 'claude-opus-5-5'

const CAT_IDS = CATEGORIES.map((c) => c.id)
const FRAME_IDS = FRAMES.map((f) => f.id)
const UPH_IDS = UPHOLSTERIES.map((u) => u.id)

// Los ids se piden como texto y se filtran aquí: un id fuera de lista no debe tumbar toda la lectura.
const Bilingual = z.object({ es: z.string(), en: z.string() })

const Extraction = z.object({
  name: z.string().describe('Nombre comercial del producto o familia, sin la palabra "chairs"/"silla". Ej: "Tad".'),
  category: z.string().describe(`Id de la categoría del catálogo que mejor le corresponde. Uno de: ${CAT_IDS.join(', ')}.`),
  description: Bilingual.describe('Descripción comercial de 1 a 3 frases, fiel a la ficha.'),
  variants: z.array(z.object({ name: z.string() })).describe('Modelos o versiones que muestra la ficha (Ej: "Tad Luxo"). Vacío si sólo hay uno.'),
  frames: z.array(z.string()).describe(`Ids de estructuras estándar que coinciden con la ficha (${FRAME_IDS.join(', ')}). Vacío si la ficha no lo indica.`),
  upholsteries: z.array(z.string()).describe(`Ids de tapicerías estándar que coinciden con los materiales (${UPH_IDS.join(', ')}). Vacío si no lo indica.`),
  colors: z.array(z.object({ name: Bilingual, hex: z.string().describe('Color aproximado de la muestra, formato #rrggbb.') })).describe('Muestras de color de la ficha, en orden.'),
  specs: z
    .array(z.object({ label: Bilingual, value: Bilingual }))
    .describe('Datos técnicos: materiales, base, extras, medidas, etc. Una fila por concepto.'),
  notes: z.array(z.string()).describe('Dudas para que una persona revise, en español (texto ilegible, datos ambiguos). Vacío si todo es claro.'),
})

const catalogLines = [
  'Categorías: ' + CATEGORIES.map((c) => `${c.id} (${c.es})`).join(', '),
  'Estructuras estándar: ' + FRAMES.map((f) => `${f.id} (${f.es})`).join(', '),
  'Tapicerías estándar: ' + UPHOLSTERIES.map((u) => `${u.id} (${u.es})`).join(', '),
].join('\n')

const SYSTEM = `Eres el asistente de catálogo de Hassman Furniture, fabricante de mobiliario de oficina y residencial en México.
Recibes la ficha técnica de un producto y llenas su alta en el catálogo.

${catalogLines}

Reglas:
- Usa sólo lo que aparece en la ficha. Si un dato no está o no se lee con claridad, déjalo vacío y explícalo en "notes"; nunca lo inventes.
- Escribe cada texto en español y en inglés. Si la ficha está en un solo idioma, traduce con tono comercial sobrio.
- Medidas: anótalas tal cual con sus unidades y el modelo al que aplican; si los números son muy pequeños o borrosos, no los adivines.
- Colores: un elemento por muestra, con un nombre descriptivo corto (p. ej. "Café tabaco" / "Tobacco brown") y su color aproximado.`

let client
const anthropic = () => {
  if (!process.env.ANTHROPIC_API_KEY) throw new ConfigError('falta ANTHROPIC_API_KEY (necesaria para leer fichas)')
  client ??= new Anthropic()
  return client
}

export class ExtractError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

/**
 * @param {{ data: string, mediaType: string }} file  contenido en base64
 * @returns {Promise<{ draft: object, notes: string[] }>}
 */
export async function extractProduct({ data, mediaType }) {
  const source = { type: 'base64', media_type: mediaType, data }
  const fileBlock = mediaType === 'application/pdf' ? { type: 'document', source } : { type: 'image', source }

  let response
  try {
    response = await anthropic().beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      // Si el modelo declina por una falsa alarma de seguridad, el servidor reintenta con otro modelo.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      system: SYSTEM,
      messages: [{ role: 'user', content: [fileBlock, { type: 'text', text: 'Llena el alta de este producto a partir de la ficha.' }] }],
      output_config: { effort: 'medium', format: betaZodOutputFormat(Extraction) },
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new ConfigError('ANTHROPIC_API_KEY no es válida')
    if (err instanceof Anthropic.RateLimitError) throw new ExtractError(429, 'Demasiadas lecturas seguidas; intenta en un minuto')
    if (err instanceof Anthropic.BadRequestError) throw new ExtractError(422, `Claude no pudo procesar el archivo: ${err.message}`)
    if (err instanceof Anthropic.APIError) throw new ExtractError(502, `Error del servicio de lectura (${err.status ?? 'sin conexión'})`)
    throw err
  }

  if (response.stop_reason === 'refusal') throw new ExtractError(422, 'No se pudo leer esta ficha. Captura el producto manualmente.')
  if (response.stop_reason === 'max_tokens') throw new ExtractError(422, 'La ficha es demasiado extensa para leerla de una vez.')
  const out = response.parsed_output
  if (!out) throw new ExtractError(502, 'La lectura no regresó datos válidos; intenta de nuevo.')

  const draft = {
    id: slugify(out.name),
    name: out.name.trim(),
    cat: CAT_IDS.includes(out.category) ? out.category : '',
    descEs: out.description.es,
    descEn: out.description.en,
    frames: [...new Set(out.frames)].filter((id) => FRAME_IDS.includes(id)),
    uphs: [...new Set(out.upholsteries)].filter((id) => UPH_IDS.includes(id)),
    variants: out.variants.map((v) => ({ name: v.name, img: null })),
    colors: out.colors.filter((c) => /^#[0-9a-f]{6}$/i.test(c.hex)),
    specs: out.specs.map((s) => ({ k: s.label, v: s.value })),
  }
  return { draft, notes: out.notes }
}

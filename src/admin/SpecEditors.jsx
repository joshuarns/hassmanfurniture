// Editores de listas de la ficha: modelos, colores y especificaciones.

const update = (list, i, patch) => list.map((x, j) => (j === i ? { ...x, ...patch } : x))
const without = (list, i) => list.filter((_, j) => j !== i)

function RemoveButton({ onClick, label }) {
  return (
    <button type="button" className="adm-list__remove" onClick={onClick} aria-label={label} title="Quitar">
      ×
    </button>
  )
}

export function VariantsEditor({ variants, imgs, onChange }) {
  return (
    <div className="adm-list">
      {variants.length === 0 && <p className="adm-hint">Sin modelos: el producto se ofrece en una sola versión.</p>}
      {variants.map((v, i) => (
        <div key={i} className="adm-list__row adm-list__row--variant">
          <input className="input" placeholder="Nombre del modelo (p. ej. Tad Luxo)" value={v.name} onChange={(e) => onChange(update(variants, i, { name: e.target.value }))} aria-label={`Modelo ${i + 1}`} />
          <select className="input" value={v.img || ''} onChange={(e) => onChange(update(variants, i, { img: e.target.value || null }))} aria-label={`Imagen del modelo ${i + 1}`}>
            <option value="">Imagen principal</option>
            {imgs.map((src, n) => (
              <option key={src} value={src}>
                Imagen {n + 1}
              </option>
            ))}
          </select>
          {v.img ? <img className="adm-list__thumb" src={v.img} alt="" /> : <span className="adm-list__thumb" />}
          <RemoveButton label={`Quitar modelo ${i + 1}`} onClick={() => onChange(without(variants, i))} />
        </div>
      ))}
      <button type="button" className="btn btn-secondary adm-btn" onClick={() => onChange([...variants, { name: '', img: null }])}>
        + Agregar modelo
      </button>
      <p className="adm-hint">Cada modelo puede usar una de las imágenes del producto; súbelas primero en “Imágenes del producto”.</p>
    </div>
  )
}

export function ColorsEditor({ colors, onChange }) {
  return (
    <div className="adm-list">
      {colors.length === 0 && <p className="adm-hint">Sin colores propios: el configurador muestra sólo estructura y tapicería.</p>}
      {colors.map((c, i) => (
        <div key={i} className="adm-list__row adm-list__row--color">
          <input type="color" className="adm-color" value={c.hex} onChange={(e) => onChange(update(colors, i, { hex: e.target.value }))} aria-label={`Color ${i + 1}`} />
          <input className="input" placeholder="Nombre (español)" value={c.name.es} onChange={(e) => onChange(update(colors, i, { name: { ...c.name, es: e.target.value } }))} aria-label={`Nombre del color ${i + 1} en español`} />
          <input className="input" placeholder="Name (English)" value={c.name.en} onChange={(e) => onChange(update(colors, i, { name: { ...c.name, en: e.target.value } }))} aria-label={`Nombre del color ${i + 1} en inglés`} />
          <RemoveButton label={`Quitar color ${i + 1}`} onClick={() => onChange(without(colors, i))} />
        </div>
      ))}
      <button type="button" className="btn btn-secondary adm-btn" onClick={() => onChange([...colors, { name: { es: '', en: '' }, hex: '#888888' }])}>
        + Agregar color
      </button>
    </div>
  )
}

export function SpecsEditor({ specs, onChange }) {
  const set = (i, field, lang, value) => onChange(update(specs, i, { [field]: { ...specs[i][field], [lang]: value } }))
  return (
    <div className="adm-list">
      {specs.length === 0 && <p className="adm-hint">Materiales, base, extras, medidas… Cada fila aparece en la ficha técnica del sitio.</p>}
      {specs.map((s, i) => (
        <div key={i} className="adm-list__row adm-list__row--spec">
          <input className="input" placeholder="Dato (p. ej. Materiales)" value={s.k.es} onChange={(e) => set(i, 'k', 'es', e.target.value)} aria-label={`Dato ${i + 1} en español`} />
          <input className="input" placeholder="Valor (p. ej. Piel y Wintex)" value={s.v.es} onChange={(e) => set(i, 'v', 'es', e.target.value)} aria-label={`Valor ${i + 1} en español`} />
          <input className="input" placeholder="Label (English)" value={s.k.en} onChange={(e) => set(i, 'k', 'en', e.target.value)} aria-label={`Dato ${i + 1} en inglés`} />
          <input className="input" placeholder="Value (English)" value={s.v.en} onChange={(e) => set(i, 'v', 'en', e.target.value)} aria-label={`Valor ${i + 1} en inglés`} />
          <RemoveButton label={`Quitar dato ${i + 1}`} onClick={() => onChange(without(specs, i))} />
        </div>
      ))}
      <button type="button" className="btn btn-secondary adm-btn" onClick={() => onChange([...specs, { k: { es: '', en: '' }, v: { es: '', en: '' } }])}>
        + Agregar dato
      </button>
    </div>
  )
}

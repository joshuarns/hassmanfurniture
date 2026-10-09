import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES, FRAMES, GROUPS, UPHOLSTERIES } from '../data/catalog'
import { CURRENCY, api, formatDate, slugify, useAdmin } from './api'
import ImageBox from './ImageBox'

const EMPTY = {
  id: '',
  name: '',
  cat: '',
  status: 'draft',
  featured: false,
  sku: '',
  price: '',
  salePrice: '',
  manageStock: false,
  stock: 0,
  descEs: '',
  descEn: '',
  frames: [],
  uphs: [],
  imgs: [],
}

const GROUP_NAMES = { seating: 'Asientos', tables: 'Mesas' }

// Normaliza lo que llega de la API para los inputs (null → '').
const toForm = (p) => ({ ...EMPTY, ...p, sku: p.sku ?? '', price: p.price ?? '', salePrice: p.salePrice ?? '', stock: p.stock ?? 0 })

// `key` reinicia el formulario al pasar de un producto a otro (o de "nuevo" al recién creado).
export default function ProductEdit() {
  const { id } = useParams()
  return <Editor key={id || 'new'} id={id} />
}

function Editor({ id }) {
  const isNew = !id
  const navigate = useNavigate()
  const { state } = useLocation()
  const { expire } = useAdmin()

  const [form, setForm] = useState(isNew ? EMPTY : null)
  const [saved, setSaved] = useState(null) // última versión guardada (fechas)
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(state?.notice ? { type: 'ok', text: state.notice } : null) // { type: 'ok' | 'error', text }
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [descLang, setDescLang] = useState('es')
  const [dataTab, setDataTab] = useState('general')

  useEffect(() => {
    if (isNew) return
    api(`/products/${id}`)
      .then((p) => {
        setForm(toForm(p))
        setSaved(p)
      })
      .catch((err) => (err.status === 401 ? expire() : setMessage({ type: 'error', text: err.message })))
  }, [id, isNew, expire])

  useEffect(() => {
    if (!dirty) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!form) {
    return message ? (
      <>
        <BackLink />
        <p className="adm-error">{message.text}</p>
      </>
    ) : (
      <p className="adm-muted">Cargando…</p>
    )
  }

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }))
    setDirty(true)
  }

  const setName = (name) => set(isNew && !slugTouched ? { name, id: slugify(name) } : { name })

  const toggleIn = (key, value) => set({ [key]: form[key].includes(value) ? form[key].filter((x) => x !== value) : [...form[key], value] })

  const save = async (status) => {
    setBusy(true)
    setMessage(null)
    setErrors({})
    const body = { ...form, status, stock: Number(form.stock) }
    try {
      const p = await api(isNew ? '/products' : `/products/${form.id}`, { method: isNew ? 'POST' : 'PUT', body })
      setDirty(false)
      const text = status === 'publish' ? 'Producto publicado.' : 'Borrador guardado.'
      if (isNew) return navigate(`/admin/productos/${p.id}`, { replace: true, state: { notice: text } })
      setForm(toForm(p))
      setSaved(p)
      setMessage({ type: 'ok', text })
    } catch (err) {
      if (err.status === 401) return expire()
      setErrors(err.fields || {})
      setMessage({ type: 'error', text: err.message })
      // Abre la pestaña de datos donde está el error.
      if (err.fields?.price || err.fields?.salePrice) setDataTab('general')
      else if (err.fields?.stock) setDataTab('inventory')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!confirm(`¿Borrar “${form.name}” definitivamente?`)) return
    try {
      await api(`/products/${form.id}`, { method: 'DELETE' })
      setDirty(false)
      navigate('/admin/productos', { state: { notice: `“${form.name}” se borró.` } })
    } catch (err) {
      if (err.status === 401) return expire()
      setMessage({ type: 'error', text: err.message })
    }
  }

  const published = saved?.status === 'publish'

  return (
    <form
      className="adm-edit"
      onSubmit={(e) => {
        e.preventDefault()
        save(form.status)
      }}
      noValidate
    >
      <BackLink />
      <header className="adm-head">
        <h1>{isNew ? 'Añadir producto' : 'Editar producto'}</h1>
        {published && (
          <a className="btn btn-secondary adm-btn" href={`/producto/${form.id}`} target="_blank" rel="noreferrer">
            Ver producto ↗
          </a>
        )}
      </header>

      {message && (
        <p className={message.type === 'ok' ? 'adm-notice' : 'adm-error'} role={message.type === 'ok' ? 'status' : 'alert'}>
          {message.text}
        </p>
      )}

      <div className="adm-edit__grid">
        <div className="adm-edit__main">
          <div className="field">
            <label htmlFor="p-name" className="sr-only">
              Nombre del producto
            </label>
            <input
              id="p-name"
              className="input adm-title-input"
              placeholder="Nombre del producto"
              value={form.name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            <FieldError msg={errors.name} />
          </div>

          <div className="adm-permalink">
            <span>Enlace permanente:</span>
            {isNew ? (
              <>
                <code>/producto/</code>
                <input
                  className="input adm-input-sm adm-slug"
                  value={form.id}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set({ id: slugify(e.target.value) })
                  }}
                  aria-label="Slug"
                  aria-invalid={Boolean(errors.id)}
                />
              </>
            ) : (
              <code>/producto/{form.id}</code>
            )}
            <FieldError msg={errors.id} />
          </div>

          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Descripción</h2>
              <div className="adm-seg" role="tablist" aria-label="Idioma">
                {[
                  ['es', 'Español'],
                  ['en', 'English'],
                ].map(([l, text]) => (
                  <button key={l} type="button" role="tab" aria-selected={descLang === l} onClick={() => setDescLang(l)}>
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <div className="adm-card__body">
              <textarea
                className="input adm-desc"
                key={descLang}
                lang={descLang}
                aria-label={descLang === 'es' ? 'Descripción en español' : 'Description in English'}
                placeholder={descLang === 'es' ? 'Si se deja vacía se usa el texto genérico del sitio.' : 'Leave empty to use the site’s generic copy.'}
                value={descLang === 'es' ? form.descEs : form.descEn}
                onChange={(e) => set(descLang === 'es' ? { descEs: e.target.value } : { descEn: e.target.value })}
              />
            </div>
          </section>

          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Datos del producto</h2>
            </div>
            <div className="adm-pdata">
              <div className="adm-pdata__tabs" role="tablist" aria-orientation="vertical">
                {[
                  ['general', 'General'],
                  ['inventory', 'Inventario'],
                  ['attributes', 'Acabados'],
                ].map(([tid, text]) => (
                  <button key={tid} type="button" role="tab" aria-selected={dataTab === tid} onClick={() => setDataTab(tid)}>
                    {text}
                  </button>
                ))}
              </div>

              <div className="adm-pdata__panel">
                {dataTab === 'general' && (
                  <>
                    <Row label={`Precio normal (${CURRENCY})`} htmlFor="p-price" error={errors.price}>
                      <input id="p-price" className="input" type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={(e) => set({ price: e.target.value })} />
                    </Row>
                    <Row label={`Precio rebajado (${CURRENCY})`} htmlFor="p-sale" error={errors.salePrice}>
                      <input id="p-sale" className="input" type="number" min="0" step="0.01" inputMode="decimal" value={form.salePrice} onChange={(e) => set({ salePrice: e.target.value })} />
                    </Row>
                    <p className="adm-hint">El sitio trabaja por cotización: los precios se guardan para uso interno y no se muestran a los visitantes.</p>
                  </>
                )}

                {dataTab === 'inventory' && (
                  <>
                    <Row label="SKU" htmlFor="p-sku" error={errors.sku}>
                      <input id="p-sku" className="input" value={form.sku} onChange={(e) => set({ sku: e.target.value })} />
                    </Row>
                    <Row label="Gestionar inventario">
                      <label className="adm-check">
                        <input type="checkbox" checked={form.manageStock} onChange={(e) => set({ manageStock: e.target.checked })} />
                        Llevar el control de existencias
                      </label>
                    </Row>
                    {form.manageStock && (
                      <Row label="Cantidad en existencia" htmlFor="p-stock" error={errors.stock}>
                        <input id="p-stock" className="input" type="number" min="0" step="1" value={form.stock} onChange={(e) => set({ stock: e.target.value })} />
                      </Row>
                    )}
                  </>
                )}

                {dataTab === 'attributes' && (
                  <>
                    <fieldset className="adm-fieldset">
                      <legend>Estructura</legend>
                      <div className="adm-options">
                        {FRAMES.map((f) => (
                          <label key={f.id} className="adm-check">
                            <input type="checkbox" checked={form.frames.includes(f.id)} onChange={() => toggleIn('frames', f.id)} />
                            <span className="adm-swatch" style={{ background: f.color }} />
                            {f.es}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset className="adm-fieldset">
                      <legend>Tapicería</legend>
                      <div className="adm-options">
                        {UPHOLSTERIES.map((u) => (
                          <label key={u.id} className="adm-check">
                            <input type="checkbox" checked={form.uphs.includes(u.id)} onChange={() => toggleIn('uphs', u.id)} />
                            {u.es}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <p className="adm-hint">Sin selección se ofrecen todas las opciones en el configurador.</p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="adm-edit__side">
          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Publicar</h2>
            </div>
            <div className="adm-card__body adm-publish">
              <dl>
                <div>
                  <dt>Estado</dt>
                  <dd>{published ? 'Publicado' : 'Borrador'}</dd>
                </div>
                {saved && (
                  <div>
                    <dt>Modificado</dt>
                    <dd>{formatDate(saved.updatedAt)}</dd>
                  </div>
                )}
              </dl>
              <label className="adm-check">
                <input type="checkbox" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} />
                Producto destacado (aparece en la portada)
              </label>
            </div>
            <div className="adm-card__foot">
              {isNew || !published ? (
                <button type="button" className="btn btn-secondary adm-btn" disabled={busy} onClick={() => save('draft')}>
                  Guardar borrador
                </button>
              ) : (
                <button type="button" className="btn btn-secondary adm-btn" disabled={busy} onClick={() => save('draft')}>
                  Pasar a borrador
                </button>
              )}
              <button type="button" className="btn btn-primary adm-btn" disabled={busy} onClick={() => save('publish')}>
                {busy ? 'Guardando…' : published ? 'Actualizar' : 'Publicar'}
              </button>
              {!isNew && (
                <button type="button" className="adm-danger adm-delete" onClick={remove}>
                  Borrar producto
                </button>
              )}
            </div>
          </section>

          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Categoría</h2>
            </div>
            <div className="adm-card__body">
              {GROUPS.map((g) => (
                <fieldset key={g} className="adm-fieldset">
                  <legend>{GROUP_NAMES[g]}</legend>
                  {CATEGORIES.filter((c) => c.group === g).map((c) => (
                    <label key={c.id} className="adm-check">
                      <input type="radio" name="cat" value={c.id} checked={form.cat === c.id} onChange={() => set({ cat: c.id })} />
                      {c.es}
                    </label>
                  ))}
                </fieldset>
              ))}
              <FieldError msg={errors.cat} />
            </div>
          </section>

          <ImageBox imgs={form.imgs} onChange={(imgs) => set({ imgs })} error={errors.imgs} />
        </div>
      </div>
    </form>
  )
}

function BackLink() {
  return (
    <Link to="/admin/productos" className="adm-back">
      ← Productos
    </Link>
  )
}

function Row({ label, htmlFor, error, children }) {
  return (
    <div className="adm-row">
      {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : <span>{label}</span>}
      <div>
        {children}
        <FieldError msg={error} />
      </div>
    </div>
  )
}

function FieldError({ msg }) {
  return msg ? <p className="adm-field-error">{msg}</p> : null
}

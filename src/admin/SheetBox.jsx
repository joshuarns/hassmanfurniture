import { useRef, useState } from 'react'
import { isPdf, uploadFile, useAdmin } from './api'

// Caja "Ficha técnica": PDF o imagen que se muestra/descarga en la página del producto.
export default function SheetBox({ sheet, onChange }) {
  const { uploads } = useAdmin()
  const fileRef = useRef(null)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const addFile = async (file) => {
    setError('')
    setBusy(true)
    try {
      onChange(await uploadFile(file, 'fichas'))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const addUrl = () => {
    const u = url.trim()
    if (!/^https?:\/\//.test(u)) return setError('La URL debe empezar con https://')
    onChange(u)
    setUrl('')
    setError('')
  }

  return (
    <section className="adm-card">
      <div className="adm-card__head">
        <h2>Ficha técnica</h2>
      </div>
      <div className="adm-card__body">
        {sheet ? (
          <div className="adm-sheet">
            {isPdf(sheet) ? (
              <a href={sheet} target="_blank" rel="noreferrer" className="adm-sheet__pdf">
                PDF ↗
              </a>
            ) : (
              <img src={sheet} alt="" />
            )}
            <button type="button" className="adm-danger" onClick={() => onChange(null)}>
              Quitar
            </button>
          </div>
        ) : (
          <p className="adm-muted">Sin ficha. Si es imagen se muestra junto a la foto; si es PDF, como descarga.</p>
        )}

        {uploads && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                if (e.target.files[0]) addFile(e.target.files[0])
                e.target.value = ''
              }}
            />
            <button type="button" className="btn btn-secondary adm-btn adm-upload" disabled={busy} onClick={() => fileRef.current.click()}>
              {busy ? 'Subiendo…' : sheet ? 'Reemplazar ficha' : 'Subir ficha'}
            </button>
          </>
        )}
        <div className="adm-url">
          <input
            className="input adm-input-sm"
            type="url"
            placeholder="https://… (URL de la ficha)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
            aria-label="URL de la ficha técnica"
          />
          <button type="button" className="btn btn-secondary adm-btn" onClick={addUrl} disabled={!url.trim()}>
            Añadir
          </button>
        </div>
        {error && <p className="adm-field-error">{error}</p>}
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { useAdmin } from './api'

// Caja "Imágenes del producto": la primera es la principal; el resto forma la galería.
export default function ImageBox({ imgs, onChange, error }) {
  const { uploads } = useAdmin()
  const fileRef = useRef(null)
  const [url, setUrl] = useState('')
  const [pending, setPending] = useState(0)
  const [uploadError, setUploadError] = useState('')

  const addFiles = async (files) => {
    setUploadError('')
    setPending((n) => n + files.length)
    const added = []
    for (const file of files) {
      try {
        const blob = await upload(`productos/${file.name}`, file, { access: 'public', handleUploadUrl: '/api/admin/upload' })
        added.push(blob.url)
      } catch (err) {
        setUploadError(`${file.name}: ${err.message}`)
      } finally {
        setPending((n) => n - 1)
      }
    }
    if (added.length) onChange([...imgs, ...added])
  }

  const addUrl = () => {
    const u = url.trim()
    if (!/^https?:\/\//.test(u)) return setUploadError('La URL debe empezar con https://')
    if (!imgs.includes(u)) onChange([...imgs, u])
    setUrl('')
    setUploadError('')
  }

  const move = (i, to) => {
    const next = [...imgs]
    const [item] = next.splice(i, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <section className="adm-card">
      <div className="adm-card__head">
        <h2>Imágenes del producto</h2>
      </div>
      <div className="adm-card__body">
        {imgs.length > 0 ? (
          <ul className="adm-imgs">
            {imgs.map((src, i) => (
              <li key={src} className={i === 0 ? 'adm-imgs__main' : undefined}>
                <img src={src} alt="" />
                {i === 0 && <span className="adm-imgs__tag">Principal</span>}
                <div className="adm-imgs__actions">
                  {i > 0 && (
                    <button type="button" title="Hacer principal" aria-label={`Hacer principal la imagen ${i + 1}`} onClick={() => move(i, 0)}>
                      ★
                    </button>
                  )}
                  {i > 0 && (
                    <button type="button" title="Mover antes" aria-label={`Mover antes la imagen ${i + 1}`} onClick={() => move(i, i - 1)}>
                      ←
                    </button>
                  )}
                  {i < imgs.length - 1 && (
                    <button type="button" title="Mover después" aria-label={`Mover después la imagen ${i + 1}`} onClick={() => move(i, i + 1)}>
                      →
                    </button>
                  )}
                  <button type="button" title="Quitar" aria-label={`Quitar la imagen ${i + 1}`} onClick={() => onChange(imgs.filter((x) => x !== src))}>
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="adm-muted">Sin imágenes todavía.</p>
        )}

        {uploads && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              hidden
              onChange={(e) => {
                addFiles([...e.target.files])
                e.target.value = ''
              }}
            />
            <button type="button" className="btn btn-secondary adm-btn adm-upload" disabled={pending > 0} onClick={() => fileRef.current.click()}>
              {pending > 0 ? `Subiendo ${pending}…` : 'Subir imágenes'}
            </button>
          </>
        )}

        <div className="adm-url">
          <input
            className="input adm-input-sm"
            type="url"
            placeholder="https://… (pegar URL de imagen)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
            aria-label="URL de imagen"
          />
          <button type="button" className="btn btn-secondary adm-btn" onClick={addUrl} disabled={!url.trim()}>
            Añadir
          </button>
        </div>
        {!uploads && <p className="adm-hint">Para subir archivos conecta Vercel Blob (BLOB_READ_WRITE_TOKEN).</p>}
        {(uploadError || error) && <p className="adm-field-error">{uploadError || error}</p>}
      </div>
    </section>
  )
}

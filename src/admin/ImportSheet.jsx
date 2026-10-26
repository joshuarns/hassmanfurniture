import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, uploadFile, useAdmin } from './api'

const ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp'
// Sin Blob el archivo viaja dentro de la petición, y Vercel limita el cuerpo a ~4.5 MB.
const MAX_INLINE = 3 * 1024 * 1024
const MAX_UPLOAD = 20 * 1024 * 1024

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = () => reject(new Error('No se pudo leer el archivo'))
    r.readAsDataURL(file)
  })

// "Importar desde ficha": sube un PDF o imagen, Claude lo lee y se abre el editor prellenado.
export default function ImportSheet() {
  const { uploads, expire } = useAdmin()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [step, setStep] = useState('idle') // idle | uploading | reading
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)

  const pick = (f) => {
    setError('')
    if (!f) return
    if (!ACCEPT.split(',').includes(f.type)) return setError('Usa un PDF o una imagen JPG, PNG o WebP.')
    const limit = uploads ? MAX_UPLOAD : MAX_INLINE
    if (f.size > limit) return setError(`El archivo pesa más de ${Math.round(limit / 1024 / 1024)} MB.`)
    if (preview) URL.revokeObjectURL(preview)
    setFile(f)
    setPreview(f.type.startsWith('image/') ? URL.createObjectURL(f) : '')
  }

  const read = async () => {
    setError('')
    try {
      let body
      if (uploads) {
        setStep('uploading')
        body = { url: await uploadFile(file, 'fichas') }
      } else {
        body = { data: await toBase64(file), mediaType: file.type }
      }
      setStep('reading')
      const { draft, notes } = await api('/import', { method: 'POST', body })
      navigate('/admin/productos/nuevo', { state: { draft, notes, source: file.name } })
    } catch (err) {
      if (err.status === 401) return expire()
      setError(err.message)
      setStep('idle')
    }
  }

  const busy = step !== 'idle'

  return (
    <div className="adm-import">
      <Link to="/admin/productos" className="adm-back">
        ← Productos
      </Link>
      <header className="adm-head">
        <h1>Importar desde ficha</h1>
      </header>
      <p className="adm-import__lead">
        Sube la ficha técnica en PDF o imagen. Claude lee nombre, descripción, modelos, materiales, colores y medidas, y abre el producto como
        borrador para que lo revises antes de publicar. ¿Prefieres capturarlo tú? <Link to="/admin/productos/nuevo">Añadir manualmente</Link>.
      </p>

      <div
        className={`adm-drop ${over ? 'is-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          if (!busy) pick(e.dataTransfer.files[0])
        }}
      >
        <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={(e) => pick(e.target.files[0])} />
        {file ? (
          <div className="adm-drop__file">
            {preview ? <img src={preview} alt="" /> : <span className="adm-drop__pdf">PDF</span>}
            <div>
              <strong>{file.name}</strong>
              <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
          </div>
        ) : (
          <p>
            Arrastra aquí la ficha
            <span>PDF, JPG, PNG o WebP · hasta {uploads ? 20 : 3} MB</span>
          </p>
        )}
        <button type="button" className="btn btn-secondary adm-btn" disabled={busy} onClick={() => inputRef.current.click()}>
          {file ? 'Cambiar archivo' : 'Elegir archivo'}
        </button>
      </div>

      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}

      <div className="adm-import__actions">
        <button type="button" className="btn btn-primary adm-btn" disabled={!file || busy} onClick={read}>
          {step === 'uploading' ? 'Subiendo…' : step === 'reading' ? 'Leyendo la ficha…' : 'Leer ficha'}
        </button>
        {step === 'reading' && <span className="adm-muted" role="status">Suele tardar entre 20 y 60 segundos.</span>}
      </div>
      {!uploads && <p className="adm-hint">Sin Vercel Blob la ficha no se guarda en el producto; súbela después en “Ficha técnica”.</p>}
    </div>
  )
}

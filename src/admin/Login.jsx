import { useState } from 'react'
import { api } from './api'

export default function Login({ offline, expired, onLogin }) {
  const [error, setError] = useState(offline ? 'No hay conexión con la API. ¿Está configurado .env.local?' : expired ? 'Tu sesión expiró. Vuelve a entrar.' : '')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/login', { method: 'POST', body: { password: new FormData(e.currentTarget).get('password') } })
      onLogin()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-card adm-login__card" onSubmit={onSubmit}>
        <div className="adm-login__brand">
          Hassman<span>Panel</span>
        </div>
        <div className="field">
          <label htmlFor="adm-pass">Contraseña</label>
          <input id="adm-pass" className="input" type="password" name="password" autoComplete="current-password" required autoFocus />
        </div>
        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

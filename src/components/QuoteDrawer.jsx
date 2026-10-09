import { useEffect, useRef, useState } from 'react'
import { FRAMES, UPHOLSTERIES } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import useLockBody from '../hooks/useLockBody'
import { CloseIcon } from './Icons'
import './QuoteDrawer.css'

// Panel lateral con las piezas a cotizar y el formulario de contacto.
// Se monta sólo mientras está abierto, así el estado "enviado" se reinicia solo.
export default function QuoteDrawer() {
  const { t, label } = useLang()
  const { items, remove, clear, close } = useQuote()
  const { findProduct } = useCatalog()
  const [sentTo, setSentTo] = useState(null)
  const panelRef = useRef(null)

  useLockBody(true)

  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const onSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    // TODO: enviar `data` + `items` al backend / servicio de correo (p. ej. endpoint de WordPress o Formspree).
    console.info('Solicitud de cotización', { ...data, items })
    setSentTo(data.email || '')
    clear()
  }

  return (
    <div className="drawer-backdrop" onClick={close}>
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__head">
          <h2 id="quote-title">{t.q_title}</h2>
          <button type="button" className="btn btn-icon" onClick={close} aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        {sentTo !== null ? (
          <div className="drawer__sent">
            <h3>{t.sent_title}</h3>
            <p>{t.sent_body(sentTo)}</p>
            <button type="button" className="btn btn-secondary" onClick={close}>
              {t.close}
            </button>
          </div>
        ) : (
          <>
            <div className="drawer__items">
              {items.length ? (
                items.map((q, i) => {
                  const p = findProduct(q.prod)
                  if (!p) return null
                  const frame = FRAMES.find((f) => f.id === q.frame)
                  const uph = UPHOLSTERIES.find((u) => u.id === q.uph)
                  return (
                    <div key={`${q.prod}-${q.frame}-${q.uph}`} className="quote-item">
                      <div className="media media--contain quote-item__img">
                        <img src={p.imgs[0]} alt="" />
                      </div>
                      <div className="quote-item__info">
                        <span className="quote-item__name">{p.name}</span>
                        <span className="quote-item__detail">
                          {frame && label(frame)} · {uph && label(uph)}
                        </span>
                      </div>
                      <span className="quote-item__qty">× {q.qty}</span>
                      <button type="button" className="btn btn-ghost" onClick={() => remove(i)}>
                        {t.remove}
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="drawer__empty">{t.q_empty}</p>
              )}
            </div>

            <form className="drawer__form" onSubmit={onSubmit}>
              <div className="drawer__fields">
                <div className="field">
                  <label htmlFor="q-name">{t.name}</label>
                  <input id="q-name" className="input" name="name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="q-email">{t.email}</label>
                  <input id="q-email" className="input" type="email" name="email" autoComplete="email" required />
                </div>
                <div className="field">
                  <label htmlFor="q-company">{t.company}</label>
                  <input id="q-company" className="input" name="company" autoComplete="organization" />
                </div>
                <div className="field">
                  <label htmlFor="q-sector">{t.sector}</label>
                  <select id="q-sector" className="input" name="sector">
                    {t.sectors.map(([name]) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="q-message">{t.message}</label>
                <textarea id="q-message" className="input" name="message" rows="4" />
              </div>
              <button type="submit" className="btn btn-primary btn-start">
                {t.send}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

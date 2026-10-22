import { useState } from 'react'
import { FRAMES, UPHOLSTERIES, findProduct } from '../data/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import Drawer from './Drawer'
import './QuoteDrawer.css'

// Lista de piezas a cotizar + formulario. Se monta sólo mientras está abierto,
// así el estado "enviado" se reinicia solo.
export default function QuoteDrawer() {
  const { t, label } = useLang()
  const { items, count, remove, clear, close } = useQuote()
  const [sentTo, setSentTo] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    // TODO: enviar `data` + `items` al backend / servicio de correo (p. ej. endpoint de WordPress o Formspree).
    console.info('Solicitud de cotización', { ...data, items })
    setSentTo(data.email || '')
    clear()
  }

  return (
    <Drawer side="right" label={t.q_title} onClose={close} head={<span className="ui tnum">{t.pieces(count)}</span>}>
      <div className="dw__body qd">
        <h2 className="qd__title">{sentTo !== null ? t.sent_title : t.q_title}</h2>

        {sentTo !== null ? (
          <div className="qd__sent">
            <p>{t.sent_body(sentTo)}</p>
            <button type="button" className="btn btn--outline" onClick={close}>
              {t.close}
            </button>
          </div>
        ) : (
          <>
            {items.length ? (
              <ul className="qd__items">
                {items.map((q, i) => {
                  const p = findProduct(q.prod)
                  if (!p) return null
                  const frame = FRAMES.find((f) => f.id === q.frame)
                  const uph = UPHOLSTERIES.find((u) => u.id === q.uph)
                  return (
                    <li key={`${q.prod}-${q.frame}-${q.uph}`} className="qd__item">
                      <div className="ph qd__thumb">
                        <img src={p.imgs[0]} alt="" />
                      </div>
                      <div className="qd__info">
                        <span className="qd__name">{p.name}</span>
                        <span className="qd__detail">
                          {frame && label(frame)} · {uph && label(uph)} · × {q.qty}
                        </span>
                      </div>
                      <button type="button" className="link-arrow qd__remove" onClick={() => remove(i)}>
                        {t.remove}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="qd__empty">{t.q_empty}</p>
            )}

            <form className="qd__form" onSubmit={onSubmit}>
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
              <div className="field">
                <label htmlFor="q-message">{t.message}</label>
                <textarea id="q-message" className="input" name="message" rows="3" />
              </div>
              <button type="submit" className="btn qd__submit">
                {t.send}
              </button>
            </form>
          </>
        )}
      </div>
    </Drawer>
  )
}

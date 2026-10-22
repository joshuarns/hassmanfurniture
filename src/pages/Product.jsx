import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FRAMES, UPHOLSTERIES, findCategory, findProduct, productsIn } from '../data/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import './Page.css'
import './Product.css'

export default function Product() {
  const { prodId } = useParams()
  const product = findProduct(prodId)
  if (!product) return <NotFound />
  // `key` reinicia la configuración al cambiar de producto.
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const { t, label } = useLang()
  const quote = useQuote()
  const cat = findCategory(product.cat)

  const [frame, setFrame] = useState(FRAMES[0].id)
  const [uph, setUph] = useState(UPHOLSTERIES[0].id)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const siblings = productsIn(product.cat)
  const idx = siblings.findIndex((p) => p.id === product.id)
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length]
  const next = siblings[(idx + 1) % siblings.length]
  const related = siblings.filter((p) => p.id !== product.id).slice(0, 5)

  const frameObj = FRAMES.find((f) => f.id === frame)
  const pick = (setter) => (value) => {
    setter(value)
    setJustAdded(false)
  }

  const details = [
    [t.d_cat, label(cat)],
    [t.d_coll, product.name],
    [t.d_fin, t.d_fin_v],
  ]

  return (
    <>
      <header className="page-head">
        <Link to={`/colecciones/${cat.id}`} className="back">
          ‹ {label(cat)}
        </Link>
        <h1 className="t-page">{product.name}</h1>
        <p className="t-lead">{t.desc(product.name)}</p>
      </header>

      <div className="wrap">
        <div className="pd__gallery">
          {product.imgs.map((src, i) => (
            <div key={src} className={`ph pd__img ${i > 0 ? 'pd__img--sheet' : ''}`}>
              <img src={src} alt={i === 0 ? product.name : ''} />
            </div>
          ))}
        </div>

        <section className="pd__config" aria-label={t.add}>
          <div className="pd__row">
            <span className="pd__key">{t.frame}</span>
            <div className="pd__val">
              <div className="pd__swatches">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="swatch"
                    style={{ background: f.color }}
                    title={label(f)}
                    aria-label={label(f)}
                    aria-pressed={f.id === frame}
                    onClick={() => pick(setFrame)(f.id)}
                  />
                ))}
              </div>
              <span className="pd__chosen">{label(frameObj)}</span>
            </div>
          </div>

          <div className="pd__row">
            <span className="pd__key">{t.upholstery}</span>
            <div className="pd__val pd__opts">
              {UPHOLSTERIES.map((u) => (
                <button key={u.id} type="button" className="tab" aria-pressed={u.id === uph} onClick={() => pick(setUph)(u.id)}>
                  {label(u)}
                </button>
              ))}
            </div>
          </div>

          <div className="pd__row">
            <span className="pd__key">{t.quantity}</span>
            <div className="pd__val qty">
              <button type="button" aria-label="−" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="tnum" aria-live="polite">
                {qty}
              </span>
              <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                +
              </button>
            </div>
          </div>

          <div className="pd__actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                quote.add({ prod: product.id, frame, uph, qty })
                setJustAdded(true)
              }}
            >
              {t.add}
            </button>
            {justAdded && (
              <button type="button" className="link-line" onClick={quote.open}>
                {t.added}
              </button>
            )}
          </div>
        </section>

        <section className="pd__specs">
          <div className="pd__specs-head">
            <h2>{t.specs}</h2>
            <Link to={`/colecciones/${cat.id}`} className="link-arrow">
              {t.view_cat} ›
            </Link>
          </div>
          <dl>
            {details.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {siblings.length > 1 && (
          <nav className="pd__pager ui" aria-label={label(cat)}>
            <Link to={`/producto/${prev.id}`}>‹ {prev.name}</Link>
            <Link to={`/producto/${next.id}`}>{next.name} ›</Link>
          </nav>
        )}
      </div>

      {related.length > 0 && (
        <section className="section pd__related">
          <div className="section-head">
            <h2 className="t-title">{t.related(label(cat))}</h2>
          </div>
          <div className="wrap">
            <div className="grid-products grid-products--5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

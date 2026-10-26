import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findCategory, framesOf, uphsOf } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import './Page.css'
import './Product.css'

export default function Product() {
  const { prodId } = useParams()
  const { findProduct, ready } = useCatalog()
  const product = findProduct(prodId)
  if (!product) return ready ? <NotFound /> : <div className="page-head" style={{ minHeight: '60vh' }} aria-busy="true" />
  // `key` reinicia la configuración al cambiar de producto.
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const { t, lang, label } = useLang()
  const quote = useQuote()
  const { productsIn } = useCatalog()
  const cat = findCategory(product.cat)
  const frames = framesOf(product)
  const uphs = uphsOf(product)
  const variants = product.variants || []
  const colors = product.colors || []

  const [variant, setVariant] = useState(variants[0]?.id ?? null)
  const [frame, setFrame] = useState(frames[0].id)
  const [uph, setUph] = useState(uphs[0].id)
  const [color, setColor] = useState(colors.length ? 0 : null)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const siblings = productsIn(product.cat)
  const idx = siblings.findIndex((p) => p.id === product.id)
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length]
  const next = siblings[(idx + 1) % siblings.length]
  const related = siblings.filter((p) => p.id !== product.id).slice(0, 5)

  const frameObj = frames.find((f) => f.id === frame)
  const variantObj = variants.find((v) => v.id === variant)

  // Foto principal (la del modelo elegido) + ficha en imagen, o la 2.ª imagen como en el catálogo original.
  const sheetIsPdf = /\.pdf($|\?)/i.test(product.sheet || '')
  const mainImg = variantObj?.img || product.imgs[0]
  const sideImg = (!sheetIsPdf && product.sheet) || product.imgs[1] || null
  const extraImgs = product.imgs.slice(1).filter((src) => src !== sideImg && src !== mainImg)
  const pick = (setter) => (value) => {
    setter(value)
    setJustAdded(false)
  }

  const details = [
    [t.d_cat, label(cat)],
    [t.d_coll, product.name],
    [t.d_fin, t.d_fin_v(frames.length, uphs.length)],
    ...(product.specs || []).map((s) => [label(s.k), label(s.v)]),
    product.sku && ['SKU', product.sku],
  ].filter(Boolean)

  return (
    <>
      <header className="page-head">
        <Link to={`/colecciones/${cat.id}`} className="back">
          ‹ {label(cat)}
        </Link>
        <h1 className="t-page">{product.name}</h1>
        <p className="t-lead">{product.desc?.[lang] || t.desc(product.name)}</p>
      </header>

      <div className="wrap">
        <div className={`pd__gallery ${sideImg ? '' : 'pd__gallery--single'}`}>
          <div className="ph pd__img">
            <img key={mainImg} src={mainImg} alt={variantObj?.name || product.name} />
          </div>
          {sideImg && (
            <div className="ph pd__img pd__img--sheet">
              <img src={sideImg} alt={product.sheet ? t.sheet : ''} />
            </div>
          )}
        </div>
        {extraImgs.length > 0 && (
          <div className="pd__extra">
            {extraImgs.map((src) => (
              <div key={src} className="ph pd__img">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        <section className="pd__config" aria-label={t.add}>
          {variants.length > 0 && (
            <div className="pd__row">
              <span className="pd__key">{t.model}</span>
              <div className="pd__val pd__opts">
                {variants.map((v) => (
                  <button key={v.id} type="button" className="tab" aria-pressed={v.id === variant} onClick={() => pick(setVariant)(v.id)}>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd__row">
            <span className="pd__key">{t.frame}</span>
            <div className="pd__val">
              <div className="pd__swatches">
                {frames.map((f) => (
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
              {uphs.map((u) => (
                <button key={u.id} type="button" className="tab" aria-pressed={u.id === uph} onClick={() => pick(setUph)(u.id)}>
                  {label(u)}
                </button>
              ))}
            </div>
          </div>

          {colors.length > 0 && (
            <div className="pd__row">
              <span className="pd__key">{t.color}</span>
              <div className="pd__val">
                <div className="pd__swatches pd__swatches--wrap">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      className="swatch swatch--sm"
                      style={{ background: c.hex }}
                      title={label(c.name)}
                      aria-label={label(c.name)}
                      aria-pressed={i === color}
                      onClick={() => pick(setColor)(i)}
                    />
                  ))}
                </div>
                <span className="pd__chosen">{colors[color] && label(colors[color].name)}</span>
              </div>
            </div>
          )}

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
                quote.add({ prod: product.id, variant, frame, uph, color, qty })
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
          {sheetIsPdf && (
            <a href={product.sheet} className="link-line pd__pdf" target="_blank" rel="noreferrer">
              {t.sheet_pdf}
            </a>
          )}
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

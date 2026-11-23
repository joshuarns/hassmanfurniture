import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findCategory, framesOf, uphsOf } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import Lines from '../components/Lines'
import useReveals from '../hooks/useReveals'
import NotFound from './NotFound'
import './Page.css'
import './Product.css'

export default function Product() {
  const { prodId } = useParams()
  const { findProduct, ready } = useCatalog()
  const product = findProduct(prodId)
  if (!product) return ready ? <NotFound /> : <div className="page-head" style={{ minHeight: '80vh' }} aria-busy="true" />
  // `key` reinicia la configuración al cambiar de producto.
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const { t, lang, label } = useLang()
  const quote = useQuote()
  const { productsIn } = useCatalog()
  const root = useRef(null)
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

  useReveals(root, [lang])

  const siblings = productsIn(product.cat)
  const idx = siblings.findIndex((p) => p.id === product.id)
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length]
  const next = siblings[(idx + 1) % siblings.length]
  const related = siblings.filter((p) => p.id !== product.id).slice(0, 3)

  const frameObj = frames.find((f) => f.id === frame)
  const uphObj = uphs.find((u) => u.id === uph)
  const variantObj = variants.find((v) => v.id === variant)
  const pick = (setter) => (value) => {
    setter(value)
    setJustAdded(false)
  }

  // Foto principal (la del modelo elegido) + ficha en imagen, o la 2.ª imagen del catálogo original.
  const sheetIsPdf = /\.pdf($|\?)/i.test(product.sheet || '')
  const mainImg = variantObj?.img || product.imgs[0]
  const sideImg = (!sheetIsPdf && product.sheet) || product.imgs[1] || null
  const extraImgs = product.imgs.slice(1).filter((src) => src !== sideImg && src !== mainImg)

  const details = [
    [t.d_cat, label(cat)],
    [t.d_coll, product.name],
    [t.d_fin, t.d_fin_v(frames.length, uphs.length)],
    ...(product.specs || []).map((s) => [label(s.k), label(s.v)]),
    product.sku && ['SKU', product.sku],
  ].filter(Boolean)

  return (
    <div ref={root}>
      <div className="pd">
        <div className="pd__gallery">
          <div className="ph pd__main">
            <img key={mainImg} src={mainImg} alt={variantObj?.name || product.name} className="pd__fadein" />
          </div>
          {sideImg && (
            <div className="ph pd__sheet" data-reveal="fade">
              <img src={sideImg} alt={product.sheet ? t.sheet : ''} loading="lazy" />
            </div>
          )}
          {extraImgs.map((src) => (
            <div key={src} className="ph pd__main" data-reveal="fade">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>

        <aside className="pd__panel">
          <nav className="crumbs caps" aria-label="Breadcrumb">
            <Link to="/colecciones">{t.coll_title}</Link>
            <span>/</span>
            <Link to={`/colecciones/${cat.id}`}>{label(cat)}</Link>
          </nav>
          <Lines as="h1" className="t-display pd__name" lines={[product.name]} />
          <p className="t-lead" data-reveal="up">
            {product.desc?.[lang] || t.desc(product.name)}
          </p>

          <div className="pd__config" data-reveal="up" data-delay="0.1">
            {variants.length > 0 && (
              <Row label={t.model} value={variantObj?.name}>
                <div className="pd__opts">
                  {variants.map((v) => (
                    <button key={v.id} type="button" className="opt" aria-pressed={v.id === variant} onClick={() => pick(setVariant)(v.id)}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </Row>
            )}

            <Row label={t.frame} value={label(frameObj)}>
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
            </Row>

            <Row label={t.upholstery} value={label(uphObj)}>
              <div className="pd__opts">
                {uphs.map((u) => (
                  <button key={u.id} type="button" className="opt" aria-pressed={u.id === uph} onClick={() => pick(setUph)(u.id)}>
                    {label(u)}
                  </button>
                ))}
              </div>
            </Row>

            {colors.length > 0 && (
              <Row label={t.color} value={colors[color] && label(colors[color].name)}>
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
              </Row>
            )}

            <Row label={t.quantity}>
              <div className="qty">
                <button type="button" aria-label="−" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                  +
                </button>
              </div>
            </Row>
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
              {justAdded ? `✓ ${t.added_sel}` : t.add_sel}
            </button>
            <button type="button" className="btn btn--ghost" onClick={quote.open}>
              {justAdded ? t.view_sel : t.advisor}
            </button>
          </div>
        </aside>
      </div>

      <section className="wrap pd__specs">
        <header className="row-head">
          <Lines className="t-title" lines={[<em key="s">{t.specs}</em>]} />
          {sheetIsPdf && (
            <a href={product.sheet} className="link" target="_blank" rel="noreferrer">
              {t.sheet_pdf} <span className="arrow" />
            </a>
          )}
        </header>
        <dl>
          {details.map(([k, v]) => (
            <div key={k} data-reveal="up">
              <dt className="caps muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {siblings.length > 1 && (
        <nav className="pd__pager wrap" aria-label={label(cat)}>
          <Link to={`/producto/${prev.id}`} className="pd__pager-link">
            <span className="caps muted">← {t.prev}</span>
            <span className="pd__pager-name">{prev.name}</span>
          </Link>
          <Link to={`/producto/${next.id}`} className="pd__pager-link pd__pager-link--next">
            <span className="caps muted">{t.next} →</span>
            <span className="pd__pager-name">{next.name}</span>
          </Link>
        </nav>
      )}

      {related.length > 0 && (
        <section className="wrap section pd__related">
          <header className="row-head">
            <Lines className="t-title" lines={[t.related(label(cat))]} />
            <Link to={`/colecciones/${cat.id}`} className="link">
              {t.view_all} <span className="arrow" />
            </Link>
          </header>
          <div className="grid-products grid-products--3">
            {related.map((p, i) => (
              <div key={p.id} data-reveal="up" data-delay={i * 0.12}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Row({ label, value, children }) {
  return (
    <div className="pd__row">
      <div className="pd__row-head">
        <span className="caps">{label}</span>
        {value && <span className="pd__value">{value}</span>}
      </div>
      {children}
    </div>
  )
}

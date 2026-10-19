import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findCategory, framesOf, uphsOf } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import './Product.css'

export default function Product() {
  const { prodId } = useParams()
  const { findProduct, ready } = useCatalog()
  const product = findProduct(prodId)
  if (!product) return ready ? <NotFound /> : <section className="container page" style={{ minHeight: '60vh' }} aria-busy="true" />
  // `key` reinicia la configuración al cambiar de producto.
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const { t, lang, label } = useLang()
  const quote = useQuote()
  const { productsIn } = useCatalog()
  const frames = framesOf(product)
  const uphs = uphsOf(product)
  const cat = findCategory(product.cat)

  const [img, setImg] = useState(0)
  const [frame, setFrame] = useState(frames[0].id)
  const [uph, setUph] = useState(uphs[0].id)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const frameObj = frames.find((f) => f.id === frame)
  const uphObj = uphs.find((u) => u.id === uph)
  const related = productsIn(product.cat)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const details = [
    [t.d_cat, label(cat)],
    [t.d_coll, product.name],
    [t.d_fin, t.d_fin_v(frames.length, uphs.length)],
    product.sku && ['SKU', product.sku],
  ].filter(Boolean)

  const addToQuote = () => {
    quote.add({ prod: product.id, frame, uph, qty })
    setJustAdded(true)
  }

  return (
    <>
      <section className="container product">
        <nav className="breadcrumbs product__crumbs" aria-label="Breadcrumb">
          <Link to="/">{t.home}</Link>
          <span>›</span>
          <Link to="/colecciones">{t.coll_title}</Link>
          <span>›</span>
          <Link to={`/colecciones/${cat.id}`}>{label(cat)}</Link>
        </nav>

        <div className="product__layout">
          <div className="product__gallery">
            <div className="media media--contain product__main">
              <img src={product.imgs[img] || product.imgs[0]} alt={product.name} />
            </div>
            <div className="product__thumbs">
              {product.imgs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className="media media--contain product__thumb"
                  aria-pressed={i === img}
                  aria-label={`${product.name} ${i + 1}`}
                  onClick={() => setImg(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="product__panel">
            <div className="product__intro">
              <span className="kicker">
                {label(cat)} — {t.collection}
              </span>
              <h1>{product.name}</h1>
              <p>{product.desc?.[lang] || t.desc(product.name)}</p>
            </div>

            <div className="product__option">
              <div className="product__option-label">
                <span>{t.frame}.</span>
                <span>{label(frameObj)}</span>
              </div>
              <div className="product__swatches">
                {frames.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="swatch"
                    style={{ background: f.color }}
                    title={label(f)}
                    aria-label={label(f)}
                    aria-pressed={f.id === frame}
                    onClick={() => {
                      setFrame(f.id)
                      setJustAdded(false)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="product__option">
              <div className="product__option-label">
                <span>{t.upholstery}.</span>
                <span>{label(uphObj)}</span>
              </div>
              <div className="product__uphs">
                {uphs.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className="uph"
                    aria-pressed={u.id === uph}
                    onClick={() => {
                      setUph(u.id)
                      setJustAdded(false)
                    }}
                  >
                    {label(u)}
                  </button>
                ))}
              </div>
            </div>

            <div className="product__buy">
              <div className="qty">
                <button type="button" aria-label="−" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                  +
                </button>
              </div>
              <button type="button" className="btn btn-primary btn-start product__add" onClick={addToQuote}>
                {t.add}
              </button>
            </div>

            {justAdded && (
              <button type="button" className="link-accent product__added" onClick={quote.open}>
                {t.added} ›
              </button>
            )}

            <dl className="product__details">
              {details.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container product-related">
          <div className="section-head section-head--sm">
            <h2>{t.related(label(cat))}</h2>
            <Link to={`/colecciones/${cat.id}`} className="link-accent">
              {t.view_all} ›
            </Link>
          </div>
          <div className="product-grid product-grid--related">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

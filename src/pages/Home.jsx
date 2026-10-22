import { Link } from 'react-router-dom'
import { CATEGORIES, FEATURED_PRODUCT, HOME_IMAGES, PRODUCTS, findCategory } from '../data/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import CategoryPanel from '../components/CategoryPanel'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const { t } = useLang()
  const { open: openQuote } = useQuote()

  const seating = CATEGORIES.filter((c) => c.group === 'seating')
  const tables = ['juntas', 'escritorios', 'mesas'].map(findCategory)

  const heroFallback = (e) => {
    if (e.currentTarget.src !== HOME_IMAGES.heroFallback) e.currentTarget.src = HOME_IMAGES.heroFallback
  }

  return (
    <>
      <section className="hero">
        <img src={HOME_IMAGES.hero} onError={heroFallback} alt={t.hero_alt} fetchPriority="high" />
        <span className="scrim" />
        <div className="hero__copy">
          <h1 className="t-display">
            {t.hb_title1} <br />
            {t.hb_title2}
          </h1>
          <p>{t.hb_coll_body}</p>
          <Link to="/colecciones" className="link-line">
            {t.cta_explore}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="t-title">{t.seat_title}</h2>
        </div>
        <div className="wrap">
          <div className="cat-row">
            {seating.map((c) => (
              <CategoryPanel key={c.id} category={c} className="cat-row__panel" />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="t-title">{t.featured_title}</h2>
        </div>
        <div className="wrap">
          <div className="grid-products">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} variant="feature" />
            ))}
          </div>
          <div className="home__more">
            <Link to="/colecciones/oficina" className="link-line">
              {t.view_all}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="t-title">{t.tables_title}</h2>
        </div>
        <div className="wrap">
          <div className="bento">
            {tables.map((c, i) => (
              <CategoryPanel key={c.id} category={c} className={`bento__tile bento__tile--${i}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div className="split__img ph">
            <img src={HOME_IMAGES.heroTile} alt="Tad" loading="lazy" />
          </div>
          <div className="split__panel">
            <span className="caps">{t.new}</span>
            <h2 className="t-title">Tad.</h2>
            <p>{t.tad_body}</p>
            <Link to={`/producto/${FEATURED_PRODUCT}`} className="link-line">
              {t.more}
            </Link>
          </div>
        </div>
        <div id="estudio" className="split split--reverse">
          <div className="split__img ph">
            <img src={findCategory('lounge').img} alt="" loading="lazy" />
          </div>
          <div className="split__panel split__panel--dark">
            <span className="caps">{t.nav_studio}</span>
            <h2 className="t-title">{t.studio_title}</h2>
            <p>{t.statement_body}</p>
            <button type="button" className="link-line" onClick={openQuote}>
              {t.close_btn}
            </button>
          </div>
        </div>
      </section>

      <section id="proyectos" className="section">
        <p className="caps sectors__label">{t.sectors_title}</p>
        <div className="sectors">
          {t.sectors.map(([title, desc]) => (
            <div key={title} className="sector">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section cta">
        <h2 className="t-title">{t.close_title}</h2>
        <p className="t-lead">{t.close_lead}</p>
        <button type="button" className="btn" onClick={openQuote}>
          {t.close_btn}
        </button>
      </section>
    </>
  )
}

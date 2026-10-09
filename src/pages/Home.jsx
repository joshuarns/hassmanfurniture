import { Link, useNavigate } from 'react-router-dom'
import { CATEGORIES, FEATURED_PRODUCT, HOME_IMAGES, findCategory, pad } from '../data/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import { useCatalog } from '../context/catalog'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const { t, label } = useLang()
  const { featured } = useCatalog()
  const { open: openQuote } = useQuote()
  const navigate = useNavigate()

  const tiles = [
    { cat: findCategory('lounge'), sub: t.lounge_sub },
    { cat: findCategory('juntas'), sub: t.meeting_sub },
  ]

  const heroFallback = (e) => {
    if (e.currentTarget.src !== HOME_IMAGES.heroFallback) e.currentTarget.src = HOME_IMAGES.heroFallback
  }

  return (
    <>
      <div className="home-stack">
        <section className="hero">
          <div className="hero__img">
            <img src={HOME_IMAGES.hero} onError={heroFallback} alt={t.hero_alt} fetchPriority="high" />
          </div>
          <div className="hero__shade" />
          <div className="hero__content">
            <div className="hero__copy">
              <h1>
                <span>{t.hb_title1}</span>
                <span>{t.hb_title2}</span>
              </h1>
              <p>{t.hb_sub}</p>
            </div>
            <div className="hero__card">
              <span className="kicker">{t.hb_coll}</span>
              <p>{t.hb_coll_body}</p>
              <Link to="/colecciones" className="btn btn-primary">
                {t.cta_explore}
              </Link>
            </div>
          </div>
        </section>

        <section className="tile tile--hero">
          <span className="kicker">{t.new}</span>
          <h2>Tad</h2>
          <p>{t.tad_sub}</p>
          <div className="tile__actions">
            <button type="button" className="btn btn-primary" onClick={() => navigate(`/producto/${FEATURED_PRODUCT}`)}>
              {t.more}
            </button>
            <button type="button" className="btn btn-secondary" onClick={openQuote}>
              {t.quote_link}
            </button>
          </div>
          <div className="tile__img tile__img--wide">
            <img src={HOME_IMAGES.heroTile} alt="Tad" loading="lazy" />
          </div>
        </section>

        <div className="tile-pair">
          {tiles.map(({ cat, sub }) => (
            <section key={cat.id} className="tile">
              <h2>{label(cat)}</h2>
              <p>{sub}</p>
              <div className="tile__links">
                <Link to={`/colecciones/${cat.id}`} className="link-accent">
                  {t.more} ›
                </Link>
                <button type="button" className="link-accent tile__link-btn" onClick={openQuote}>
                  {t.quote_link} ›
                </button>
              </div>
              <div className="tile__img">
                <img src={cat.img} alt={label(cat)} loading="lazy" />
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="container home-section">
        <div className="section-head">
          <h2>{t.cat_strip}</h2>
          <Link to="/colecciones" className="link-accent">
            {t.view_all} ›
          </Link>
        </div>
        <div className="cat-strip scroll-x">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="container home-section">
        <div className="section-head">
          <h2>{t.featured_title}</h2>
          <Link to="/colecciones/oficina" className="link-accent">
            {t.view_all} ›
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="estudio" className="container statement">
        <p>
          {t.statement} <span>{t.statement_body}</span>
        </p>
      </section>

      <section id="proyectos" className="container sectors">
        <h2>{t.sectors_title}</h2>
        <div className="sectors__grid">
          {t.sectors.map(([title, desc], i) => (
            <div key={title} className="sector">
              <span className="sector__num">{pad(i + 1)}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="close-wrap">
        <section className="close">
          <h2>{t.close_title}</h2>
          <button type="button" className="btn close__btn" onClick={openQuote}>
            {t.close_btn}
          </button>
        </section>
      </div>
    </>
  )
}

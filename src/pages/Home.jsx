import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, FEATURED_PRODUCT, FRAMES, HOME_IMAGES, UPHOLSTERIES, findCategory, pad } from '../data/catalog'
import { useCatalog } from '../context/catalog'
import { useLang } from '../context/lang'
import { useQuote } from '../context/quote'
import ProductCard from '../components/ProductCard'
import Lines from '../components/Lines'
import { rich } from '../lib/rich'
import useReveals from '../hooks/useReveals'
import { EASE, ScrollTrigger, finePointer, gsap, introDone, reducedMotion, useGSAP } from '../lib/motion'
import './Home.css'

const SECTOR_IMAGES = ['oficina', 'lounge', 'sofas', 'juntas']

export default function Home() {
  const { t, lang, label } = useLang()
  const { open: openQuote } = useQuote()
  const { featured } = useCatalog()
  const root = useRef(null)

  useReveals(root, [lang, featured.length])
  useHero(root)
  useManifesto(root, [lang])
  useCollectionsScroll(root)

  const heroFallback = (e) => {
    if (e.currentTarget.src !== HOME_IMAGES.heroFallback) e.currentTarget.src = HOME_IMAGES.heroFallback
  }

  const manifesto = `${t.statement} ${t.statement_body}`.split(' ')

  return (
    <div ref={root}>
      {/* — 1. Hero — */}
      <section className="hero dark">
        <div className="hero__media">
          <img className="hero__img" src={HOME_IMAGES.hero} onError={heroFallback} alt={t.hero_alt} fetchPriority="high" />
        </div>
        <span className="hero__shade" />
        <div className="hero__inner">
          <p className="caps kicker hero__kicker">{t.hero_kicker}</p>
          <h1 className="t-mega hero__title">
            <span className="mask">
              <span>{t.hero_l1}</span>
            </span>
            <span className="mask">
              <span className="hero__indent">{rich(t.hero_l2)}</span>
            </span>
          </h1>
          <div className="hero__foot">
            <p className="hero__body">{t.hero_body}</p>
            <Link to="/colecciones" className="link hero__cta">
              {t.hero_cta} <span className="arrow" />
            </Link>
          </div>
        </div>
        <div className="hero__scroll caps" aria-hidden="true">
          <span>{t.scroll}</span>
          <i />
        </div>
      </section>

      {/* — 2. Manifiesto — */}
      <section id="estudio" className="manifesto wrap">
        <p className="caps kicker muted" data-reveal="fade">
          {t.house}
        </p>
        <p className="manifesto__text">
          {manifesto.map((w, i) => (
            <span key={i} className="manifesto__word">
              {w}{' '}
            </span>
          ))}
        </p>
        <p className="manifesto__sign caps muted" data-reveal="fade">
          Hassman — {t.meta3}
        </p>
      </section>

      {/* — 3. Colecciones en desplazamiento horizontal — */}
      <section className="hs">
        <div className="hs__pin">
          <div className="hs__track">
            <div className="hs__intro">
              <p className="caps kicker muted">{t.coll_kicker}</p>
              <Lines className="t-display" lines={[t.coll_l1, rich(t.coll_l2)]} />
              <div className="hs__meta">
                <span className="numeral hs__count">{pad(CATEGORIES.length)}</span>
                <Link to="/colecciones" className="link">
                  {t.view_all} <span className="arrow" />
                </Link>
              </div>
            </div>
            {CATEGORIES.map((c, i) => (
              <Link key={c.id} to={`/colecciones/${c.id}`} className="hs__card" data-cursor={t.drag}>
                <div className="ph hs__img">
                  <img src={c.img} alt="" loading="lazy" />
                </div>
                <div className="hs__cap">
                  <span className="numeral">{pad(i + 1)}</span>
                  <span className="hs__name">{label(c)}</span>
                  <span className="caps muted hs__sub">{label(c.sub)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* — 4. Pieza insignia — */}
      <section className="feature wrap section">
        <div className="feature__media">
          <div className="ph feature__main" data-reveal="clip">
            <img src={HOME_IMAGES.heroTile} alt="Tad" loading="lazy" data-parallax="6" />
          </div>
          <div className="ph feature__inset" data-reveal="clip" data-delay="0.3">
            <img src={findCategory('oficina').img} alt="" loading="lazy" />
          </div>
        </div>
        <div className="feature__copy">
          <p className="caps kicker muted" data-reveal="fade">
            {t.tad_kicker}
          </p>
          <Lines className="t-display" lines={['Tad', rich(t.tad_l2)]} />
          <p className="t-lead" data-reveal="up">
            {t.tad_body}
          </p>
          <dl className="feature__facts" data-reveal="up" data-delay="0.1">
            <div>
              <dt className="numeral">{pad(FRAMES.length)}</dt>
              <dd className="caps muted">{t.frames_label}</dd>
            </div>
            <div>
              <dt className="numeral">{pad(UPHOLSTERIES.length)}</dt>
              <dd className="caps muted">{t.uphs_label}</dd>
            </div>
            <div>
              <dt className="numeral">∞</dt>
              <dd className="caps muted">{t.made_to_order}</dd>
            </div>
          </dl>
          <Link to={`/producto/${FEATURED_PRODUCT}`} className="link" data-reveal="up" data-delay="0.2">
            {t.tad_cta} <span className="arrow" />
          </Link>
        </div>
      </section>

      {/* — 5. La selección — */}
      <section className="selection wrap section">
        <header className="row-head">
          <div>
            <p className="caps kicker muted" data-reveal="fade">
              {t.sel_kicker}
            </p>
            <Lines className="t-title" lines={[t.sel_l1, rich(t.sel_l2)]} />
          </div>
          <Link to="/colecciones/oficina" className="link" data-reveal="fade">
            {t.view_all} <span className="arrow" />
          </Link>
        </header>
        <div className="grid-products">
          {featured.map((p, i) => (
            <div key={p.id} data-reveal="up" data-delay={(i % 4) * 0.1}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* — 6. Materia — */}
      <section className="matter dark">
        <div className="matter__copy">
          <p className="caps kicker muted" data-reveal="fade">
            {t.mat_kicker}
          </p>
          <Lines className="t-title" lines={[t.mat_l1, rich(t.mat_l2)]} />
          <p className="t-lead" data-reveal="up">
            {t.mat_body}
          </p>
          <div className="matter__lists" data-reveal="up" data-delay="0.1">
            <div>
              <p className="caps muted">{t.frames_label}</p>
              <ul className="matter__swatches">
                {FRAMES.map((f) => (
                  <li key={f.id}>
                    <span style={{ background: f.color }} />
                    {label(f)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="caps muted">{t.uphs_label}</p>
              <ul className="matter__words">
                {UPHOLSTERIES.map((u) => (
                  <li key={u.id}>{label(u)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="ph matter__img" data-reveal="clip">
          <img src={findCategory('lounge').img} alt="" loading="lazy" data-parallax="8" />
        </div>
      </section>

      {/* — 7. Proyectos — */}
      <Sectors />

      {/* — 8. Cita privada — */}
      <section className="visit dark">
        <div className="visit__bg">
          <img src={findCategory('juntas').img} alt="" loading="lazy" data-parallax="12" />
        </div>
        <span className="visit__shade" />
        <div className="visit__inner">
          <p className="caps kicker" data-reveal="fade">
            {t.visit_kicker}
          </p>
          <Lines className="t-display" lines={[t.visit_l1, rich(t.visit_l2)]} />
          <p className="t-lead" data-reveal="up">
            {t.visit_body}
          </p>
          <div className="visit__actions" data-reveal="up" data-delay="0.1">
            <button type="button" className="btn btn--light" onClick={openQuote}>
              {t.visit_cta}
            </button>
            <button type="button" className="btn btn--outline-light" onClick={openQuote}>
              {t.catalogue_cta}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Lista de sectores con una imagen que sigue al cursor.
function Sectors() {
  const { t } = useLang()
  const [hover, setHover] = useState(-1)
  const preview = useRef(null)
  const follow = useRef(null)

  useGSAP(() => {
    if (!finePointer() || reducedMotion()) return
    follow.current = {
      x: gsap.quickTo(preview.current, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(preview.current, 'y', { duration: 0.8, ease: 'power3.out' }),
    }
  })

  const move = (e) => {
    if (!follow.current) return
    follow.current.x(e.clientX)
    follow.current.y(e.clientY)
  }

  return (
    <section id="proyectos" className="sectors wrap section" onPointerMove={move} onPointerLeave={() => setHover(-1)}>
      <header className="row-head">
        <div>
          <p className="caps kicker muted" data-reveal="fade">
            {t.sectors_kicker}
          </p>
          <Lines className="t-title" lines={[t.sectors_title]} />
        </div>
      </header>
      <ol className="sectors__list">
        {t.sectors.map(([title, desc], i) => (
          <li key={title} className={`sector ${hover === i ? 'is-active' : ''} ${hover > -1 && hover !== i ? 'is-dim' : ''}`} onPointerEnter={() => setHover(i)} data-reveal="up">
            <span className="numeral sector__num">{pad(i + 1)}</span>
            <h3 className="sector__name">{title}</h3>
            <p className="sector__desc">{desc}</p>
          </li>
        ))}
      </ol>
      <div ref={preview} className={`sectors__preview ${hover > -1 ? 'is-on' : ''}`} aria-hidden="true">
        {SECTOR_IMAGES.map((id, i) => (
          <img key={id} src={findCategory(id).img} alt="" className={hover === i ? 'is-active' : ''} loading="lazy" />
        ))}
      </div>
    </section>
  )
}

// Entrada del hero (después de la intro) y parallax al salir.
function useHero(root) {
  useGSAP(
    () => {
      if (reducedMotion()) return
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } })
      tl.fromTo('.hero__img', { scale: 1.22 }, { scale: 1, duration: 3.2, ease: 'expo.out' })
        .from('.hero__title .mask > span', { yPercent: 115, duration: 1.8, stagger: 0.12 }, 0.2)
        .from('.hero__kicker, .hero__body, .hero__cta, .hero__scroll', { opacity: 0, y: 24, duration: 1.4, stagger: 0.1 }, 0.7)
      introDone.then(() => tl.play())

      gsap.to('.hero__media', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__inner', {
        yPercent: -12,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true },
      })
    },
    { scope: root },
  )
}

// El manifiesto se ilumina palabra por palabra al avanzar.
function useManifesto(root, deps) {
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.fromTo(
        '.manifesto__word',
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true } },
      )
    },
    { scope: root, dependencies: deps, revertOnUpdate: true },
  )
}

// Colecciones: en escritorio la sección se fija y el carril avanza en horizontal.
function useCollectionsScroll(root) {
  useGSAP(
    () => {
      if (reducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = root.current.querySelector('.hs__track')
        const distance = () => track.scrollWidth - window.innerWidth
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.hs',
            pin: '.hs__pin',
            start: 'top top',
            end: () => '+=' + distance(),
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        ScrollTrigger.refresh()
      })
      return () => mm.revert()
    },
    { scope: root },
  )
}

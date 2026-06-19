'use client'

import Image from 'next/image'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import styles from './FleetSection.module.css'

// ── Tune these without touching anything else ─────────────────────────────────
const FLIP_W_DESKTOP  = 300   // px — flip gallery width
const FLIP_H_DESKTOP  = 480   // px — flip gallery height
const AUTO_ADVANCE_MS = 4000  // ms — auto-flip idle interval
const FLIP_SPEED      = 650   // ms — single flip animation duration
// ─────────────────────────────────────────────────────────────────────────────

interface FlipImage {
  title: string
  url:   string
}

const FLEET_ASSETS: Array<{ images: FlipImage[]; available: boolean }> = [
  {
    available: true,
    images: [
      { title: 'Bruno Abbate Primatist',    url: '/images/ba-prima-1.webp' },
      { title: 'Bruno Abbate — Dettaglio',  url: '/images/ba-prima-2.webp' },
      { title: 'Bruno Abbate — Vista Lago', url: '/images/ba-prima-3.webp' },
    ],
  },
  {
    available: false,  // Cranchi Turchese — not yet in service
    images: [
      { title: 'Cranchi E26 Classic',  url: '/images/cranchi-e26-1.webp' },
      { title: 'Cranchi — Dettaglio',  url: '/images/cranchi-e26-2.webp' },
      { title: 'Cranchi — Vista Lago', url: '/images/cranchi-e26-3.webp' },
    ],
  },
  {
    available: true,  // Self drive — no license required
    images: [
      { title: 'Self Drive — Senza Patente', url: '/images/self-spec-4-v2.png' },
      { title: 'Self Drive — Dettaglio',     url: '/images/self-spec-2-v2.png' },
      { title: 'Self Drive — Vista Lago',    url: '/images/self-spec-3-v2.png' },
    ],
  },
]

// ── Flip animation keyframes ──────────────────────────────────────────────────

const FWD_TOP:    Keyframe[] = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
]
const FWD_BOTTOM: Keyframe[] = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' },
]
const REV_TOP:    Keyframe[] = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' },
]
const REV_BOTTOM: Keyframe[] = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
]

// ── Mobile carousel — editorial horizontal snap, touch-native ─────────────────

interface MobileCarouselProps {
  readonly boats: Array<{ productSrc: string; name: string; desc: string; available: boolean }>
  readonly cta: string
  readonly visible: boolean
  readonly notAvailableLabel: string
}

function MobileCarousel({ boats, cta, visible, notAvailableLabel }: MobileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef  = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const track  = trackRef.current
    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!track || !slides.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { root: track, threshold: 0.55 },
    )

    slides.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block:    'nearest',
      inline:   'start',
    })
  }

  return (
    <motion.div
      className={styles.carousel}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.carouselTrack} ref={trackRef}>
        {boats.map((boat, i) => (
          <div
            key={boat.productSrc}
            ref={(el) => { slideRefs.current[i] = el }}
            className={`${styles.slide} ${i === activeIndex ? styles.slideActive : ''} ${!boat.available ? styles.slideUnavailable : ''}`}
          >
            {!boat.available && (
              <div className={styles.slideOverlay}>
                <span className={styles.slideOverlayLabel}>{notAvailableLabel}</span>
              </div>
            )}
            <div className={styles.slideIndex}>
              <span className={styles.slideNum}>0{i + 1}</span>
              <span className={styles.slideRule} />
              <span className={styles.slideTotal}>0{boats.length}</span>
            </div>
            <div className={styles.slideImageWrap}>
              <Image
                src={boat.productSrc}
                alt={`${boat.name} — barca di lusso flotta 4M Lago di Como`}
                width={360}
                height={280}
                sizes="(max-width: 768px) 78vw, 360px"
                quality={75}
                className={styles.slideImage}
                priority={i === 0}
              />
            </div>
            <div className={styles.slideContent}>
              <div className={styles.slideGoldBar} />
              <h3 className={styles.slideName}>{boat.name}</h3>
              <p className={styles.slideDesc}>{boat.desc}</p>
              {boat.available && (
                <a href="#contact" className={styles.slideCta}>{cta}</a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.carouselDots}>
        {boats.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => scrollToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ── Desktop: Flip Gallery ─────────────────────────────────────────────────────

interface FlipGalleryProps {
  images:      FlipImage[]
  vesselIndex: number
  timerKey:    number
  onManualFlip: () => void
}

function FlipGallery({ images, vesselIndex, timerKey, onManualFlip }: FlipGalleryProps) {
  const topRef           = useRef<HTMLDivElement>(null)
  const bottomRef        = useRef<HTMLDivElement>(null)
  const overlayTopRef    = useRef<HTMLDivElement>(null)
  const overlayBottomRef = useRef<HTMLDivElement>(null)

  const currentIdxRef = useRef(0)
  const isHovering    = useRef(false)

  const [displayIndex, setDisplayIndex] = useState(0)
  const [currentTitle, setCurrentTitle] = useState(images[0]?.title ?? '')
  const [titleVisible, setTitleVisible] = useState(true)

  // Preload all images for the active vessel
  useEffect(() => {
    images.forEach((img) => {
      const preload = new window.Image()
      preload.src = img.url
    })
  }, [images])

  const setPanelBg = useCallback((url: string) => {
    ;[topRef, bottomRef, overlayTopRef, overlayBottomRef].forEach((ref) => {
      if (ref.current) ref.current.style.backgroundImage = `url('${url}')`
    })
  }, [])

  // Reset on vessel switch
  useEffect(() => {
    currentIdxRef.current = 0
    setDisplayIndex(0)
    setCurrentTitle(images[0]?.title ?? '')
    setTitleVisible(true)
    setPanelBg(images[0]?.url ?? '')
  // vesselIndex change is the intentional trigger; images updates alongside it
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselIndex])

  const goTo = useCallback((nextIdx: number, reverse: boolean) => {
    if (!overlayTopRef.current || !overlayBottomRef.current) return

    const timing: KeyframeAnimationOptions = { duration: FLIP_SPEED, iterations: 1 }
    overlayTopRef.current.animate(reverse ? REV_TOP : FWD_TOP, timing)
    overlayBottomRef.current.animate(reverse ? REV_BOTTOM : FWD_BOTTOM, timing)

    setTitleVisible(false)

    const nextUrl = images[nextIdx].url
    // Delay order: [top, bottom, overlayTop, overlayBottom]
    const delays = reverse
      ? [FLIP_SPEED - 200, 0, 0, FLIP_SPEED - 200]
      : [0, FLIP_SPEED - 200, FLIP_SPEED - 200, 0]

    ;[topRef, bottomRef, overlayTopRef, overlayBottomRef].forEach((ref, i) => {
      setTimeout(() => {
        if (ref.current) ref.current.style.backgroundImage = `url('${nextUrl}')`
      }, delays[i])
    })

    setTimeout(() => {
      setCurrentTitle(images[nextIdx].title)
      setTitleVisible(true)
    }, FLIP_SPEED * 0.5)

    currentIdxRef.current = nextIdx
    setDisplayIndex(nextIdx)
  }, [images])

  // Auto-advance — restarts on timerKey bump (manual flip or vessel change)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering.current) {
        const next = (currentIdxRef.current + 1) % images.length
        goTo(next, false)
      }
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(interval)
  }, [goTo, images.length, timerKey])

  const handleNav = (inc: number) => {
    const next = (currentIdxRef.current + inc + images.length) % images.length
    goTo(next, inc < 0)
    onManualFlip()
  }

  return (
    <div
      className={styles.flipWrap}
      style={{ '--flip-w': `${FLIP_W_DESKTOP}px`, '--flip-h': `${FLIP_H_DESKTOP}px` } as React.CSSProperties}
      onMouseEnter={() => { isHovering.current = true }}
      onMouseLeave={() => { isHovering.current = false }}
    >
      <div className={styles.flipBorder}>
        <div className={styles.flipGallery}>
          <div ref={topRef}           className={`${styles.flipPanel} ${styles.flipTop}`} />
          <div ref={bottomRef}        className={`${styles.flipPanel} ${styles.flipBottom}`} />
          <div ref={overlayTopRef}    className={`${styles.flipPanel} ${styles.flipOverlayTop}`} />
          <div ref={overlayBottomRef} className={`${styles.flipPanel} ${styles.flipOverlayBottom}`} />
        </div>
      </div>

      <div className={styles.flipFooter}>
        <motion.span
          className={styles.flipTitle}
          animate={{ opacity: titleVisible ? 0.6 : 0, y: titleVisible ? 0 : -6 }}
          transition={{ duration: 0.38, ease: 'easeInOut' }}
        >
          {currentTitle}
        </motion.span>
        <div className={styles.flipNav}>
          <button type="button" onClick={() => handleNav(-1)} className={styles.flipNavBtn} aria-label="Previous image">‹</button>
          <div className={styles.flipDots}>
            {images.map((_, i) => (
              <span
                key={i}
                className={`${styles.flipDot} ${i === displayIndex ? styles.flipDotActive : ''}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => handleNav(1)} className={styles.flipNavBtn} aria-label="Next image">›</button>
        </div>
      </div>
    </div>
  )
}

// ── Desktop: vessel selector + gallery + description ──────────────────────────

interface DesktopBoat {
  productSrc: string  // = images[0].url — used by mobile carousel
  images:     FlipImage[]
  name:       string
  desc:       string
  available:  boolean
}

interface DesktopFleetProps {
  readonly boats:             DesktopBoat[]
  readonly cta:               string
  readonly visible:           boolean
  readonly notAvailableLabel: string
}

function DesktopFleet({ boats, cta, visible, notAvailableLabel }: DesktopFleetProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [timerKey,  setTimerKey]  = useState(0)

  const switchVessel = (idx: number) => {
    if (!boats[idx].available) return
    setActiveIdx(idx)
    setTimerKey((k) => k + 1)
  }

  return (
    <motion.div
      className={styles.desktopFleet}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Vessel selector */}
      <nav className={styles.vesselNav} aria-label="Select vessel">
        {boats.map((boat, i) => (
          <button
            key={i}
            type="button"
            onClick={() => switchVessel(i)}
            className={`${styles.vesselTab} ${i === activeIdx ? styles.vesselTabActive : ''} ${!boat.available ? styles.vesselTabDisabled : ''}`}
            aria-current={i === activeIdx ? 'true' : undefined}
            aria-disabled={!boat.available ? 'true' : undefined}
          >
            <span className={styles.vesselTabNum}>0{i + 1}</span>
            <span className={styles.vesselTabName}>{boat.name}</span>
            {!boat.available && (
              <span className={styles.vesselTabBadge}>{notAvailableLabel}</span>
            )}
            <span className={styles.vesselTabBar} aria-hidden="true" />
          </button>
        ))}
      </nav>

      {/* Flip gallery */}
      <FlipGallery
        images={boats[activeIdx].images}
        vesselIndex={activeIdx}
        timerKey={timerKey}
        onManualFlip={() => setTimerKey((k) => k + 1)}
      />

      {/* Vessel description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          className={styles.vesselInfo}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.vesselInfoTag}>La Flotta</p>
          <h3 className={styles.vesselInfoName}>{boats[activeIdx].name}</h3>
          <p className={styles.vesselInfoDesc}>{boats[activeIdx].desc}</p>
          <a href="#contact" className={styles.vesselInfoCta}>{cta}</a>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function FleetSection() {
  const { t } = useLang()
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const isHeaderVisible = useInView(headerRef, { once: true, margin: '-80px' })
  const isGridVisible   = useInView(gridRef,   { once: true, margin: '-60px' })

  const f = t.fleet

  const boats: DesktopBoat[] = FLEET_ASSETS.map((a, i) => ({
    productSrc: a.images[0].url,  // mobile carousel uses first image
    images:     a.images,
    name:       f.boats[i].name,
    desc:       f.boats[i].desc,
    available:  a.available,
  }))

  return (
    <section id="fleet" className={styles.section}>
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 28 }}
        animate={isHeaderVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={styles.header}
      >
        <p className={styles.eyebrow}>{f.eyebrow}</p>
        <div className={styles.goldLine} />
        <h2 className={styles.title}>{f.title}</h2>
      </motion.div>

      <div ref={gridRef} className={styles.fleetSentinel}>
        {/* Mobile / touch tablet: editorial snap carousel */}
        <MobileCarousel boats={boats} cta={f.all_packages} visible={isGridVisible} notAvailableLabel={f.not_available} />

        {/* Desktop: flip gallery + vessel selector + description */}
        <DesktopFleet boats={boats} cta={f.all_packages} visible={isGridVisible} notAvailableLabel={f.not_available} />
      </div>
    </section>
  )
}

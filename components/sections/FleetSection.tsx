'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import styles from './FleetSection.module.css'

// ── Tune these to resize the boat image without touching anything else ──────
const PRODUCT_IMG_H_MOBILE  = 340  // px — mobile static display
const PRODUCT_IMG_H_DEFAULT = 100  // px — desktop collapsed (before hover)
const PRODUCT_IMG_H_HOVER   = 200  // px — desktop expanded (on hover)
// ────────────────────────────────────────────────────────────────────────────

const FLEET_ASSETS = [
  { logoSrc: '/images/boat-1.png', productSrc: '/images/boat-1.png' },
  { logoSrc: '/images/boat-2.png', productSrc: '/images/boat-2.png' },
]

// ── Mobile carousel — editorial horizontal snap, touch-native ───────────────

interface MobileCarouselProps {
  readonly boats: Array<{ logoSrc: string; productSrc: string; name: string; desc: string }>
  readonly cta: string
  readonly visible: boolean
}

function MobileCarousel({ boats, cta, visible }: MobileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const track = trackRef.current
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
      { root: track, threshold: 0.55 }
    )

    slides.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
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
            className={`${styles.slide} ${i === activeIndex ? styles.slideActive : ''}`}
          >
            {/* Index counter */}
            <div className={styles.slideIndex}>
              <span className={styles.slideNum}>0{i + 1}</span>
              <span className={styles.slideRule} />
              <span className={styles.slideTotal}>0{boats.length}</span>
            </div>

            {/* Hero boat image */}
            <div className={styles.slideImageWrap}>
              <Image
                src={boat.productSrc}
                alt={`${boat.name} — luxury boat Lake Como`}
                width={360}
                height={280}
                className={styles.slideImage}
                priority={i === 0}
              />
            </div>

            {/* Editorial content */}
            <div className={styles.slideContent}>
              <div className={styles.slideGoldBar} />
              <h2 className={styles.slideName}>{boat.name}</h2>
              <p className={styles.slideDesc}>{boat.desc}</p>
              <a href="#contact" className={styles.slideCta}>{cta}</a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
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

// ── Desktop card ─────────────────────────────────────────────────────────────

interface FleetCardProps {
  readonly logoSrc: string
  readonly productSrc: string
  readonly name: string
  readonly desc: string
  readonly cta: string
  readonly index: number
  readonly visible: boolean
}

function FleetCard({ logoSrc, productSrc, name, desc, cta, index, visible }: FleetCardProps) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.9, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        '--product-h-mobile':  `${PRODUCT_IMG_H_MOBILE}px`,
        '--product-h-default': `${PRODUCT_IMG_H_DEFAULT}px`,
        '--product-h-hover':   `${PRODUCT_IMG_H_HOVER}px`,
      } as React.CSSProperties}
    >
      {/* Circle background + logo */}
      <div className={styles.circle}>
        <Image
          src={logoSrc}
          alt={name}
          width={200}
          height={200}
          className={styles.logo}
          priority={index === 0}
        />
      </div>

      {/* Boat / product image — floats on hover */}
      <Image
        src={productSrc}
        alt={`${name} — Luxury Lake Como boat`}
        width={400}
        height={600}
        className={styles.productImg}
        priority={index === 0}
      />

      {/* Text content */}
      <div className={styles.content}>
        <h2 className={styles.contentTitle}>{name}</h2>
        <p className={styles.contentDesc}>{desc}</p>
      </div>
    </motion.div>
  )
}

export default function FleetSection() {
  const { t } = useLang()
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isHeaderVisible = useInView(headerRef, { once: true, margin: '-80px' })
  const isGridVisible = useInView(gridRef, { once: true, margin: '-60px' })

  const f = t.fleet

  return (
    <section id="fleet" className={styles.section}>
      {/* Section header */}
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

      {/* Sentinel: always in DOM, drives InView for both mobile and desktop */}
      <div ref={gridRef} className={styles.fleetSentinel}>
        {/* Mobile/tablet: editorial snap carousel */}
        <MobileCarousel
          boats={FLEET_ASSETS.map((a, i) => ({
            logoSrc: a.logoSrc,
            productSrc: a.productSrc,
            name: f.boats[i].name,
            desc: f.boats[i].desc,
          }))}
          cta={f.all_packages}
          visible={isGridVisible}
        />

        {/* Desktop: cinematic hover cards */}
        <div className={styles.grid}>
          {FLEET_ASSETS.map((asset, i) => (
            <FleetCard
              key={asset.logoSrc}
              logoSrc={asset.logoSrc}
              productSrc={asset.productSrc}
              name={f.boats[i].name}
              desc={f.boats[i].desc}
              cta={f.all_packages}
              index={i}
              visible={isGridVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

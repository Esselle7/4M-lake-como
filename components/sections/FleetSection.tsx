'use client'

import Image from 'next/image'
import { useRef } from 'react'
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

      {/* Fleet cards */}
      <div ref={gridRef} className={styles.grid}>
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
    </section>
  )
}

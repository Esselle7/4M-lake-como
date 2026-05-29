'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import clsx from 'clsx'

interface PackageItem {
  id: string
  name: string
  type: string
  duration_label: string
  price: number
  image: string
  desc: string
  includes: string
}

interface CardLabels {
  from: string
  currency: string
  per_boat: string
  duration_label: string
  includes_label: string
  book_cta: string
  standard_label: string
  premium_label: string
}

const CARD_GRADIENTS = [
  'linear-gradient(160deg, #0D2137 0%, #1A4060 60%, #0D3252 100%)',
  'linear-gradient(160deg, #1A2F1A 0%, #1A3520 60%, #0F2A0F 100%)',
  'linear-gradient(160deg, #2A1A0D 0%, #3A2510 60%, #1F1505 100%)',
  'linear-gradient(160deg, #1A0D2A 0%, #2A1540 60%, #100820 100%)',
  'linear-gradient(160deg, #0A1628 0%, #1A2F4E 50%, #0D2040 100%)',
  'linear-gradient(160deg, #1C0F0A 0%, #3D2010 50%, #1C0F0A 100%)',
]

function PackageCard({ pkg, index, labels, compact = false }: { pkg: PackageItem; index: number; labels: CardLabels; compact?: boolean }) {
  const isPremium = pkg.type === 'premium'
  const router = useRouter()

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-2xl flex flex-col',
        /* compact: width controlled by parent wrapper; desktop: fixed widths */
        compact ? 'w-full h-full' : 'flex-shrink-0 w-[320px] md:w-[360px]'
      )}
      style={{ background: CARD_GRADIENTS[index % CARD_GRADIENTS.length] }}
    >
      {/* Decorative corner — luxury editorial mark */}
      {compact && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: 16, height: 16,
            borderTop: '1.5px solid rgba(201,169,110,0.5)',
            borderRight: '1.5px solid rgba(201,169,110,0.5)',
            pointerEvents: 'none', zIndex: 2,
          }}
        />
      )}

      {/* Image area */}
      <div className={clsx('relative overflow-hidden flex-shrink-0', compact ? 'h-32' : 'h-48')}>
        {/* Image — saturated, punchy, no grey veil */}
        <NextImage
          src={`/images/${pkg.image}`}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 78vw, 360px"
          quality={85}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'saturate(1.32) contrast(1.09) brightness(1.06)' }}
        />
        {/* Cinematic warm screen — adds golden shimmer to highlights, never darkens */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(155deg, rgba(255,210,100,0.09) 0%, rgba(80,160,255,0.05) 55%, transparent 100%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Bottom vignette — only for badge legibility, transparent in upper 60% */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.10) 38%, transparent 62%)' }}
        />
        {/* Badge — above all overlays */}
        <div className="absolute inset-0 flex items-end p-3">
          <span
            className={clsx(
              'px-2.5 py-1 rounded-full text-[9px] tracking-widest uppercase',
              isPremium
                ? 'bg-gold text-navy font-semibold shadow-sm'
                : 'border border-white/30 text-white/85 backdrop-blur-sm'
            )}
            style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em' }}
          >
            {isPremium ? labels.premium_label : labels.standard_label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={clsx('flex flex-col flex-1', compact ? 'p-4' : 'p-6')}>
        {/* Duration */}
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-3 h-3 text-gold/50 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3.5l2 1.5" strokeLinecap="round" />
          </svg>
          <span
            className="text-gold/50 uppercase"
            style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.5625rem', letterSpacing: '0.2em' }}
          >
            {labels.duration_label} · {pkg.duration_label}
          </span>
        </div>

        {/* Gold bar — editorial accent */}
        {compact && (
          <div style={{ width: 24, height: 1.5, background: 'linear-gradient(90deg,#C9A96E,rgba(201,169,110,0.2))', marginBottom: '0.5rem' }} />
        )}

        {/* Name */}
        <h3
          className="text-white"
          style={{
            fontFamily: 'Bodoni Moda, serif',
            fontSize: compact ? '1.125rem' : '1.375rem',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.15,
            marginBottom: compact ? '0.375rem' : '0.625rem',
          }}
        >
          {pkg.name}
        </h3>

        {/* Description */}
        <p
          className="flex-1"
          style={{
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
            fontSize: compact ? '0.75rem' : '0.875rem',
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.6,
            marginBottom: compact ? '0.75rem' : '1rem',
          }}
        >
          {pkg.desc}
        </p>

        {/* Includes */}
        <div style={{ marginBottom: compact ? '0.75rem' : '1.25rem', paddingBottom: compact ? '0.75rem' : '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>
            {labels.includes_label}
          </p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>
            {pkg.includes}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.625rem', color: 'rgba(255,255,255,0.28)' }}>
              {labels.from}
            </span>
            <div>
              <span
                className="text-gold"
                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: compact ? '1.375rem' : '1.75rem', fontWeight: 400 }}
              >
                {labels.currency}{pkg.price}
              </span>
            </div>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)' }}>
              {labels.per_boat}
            </span>
          </div>
          <LiquidGlassButton
            variant="light"
            size="sm"
            onClick={() => router.push('/booking')}
          >
            {labels.book_cta}
          </LiquidGlassButton>
        </div>
      </div>
    </div>
  )
}

// ── Mobile snap carousel — centered cards with edge breathing room ────────────

function MobilePackagesCarousel({
  packages,
  labels,
  visible,
}: {
  packages: PackageItem[]
  labels: CardLabels
  visible: boolean
}) {
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
      { root: track, threshold: 0.6 }
    )
    slides.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  /* 78vw card with 11vw padding on each side = centered first/last card */
  const SIDE_PAD = 'calc((100vw - 78vw) / 2)'

  return (
    <motion.div
      className="md:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Scroll track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
          gap: '0.875rem',
          paddingLeft: SIDE_PAD,
          paddingRight: SIDE_PAD,
          scrollPaddingLeft: SIDE_PAD,
          paddingTop: '0.5rem',
          paddingBottom: '1.75rem',
        }}
      >
        {packages.map((pkg, i) => (
          <div
            key={pkg.id}
            ref={(el) => { slideRefs.current[i] = el }}
            style={{
              flexShrink: 0,
              width: '78vw',
              scrollSnapAlign: 'center',
              transform: i === activeIndex ? 'scale(1)' : 'scale(0.955)',
              transition: 'transform 0.42s cubic-bezier(0.4,0,0.2,1), box-shadow 0.42s ease',
              boxShadow: i === activeIndex
                ? '0 20px 60px rgba(0,0,0,0.38), 0 0 0 1px rgba(201,169,110,0.15)'
                : '0 8px 24px rgba(0,0,0,0.2)',
              borderRadius: '1rem',
              willChange: 'transform',
            }}
          >
            <PackageCard pkg={pkg} index={i} labels={labels} compact />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem' }}>
        {packages.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            aria-label={`Vai alla card ${i + 1}`}
            style={{
              width: i === activeIndex ? 22 : 6,
              height: 6,
              borderRadius: i === activeIndex ? 3 : '50%',
              background: i === activeIndex ? '#C9A96E' : 'rgba(201,169,110,0.22)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, border-radius 0.35s ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function PackagesSection() {
  const { t } = useLang()
  const [paused, setPaused] = useState(false)
  const [isDraggingUI, setIsDraggingUI] = useState(false)
  const [animDelay, setAnimDelay] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' })

  // Drag-to-scroll refs (no re-renders during drag)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartScrollX = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !trackRef.current) return
      const el = trackRef.current
      const halfWidth = el.scrollWidth / 2
      const newX = Math.max(-halfWidth, Math.min(0, dragStartScrollX.current + e.clientX - dragStartX.current))
      el.style.transform = `translateX(${newX}px)`
    }

    const onMouseUp = () => {
      if (!isDragging.current || !trackRef.current) return
      const el = trackRef.current
      isDragging.current = false
      setIsDraggingUI(false)

      const matrix = new DOMMatrix(window.getComputedStyle(el).transform)
      const currentX = matrix.m41
      const halfWidth = el.scrollWidth / 2
      const delay = (Math.abs(currentX) / halfWidth) * 52

      // Restart animation from current drag position
      el.style.transform = ''
      el.style.animation = 'none'
      void el.offsetWidth // force reflow so browser treats next assignment as a new animation
      el.style.animation = 'pkgMarquee 52s linear infinite'
      el.style.animationDelay = `-${delay}s`
      el.style.animationPlayState = pausedRef.current ? 'paused' : 'running'

      setAnimDelay(delay)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Skip drag on interactive elements so buttons remain clickable
    if ((e.target as HTMLElement).closest('button, a')) return
    const el = trackRef.current
    if (!el) return

    // Capture current animated position before freezing
    const matrix = new DOMMatrix(window.getComputedStyle(el).transform)
    const currentX = matrix.m41

    isDragging.current = true
    dragStartX.current = e.clientX
    dragStartScrollX.current = currentX
    setIsDraggingUI(true)

    el.style.animation = 'none'
    el.style.transform = `translateX(${currentX}px)`
    e.preventDefault()
  }

  const p = t.packages
  const packages = p.items as PackageItem[]
  // Two copies for seamless loop: translateX(-50%) = exactly one copy width
  const doubled = [...packages, ...packages]

  const labels: CardLabels = {
    from: p.from,
    currency: p.currency,
    per_boat: p.per_boat,
    duration_label: p.duration_label,
    includes_label: p.includes_label,
    book_cta: p.book_cta,
    standard_label: p.standard_label,
    premium_label: p.premium_label,
  }

  return (
    <section
      id="packages"
      className="py-28 md:py-40"
      style={{ background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F0E8 100%)' }}
    >
      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 28 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-14 px-6"
      >
        <p className="eyebrow text-gold mb-3">{p.eyebrow}</p>
        <div className="gold-line mx-auto mb-5" />
        <h2 className="display-md text-navy mb-3">{p.title}</h2>
        <p
          className="text-navy/45 text-base"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
        >
          {p.subtitle}
        </p>
      </motion.div>

      {/* ── Mobile: centered snap carousel ── */}
      <MobilePackagesCarousel
        packages={packages}
        labels={labels}
        visible={isHeaderInView}
      />

      {/* ── Desktop: auto-scrolling marquee ── */}
      <div
        className="hidden md:block relative overflow-hidden"
        style={{ cursor: isDraggingUI ? 'grabbing' : 'grab' }}
        onMouseEnter={() => { setPaused(true); pausedRef.current = true }}
        onMouseLeave={() => { setPaused(false); pausedRef.current = false }}
        onMouseDown={handleMouseDown}
        aria-label="Auto-scrolling package list — drag to scroll, hover to pause"
      >
        {/* Left edge fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 inset-y-0 w-24 md:w-40 z-10"
          style={{ background: 'linear-gradient(to right, #FAFAF8, transparent)' }}
        />
        {/* Right edge fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 inset-y-0 w-24 md:w-40 z-10"
          style={{ background: 'linear-gradient(to left, #F5F0E8, transparent)' }}
        />

        {/* Scrolling track — contains 2× cards for seamless loop */}
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 py-4"
          style={{
            width: 'max-content',
            animation: 'pkgMarquee 52s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
            animationDelay: `-${animDelay}s`,
          }}
          aria-hidden="true"
        >
          {doubled.map((pkg, i) => (
            <PackageCard
              key={`${pkg.id}-${i}`}
              pkg={pkg}
              index={i % packages.length}
              labels={labels}
            />
          ))}
        </div>
      </div>

      {/* Pause hint — desktop only */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="hidden md:block text-center text-navy/30 text-[9px] tracking-widest uppercase mt-8"
        style={{ fontFamily: 'Jost, sans-serif' }}
      >
        {isDraggingUI ? '← Drag →' : paused ? '⏸ Paused' : '↔ Drag or hover to pause'}
      </motion.p>
    </section>
  )
}

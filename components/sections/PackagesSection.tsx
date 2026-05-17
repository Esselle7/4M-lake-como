'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import { useRouter } from 'next/navigation'
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

function PackageCard({ pkg, index, labels }: { pkg: PackageItem; index: number; labels: CardLabels }) {
  const isPremium = pkg.type === 'premium'
  const router = useRouter()

  return (
    <div
      className="relative flex-shrink-0 w-[320px] md:w-[360px] overflow-hidden rounded-2xl flex flex-col"
      style={{ background: CARD_GRADIENTS[index % CARD_GRADIENTS.length] }}
    >
      {/* Image placeholder */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {/*
          📸 PLACEHOLDER: {pkg.image}
          Inserisci: /public/images/{pkg.image}
        */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-end p-4">
          <span
            className={clsx(
              'px-2.5 py-1 rounded-full text-[9px] tracking-widest uppercase',
              isPremium
                ? 'bg-gold text-navy font-semibold'
                : 'border border-white/25 text-white/75'
            )}
            style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em' }}
          >
            {isPremium ? labels.premium_label : labels.standard_label}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <svg className="w-3 h-3 text-gold/60 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3.5l2 1.5" strokeLinecap="round" />
          </svg>
          <span className="text-gold/60 text-[10px] tracking-widest uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
            {labels.duration_label} · {pkg.duration_label}
          </span>
        </div>

        <h3
          className="text-white mb-2.5"
          style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.375rem', fontWeight: 400, fontStyle: 'italic' }}
        >
          {pkg.name}
        </h3>

        <p
          className="text-white/50 text-sm leading-relaxed mb-4 flex-1"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
        >
          {pkg.desc}
        </p>

        <div className="mb-5 pb-4 border-b border-white/10">
          <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>
            {labels.includes_label}
          </p>
          <p className="text-white/55 text-xs" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            {pkg.includes}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-white/30 text-[10px]" style={{ fontFamily: 'Jost, sans-serif' }}>
              {labels.from}
            </span>
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-gold"
                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.75rem', fontWeight: 400 }}
              >
                {labels.currency}{pkg.price}
              </span>
            </div>
            <span className="text-white/25 text-[9px] uppercase tracking-wide" style={{ fontFamily: 'Jost, sans-serif' }}>
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
      className="py-28 md:py-40 overflow-hidden"
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

      {/* ── Marquee ── */}
      <div
        className="relative overflow-hidden"
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

      {/* Pause hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center text-navy/30 text-[9px] tracking-widest uppercase mt-8"
        style={{ fontFamily: 'Jost, sans-serif' }}
      >
        {isDraggingUI ? '← Drag →' : paused ? '⏸ Paused' : '↔ Drag or hover to pause'}
      </motion.p>
    </section>
  )
}

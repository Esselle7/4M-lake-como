'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import { scrollToSection } from '@/hooks/useLenis'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HeroSection() {
  const { t } = useLang()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()

  /* Parallax: bg moves at 20% of scroll speed (window effect) */
  const bgY = useTransform(scrollY, [0, 800], [0, -160])
  /* Title floats up at 60% of scroll speed */
  const titleY = useTransform(scrollY, [0, 800], [0, -480])
  const titleOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const h = t.hero

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
    >
      {/* ─── Background parallax layer ─── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 will-change-transform"
      >
        {/* Sfondo con Immagine Next.js */}
        <div className="absolute inset-0 scale-[1.15]">
          <Image
            src="/images/hero-bg.webp"
            alt="Tour privato in barca sul Lago di Como — 4M Luxury Boats"
            fill
            priority
            sizes="100vw"
            quality={80}
            fetchPriority="high"
            className="object-cover"
          />
        </div>
        {/* Water shimmer layers */}
        <div className="absolute inset-0 overflow-hidden opacity-25">
          <div
            className="water-wave absolute bottom-0 left-0 right-0 h-48"
            style={{ background: 'linear-gradient(transparent, rgba(26, 159, 220, 0.15))' }}
          />
          <div
            className="water-wave-2 absolute bottom-12 left-0 right-0 h-32"
            style={{ background: 'linear-gradient(transparent, rgba(13, 100, 160, 0.12))' }}
          />
          <div
            className="water-wave-3 absolute bottom-24 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(transparent, rgba(201, 169, 110, 0.08))' }}
          />
        </div>
        {/* Vignette gradient over background */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/20 to-navy/70" />
      </motion.div>

      {/* ─── Foreground: text content ─── */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto will-change-transform"
      >

        {/* Main headline — each line staggers in */}
        <div className="overflow-hidden mb-6">
          {/* H1 semantico per SEO/a11y — una sola occorrenza per pagina */}
          <h1 className="sr-only">{[h.headline_1, h.headline_2, h.headline_3].join(' ')}</h1>
          {[h.headline_1, h.headline_2, h.headline_3].map((line, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              initial={{ y: '120%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl text-white block"
              style={{ lineHeight: i === 1 ? 1.05 : 1.0 }}
            >
              {i === 1 ? <em>{line}</em> : line}
            </motion.div>
          ))}
        </div>

        {/* Gold line below headline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="gold-line mx-auto mb-8"
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-white/65 text-lg max-w-xl mx-auto mb-12"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, letterSpacing: '0.03em' }}
        >
          {h.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <LiquidGlassButton
            variant="gold"
            size="lg"
            onClick={() => router.push('/booking')}
          >
            {h.cta_primary}
          </LiquidGlassButton>
          <LiquidGlassButton
            variant="light"
            size="lg"
            onClick={() => scrollToSection('packages')}
          >
            {h.cta_secondary}
          </LiquidGlassButton>
        </motion.div>
      </motion.div>

      
    </section>
  )
}

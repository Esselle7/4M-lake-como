'use client'

// ─────────────────────────────────────────────────────────────────────────────
// IsolaComacinaBanner — home teaser for the limited Isola Comacina fireworks package.
// ISOLA COMACINA EVENT (remove after 2026-06-27)
// ─────────────────────────────────────────────────────────────────────────────
// Placed between HeroSection and HowItWorks on the home page.
// Fireworks canvas backdrop + real-time countdown + CTA to /book-isola-comacina.

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import FireworksCanvas from './FireworksCanvas'
import IsolaComacinaCountdown from './IsolaComacinaCountdown'

export default function IsolaComacinaBanner() {
  const { t } = useLang()
  const bl = t.isola_comacina
  const router = useRouter()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      aria-labelledby="isola-comacina-banner-title"
      className="relative overflow-hidden"
      style={{ background: '#07101E' }}
    >
      {/* ── Wallpaper image (bellagio-fire.jpg) ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/bellagio-fire.jpg"
          alt="Fuochi d'artificio a Isola Comacina sul Lago di Como"
          fill
          sizes="100vw"
          quality={75}
          className="object-cover"
        />
        {/* Dark gradient for legibility — heavier at the bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy/85" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,16,30,0.5) 100%)' }}
        />
      </div>

      {/* ── Fireworks particle overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-90">
        <FireworksCanvas density={0.9} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-gold tracking-[0.2em] uppercase mb-5"
          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6875rem', fontWeight: 600 }}
        >
          {bl.banner_eyebrow}
        </motion.p>

        <motion.h2
          id="isola-comacina-banner-title"
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-white mb-4"
          style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(2.25rem, 6vw, 4rem)', fontWeight: 400, lineHeight: 1.05, fontStyle: 'italic' }}
        >
          {bl.banner_title}
        </motion.h2>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="gold-line mx-auto mb-7"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/65 max-w-xl mx-auto mb-10"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.7 }}
        >
          {bl.banner_desc}
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mb-10"
        >
          <IsolaComacinaCountdown variant="banner" />
        </motion.div>

        {/* CTA + note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <LiquidGlassButton
            variant="gold"
            size="lg"
            onClick={() => router.push('/book-isola-comacina')}
          >
            {bl.banner_cta}
          </LiquidGlassButton>
          <p
            className="text-gold/55 flex items-center gap-1.5"
            style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.08em' }}
          >
            <span className="text-gold/80">✦</span>
            {bl.banner_note}
          </p>
        </motion.div>
      </div>

      {/* Bottom fade into next (light) section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white-warm/95 pointer-events-none" />
    </section>
  )
}

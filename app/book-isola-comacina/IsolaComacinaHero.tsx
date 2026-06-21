'use client'

// ─────────────────────────────────────────────────────────────────────────────
// IsolaComacinaHero — full-width wallpaper hero for /book-isola-comacina.
// ISOLA COMACINA EVENT (remove after 2026-06-27)
// ─────────────────────────────────────────────────────────────────────────────
// Takes the top ~half of the viewport. bellagio-fire.jpg as background with
// fireworks canvas overlay + event headline + real-time countdown.

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import FireworksCanvas from '@/components/isola-comacina/FireworksCanvas'
import IsolaComacinaCountdown from '@/components/isola-comacina/IsolaComacinaCountdown'

export default function IsolaComacinaHero() {
  const { t } = useLang()
  const bl = t.isola_comacina

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '60vh' }}>
      {/* ── Wallpaper ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/bellagio-fire.jpg"
          alt="Fuochi d'artificio a Isola Comacina sul Lago di Como"
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
        />
        {/* Gradient for legibility — heavier at bottom for the content fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/35 to-white-warm" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, transparent 25%, rgba(7,16,30,0.45) 100%)' }}
        />
      </div>

      {/* ── Fireworks overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-85">
        <FireworksCanvas density={1} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 min-h-[60vh]">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-gold tracking-[0.22em] uppercase mb-5"
          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6875rem', fontWeight: 600 }}
        >
          {bl.page_eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-white"
          style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(2.75rem, 9vw, 6rem)', fontWeight: 400, lineHeight: 1.0, fontStyle: 'italic' }}
        >
          <span className="block">{bl.page_headline_1}</span>
          <span className="block text-gold">{bl.page_headline_2}</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="gold-line mx-auto my-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white/70 mb-10"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.9375rem', letterSpacing: '0.05em' }}
        >
          {bl.page_subtitle}
        </motion.p>

        {/* Real-time countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          <IsolaComacinaCountdown variant="page" />
        </motion.div>
      </div>
    </section>
  )
}

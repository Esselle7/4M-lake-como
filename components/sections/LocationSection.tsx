'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'

const MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=Lungo+Lario+Trieste,+Como+CO&t=k&z=16&ie=UTF8&iwloc=&output=embed'

const MAPS_LINK =
  'https://www.google.com/maps/search/Lungo+Lario+Trieste,+22100+Como+CO'

function ArrivalCard({
  icon,
  label,
  value,
  delay,
}: Readonly<{
  icon: React.ReactNode
  label: string
  value: string
  delay: number
}>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex gap-4 items-start p-5 rounded-xl border border-white/8"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border border-gold/25"
        style={{ background: 'rgba(201,169,110,0.08)' }}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] tracking-[0.2em] uppercase text-gold/50 mb-1"
          style={{ fontFamily: 'Jost, sans-serif' }}>
          {label}
        </p>
        <p className="text-white/75 text-sm leading-relaxed"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

export default function LocationSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const l = t.location

  return (
    <section
      id="location"
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #060E1A 0%, #0D1E33 50%, #060E1A 100%)' }}
    >
      {/* Gold separator top */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(201,169,110,0.35), rgba(201,169,110,0.35), transparent)',
        }}
      />

      {/* Watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none overflow-hidden"
      >
        <span
          className="text-white/[0.018]"
          style={{
            fontFamily: 'Bodoni Moda, serif',
            fontSize: 'clamp(80px, 18vw, 220px)',
            fontStyle: 'italic',
            fontWeight: 400,
            whiteSpace: 'nowrap',
          }}
        >
          Como
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── Left: info ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <p className="eyebrow text-gold/60 mb-4">{l.eyebrow}</p>
              <div className="gold-line mb-6" />
              <h2
                className="text-white mb-5"
                style={{
                  fontFamily: 'Bodoni Moda, serif',
                  fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                }}
              >
                {l.title}
              </h2>
              <p
                className="text-white/45 text-base leading-relaxed"
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
              >
                {l.subtitle}
              </p>
            </motion.div>

            {/* Arrival cards */}
            {isInView && (
              <div className="flex flex-col gap-4 mb-10">
                {/* Address */}
                <ArrivalCard
                  delay={0.2}
                  label={l.address_label}
                  value={`${l.address} · ${l.city}`}
                  icon={
                    <svg className="w-4 h-4 text-gold/70" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5Z" strokeLinejoin="round" />
                      <circle cx="8" cy="6" r="1.5" />
                    </svg>
                  }
                />
                {/* Dock */}
                <ArrivalCard
                  delay={0.3}
                  label={l.dock_label}
                  value={l.dock_desc}
                  icon={
                    <svg className="w-4 h-4 text-gold/70" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12c0 0 1.5 2 6 2s6-2 6-2" strokeLinecap="round" />
                    </svg>
                  }
                />
                {/* Directions */}
                <ArrivalCard
                  delay={0.4}
                  label={l.directions_label}
                  value={l.directions}
                  icon={
                    <svg className="w-4 h-4 text-gold/70" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M1.5 8h13M10 4.5l4.5 3.5L10 11.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="inline-block">
                <LiquidGlassButton
                  variant="light"
                  size="md"
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5Z" strokeLinejoin="round" />
                      <circle cx="8" cy="6" r="1.5" />
                    </svg>
                  }
                >
                  {l.open_maps}
                </LiquidGlassButton>
              </a>
            </motion.div>

            {/* Coordinates line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-5 text-[10px] tracking-[0.18em] uppercase text-white/20"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              {l.coords}
            </motion.p>
          </div>

          {/* ── Right: map ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full min-h-[420px] md:min-h-[520px]"
          >
            {/* Gold glow behind map */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)',
              }}
            />

            {/* Map container */}
            <div
              className="relative h-full rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(201,169,110,0.18)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
              }}
            >
              <iframe
                title="4M Luxury Boats — Punto di Imbarco"
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: 'block',
                  minHeight: 420,
                  /*
                   * Dark-navy map hack:
                   * 1. invert(1)          → light beige land becomes dark navy, light blue water becomes amber
                   * 2. hue-rotate(195deg) → rotates amber water back to navy-blue; roads shift to deep indigo
                   * 3. saturate(0.32)     → desaturates to the muted, luxury palette of the site
                   * 4. brightness(0.8)    → pulls brightness down to match the #060E1A section background
                   */
                  filter: 'invert(1) hue-rotate(195deg) saturate(0.32) brightness(0.8)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Navy tint wash — unifies the inverted map palette with the section */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'rgba(6,14,26,0.18)' }}
              />

              {/* Gold edge vignette — top fade into section bg */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(6,14,26,0.6), transparent)',
                }}
              />
              {/* Subtle gold sheen on left edge */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-0 w-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, rgba(201,169,110,0.06), transparent)',
                }}
              />

              {/* Address badge — bottom overlay */}
              <div
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(6,14,26,0.82)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(201,169,110,0.15)',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Gold pulse dot */}
                  <span className="relative flex-shrink-0">
                    <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-gold/40 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
                  </span>
                  <div>
                    <p className="text-gold text-[10px] tracking-widest uppercase"
                      style={{ fontFamily: 'Jost, sans-serif' }}>
                      {l.dock_label}
                    </p>
                    <p className="text-white/55 text-xs"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                      {l.address} · Como
                    </p>
                  </div>
                </div>
                <p className="text-white/20 text-[9px] tracking-wide flex-shrink-0"
                  style={{ fontFamily: 'Jost, sans-serif' }}>
                  45.8108° N<br />9.0836° E
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

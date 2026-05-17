'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/context/LanguageContext'

export default function HowItWorks() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const h = t.how

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="relative py-28 md:py-40 bg-white-warm overflow-hidden"
    >
      {/* Decorative background letter */}
      <div
        aria-hidden="true"
        className="absolute -right-12 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: 'Bodoni Moda, serif',
          fontSize: 'clamp(200px, 30vw, 400px)',
          fontStyle: 'italic',
          color: 'rgba(10, 22, 40, 0.025)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        4M
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-28"
        >
          <p className="eyebrow text-gold mb-4">{h.eyebrow}</p>
          <div className="gold-line mx-auto mb-6" />
          <h2 className="display-lg text-navy mb-6">{h.title}</h2>
          <p
            className="text-navy/50 max-w-lg mx-auto text-lg"
            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
          >
            {h.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 relative">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.25), rgba(201,169,110,0.25), transparent)' }}
          />

          {h.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step number circle */}
              <div className="relative mb-7">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-white shadow-luxury-sm"
                  style={{ background: 'linear-gradient(135deg, #fafaf8, #f5f0e8)' }}
                >
                  <span
                    className="font-display italic text-gold text-xl"
                    style={{ fontFamily: 'Bodoni Moda, serif' }}
                  >
                    {step.number}
                  </span>
                </motion.div>
                {/* Gold glow on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 24px 6px rgba(201, 169, 110, 0.2)' }}
                />
              </div>

              <h3
                className="text-navy font-display mb-4"
                style={{ fontSize: '1.25rem', fontFamily: 'Bodoni Moda, serif', fontWeight: 400 }}
              >
                {step.title}
              </h3>
              <p
                className="text-navy/55 leading-relaxed"
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.9375rem' }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

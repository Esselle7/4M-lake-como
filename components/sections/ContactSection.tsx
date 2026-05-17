'use client'

import { useRef } from 'react'
import Image from 'next/image' // Importato per gestire il logo
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'

const WA_ICON = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.25.621 4.35 1.688 6.15L0 24l5.984-1.671A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.78-.525-5.35-1.43L2 22l1.455-4.55A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

export default function ContactSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  const c = t.contact
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '39XXXXXXXXXX'

  const infoItems = [
    { label: c.address_label, value: c.address },
    { label: c.email_label,   value: c.email   },
    { label: c.hours_label,   value: c.hours   },
  ]

  const LOGO_CONFIG = {
    src: "/images/logo.png",
    height: "h-20",
    opacity: "opacity-100",
    hoverScale: "hover:scale-105"
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0A1628 0%, #1A2F4E 50%, #0A1628 100%)' }}
    >
      {/* Gold top separator */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.35), rgba(201,169,110,0.35), transparent)' }}
      />

      {/* ── Main compact band ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-7xl mx-auto px-6 py-10 md:py-12"
      >
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0">
          <div className={`relative transition-all duration-300 ${LOGO_CONFIG.hoverScale}`}>
              <Image 
                src={LOGO_CONFIG.src}
                alt="4M Luxury Boats"
                width={150}
                height={60}
                priority
                className={`${LOGO_CONFIG.height} w-auto object-contain brightness-0 invert ${LOGO_CONFIG.opacity}`}
              />
            </div>
          {/* Left — title block */}
          <div className="lg:pr-8 lg:mr-8 lg:border-r lg:border-gold/12 flex-shrink-0 lg:max-w-[220px]">
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-gold/50 mb-1.5"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              {c.eyebrow}
            </p>
            <h2
              className="text-white leading-tight mb-1.5"
              style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.25rem', fontWeight: 400 }}
            >
              {c.title}
            </h2>
            <p
              className="text-white/40 text-xs leading-relaxed"
              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
            >
              {c.subtitle}
            </p>
          </div>

          {/* Center — info strip */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3">
            {infoItems.map((item, i) => (
              <div
                key={item.label}
                className="relative px-6 py-3 lg:py-0"
              >
                {/* Vertical separator on sm+ */}
                {i < infoItems.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute right-0 top-1 bottom-1 w-px"
                    style={{ background: 'rgba(201,169,110,0.1)' }}
                  />
                )}
                {/* Horizontal separator on mobile */}
                {i < infoItems.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="sm:hidden absolute bottom-0 left-6 right-6 h-px"
                    style={{ background: 'rgba(201,169,110,0.1)' }}
                  />
                )}
                <p
                  className="text-[9px] tracking-[0.18em] uppercase text-gold/45 mb-1"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-white/65 text-xs leading-snug"
                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Right — WhatsApp CTA */}
          <div className="flex-shrink-0">
            
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <LiquidGlassButton variant="light" size="sm" icon={WA_ICON}>
                {c.whatsapp_cta}
              </LiquidGlassButton>
            </a>
          </div>

        </div>
      </motion.div>

      
    </section>
  )
}
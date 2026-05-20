'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import Image from 'next/image'
interface StorySection {
  eyebrow: string
  title: string
  desc: string
  image: string
}

function StoryPanel({ section, index }: { section: StorySection; index: number }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(panelRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'end start'],
  })

  /* Container scroll animation: image reveals as you scroll */
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.03, 1.08])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.7, 0.4, 0.4, 0.65])

  const isReversed = index % 2 === 1

  /* Background gradient per section */
  const bgGradients = [
    'linear-gradient(160deg, #0A1628 0%, #1A3F5C 40%, #0D3A5A 100%)',
    'linear-gradient(160deg, #1A0F06 0%, #2A1808 40%, #0D2137 100%)',
    'linear-gradient(160deg, #0A1628 0%, #0D2137 40%, #1A2F4E 100%)',
  ]

  return (
    <div
      ref={panelRef}
      className="relative h-screen min-h-[500px] overflow-hidden"
    >
      {/* Full-bleed background image with scroll parallax */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        {/* Full-bleed background image with scroll parallax */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="absolute inset-0 will-change-transform"
          >
            {/* Sfondo con Immagine Next.js Dinamica */}
            <div className="absolute inset-0">
              <Image
                src={`/images/${section.image}`}
                alt={section.title}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={75}
                className="object-cover"
              />
            </div>
          </motion.div>

{/* Dark overlay with parallax opacity */}
      </motion.div>

      {/* Dark overlay with parallax opacity */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-navy"
      />

      {/* Content */}
      <div className={`relative z-10 h-full flex items-center ${isReversed ? 'justify-end' : 'justify-start'}`}>
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-lg px-8 md:px-16 lg:px-24 ${isReversed ? 'text-right' : 'text-left'}`}
        >
          <p className="eyebrow text-gold/70 mb-4">{section.eyebrow}</p>
          <div className={`gold-line mb-6 ${isReversed ? 'ml-auto' : ''}`} />
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: 'Bodoni Moda, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              fontStyle: index === 1 ? 'italic' : 'normal',
            }}
          >
            {section.title}
          </h2>
          <p
            className="text-white/55 text-lg leading-relaxed"
            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
          >
            {section.desc}
          </p>
        </motion.div>
      </div>

      {/* Corner accent */}
      <div
        className={`absolute bottom-8 ${isReversed ? 'left-8' : 'right-8'} flex items-center gap-3`}
        aria-hidden="true"
      >
        <div className="w-8 h-px bg-gold/30" />
        <div className="w-2 h-2 rounded-full border border-gold/40" />
      </div>
    </div>
  )
}

export default function VisualStory() {
  const { t } = useLang()
  const sections = t.visual.sections as StorySection[]

  return (
    <section id="visual-story" aria-label="Visual story sections">
      {sections.map((section, i) => (
        <StoryPanel key={i} section={section} index={i} />
      ))}
    </section>
  )
}

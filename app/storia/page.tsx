'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'
import VisualStory from '@/components/sections/VisualStory'

export default function StoriaPage() {
  const { t } = useLang()
  const v = t.visual

  return (
    <main>
      <VisualStory />

      {/* Bottom CTA */}
      <section
        className="py-24 text-center"
        style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0D2137 60%, #1A2F4E 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="px-6"
        >
          <p
            className="text-gold/60 text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            4M Luxury Boats
          </p>
          <div className="w-12 h-px bg-gold/30 mx-auto mb-8" />
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full border border-gold/40 text-white text-sm tracking-widest uppercase hover:border-gold hover:bg-gold/8 transition-all duration-300"
            style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.14em' }}
          >
            {v.book_cta}
            <svg className="w-4 h-4 text-gold" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}

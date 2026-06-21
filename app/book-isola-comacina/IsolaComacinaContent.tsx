'use client'

// ─────────────────────────────────────────────────────────────────────────────
// BellagioContent — package description + quote form for /book-bellagio.
// BELLAGIO EVENT (remove after 2026-06-27)
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import BellagioQuoteForm from '@/components/bellagio/BellagioQuoteForm'

export default function BellagioContent() {
  const { t } = useLang()
  const bl = t.bellagio

  return (
    <section className="relative -mt-10 z-10">
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-2xl shadow-luxury border border-navy/8 overflow-hidden">
          {/* Gold accent line at card top */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="p-8 md:p-12">
            {/* ── Package description ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10"
            >
              <p
                className="text-gold tracking-[0.2em] uppercase mb-3 text-center"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.625rem', fontWeight: 600 }}
              >
                {bl.package_eyebrow}
              </p>
              <h2
                className="text-navy text-center mb-5"
                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(1.625rem, 4vw, 2.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.15 }}
              >
                {bl.package_title}
              </h2>
              <p
                className="text-navy/60 text-center max-w-2xl mx-auto"
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.9375rem', lineHeight: 1.75 }}
              >
                {bl.package_desc}
              </p>

              {/* Includes + price — two columns on desktop, stacked on mobile */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Includes list */}
                <div className="rounded-xl border border-gold/15 bg-gold/[0.03] p-5">
                  <p
                    className="text-navy/50 tracking-widest uppercase mb-3"
                    style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.625rem', letterSpacing: '0.14em', fontWeight: 600 }}
                  >
                    {bl.package_includes_title}
                  </p>
                  <ul className="space-y-2.5">
                    {(bl.package_includes as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-gold mt-0.5 flex-shrink-0">✦</span>
                        <span
                          className="text-navy/70"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8125rem', fontWeight: 300, lineHeight: 1.5 }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price block */}
                <div className="rounded-xl border border-gold/25 bg-gradient-to-br from-gold/[0.08] to-transparent p-5 flex flex-col justify-center items-center text-center">
                  <p
                    className="text-navy/50 tracking-widest uppercase mb-2"
                    style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.625rem', letterSpacing: '0.14em', fontWeight: 600 }}
                  >
                    {bl.package_price_label}
                  </p>
                  <p
                    className="text-navy mb-1"
                    style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', fontWeight: 400, lineHeight: 1 }}
                  >
                    {bl.package_price_value}
                  </p>
                  <p
                    className="text-navy/55"
                    style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6875rem', fontWeight: 300, letterSpacing: '0.04em' }}
                  >
                    {bl.package_price_note}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-navy/8" />
              <span className="text-gold/40 text-xs" style={{ fontFamily: 'Bodoni Moda, serif', fontStyle: 'italic' }}>✦</span>
              <div className="h-px flex-1 bg-navy/8" />
            </div>

            {/* ── Quote form ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-8"
            >
              <p
                className="text-gold tracking-[0.2em] uppercase mb-2 text-center"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.625rem', fontWeight: 600 }}
              >
                {bl.form_eyebrow}
              </p>
              <h3
                className="text-navy text-center mb-3"
                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 400, fontStyle: 'italic' }}
              >
                {bl.form_title}
              </h3>
              <p
                className="text-navy/50 text-center max-w-md mx-auto mb-8"
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.875rem' }}
              >
                {bl.form_subtitle}
              </p>
            </motion.div>

            <BellagioQuoteForm />
          </div>
        </div>
      </div>
    </section>
  )
}

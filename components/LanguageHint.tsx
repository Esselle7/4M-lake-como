'use client'

// Concierge-style one-time hint that points first-time visitors at the language
// control (top-right: the switcher on desktop, the burger on mobile).
// Shows once per visitor, then never again (localStorage).

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const SEEN_KEY = 'lang-hint-seen'

export default function LanguageHint() {
  const [show, setShow] = useState(false)
  const reduce = useReducedMotion()

  // Appear shortly after load, but only for first-time visitors.
  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return
    const t = setTimeout(() => setShow(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // Once shown: auto-dismiss, and dismiss on scroll / Esc.
  useEffect(() => {
    if (!show) return
    const auto = setTimeout(dismiss, 6500)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss()
    window.addEventListener('scroll', dismiss, { once: true, passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(auto)
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function dismiss() {
    setShow(false)
    localStorage.setItem(SEEN_KEY, '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed right-3 top-[94px] z-[60] flex flex-col items-end lg:right-5 lg:top-[100px]"
        >
          {/* Signature: gold arc arrow drawing toward the top-right control */}
          <svg
            width="46"
            height="34"
            viewBox="0 0 46 34"
            fill="none"
            aria-hidden="true"
            className="mr-6 -mb-1"
          >
            <motion.path
              d="M3 31 C 14 28, 30 22, 40 5"
              stroke="#C9A96E"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: 'easeInOut' }}
            />
            <motion.path
              d="M33 4 L41 4 L40 12"
              stroke="#C9A96E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.95 }}
            />
          </svg>

          {/* Concierge note */}
          <div
            className="relative flex items-center gap-3 rounded-2xl border border-gold/35 px-4 py-2.5 backdrop-blur-md"
            style={{
              background: 'rgba(10,22,40,0.90)',
              boxShadow: '0 16px 40px rgba(10,22,40,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex flex-col leading-tight">
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-gold/70"
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                Your language?
              </span>
              <span
                className="text-[15px] text-gold-light"
                style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontStyle: 'italic' }}
              >
                Italiano · Deutsch
              </span>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="-mr-1 flex h-5 w-5 items-center justify-center rounded-full text-gold/50 transition-colors hover:text-gold-light"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLang, type Lang } from '@/context/LanguageContext'
import clsx from 'clsx'

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
]

interface LanguageSwitcherProps {
  onDark?: boolean
}

export default function LanguageSwitcher({ onDark = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const current = langs.find(l => l.code === lang)!

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen(p => !p)
  }

  const dropdown = (
    <AnimatePresence>
      {open && (
        <>
          {/* Invisible full-screen backdrop to close on outside click */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => setOpen(false)}
          />

          {/* Dropdown rendered at body level — escapes any stacking context */}
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: pos.top,
              right: pos.right,
              zIndex: 9999,
              minWidth: 96,
              borderRadius: 12,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.97)',
              border: '1px solid rgba(10,22,40,0.10)',
              boxShadow: '0 24px 64px rgba(10,22,40,0.14)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {langs.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: l.code === lang ? 600 : 400,
                  color: l.code === lang ? '#0A1628' : 'rgba(10,22,40,0.55)',
                  background: l.code === lang ? 'rgba(201,169,110,0.10)' : 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  if (l.code !== lang) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,22,40,0.04)'
                }}
                onMouseLeave={e => {
                  if (l.code !== lang) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-200 cursor-pointer',
          onDark
            ? 'text-white/80 hover:text-white border border-white/15 hover:border-white/30 hover:bg-white/10'
            : 'text-navy/70 hover:text-navy border border-navy/15 hover:border-navy/30 hover:bg-navy/5'
        )}
        style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.12em' }}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <svg
          className={clsx('w-2.5 h-2.5 transition-transform duration-200', open && 'rotate-180')}
          viewBox="0 0 10 6"
          fill="none"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Portal: renders outside any stacking context */}
      {mounted && createPortal(dropdown, document.body)}
    </>
  )
}

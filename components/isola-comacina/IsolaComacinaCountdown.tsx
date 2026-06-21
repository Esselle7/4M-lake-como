'use client'

// ─────────────────────────────────────────────────────────────────────────────
// BellagioCountdown — real-time countdown to the fireworks event.
// BELLAGIO EVENT (remove after 2026-06-27)
// ─────────────────────────────────────────────────────────────────────────────
// Event: Saturday 27 June 2026, 22:30 local time (Lake Como fireworks).
// Booking deadline: 27 June 2026, 10:00 — after this the form is disabled
// but the countdown keeps running until the show begins.

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

// Build the event date in LOCAL time (avoid TZ drift server-side).
// new Date(2026, 5, 27, 22, 30) → 5 = June (0-indexed).
export const BELLAGIO_EVENT = new Date(2026, 5, 27, 22, 30, 0).getTime()
export const BELLAGIO_DEADLINE = new Date(2026, 5, 27, 10, 0, 0).getTime()

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

type Status = 'open' | 'closed' | 'live' | 'past'

export function useBellagioStatus(): Status {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (now < BELLAGIO_DEADLINE) return 'open'
  if (now < BELLAGIO_EVENT) return 'closed'
  if (now < BELLAGIO_EVENT + 60 * 60 * 1000) return 'live' // 1h of show
  return 'past'
}

interface Props {
  variant?: 'banner' | 'page'
}

export default function BellagioCountdown({ variant = 'banner' }: Props) {
  const { t } = useLang()
  const bl = t.bellagio
  const [remaining, setRemaining] = useState<Remaining>(() => getRemaining(BELLAGIO_EVENT))
  const status = useBellagioStatus()

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(BELLAGIO_EVENT)), 1000)
    return () => clearInterval(id)
  }, [])

  const units: Array<{ value: number; label: string }> = [
    { value: remaining.days, label: bl.days },
    { value: remaining.hours, label: bl.hours },
    { value: remaining.minutes, label: bl.minutes },
    { value: remaining.seconds, label: bl.seconds },
  ]

  // After the deadline, the countdown shows the event time but form is locked.
  if (status === 'past') {
    return (
      <div className="text-center">
        <p className="text-gold/70 text-sm tracking-widest uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
          {bl.event_started}
        </p>
      </div>
    )
  }

  const isLarge = variant === 'page'

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="text-gold/70 tracking-[0.2em] uppercase"
        style={{ fontFamily: 'Jost, sans-serif', fontSize: isLarge ? '0.625rem' : '0.5rem' }}
      >
        {bl.countdown_label}
      </span>
      <div className="flex items-stretch gap-2 sm:gap-3">
        {units.map((u, i) => (
          <div key={i} className="flex items-stretch gap-2 sm:gap-3">
            <div
              className="flex flex-col items-center justify-center rounded-xl border border-gold/25 bg-navy/40 backdrop-blur-sm"
              style={{
                width: isLarge ? 'clamp(64px, 14vw, 96px)' : 'clamp(54px, 16vw, 72px)',
                padding: isLarge ? '0.875rem 0.5rem' : '0.625rem 0.375rem',
              }}
            >
              <motion.span
                key={u.value}
                initial={{ y: -6, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="text-white tabular-nums leading-none"
                style={{
                  fontFamily: 'Bodoni Moda, serif',
                  fontSize: isLarge ? 'clamp(1.75rem, 4vw, 2.75rem)' : 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 400,
                }}
              >
                {String(u.value).padStart(2, '0')}
              </motion.span>
              <span
                className="text-gold/60 mt-1.5 uppercase"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: isLarge ? '0.5625rem' : '0.5rem', letterSpacing: '0.14em' }}
              >
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span
                className="self-center text-gold/40"
                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: isLarge ? '1.5rem' : '1.125rem' }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

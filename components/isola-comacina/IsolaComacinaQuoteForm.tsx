'use client'

// ─────────────────────────────────────────────────────────────────────────────
// IsolaComacinaQuoteForm — quote-request form for the Isola Comacina fireworks package.
// ISOLA COMACINA EVENT (remove after 2026-06-27)
// ─────────────────────────────────────────────────────────────────────────────
// Same personal-data fields as the main booking form. Posts to /api/send-isola-comacina.
// Locked once the booking deadline (27 June 10:00) passes.

import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useLang } from '@/context/LanguageContext'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import { useIsolaComacinaStatus, ISOLA_COMACINA_DEADLINE } from './IsolaComacinaCountdown'

interface FormState {
  name: string
  surname: string
  email: string
  phone: string
  guests: string
  notes: string
}

const INITIAL: FormState = { name: '', surname: '', email: '', phone: '', guests: '2', notes: '' }

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validatePhone = (phone: string) => /^\+?[\d\s\-()]{7,20}$/.test(phone)

export default function IsolaComacinaQuoteForm() {
  const { t } = useLang()
  const bl = t.isola_comacina
  const status = useIsolaComacinaStatus()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSending, setIsSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const locked = status !== 'open'

  const set = (field: keyof FormState, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = bl.form_required
    if (!form.surname.trim()) e.surname = bl.form_required
    if (!form.email.trim()) e.email = bl.form_required
    else if (!validateEmail(form.email)) e.email = bl.form_required
    if (!form.phone.trim()) e.phone = bl.form_required
    else if (!validatePhone(form.phone)) e.phone = bl.form_required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    if (locked || !validate()) return
    setIsSending(true)
    try {
      const res = await fetch('/api/send-isola-comacina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const p = await res.json().catch(() => null)
        throw new Error(p?.error?.message ?? `HTTP ${res.status}`)
      }
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert("C'è stato un problema nell'inviare la richiesta. Prova a contattarci direttamente.")
    } finally {
      setIsSending(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <h3
          className="text-navy mb-3"
          style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.75rem', fontWeight: 400, fontStyle: 'italic' }}
        >
          {bl.form_success_title}
        </h3>
        <p className="text-navy/55 max-w-sm mx-auto" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          {bl.form_success_desc}
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm(INITIAL) }}
          className="mt-8 text-sm text-gold hover:text-gold-dark transition-colors cursor-pointer"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          {bl.form_new}
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Deadline warning banner */}
      {locked && (
        <div className="mb-6 p-4 rounded-xl border border-gold/30 bg-gold/[0.06] text-center">
          <p className="text-navy/70 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
            <span className="text-gold font-medium">✦ </span>
            {bl.booking_closed} · {bl.deadline_warning}
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            {bl.form_name} *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="given-name"
            disabled={locked}
            className={clsx('luxury-input', errors.name && 'border-red-400', locked && 'opacity-50 cursor-not-allowed')}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            {bl.form_surname} *
          </label>
          <input
            type="text"
            value={form.surname}
            onChange={e => set('surname', e.target.value)}
            autoComplete="family-name"
            disabled={locked}
            className={clsx('luxury-input', errors.surname && 'border-red-400', locked && 'opacity-50 cursor-not-allowed')}
          />
          {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            {bl.form_email} *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            autoComplete="email"
            inputMode="email"
            disabled={locked}
            className={clsx('luxury-input', errors.email && 'border-red-400', locked && 'opacity-50 cursor-not-allowed')}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            {bl.form_phone} *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+39..."
            disabled={locked}
            className={clsx('luxury-input', errors.phone && 'border-red-400', locked && 'opacity-50 cursor-not-allowed')}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            {bl.form_guests}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => set('guests', String(n))}
                disabled={locked}
                className={clsx(
                  'flex-1 h-10 rounded-lg border text-sm transition-all duration-150 cursor-pointer',
                  form.guests === String(n)
                    ? 'border-gold bg-gold/10 text-navy font-semibold'
                    : 'border-navy/10 bg-white text-navy/55 hover:border-navy/25',
                  locked && 'opacity-50 cursor-not-allowed'
                )}
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
            {bl.form_notes}
          </label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder={bl.form_notes_placeholder}
            disabled={locked}
            className={clsx('luxury-input resize-none', locked && 'opacity-50 cursor-not-allowed')}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <LiquidGlassButton
          variant="gold"
          size="lg"
          onClick={submit}
          disabled={isSending || locked}
          fullWidth
        >
          {isSending ? bl.form_sending : bl.form_submit}
        </LiquidGlassButton>
        {!locked && (
          <p className="text-navy/40 text-[11px]" style={{ fontFamily: 'Jost, sans-serif' }}>
            ✦ {bl.deadline_warning}
          </p>
        )}
      </div>
    </div>
  )
}

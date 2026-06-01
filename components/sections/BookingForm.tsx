'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import Image from 'next/image'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import clsx from 'clsx'
import itLocale from '@/locales/it.json'
import enLocale from '@/locales/en.json'
import {
  computePriceBreakdown,
  computeDeposit,
  isCustomPackage,
  isCustomPriceAddon,
  selectedAddonLines,
} from '@/lib/pricing'

interface FormData {
  packageId: string
  packageName: string
  mode: 'private' | 'shared'
  boatId: string
  date: string
  time: string
  name: string
  surname: string
  email: string
  phone: string
  guests: string
  notes: string
  // "La Bella Vita" only — chosen duration (hours) and onboard extras (addonId → qty)
  durationHours: number
  addons: Record<string, number>
  // Free-text brief for the custom-priced "special setup" extra (quoted later)
  customSetupNote: string
}

const BOAT_IMAGES: Record<string, string> = {
  'boat-1': 'ba-prima-1.webp',
  'boat-2': 'cranchi-e26-1.webp',
}

// Set visible: true to re-enable a boat in the booking flow when ready
const BOATS_CONFIG: Array<{ id: 'boat-1' | 'boat-2'; fleetIdx: number; visible: boolean }> = [
  { id: 'boat-1', fleetIdx: 0, visible: true  },
  { id: 'boat-2', fleetIdx: 1, visible: false },
]

const INITIAL_FORM: FormData = {
  packageId: '',
  packageName: '',
  mode: 'private',
  boatId: '',
  date: '',
  time: '',
  name: '',
  surname: '',
  email: '',
  phone: '',
  guests: '2',
  notes: '',
  durationHours: 0,
  addons: {},
  customSetupNote: '',
}

const LOCKED_TIMES: Record<string, number> = {
  'golden-hour': 2,
  'breakfast': 0,
}

const TIME_MIN_INDEX: Record<string, number> = {
  'aperitivo': 1,
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string) => {
  // Accetta formati come +39 333 1234567 o 031 123456
  const re = /^\+?[\d\s\-()]{7,20}$/;
  return re.test(phone);
};



// ── Calendar ────────────────────────────────────────────────────────────────

function CalendarPicker({
  value,
  onChange,
  lang,
}: {
  value: string
  onChange: (date: string) => void
  lang: string
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [viewYear, setViewYear] = useState(() => today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => today.getMonth())

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1 // Monday-first

  const monthLabel = useMemo(() => {
    const raw = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(
      new Date(viewYear, viewMonth)
    )
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  }, [lang, viewYear, viewMonth])

  const dayHeaders = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2024, 0, 1 + i) // Jan 1 2024 = Monday
        return new Intl.DateTimeFormat(lang, { weekday: 'narrow' }).format(d)
      }),
    [lang]
  )

  const toISO = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const isPast = (day: number) => new Date(viewYear, viewMonth, day) < today
  const isSelected = (day: number) => value === toISO(day)
  const isTodayCell = (day: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  return (
    <div className="rounded-2xl p-4 border border-navy/8 bg-cream/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-navy/6 disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4 text-navy/60" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span
          className="text-navy text-sm font-medium"
          style={{ fontFamily: 'Bodoni Moda, serif', fontStyle: 'italic' }}
        >
          {monthLabel}
        </span>

        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-navy/6 transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <svg className="w-4 h-4 text-navy/60" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayHeaders.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] text-navy/35 py-1.5 font-semibold"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) =>
          day === null ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              disabled={isPast(day)}
              onClick={() => !isPast(day) && onChange(toISO(day))}
              className={clsx(
                'relative h-9 w-full flex items-center justify-center rounded-lg text-sm transition-all duration-150 cursor-pointer',
                isPast(day) && 'text-navy/12 cursor-not-allowed',
                !isPast(day) && !isSelected(day) && 'text-navy/60 hover:bg-gold/15 hover:text-navy hover:scale-105',
                isSelected(day) && 'bg-gold text-navy font-semibold scale-110 rounded-xl',
                isTodayCell(day) && !isSelected(day) && !isPast(day) && 'font-bold text-navy ring-1 ring-gold/30'
              )}
              style={{ fontFamily: 'Jost, sans-serif', boxShadow: isSelected(day) ? '0 0 0 3px rgba(201,169,110,0.22), 0 4px 16px rgba(201,169,110,0.35)' : undefined }}
            >
              {day}
              {isTodayCell(day) && !isSelected(day) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold/60" />
              )}
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ── Time Slot Picker ─────────────────────────────────────────────────────────

const TIME_ICONS = [
  // Morning — sunrise
  <svg key="morning" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 3v2M4.22 6.22l1.42 1.42M2 14h2M20 14h2M18.36 7.64l1.42-1.42M12 7a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 19h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 19a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // Afternoon — sun
  <svg key="afternoon" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Sunset
  <svg key="sunset" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 10v4M4.22 10.22l1.42 1.42M18.36 11.64l1.42-1.42M2 17h2M20 17h2M12 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 22h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 22a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
]

function TimeSlotPicker({
  value,
  onChange,
  options,
  lockedIndex,
  minIndex,
  lockedNote,
}: {
  value: string
  onChange: (t: string) => void
  options: string[]
  lockedIndex?: number
  minIndex?: number
  lockedNote: string
}) {
  const isLocked = lockedIndex !== undefined

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt, idx) => {
          const isDisabled = isLocked ? idx !== lockedIndex : minIndex !== undefined && idx < minIndex
          const isSelected = value === opt
          return (
            <button
              key={opt}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(opt)}
              className={clsx(
                'relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border transition-all duration-250 cursor-pointer overflow-hidden',
                isSelected && !isDisabled
                  ? 'border-gold bg-gold/[0.09] shadow-[0_0_0_1px_rgba(201,169,110,0.18),0_4px_24px_rgba(201,169,110,0.28)] scale-[1.03]'
                  : !isDisabled
                  ? 'border-navy/10 bg-white hover:border-gold/25 hover:bg-cream/30 hover:shadow-[0_2px_12px_rgba(201,169,110,0.09)]'
                  : 'border-navy/5 bg-navy/2 opacity-25 cursor-not-allowed'
              )}
            >
              {/* Gold top bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }}
                animate={{ opacity: isSelected && !isDisabled ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                animate={{ scale: isSelected && !isDisabled ? 1.12 : 1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={clsx('transition-colors', isSelected && !isDisabled ? 'text-gold' : 'text-navy/30')}
              >
                {TIME_ICONS[idx]}
              </motion.span>
              <span
                className={clsx(
                  'text-[10px] text-center leading-snug',
                  isSelected && !isDisabled ? 'text-navy font-semibold' : 'text-navy/50'
                )}
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {opt}
              </span>
            </button>
          )
        })}
      </div>
      {isLocked && (
        <p
          className="flex items-center gap-1.5 mt-3 text-[10px] text-navy/45"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          <span className="text-gold">✦</span>
          {lockedNote}
        </p>
      )}
    </div>
  )
}

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-10">
      <div className="flex items-center">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="relative">
              {/* Pulsing ring on active step */}
              {i === step && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-gold/40"
                  animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <motion.div
                animate={{
                  background: i <= step ? '#C9A96E' : 'transparent',
                  scale: i === step ? 1.12 : 1,
                  borderColor: i <= step ? '#C9A96E' : 'rgba(10, 22, 40, 0.18)',
                }}
                className="relative w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {i < step ? (
                  <svg className="w-3.5 h-3.5 text-navy" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span
                    className={clsx('text-[9px]', i <= step ? 'text-navy' : 'text-navy/25')}
                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700 }}
                  >
                    {i + 1}
                  </span>
                )}
              </motion.div>
            </div>
            {i < total - 1 && (
              <motion.div
                animate={{ background: i < step ? '#C9A96E' : 'rgba(10, 22, 40, 0.10)' }}
                className="w-10 md:w-14 h-px mx-1"
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
      <span
        className="text-[10px] text-navy/35 tracking-widest uppercase"
        style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.16em' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── WhatsApp confirmation copy (always rendered in both IT + EN) ──────────────

type WaLang = 'it' | 'en'

const WA_STRINGS: Record<WaLang, {
  locale: string
  header: string
  greeting: (name: string) => string
  intro: string
  recap: string
  date: string
  experience: string
  duration: string
  extras: string
  setup: string
  departure: string
  meeting: string
  boat: (name: string) => string
  total: string
  insteadOf: (orig: string, pct: number) => string
  customPrice: string
  bespoke: (guests: string) => string
  privateFor: (guests: string) => string
  sharedFor: (guests: string) => string
  persons: (n: number) => string
  lock: string
  deposit: (amount: string) => string
  closing: string
  signoff: string
}> = {
  it: {
    locale: 'it-IT',
    header: '🇮🇹 ITALIANO',
    greeting: (name) => `Ciao ${name}! 🛥️✨`,
    intro: `Qui è lo staff di 4M Lake Como. Siamo felici di confermarti che abbiamo ricevuto la tua richiesta di prenotazione! Pronti a farvi vivere un'esperienza indimenticabile sul lago. 🌊`,
    recap: `Ecco il riepilogo del vostro tour:`,
    date: 'Data',
    experience: 'Esperienza',
    duration: 'Durata',
    extras: 'Extra a bordo',
    setup: 'Allestimento speciale',
    departure: 'Partenza',
    meeting: `Meeting point: Molo di Lungo Lario Trieste, Como (trovi la posizione esatta e tutti i riferimenti completi sul nostro sito web https://4mboatlakecomo.com/)`,
    boat: (name) => `La barca: Per questa occasione vi abbiamo riservato la splendida ${name} 🇮🇹💨`,
    total: 'Prezzo totale',
    insteadOf: (orig, pct) => `(anziché ${orig} — sconto ${pct}% sulle ore)`,
    customPrice: 'prezzo da definire',
    bespoke: (g) => `esperienza su misura (barca privata per ${g})`,
    privateFor: (g) => `barca privata per ${g}`,
    sharedFor: (g) => `tour condiviso, ${g}`,
    persons: (n) => `${n} ${n === 1 ? 'persona' : 'persone'}`,
    lock: `🔒 Per bloccare definitivamente la prenotazione:`,
    deposit: (amount) => `A breve ti invieremo qui sotto un link sicuro per il pagamento dell'acconto, che è di ${amount} (30% del prezzo totale). Ti basterà cliccarci sopra per completare la transazione in un attimo.`,
    closing: `Non vediamo l'ora di avervi a bordo! Se hai richieste particolari per l'aperitivo, per la musica o per le tue occasioni speciali, faccelo sapere. 🍾🥂`,
    signoff: `A presto,\nIl team di 4M Lake Como 🌅📖`,
  },
  en: {
    locale: 'en-GB',
    header: '🇬🇧 ENGLISH',
    greeting: (name) => `Hi ${name}! 🛥️✨`,
    intro: `This is the 4M Lake Como team. We're delighted to confirm we've received your booking request! Ready to give you an unforgettable experience on the lake. 🌊`,
    recap: `Here's a summary of your tour:`,
    date: 'Date',
    experience: 'Experience',
    duration: 'Duration',
    extras: 'Onboard extras',
    setup: 'Special setup',
    departure: 'Departure',
    meeting: `Meeting point: Molo di Lungo Lario Trieste, Como (you'll find the exact location and all the details on our website https://4mboatlakecomo.com/)`,
    boat: (name) => `The boat: For this occasion we've reserved the stunning ${name} 🇮🇹💨`,
    total: 'Total price',
    insteadOf: (orig, pct) => `(instead of ${orig} — ${pct}% off the hours)`,
    customPrice: 'price to be confirmed',
    bespoke: (g) => `bespoke experience (private boat for ${g})`,
    privateFor: (g) => `private boat for ${g}`,
    sharedFor: (g) => `shared tour, ${g}`,
    persons: (n) => `${n} ${n === 1 ? 'person' : 'people'}`,
    lock: `🔒 To secure your booking:`,
    deposit: (amount) => `We'll shortly send you a secure link below to pay the deposit of ${amount} (30% of the total). Just tap it to complete the transaction in seconds.`,
    closing: `We can't wait to have you on board! If you have any special requests for the aperitivo, the music or your special occasion, just let us know. 🍾🥂`,
    signoff: `See you soon,\nThe 4M Lake Como team 🌅📖`,
  },
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookingForm() {
  const { t, lang } = useLang()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSending, setIsSending] = useState(false)
  const [durationError, setDurationError] = useState('')
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const b = t.booking
  const packages = t.packages.items

  // "La Bella Vita": fully customizable, private-only experience
  const addonCatalog = b.addons
  // Extras with a fixed price (stepper) vs. the custom-priced "special setup" (toggle + brief)
  const fixedAddons = addonCatalog.filter(a => !isCustomPriceAddon(a.id))
  const customAddon = addonCatalog.find(a => isCustomPriceAddon(a.id))
  const customSetupSelected = !!customAddon && (form.addons[customAddon.id] || 0) > 0
  const durationOptions = b.duration_options
  const isCustom = isCustomPackage(form.packageId)
  const currency = t.packages.currency

  const selectedPkg = packages.find(p => p.id === form.packageId)
  const unitPrice = typeof selectedPkg?.price === 'number' ? selectedPkg.price : Number(selectedPkg?.price) || 0
  const liveBreakdown = computePriceBreakdown({
    packageId: form.packageId,
    unitPrice,
    mode: form.mode,
    guests: parseInt(form.guests, 10) || 1,
    durationHours: form.durationHours,
    addons: form.addons,
    addonCatalog,
  })

  const timeOptionsRef = useRef(b.time_options)
  useEffect(() => { timeOptionsRef.current = b.time_options }, [b.time_options])

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, name } = (e as CustomEvent<{ id: string; name: string }>).detail
      const lockedIdx = LOCKED_TIMES[id]
      const minIdx = TIME_MIN_INDEX[id]
      const custom = isCustomPackage(id)
      setForm(prev => {
        const currentTimeIdx = timeOptionsRef.current.indexOf(prev.time)
        const nowBelowMin = minIdx !== undefined && currentTimeIdx >= 0 && currentTimeIdx < minIdx
        return {
          ...prev,
          packageId: id,
          packageName: name,
          // La Bella Vita is private-only and customizable: force private,
          // default to the first duration, and reset extras when leaving it.
          mode: custom ? 'private' : prev.mode,
          durationHours: custom ? durationOptions[0].hours : 0,
          addons: custom ? prev.addons : {},
          customSetupNote: custom ? prev.customSetupNote : '',
          time: lockedIdx !== undefined
            ? timeOptionsRef.current[lockedIdx]
            : nowBelowMin ? '' : prev.time,
        }
      })
      setErrors({})
      setDurationError('')
      setStep(0)
    }
    window.addEventListener('selectPackage', handler)
    return () => window.removeEventListener('selectPackage', handler)
  }, [])

  const set = (field: keyof FormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const setDuration = (hours: number) => {
    setForm(p => ({ ...p, durationHours: hours }))
    setDurationError('')
  }

  // Increment/decrement an onboard extra; quantity never goes below 0.
  const changeAddon = (id: string, delta: number) => {
    setForm(p => {
      const next = Math.max(0, (p.addons[id] || 0) + delta)
      const addons = { ...p.addons }
      if (next === 0) delete addons[id]
      else addons[id] = next
      return { ...p, addons }
    })
  }

  // Toggle the custom-priced "special setup" extra on/off (no quantity).
  const toggleCustomSetup = (id: string) => {
    setForm(p => {
      const addons = { ...p.addons }
      if (addons[id]) {
        delete addons[id]
        return { ...p, addons, customSetupNote: '' }
      }
      addons[id] = 1
      return { ...p, addons }
    })
    setErrors(e => ({ ...e, customSetupNote: '' }))
  }

  function validateStep(): boolean {
    const errs: Partial<FormData> = {}
    let durationInvalid = false
    if (step === 0 && !form.packageId) errs.packageId = b.required
    if (step === 1 && !form.boatId) errs.boatId = b.boat_required
    if (step === 2) {
      durationInvalid = isCustom && !(form.durationHours > 0)
      setDurationError(durationInvalid ? b.duration_required : '')
      if (customSetupSelected && !form.customSetupNote.trim()) errs.customSetupNote = b.custom_setup_required
      if (!form.date) errs.date = b.required
      if (!form.time) errs.time = b.required
    }
    if (step === 3) {
      if (!form.name.trim()) errs.name = b.required
      if (!form.surname.trim()) errs.surname = b.required
      if (!form.email.trim()) errs.email = b.required
      if (!form.phone.trim()) errs.phone = b.required
    }
    setErrors(errs)
    return Object.keys(errs).length === 0 && !durationInvalid
  }

  // Single source of truth for the booking price + breakdown, reused by the
  // WhatsApp/email messages and the structured payload sent to the API.
  function computePricing() {
    const guests = parseInt(form.guests, 10) || 1
    const bd = computePriceBreakdown({
      packageId: form.packageId,
      unitPrice,
      mode: form.mode,
      guests,
      durationHours: form.durationHours,
      addons: form.addons,
      addonCatalog,
    })
    const durationLabel = durationOptions.find(o => o.hours === form.durationHours)?.label ?? ''
    const addonLines = selectedAddonLines(form.addons, addonCatalog).map(l => ({
      ...l,
      isCustomPrice: isCustomPriceAddon(l.id),
    }))
    return {
      isCustom,
      currency,
      guests,
      unitPrice,
      durationHours: form.durationHours,
      durationLabel,
      addonLines,
      customSetupNote: form.customSetupNote.trim(),
      discountRate: bd.discountRate,
      originalTotal: bd.originalTotal,
      total: bd.total,
      deposit: computeDeposit(bd.total),
    }
  }

  function buildMessage() {
    const modeText = form.mode === 'private' ? b.private : b.shared
    const boatName = form.boatId === 'boat-1' ? t.fleet.boats[0].name : t.fleet.boats[1].name
    const pr = computePricing()
    let extra = ''
    if (pr.isCustom) {
      const addonsText = pr.addonLines.length
        ? ` Extra a bordo: ${pr.addonLines
            .map(l => (l.isCustomPrice ? `${l.label} (prezzo da definire)` : `${l.qty}× ${l.label}`))
            .join(', ')}.`
        : ''
      const setupText = pr.customSetupNote ? ` Allestimento speciale: ${pr.customSetupNote}.` : ''
      extra = ` Durata: ${pr.durationLabel}.${addonsText}${setupText} Totale stimato: ${currency}${pr.total} (acconto ${currency}${pr.deposit}).`
    }
    return `Vorrei richiedere una prenotazione per il pacchetto "${form.packageName}" in modalità ${modeText}. Imbarcazione: ${boatName}. Data: ${form.date} alle ore ${form.time}. Gruppo composto da ${form.guests} persone. Nome: ${form.name} ${form.surname}. Contatto: ${form.phone} - ${form.email}. Note: ${form.notes || 'Nessuna nota specifica'}.${extra}`
  }

  // Single localized variant of the WhatsApp confirmation. Extra/duration labels
  // are pulled from the matching locale file so each block is fully translated.
  function buildWhatsappVariant(lng: WaLang) {
    const tr = WA_STRINGS[lng]
    const loc = lng === 'it' ? itLocale : enLocale
    const pr = computePricing() // numbers (currency/total/discount) are language-independent
    const boatName = form.boatId === 'boat-1' ? t.fleet.boats[0].name : t.fleet.boats[1].name
    const guestsLabel = tr.persons(pr.guests)
    const experienceLabel = pr.isCustom
      ? `${form.packageName} — ${tr.bespoke(guestsLabel)}`
      : `${form.packageName} (${form.mode === 'private' ? tr.privateFor(guestsLabel) : tr.sharedFor(guestsLabel)})`

    const durationLabel = loc.booking.duration_options.find(o => o.hours === form.durationHours)?.label ?? ''
    const addonLines = selectedAddonLines(form.addons, loc.booking.addons)
    // Translate the selected time slot by matching its index in the active locale.
    const timeIdx = t.booking.time_options.indexOf(form.time)
    const timeLabel = timeIdx >= 0 ? loc.booking.time_options[timeIdx] : form.time

    let dateLabel = form.date
    if (form.date) {
      const d = new Date(`${form.date}T00:00:00`)
      const raw = new Intl.DateTimeFormat(tr.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
      dateLabel = raw.charAt(0).toUpperCase() + raw.slice(1)
    }

    const lines = [
      tr.greeting(form.name),
      tr.intro,
      tr.recap,
      `📅 ${tr.date}: ${dateLabel}`,
      `🥂 ${tr.experience}: ${experienceLabel}`,
    ]
    if (pr.isCustom) lines.push(`⏱️ ${tr.duration}: ${durationLabel}`)
    if (pr.isCustom && addonLines.length) {
      const addonText = addonLines
        .map(l => (isCustomPriceAddon(l.id) ? `${l.label} (${tr.customPrice})` : `${l.qty}× ${l.label}`))
        .join(', ')
      lines.push(`🍹 ${tr.extras}: ${addonText}`)
    }
    if (pr.isCustom && pr.customSetupNote) lines.push(`📝 ${tr.setup}: ${pr.customSetupNote}`)
    const priceLine = pr.discountRate > 0
      ? `💰 ${tr.total}: ${currency}${pr.total} ${tr.insteadOf(`${currency}${pr.originalTotal}`, Math.round(pr.discountRate * 100))}`
      : `💰 ${tr.total}: ${currency}${pr.total}`
    lines.push(
      `🕒 ${tr.departure}: ${timeLabel}`,
      `📍 ${tr.meeting}`,
      `🚤 ${tr.boat(boatName)}`,
      priceLine,
      tr.lock,
      tr.deposit(`${currency}${pr.deposit}`),
      tr.closing,
      tr.signoff,
    )
    return lines.join('\n')
  }

  // Confirmation message ready to copy into WhatsApp — always bilingual (IT + EN).
  function buildWhatsappMessage() {
    return [
      WA_STRINGS.it.header,
      buildWhatsappVariant('it'),
      '———————————————',
      WA_STRINGS.en.header,
      buildWhatsappVariant('en'),
    ].join('\n\n')
  }
  const handleBlur = (field: string, value: string) => {
  let errorMessage = "";
  
  if (!value || value.trim() === "") {
    errorMessage = "Questo campo è obbligatorio";
  } else if (field === 'email' && !validateEmail(value)) {
    errorMessage = "Inserisci un indirizzo email valido (es. nome@esempio.it)";
  } else if (field === 'phone' && !validatePhone(value)) {
    errorMessage = "Inserisci un numero di telefono valido";
  }

  setErrors(prev => ({
    ...prev,
    [field]: errorMessage
  }));
};

  async function handleSubmit() {
    if (!validateStep()) return
    setIsSending(true)
    const message = buildMessage()
    const whatsappMessage = buildWhatsappMessage()
    const pricing = computePricing()
    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, message, whatsappMessage, pricing }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const detail = payload?.error?.message ?? payload?.error ?? `HTTP ${response.status}`
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
      }
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      alert("C'è stato un problema nell'inviare la richiesta. Prova a contattarci direttamente.")
    } finally {
      setIsSending(false)
    }
  }

  function handleNext() {
    if (!validateStep()) return
    if (step < 3) setStep(s => s + 1)
    else handleSubmit()
  }

  function goBack() {
    if (step > 0) {
    setStep(s => s - 1);
  }
  }


  return (
    <section id="booking" ref={sectionRef} className="py-28 md:py-40 bg-white-warm">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="eyebrow text-gold mb-4">{b.eyebrow}</p>
          <div className="gold-line mx-auto mb-6" />
          <h1
            className="text-navy mb-6 text-3xl md:text-4xl lg:text-5xl"
            style={{
              fontFamily: 'Bodoni Moda, serif',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.2
            }}
          >
            {b.title}
          </h1>
          <p className="text-navy/45 text-base" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            {b.subtitle}
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          id="booking-form"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-luxury border border-navy/8 overflow-hidden"
        >
          {/* Gold accent line at card top */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="p-8 md:p-12">
          {!submitted ? (
            <>
              <StepIndicator step={step} total={4} label={`${step + 1} ${b.step_of} 4`} />

              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >

                {/* ── Step 0: Package + Mode ── */}
{step === 0 && (
  <div>
    <h3 className="display-md text-navy mb-10 text-center" style={{ fontSize: '1.375rem' }}>
      {b.step1_title}
    </h3>

    {/* Griglia principale: 3 colonne su schermi grandi */}
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      
      {/* SEZIONE PACCHETTI (Occupa 2 colonne su 3) */}
      <div className="lg:col-span-2">
        <p className="text-xs text-navy/50 tracking-widest uppercase mb-4" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em' }}>
          {b.package_label || "Scegli l'esperienza"}
        </p>
        
        {/* Griglia pacchetti: 2 colonne fisse (3 righe se hai 6 pacchetti) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packages.map((pkg) => {
            const selected = form.packageId === pkg.id
            return (
              <button
                key={pkg.id}
                onClick={() => {
                  set('packageId', pkg.id)
                  set('packageName', pkg.name)
                  // La Bella Vita: private-only & customizable — force private,
                  // seed the first duration, and clear extras when switching away.
                  const custom = isCustomPackage(pkg.id)
                  setForm(p => ({
                    ...p,
                    mode: custom ? 'private' : p.mode,
                    durationHours: custom ? durationOptions[0].hours : 0,
                    addons: custom ? p.addons : {},
                    customSetupNote: custom ? p.customSetupNote : '',
                  }))
                  setDurationError('')
                  const lockedIdx = LOCKED_TIMES[pkg.id]
                  const minIdx = TIME_MIN_INDEX[pkg.id]
                  if (lockedIdx !== undefined) {
                    set('time', b.time_options[lockedIdx])
                  } else {
                    const currentIdx = b.time_options.indexOf(form.time)
                    const previousWasLocked = form.packageId in LOCKED_TIMES
                    const nowBelowMin = minIdx !== undefined && currentIdx >= 0 && currentIdx < minIdx
                    if (previousWasLocked || nowBelowMin) set('time', '')
                  }
                }}
                className={clsx(
                  'relative text-left p-4 rounded-xl border transition-all duration-250 cursor-pointer w-full flex flex-col justify-between min-h-[140px] overflow-hidden',
                  selected
                    ? 'border-gold bg-gold/[0.07] shadow-[0_0_0_1px_rgba(201,169,110,0.18),0_8px_32px_rgba(201,169,110,0.20)] scale-[1.01]'
                    : 'border-navy/10 hover:border-gold/30 hover:shadow-[0_2px_14px_rgba(201,169,110,0.10)] bg-white hover:bg-cream/30'
                )}
              >
                {/* Gold top accent bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #C9A96E 40%, #E8D5A3 50%, #C9A96E 60%, transparent)' }}
                  animate={{ opacity: selected ? 1 : 0, scaleX: selected ? 1 : 0.4 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Gold checkmark */}
                <motion.div
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gold flex items-center justify-center shadow-sm"
                  animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.5 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <svg className="w-2.5 h-2.5 text-navy" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.2l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                <div>
                  <div className="flex items-start justify-between mb-1 gap-2 pr-6">
                    <span
                      className={clsx('text-sm font-medium leading-tight', selected ? 'text-navy' : 'text-navy/80')}
                      style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '0.95rem', fontStyle: 'italic' }}
                    >
                      {pkg.name}
                    </span>
                    <span
                      className={clsx(
                        'text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded-full flex-shrink-0',
                        pkg.type === 'premium'
                          ? selected ? 'bg-gold text-navy' : 'bg-gold/15 text-gold-dark'
                          : selected ? 'bg-navy/12 text-navy/65' : 'bg-navy/6 text-navy/45'
                      )}
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      {pkg.type === 'premium' ? 'PREMIUM' : 'STD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className={clsx('text-[10px]', selected ? 'text-gold' : 'text-gold/60')}>✦</span>
                    <span className={clsx('text-[10px]', selected ? 'text-navy/70' : 'text-navy/50')} style={{ fontFamily: 'Jost, sans-serif' }}>
                      {pkg.duration_label}
                    </span>
                  </div>
                  <p className={clsx('text-[9px] leading-snug', selected ? 'text-navy/55' : 'text-navy/38')} style={{ fontFamily: 'Jost, sans-serif' }}>
                    {pkg.includes}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className={clsx('h-px flex-1 mr-3 transition-colors duration-300', selected ? 'bg-gold/25' : 'bg-navy/6')} />
                  <span
                    className={clsx('transition-all duration-300', selected ? 'text-navy' : 'text-navy/65')}
                    style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.125rem', fontWeight: 400 }}
                  >
                    {t.packages.currency}{pkg.price}
                    {isCustomPackage(pkg.id) && (
                      <span className="text-navy/45" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.625rem' }}> /{t.packages.per_hour}</span>
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        {errors.packageId && (
          <p className="text-red-500 text-xs mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>
            {errors.packageId}
          </p>
        )}
      </div>

      {/* SEZIONE MODALITÀ (Occupa 1 colonna su 3) */}
      <div className="lg:border-l lg:border-navy/5 lg:pl-8">
        <p className="text-xs text-navy/50 tracking-widest uppercase mb-4" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em' }}>
          {b.mode_label}
        </p>
        <div className="grid grid-cols-1 gap-4">
          {(['private', 'shared'] as const).map((mode) => {
            const isSelected = form.mode === mode
            // La Bella Vita is private-only: lock the shared option out.
            const isDisabled = isCustom && mode === 'shared'
            return (
              <button
                key={mode}
                onClick={() => !isDisabled && set('mode', mode)}
                disabled={isDisabled}
                className={clsx(
                  'group relative overflow-hidden rounded-xl border transition-all duration-300 text-left w-full',
                  isDisabled && 'opacity-40 cursor-not-allowed',
                  !isDisabled && 'cursor-pointer',
                  isSelected
                    ? 'border-gold shadow-[0_0_0_1px_rgba(201,169,110,0.2),0_6px_28px_rgba(201,169,110,0.22)] scale-[1.01]'
                    : 'border-navy/10 hover:border-gold/25 hover:shadow-[0_2px_12px_rgba(201,169,110,0.09)]'
                )}
              >
                {/* Gold top bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] z-10"
                  style={{ background: 'linear-gradient(90deg, transparent, #C9A96E 40%, #E8D5A3 50%, #C9A96E 60%, transparent)' }}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative h-24 overflow-hidden">
                  <Image
                    src={`/images/${mode === 'private' ? 'private-tour.webp' : 'shared-tour.webp'}`}
                    alt={mode === 'private' ? b.private_title : b.shared_title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    quality={75}
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy/15" />
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent" />}
                  {/* Checkmark badge */}
                  <motion.div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center shadow-md"
                    animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.4 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <svg className="w-3 h-3 text-navy" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
                <div className={clsx('p-4 transition-colors duration-300', isSelected ? 'bg-gold/[0.07]' : 'bg-white')}>
                  <p
                    className={clsx('mb-0.5', isSelected ? 'text-navy' : 'text-navy/80')}
                    style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 400 }}
                  >
                    {mode === 'private' ? b.private_title : b.shared_title}
                  </p>
                  <p className={clsx('text-[10px] leading-tight', isSelected ? 'text-navy/55' : 'text-navy/40')} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                    {mode === 'private' ? b.private_desc : b.shared_desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
        {isCustom && (
          <p className="flex items-center gap-1.5 mt-3 text-[10px] text-navy/45" style={{ fontFamily: 'Jost, sans-serif' }}>
            <span className="text-gold">✦</span>
            {b.private_only_note}
          </p>
        )}
      </div>

    </div>
  </div>
)}

                {/* ── Step 1: Boat Selection ── */}
                {step === 1 && (
                  <div>
                    <h3
                      className="text-navy text-center mb-8"
                      style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.375rem', fontWeight: 400 }}
                    >
                      {b.step_boat_title}
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {BOATS_CONFIG.filter(b => b.visible).map(({ id: boatId, fleetIdx }) => {
                        const boat = t.fleet.boats[fleetIdx]
                        const isSelected = form.boatId === boatId
                        return (
                          <button
                            key={boatId}
                            onClick={() => set('boatId', boatId)}
                            className={clsx(
                              'group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left cursor-pointer',
                              isSelected
                                ? 'border-gold shadow-[0_0_0_1px_rgba(201,169,110,0.2),0_8px_40px_rgba(201,169,110,0.28)] scale-[1.01]'
                                : 'border-navy/10 hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(201,169,110,0.12)]'
                            )}
                          >
                            {/* Gold top bar */}
                            <motion.div
                              className="absolute top-0 left-0 right-0 h-[2px] z-10"
                              style={{ background: 'linear-gradient(90deg, transparent, #C9A96E 35%, #E8D5A3 50%, #C9A96E 65%, transparent)' }}
                              animate={{ opacity: isSelected ? 1 : 0, scaleX: isSelected ? 1 : 0.3 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            />
                            {/* Boat image */}
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={`/images/${BOAT_IMAGES[boatId] ?? `${boatId}.webp`}`}
                                alt={boat.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                priority
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className={clsx('absolute inset-0 transition-all duration-300', isSelected ? 'bg-navy/15' : 'bg-navy/25')} />
                              {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent" />
                              )}
                              {/* Boat number badge */}
                              <div className="absolute top-3 left-3">
                                <motion.span
                                  animate={{
                                    background: isSelected ? '#C9A96E' : 'rgba(255,255,255,0.15)',
                                    color: isSelected ? '#0A1628' : '#ffffff',
                                  }}
                                  transition={{ duration: 0.25 }}
                                  className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm inline-block"
                                  style={{ fontFamily: 'Jost, sans-serif' }}
                                >
                                  {fleetIdx === 0 ? 'I' : 'II'}
                                </motion.span>
                              </div>
                              {/* Gold checkmark */}
                              <motion.div
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gold flex items-center justify-center shadow-lg"
                                animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.3 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <svg className="w-3.5 h-3.5 text-navy" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.div>
                            </div>

                            {/* Info */}
                            <div className={clsx('p-4 transition-colors duration-300', isSelected ? 'bg-gold/[0.07]' : 'bg-white')}>
                              <p
                                className={clsx('mb-1', isSelected ? 'text-navy' : 'text-navy/80')}
                                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 400 }}
                              >
                                {boat.name}
                              </p>
                              <p className={clsx('text-xs', isSelected ? 'text-navy/55' : 'text-navy/40')} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                                {boat.desc}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {errors.boatId && (
                      <p className="text-red-500 text-xs mt-4" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {errors.boatId}
                      </p>
                    )}
                  </div>
                )}

                {/* ── Step 2: Date & Time ── */}
                {step === 2 && (
                  <div>
                    <h3
                      className="text-navy text-center mb-8"
                      style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.375rem', fontWeight: 400 }}
                    >
                      {b.step2_title}
                    </h3>

                    {/* ── La Bella Vita: customize duration + onboard extras ── */}
                    {isCustom && (
                      <div className="mb-8 p-5 rounded-2xl border border-gold/25 bg-gold/[0.04]">
                        <p className="text-xs text-navy/55 tracking-widest uppercase mb-4 flex items-center gap-1.5" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.15em' }}>
                          <span className="text-gold">✦</span> {b.customize_title}
                        </p>

                        {/* Duration */}
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.duration_select_label} *
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                          {durationOptions.map((opt) => {
                            const active = form.durationHours === opt.hours
                            return (
                              <button
                                key={opt.hours}
                                type="button"
                                onClick={() => setDuration(opt.hours)}
                                className={clsx(
                                  'h-12 rounded-xl border text-xs transition-all duration-150 cursor-pointer flex items-center justify-center text-center px-1 leading-tight',
                                  active
                                    ? 'border-gold bg-gold/15 text-navy font-semibold shadow-[0_0_0_1px_rgba(201,169,110,0.18)]'
                                    : 'border-navy/10 bg-white text-navy/55 hover:border-gold/30'
                                )}
                                style={{ fontFamily: 'Jost, sans-serif' }}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                        {durationError && (
                          <p className="text-red-500 text-[10px] mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>{durationError}</p>
                        )}

                        {/* Onboard extras */}
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mt-5 mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.addons_label}
                        </label>
                        <p className="text-[11px] text-navy/45 mb-3" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                          {b.addons_hint}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {fixedAddons.map((addon) => {
                            const qty = form.addons[addon.id] || 0
                            return (
                              <div
                                key={addon.id}
                                className={clsx(
                                  'flex items-center justify-between gap-2 px-3 py-2 rounded-xl border bg-white transition-colors',
                                  qty > 0 ? 'border-gold/40' : 'border-navy/10'
                                )}
                              >
                                <div className="min-w-0">
                                  <p className="text-[12px] text-navy/80 truncate" style={{ fontFamily: 'Jost, sans-serif' }}>{addon.label}</p>
                                  <p className="text-[10px] text-navy/45" style={{ fontFamily: 'Jost, sans-serif' }}>{currency}{addon.price}</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    aria-label={`- ${addon.label}`}
                                    onClick={() => changeAddon(addon.id, -1)}
                                    disabled={qty === 0}
                                    className="w-7 h-7 rounded-lg border border-navy/15 text-navy/70 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold/40 cursor-pointer transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="w-5 text-center text-sm text-navy tabular-nums" style={{ fontFamily: 'Jost, sans-serif' }}>{qty}</span>
                                  <button
                                    type="button"
                                    aria-label={`+ ${addon.label}`}
                                    onClick={() => changeAddon(addon.id, 1)}
                                    className="w-7 h-7 rounded-lg border border-navy/15 text-navy/70 flex items-center justify-center hover:border-gold/40 hover:bg-gold/10 cursor-pointer transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Custom-priced "special setup" extra — toggle + required brief */}
                        {customAddon && (
                          <div
                            className={clsx(
                              'mt-2 px-3 py-3 rounded-xl border bg-white transition-colors',
                              customSetupSelected ? 'border-gold/40' : 'border-navy/10'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[12px] text-navy/80" style={{ fontFamily: 'Jost, sans-serif' }}>{customAddon.label}</p>
                                <p className="text-[10px] text-gold-dark" style={{ fontFamily: 'Jost, sans-serif' }}>
                                  {b.custom_price_label} · {b.custom_price_value}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleCustomSetup(customAddon.id)}
                                className={clsx(
                                  'flex-shrink-0 text-[11px] px-3 h-8 rounded-lg border cursor-pointer transition-colors',
                                  customSetupSelected
                                    ? 'border-gold bg-gold/15 text-navy font-medium'
                                    : 'border-navy/15 text-navy/70 hover:border-gold/40'
                                )}
                                style={{ fontFamily: 'Jost, sans-serif' }}
                              >
                                {customSetupSelected ? b.remove_label : b.add_label}
                              </button>
                            </div>
                            {customSetupSelected && (
                              <div className="mt-3">
                                <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-1.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                                  {b.custom_setup_desc_label} *
                                </label>
                                <textarea
                                  value={form.customSetupNote}
                                  onChange={e => {
                                    set('customSetupNote', e.target.value)
                                  }}
                                  rows={2}
                                  placeholder={b.custom_setup_placeholder}
                                  className={clsx('luxury-input resize-none', errors.customSetupNote && 'border-red-400 focus:ring-red-400')}
                                />
                                {errors.customSetupNote && (
                                  <p className="text-red-500 text-[10px] mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>{errors.customSetupNote}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Live total — original price struck through + progressive discount */}
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gold/20">
                          <span className="text-[11px] tracking-widest uppercase text-navy/50" style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.12em' }}>
                            {b.total_label}
                          </span>
                          <div className="text-right">
                            {liveBreakdown.discountRate > 0 && (
                              <div className="flex items-center justify-end gap-2 mb-0.5">
                                <span className="text-navy/40 line-through" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem' }}>
                                  {currency}{liveBreakdown.originalTotal}
                                </span>
                                <span className="text-[10px] font-semibold text-gold-dark bg-gold/15 px-1.5 py-0.5 rounded-full" style={{ fontFamily: 'Jost, sans-serif' }}>
                                  −{Math.round(liveBreakdown.discountRate * 100)}%
                                </span>
                              </div>
                            )}
                            <span className="text-navy" style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.5rem', fontWeight: 400 }}>
                              {currency}{liveBreakdown.total}
                            </span>
                            {liveBreakdown.discountRate > 0 && (
                              <p className="text-[10px] text-gold-dark mt-0.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                                {b.you_save_label} {currency}{liveBreakdown.originalTotal - liveBreakdown.total}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Calendar */}
                    <div className="mb-6">
                      <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {b.date_label} *
                      </label>
                      <CalendarPicker value={form.date} onChange={(d) => set('date', d)} lang={lang} />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {errors.date}
                        </p>
                      )}
                    </div>

                    {/* Time slots */}
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {b.time_label} *
                      </label>
                      <TimeSlotPicker
                        value={form.time}
                        onChange={(t) => set('time', t)}
                        options={b.time_options}
                        lockedIndex={LOCKED_TIMES[form.packageId]}
                        minIndex={TIME_MIN_INDEX[form.packageId]}
                        lockedNote={b.time_locked_note}
                      />
                      {errors.time && (
                        <p className="text-red-500 text-xs mt-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {errors.time}
                        </p>
                      )}
                    </div>

                    {/* Package description hint */}
                    {form.packageName && (
                      <div className="mt-6 p-4 rounded-xl bg-gold/8 border border-gold/20">
                        <p className="text-navy/60 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                          <span className="text-gold font-medium">✦ </span>
                          {t.packages.items.find(p => p.id === form.packageId)?.desc}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 3: Personal details ── */}
                {step === 3 && (
                  <div>
                    <h3
                      className="text-navy text-center mb-8"
                      style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.375rem', fontWeight: 400 }}
                    >
                      {b.step3_title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.name_label} *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => set('name', e.target.value)}
                          autoComplete="given-name"
                          className={clsx('luxury-input', errors.name && 'border-red-400')}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.surname_label} *
                        </label>
                        <input
                          type="text"
                          value={form.surname}
                          onChange={e => set('surname', e.target.value)}
                          autoComplete="family-name"
                          className={clsx('luxury-input', errors.surname && 'border-red-400')}
                        />
                        {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.email_label} *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => {
                              set('email', e.target.value);
                              if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                            }}
                            onBlur={e => handleBlur('email', e.target.value)}
                            autoComplete="email"
                            inputMode="email"
                            className={clsx('luxury-input', errors.email && 'border-red-400 focus:ring-red-400')}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-[10px] mt-1 animate-in fade-in slide-in-from-top-1">
                              {errors.email}
                            </p>
                          )}
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.phone_label} *
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => {
                              set('phone', e.target.value);
                              if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                            }}
                            onBlur={e => handleBlur('phone', e.target.value)}
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="+39..."
                            className={clsx('luxury-input', errors.phone && 'border-red-400 focus:ring-red-400')}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-[10px] mt-1 animate-in fade-in slide-in-from-top-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-navy/50 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {b.guests_label}
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => set('guests', String(n))}
                              className={clsx(
                                'flex-1 h-10 rounded-lg border text-sm transition-all duration-150 cursor-pointer',
                                form.guests === String(n)
                                  ? 'border-gold bg-gold/10 text-navy font-semibold'
                                  : 'border-navy/10 bg-white text-navy/55 hover:border-navy/25'
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
                          {b.notes_label}
                        </label>
                        <textarea
                          value={form.notes}
                          onChange={e => set('notes', e.target.value)}
                          rows={3}
                          placeholder={b.notes_placeholder}
                          className="luxury-input resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
                </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10">
                {step > 0 ? (
                  <button
                    onClick={goBack}
                    className="text-sm text-navy/50 hover:text-navy transition-colors flex items-center gap-2 cursor-pointer"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b.back}
                  </button>
                ) : (
                  <div />
                )}

                <LiquidGlassButton
                  variant="gold"
                  size="md"
                  onClick={handleNext}
                  disabled={isSending}
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {b.sending}
                    </span>
                  ) : step < 3 ? (
                    b.next
                  ) : (
                    b.submit_desktop
                  )}
                </LiquidGlassButton>
              </div>
            </>
          ) : (
            /* Success state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
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
                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.75rem', fontWeight: 400 }}
              >
                {b.success_title}
              </h3>
              <p className="text-navy/55 max-w-sm mx-auto" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                {b.success_desc}
              </p>
              <button
                onClick={() => { setSubmitted(false); setStep(0); setForm(INITIAL_FORM) }}
                className="mt-8 text-sm text-gold hover:text-gold-dark transition-colors cursor-pointer"
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {b.new_request}
              </button>
            </motion.div>
          )}
          </div>{/* /inner padding div */}
        </motion.div>
      </div>
    </section>
  )
}

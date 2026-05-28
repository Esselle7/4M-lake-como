'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import Image from 'next/image'
import LiquidGlassButton from '@/components/ui/LiquidGlassButton'
import clsx from 'clsx'

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
}

const BOAT_IMAGES: Record<string, string> = {
  'boat-1': 'boat-1-v2.0.webp',
  'boat-2': 'boat-2.webp',
}

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
    <div className="rounded-2xl p-4 border border-navy/8 bg-cream/30">
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
                isPast(day) && 'text-navy/15 cursor-not-allowed',
                !isPast(day) && !isSelected(day) && 'text-navy/65 hover:bg-gold/15 hover:text-navy',
                isSelected(day) && 'bg-gold text-navy font-semibold',
                isTodayCell(day) && !isSelected(day) && !isPast(day) && 'font-bold text-navy'
              )}
              style={{ fontFamily: 'Jost, sans-serif', boxShadow: isSelected(day) ? '0 2px 12px rgba(201,169,110,0.35)' : undefined }}
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
                'flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border transition-all duration-200 cursor-pointer',
                isSelected && !isDisabled
                  ? 'border-gold bg-gold/10 shadow-[0_2px_16px_rgba(201,169,110,0.25)]'
                  : !isDisabled
                  ? 'border-navy/10 bg-white hover:border-navy/20 hover:bg-cream/50'
                  : 'border-navy/5 bg-navy/2 opacity-30 cursor-not-allowed'
              )}
            >
              <span className={clsx('transition-colors', isSelected ? 'text-gold' : 'text-navy/35')}>
                {TIME_ICONS[idx]}
              </span>
              <span
                className={clsx(
                  'text-[10px] text-center leading-snug',
                  isSelected ? 'text-navy font-medium' : 'text-navy/55'
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
    <div className="flex items-center justify-center gap-3 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <motion.div
            animate={{
              background: i <= step ? '#C9A96E' : 'transparent',
              scale: i === step ? 1.1 : 1,
              borderColor: i <= step ? '#C9A96E' : 'rgba(10, 22, 40, 0.2)',
            }}
            className="w-6 h-6 rounded-full border flex items-center justify-center"
            transition={{ duration: 0.3 }}
          >
            {i < step ? (
              <svg className="w-3 h-3 text-navy" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span
                className={clsx('text-[9px]', i <= step ? 'text-navy' : 'text-navy/30')}
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
              >
                {i + 1}
              </span>
            )}
          </motion.div>
          {i < total - 1 && (
            <motion.div
              animate={{ background: i < step ? '#C9A96E' : 'rgba(10, 22, 40, 0.12)' }}
              className="w-6 h-px"
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      ))}
      <span
        className="ml-2 text-xs text-navy/40"
        style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.08em' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookingForm() {
  const { t, lang } = useLang()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSending, setIsSending] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const b = t.booking
  const packages = t.packages.items

  const timeOptionsRef = useRef(b.time_options)
  useEffect(() => { timeOptionsRef.current = b.time_options }, [b.time_options])

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, name } = (e as CustomEvent<{ id: string; name: string }>).detail
      const lockedIdx = LOCKED_TIMES[id]
      const minIdx = TIME_MIN_INDEX[id]
      setForm(prev => {
        const currentTimeIdx = timeOptionsRef.current.indexOf(prev.time)
        const nowBelowMin = minIdx !== undefined && currentTimeIdx >= 0 && currentTimeIdx < minIdx
        return {
          ...prev,
          packageId: id,
          packageName: name,
          time: lockedIdx !== undefined
            ? timeOptionsRef.current[lockedIdx]
            : nowBelowMin ? '' : prev.time,
        }
      })
      setErrors({})
      setStep(0)
    }
    window.addEventListener('selectPackage', handler)
    return () => window.removeEventListener('selectPackage', handler)
  }, [])

  const set = (field: keyof FormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validateStep(): boolean {
    const errs: Partial<FormData> = {}
    if (step === 0 && !form.packageId) errs.packageId = b.required
    if (step === 1 && !form.boatId) errs.boatId = b.boat_required
    if (step === 2) {
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
    return Object.keys(errs).length === 0
  }

  function buildMessage() {
    const modeText = form.mode === 'private' ? b.private : b.shared
    const boatName = form.boatId === 'boat-1' ? t.fleet.boats[0].name : t.fleet.boats[1].name
    return `Vorrei richiedere una prenotazione per il pacchetto "${form.packageName}" in modalità ${modeText}. Imbarcazione: ${boatName}. Data: ${form.date} alle ore ${form.time}. Gruppo composto da ${form.guests} persone. Nome: ${form.name} ${form.surname}. Contatto: ${form.phone} - ${form.email}. Note: ${form.notes || 'Nessuna nota specifica'}.`
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
    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, message }),
      })
      if (!response.ok) throw new Error('Errore invio mail')
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
          className="bg-white rounded-2xl shadow-luxury p-8 md:p-12 border border-navy/6"
        >
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
                  'text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer w-full flex flex-col justify-between min-h-[140px]',
                  selected
                    ? 'border-gold bg-gold/8 shadow-glass-gold'
                    : 'border-navy/10 hover:border-navy/20 bg-white hover:bg-cream/50'
                )}
              >
                <div>
                  <div className="flex items-start justify-between mb-1 gap-2">
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
                          ? 'bg-gold/15 text-gold-dark'
                          : 'bg-navy/6 text-navy/50'
                      )}
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      {pkg.type === 'premium' ? 'PREMIUM' : 'STD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-gold text-[10px]">✦</span>
                    <span className="text-[10px] text-navy/60" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {pkg.duration_label}
                    </span>
                  </div>
                  <p className="text-[9px] text-navy/40 leading-snug" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {pkg.includes}
                  </p>
                </div>

                <div className="flex items-center justify-end mt-auto">
                  <span
                    className={clsx(selected ? 'text-navy' : 'text-navy/75')}
                    style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.125rem', fontWeight: 400 }}
                  >
                    {t.packages.currency}{pkg.price}
                  </span>
                </div>
                {selected && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-4 right-4 h-px bg-gold"
                  />
                )}
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
            return (
              <button
                key={mode}
                onClick={() => set('mode', mode)}
                className={clsx(
                  'group relative overflow-hidden rounded-xl border transition-all duration-300 text-left cursor-pointer w-full',
                  isSelected ? 'border-gold shadow-glass-gold' : 'border-navy/10 hover:border-navy/20'
                )}
              >
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
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-gold/25 to-transparent" />}
                </div>
                <div className={clsx('p-4 transition-colors duration-300', isSelected ? 'bg-gold/8' : 'bg-white')}>
                  <p
                    className={clsx('mb-0.5', isSelected ? 'text-navy' : 'text-navy/80')}
                    style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 400 }}
                  >
                    {mode === 'private' ? b.private_title : b.shared_title}
                  </p>
                  <p className="text-[10px] text-navy/45 leading-tight" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                    {mode === 'private' ? b.private_desc : b.shared_desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
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
                      {(['boat-1', 'boat-2'] as const).map((boatId, idx) => {
                        const boat = t.fleet.boats[idx]
                        const isSelected = form.boatId === boatId
                        return (
                          <button
                            key={boatId}
                            onClick={() => set('boatId', boatId)}
                            className={clsx(
                              'group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left cursor-pointer',
                              isSelected
                                ? 'border-gold shadow-[0_4px_24px_rgba(201,169,110,0.25)]'
                                : 'border-navy/10 hover:border-navy/25'
                            )}
                          >
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
                              <div className="absolute inset-0 bg-navy/20" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-t from-gold/25 to-transparent" />
                              )}
                              {isSelected && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                              )}
                              {/* Boat number badge */}
                              <div className="absolute top-3 left-3">
                                <span
                                  className={clsx(
                                    'text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full',
                                    isSelected
                                      ? 'bg-gold text-navy'
                                      : 'bg-white/15 text-white backdrop-blur-sm'
                                  )}
                                  style={{ fontFamily: 'Jost, sans-serif' }}
                                >
                                  {idx === 0 ? 'I' : 'II'}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className={clsx('p-4 transition-colors duration-300', isSelected ? 'bg-gold/8' : 'bg-white')}>
                              <p
                                className={clsx('mb-1', isSelected ? 'text-navy' : 'text-navy/80')}
                                style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 400 }}
                              >
                                {boat.name}
                              </p>
                              <p className="text-xs text-navy/45" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
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
        </motion.div>
      </div>
    </section>
  )
}

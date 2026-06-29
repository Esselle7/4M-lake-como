'use client'

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LanguageHint from '@/components/LanguageHint'
import clsx from 'clsx'

const GYG_SIZE = 40  // ← modifica questo per ridimensionare il logo GetYourGuide

const INSTAGRAM_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
)

const NAV_PAGES = [
  { href: '/', labelKey: 'home' as const },
  { href: '/booking', labelKey: 'booking' as const },
  { href: '/story', labelKey: 'visual_story' as const },
]

// ISOLA COMACINA EVENT (remove after 2026-06-27) — temporary highlighted nav link.
const ISOLA_COMACINA_HREF = '/book-isola-comacina'

export default function GlowMenu() {
  const { t } = useLang()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 60)
  })

  // On non-home pages, always use frosted glass (no dark hero beneath)
  const showFrost = pathname !== '/' || scrolled

  return (
    <>
      <LanguageHint />
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <motion.div
          className="mx-4 mt-3 rounded-2xl overflow-hidden"
          animate={{
            backgroundColor: showFrost ? 'rgba(10, 22, 40, 0.78)' : 'rgba(10, 22, 40, 0)',
            backdropFilter: showFrost ? 'blur(24px) saturate(1.8)' : 'blur(0px)',
            borderColor: showFrost ? 'rgba(201, 169, 110, 0.15)' : 'rgba(255, 255, 255, 0)',
          }}
          style={{
            border: '1px solid',
            backgroundColor: 'rgba(10, 22, 40, 0)',
            borderColor: 'rgba(255, 255, 255, 0)',
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex items-center justify-between px-5 py-3.5">

            {/* Logo */}

            <Link href="/" className="flex items-center gap-5 cursor-pointer group" aria-label="Home">
              <div className="relative w-[180x] h-[60px] -mr-3">
                <Image
                src="/images/logo.png"
                alt="4M Luxury Boats — Home"
                width={130}
                height={52}
                sizes="130px"
                quality={85}
                priority
                className="h-[50px] w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-white/90 text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Luxury Boats
                </span>
                <span className="text-gold/70 text-[7px] tracking-[0.18em] uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Lake Como
                </span>
              </div>
            </Link>

            {/* Mobile center title — visible only on mobile (lg:hidden) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none lg:hidden pointer-events-none">
              <span className="text-white/90 text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
                Luxury Boats
              </span>
              <span className="text-gold/70 text-[7px] tracking-[0.18em] uppercase" style={{ fontFamily: 'Jost, sans-serif' }}>
                Lake Como
              </span>
            </div>

            {/* Desktop 3-page nav — LumaBar glow effect */}
            <ul className="hidden lg:flex items-center gap-1" role="list">
              {NAV_PAGES.map((page) => {
                const isActive = pathname === page.href
                return (
                  <li key={page.href} className="relative">
                    <Link
                      href={page.href}
                      scroll={false}
                      className="relative flex items-center justify-center px-5 py-2.5 rounded-xl"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* LumaBar-style: gold radial glow slides between active items */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-glow-orb"
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(ellipse at 50% 60%, rgba(201,169,110,0.28) 0%, rgba(201,169,110,0.08) 50%, transparent 80%)',
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Gold dot — glides to active item */}
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                          style={{ boxShadow: '0 0 8px 3px rgba(201, 169, 110, 0.55)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Label — scales up when active */}
                      <motion.span
                        animate={{
                          scale: isActive ? 1.06 : 1,
                          color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.65)',
                        }}
                        whileHover={{ color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.9)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="relative z-10 text-xs tracking-widest uppercase whitespace-nowrap"
                        style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.12em' }}
                      >
                        {t.nav[page.labelKey]}
                      </motion.span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* ISOLA COMACINA EVENT — disabled until next season. Flip `false` to `true` to restore. */}
            {false && (
            <Link
              href={ISOLA_COMACINA_HREF}
              scroll={false}
              className="hidden lg:flex relative items-center gap-1.5 ml-2 px-4 py-2 rounded-xl border border-gold/40 overflow-hidden group"
              aria-current={pathname === ISOLA_COMACINA_HREF ? 'page' : undefined}
            >
              {/* Animated fireworks glow */}
              <motion.span
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.35) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(232,213,163,0.25) 0%, transparent 55%)',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Sparkle dot */}
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-gold"
                style={{ boxShadow: '0 0 6px 2px rgba(201,169,110,0.7)' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                className="relative z-10 text-xs tracking-widest uppercase whitespace-nowrap text-gold"
                style={{ fontFamily: 'Jost, sans-serif', letterSpacing: '0.12em', fontWeight: 600 }}
              >
                {t.isola_comacina.nav_label}
              </span>
            </Link>
            )}

            {/* Right: social icons + language (desktop only) + mobile burger */}
            <div className="flex items-center gap-3">
              {/* Social icons — desktop only */}
              <div className="hidden lg:flex items-center gap-1.5">
                <a
                  href="https://www.instagram.com/4mlakecomo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors duration-200"
                >
                  {INSTAGRAM_ICON}
                </a>
                <a
                  href="https://www.getyourguide.com/4mlake-s747478"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GetYourGuide"
                  className="flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity duration-200"
                  style={{ width: GYG_SIZE + 8, height: GYG_SIZE + 8 }}
                >
                  <Image src="/images/gyg.webp" alt="GetYourGuide" width={GYG_SIZE} height={GYG_SIZE} style={{ width: GYG_SIZE, height: GYG_SIZE }} className="object-contain brightness-0 invert" />
                </a>
              </div>
              <div className="hidden lg:block">
                <LanguageSwitcher onDark />
              </div>
              <button
                className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
                onClick={() => setMenuOpen((p) => !p)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <motion.span
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                  className="block h-px w-6 bg-white origin-center"
                />
                <motion.span
                  animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                  className="block h-px w-4 bg-white/60"
                />
                <motion.span
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                  className="block h-px w-6 bg-white origin-center"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{ background: 'rgba(10, 22, 40, 0.97)', backdropFilter: 'blur(24px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {NAV_PAGES.map((page, i) => {
                const isActive = pathname === page.href
                return (
                  <motion.div
                    key={page.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    <Link
                      href={page.href}
                      scroll={false}
                      onClick={() => setMenuOpen(false)}
                      className={clsx(
                        'text-2xl tracking-widest uppercase transition-colors duration-200',
                        isActive ? 'text-gold' : 'text-white/70 hover:text-white'
                      )}
                      style={{ fontFamily: 'Bodoni Moda, serif', fontStyle: 'italic' }}
                    >
                      {t.nav[page.labelKey]}
                    </Link>
                  </motion.div>
                )
              })}
              {/* ISOLA COMACINA EVENT — disabled until next season. Flip `false` to `true` to restore. */}
              {false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_PAGES.length * 0.07 + 0.1 }}
                className="mt-2"
              >
                <Link
                  href={ISOLA_COMACINA_HREF}
                  scroll={false}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-gold"
                    style={{ boxShadow: '0 0 6px 2px rgba(201,169,110,0.7)' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span
                    className="text-lg tracking-widest uppercase text-gold"
                    style={{ fontFamily: 'Bodoni Moda, serif', fontStyle: 'italic' }}
                  >
                    {t.isola_comacina.nav_label}
                  </span>
                </Link>
              </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4"
              >
                <LanguageSwitcher onDark />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                className="flex items-center gap-5 mt-2"
              >
                <a
                  href="https://www.instagram.com/4mlakecomo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all duration-200"
                >
                  {INSTAGRAM_ICON}
                </a>
                <a
                  href="https://www.getyourguide.com/4mlake-s747478"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GetYourGuide"
                  className="flex items-center justify-center rounded-full border border-white/15 opacity-50 hover:opacity-100 hover:border-white/35 transition-all duration-200"
                  style={{ width: GYG_SIZE + 8, height: GYG_SIZE + 8 }}
                >
                  <Image src="/images/gyg.webp" alt="GetYourGuide" width={GYG_SIZE} height={GYG_SIZE} style={{ width: GYG_SIZE, height: GYG_SIZE }} className="object-contain brightness-0 invert" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

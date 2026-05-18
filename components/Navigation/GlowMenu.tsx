'use client'

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import clsx from 'clsx'

const NAV_PAGES = [
  { href: '/', labelKey: 'home' as const },
  { href: '/booking', labelKey: 'booking' as const },
  { href: '/storia', labelKey: 'visual_story' as const },
]

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
                alt="4M Luxury Boats"
                width={130}
                height={52}
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

            {/* Right: language (desktop only) + mobile burger */}
            <div className="flex items-center gap-3">
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4"
              >
                <LanguageSwitcher onDark />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

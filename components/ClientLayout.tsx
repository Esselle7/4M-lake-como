'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/hooks/useLenis'
import GlowMenu from '@/components/Navigation/GlowMenu'
import PageTransition from '@/components/PageTransition'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useLenis()
  const pathname = usePathname()

  // useLayoutEffect fires synchronously after DOM mutations but BEFORE the browser
  // paints — scroll is at 0 before the user ever sees the new page state.
  useLayoutEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, lenisRef])

  return (
    <>
      <GlowMenu />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  )
}

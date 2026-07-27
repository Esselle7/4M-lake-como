'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Widget Cloudflare Turnstile — anti-bot sui form che spediscono email.
// Il token prodotto qui va verificato lato server (lib/verify-turnstile.ts):
// da solo il widget non protegge nulla, chiunque può saltarlo con un POST diretto.
// ─────────────────────────────────────────────────────────────────────────────

import Script from 'next/script'
import { useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const boxRef = useRef<HTMLDivElement>(null)

  // Senza site key il widget non può esistere: non renderizzare nulla invece di
  // mostrare un riquadro rotto. Il server rifiuta comunque (fail closed).
  if (!SITE_KEY) return null

  return (
    <>
      <div ref={boxRef} className="flex justify-center my-4" />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        // onReady (non onLoad) scatta anche se lo script era già in cache da un
        // mount precedente — senza, tornando sullo step il widget resta vuoto.
        onReady={() => {
          if (!boxRef.current || boxRef.current.childElementCount > 0) return
          window.turnstile?.render(boxRef.current, {
            sitekey: SITE_KEY,
            callback: (token: string) => onToken(token),
            'expired-callback': () => onToken(''),
            'error-callback': () => onToken(''),
          })
        }}
      />
    </>
  )
}

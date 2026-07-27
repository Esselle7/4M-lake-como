// ─────────────────────────────────────────────────────────────────────────────
// Verifica server-side del token Turnstile. È QUESTO il controllo che protegge:
// il widget nel browser è solo l'interfaccia, un bot fa POST diretto e lo salta.
// Fail closed: qualunque dubbio (secret mancante, token assente, rete giù) → false.
// ─────────────────────────────────────────────────────────────────────────────

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Misconfigurazione, non attacco: va vista nei log, non ignorata in silenzio.
    console.error('TURNSTILE_SECRET_KEY mancante — richiesta rifiutata.')
    return false
  }
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)

  try {
    const res = await fetch(SITEVERIFY, { method: 'POST', body })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('Turnstile siteverify irraggiungibile:', err)
    return false
  }
}

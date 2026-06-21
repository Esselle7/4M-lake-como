'use client'

// ─────────────────────────────────────────────────────────────────────────────
// FireworksCanvas — lightweight gold particle fireworks for the Isola Comacina event.
// ISOLA COMACINA EVENT (remove after 2026-06-27)
// ─────────────────────────────────────────────────────────────────────────────
// Canvas-based, requestAnimationFrame-driven. Respects prefers-reduced-motion
// (renders nothing). Auto-pauses when the tab is hidden. Self-cleans on unmount.

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number   // 0..1 — 1 = just born, 0 = dead
  decay: number
  size: number
  hue: number    // gold range
  alpha: number
}

interface Firework {
  x: number
  y: number       // current rocket position
  vy: number      // upward velocity (negative)
  targetY: number // explode altitude
  trail: Array<{ x: number; y: number; life: number }>
  exploded: boolean
}

interface Props {
  /** Tailwind/CSS color of the rocket trail. Defaults to gold. */
  className?: string
  /** Density multiplier — lower = fewer fireworks. Default 1. */
  density?: number
  /** Disable the rocket launch trail (just ambient bursts). */
  ambientOnly?: boolean
}

const GOLD_HUES = [38, 42, 46, 50] // warm gold → champagne range
const PARTICLE_PALETTE = ['#C9A96E', '#E8D5A3', '#F5E6C8', '#FFE9B0', '#D4AF6A']

export default function FireworksCanvas({ className, density = 1, ambientOnly = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Respect reduced-motion: render nothing, exit.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let width = 0
    let height = 0
    let dpr = 1
    let rafId = 0
    let lastLaunch = 0
    let running = true

    const fireworks: Firework[] = []
    const particles: Particle[] = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const launch = () => {
      if (ambientOnly) {
        // Ambient: explode directly at a random high point, no rocket.
        const x = width * (0.15 + Math.random() * 0.7)
        const y = height * (0.15 + Math.random() * 0.35)
        explode(x, y)
        return
      }
      const x = width * (0.1 + Math.random() * 0.8)
      const targetY = height * (0.12 + Math.random() * 0.3)
      fireworks.push({
        x,
        y: height + 10,
        vy: -(7 + Math.random() * 3),
        targetY,
        trail: [],
        exploded: false,
      })
    }

    const explode = (x: number, y: number) => {
      const count = 38 + Math.floor(Math.random() * 22)
      const baseHue = GOLD_HUES[Math.floor(Math.random() * GOLD_HUES.length)]
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3
        const speed = 1.4 + Math.random() * 2.6
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.011 + Math.random() * 0.012,
          size: 1.2 + Math.random() * 1.8,
          hue: baseHue + (Math.random() * 8 - 4),
          alpha: 1,
        })
      }
    }

    const step = (ts: number) => {
      if (!running) return
      rafId = requestAnimationFrame(step)

      // Gentle trail fade — semi-transparent black fill creates the motion blur.
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(7, 16, 30, 0.18)'
      ctx.fillRect(0, 0, width, height)

      // Launch cadence — scaled by density, randomized for organic feel.
      const cadence = ambientOnly ? 1400 : 1900
      if (ts - lastLaunch > cadence / density + Math.random() * 700) {
        launch()
        lastLaunch = ts
      }

      // ── Rockets ──
      ctx.globalCompositeOperation = 'lighter'
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i]
        fw.y += fw.vy
        fw.vy += 0.04 // gravity slows the ascent
        fw.trail.push({ x: fw.x, y: fw.y, life: 1 })
        if (fw.trail.length > 14) fw.trail.shift()

        // Draw trail
        for (let t = 0; t < fw.trail.length; t++) {
          const p = fw.trail[t]
          p.life -= 0.07
          if (p.life <= 0) continue
          const r = 1.6 * p.life
          ctx.fillStyle = `rgba(232, 213, 163, ${p.life * 0.7})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fill()
        }

        // Explode at apex
        if (fw.y <= fw.targetY || fw.vy >= 0) {
          explode(fw.x, fw.y)
          fireworks.splice(i, 1)
        }
      }

      // ── Particles ──
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.038 // gravity
        p.vx *= 0.985 // air drag
        p.vy *= 0.985
        p.life -= p.decay
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // Twinkle: alpha oscillates slightly for a sparkle effect.
        const twinkle = 0.75 + 0.25 * Math.sin(ts * 0.012 + p.x)
        p.alpha = p.life * twinkle
        const color = PARTICLE_PALETTE[Math.floor((p.hue / 54) * PARTICLE_PALETTE.length) % PARTICLE_PALETTE.length]
        // Parse hex → rgba for alpha control
        const hex = color.replace('#', '')
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)

        // Soft glow halo
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.25})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const onVisibility = () => {
      running = !document.hidden
      if (running) {
        rafId = requestAnimationFrame(step)
      } else {
        cancelAnimationFrame(rafId)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    rafId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, ambientOnly])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

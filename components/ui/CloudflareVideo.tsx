'use client'

import { useEffect, useRef } from 'react'

interface CloudflareVideoProps {
  /** Path of the video file relative to NEXT_PUBLIC_MEDIA_URL (e.g. "hero.mp4") */
  src: string
  /** Optional WebM source for browsers that support it (smaller file) */
  webmSrc?: string
  /** Poster image (passed through the same media loader). Used as LCP frame. */
  poster?: string
  className?: string
  style?: React.CSSProperties
  /** Auto-pause when scrolled out of view to save CPU/bandwidth */
  pauseWhenOffscreen?: boolean
}

/**
 * Hero/background video served from Cloudflare R2 + CDN.
 * Free-tier compatible: no Cloudflare Stream needed.
 *
 * Expected file layout in R2 (uploaded once, manually):
 *   - hero.mp4   (H.264, ≤ 6 MB, 1080p max, no audio for hero)
 *   - hero.webm  (VP9, optional, ~30% smaller)
 *   - hero-poster.jpg (LCP frame, served via Image Transformations)
 */
export default function CloudflareVideo({
  src,
  webmSrc,
  poster,
  className,
  style,
  pauseWhenOffscreen = true,
}: CloudflareVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const base = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const buildUrl = (path: string) => {
    if (path.startsWith('http')) return path
    if (!base) return `/${path.replace(/^\/+/, '')}`
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
  }

  useEffect(() => {
    if (!pauseWhenOffscreen) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [pauseWhenOffscreen])

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      poster={poster ? buildUrl(poster) : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disableRemotePlayback
      controls={false}
    >
      {webmSrc && <source src={buildUrl(webmSrc)} type="video/webm" />}
      <source src={buildUrl(src)} type="video/mp4" />
    </video>
  )
}

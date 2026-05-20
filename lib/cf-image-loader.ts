interface LoaderArgs {
  src: string
  width: number
  quality?: number
}

export default function cfImageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src

  const base = process.env.NEXT_PUBLIC_MEDIA_URL
  if (!base) return src

  const q = quality ?? 75
  const path = src.replace(/^\/+/, '')
  const cleanBase = base.replace(/\/+$/, '')

  return `${cleanBase}/cdn-cgi/image/width=${width},quality=${q},format=auto,fit=scale-down/${path}`
}

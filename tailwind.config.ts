import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        'navy-mid': '#1A2F4E',
        'navy-light': '#2A4A6E',
        gold: '#C9A96E',
        'gold-light': '#E8D5A3',
        'gold-dark': '#A07840',
        cream: '#F5F0E8',
        'white-warm': '#FAFAF8',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        float: 'float 8s ease-in-out infinite',
        'water-ripple': 'waterRipple 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
          '100%': { transform: 'translateX(350%) skewX(-15deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        waterRipple: {
          '0%, 100%': { transform: 'scale(1) translateX(0)' },
          '33%': { transform: 'scale(1.02) translateX(-4px)' },
          '66%': { transform: 'scale(0.99) translateX(4px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #E8D5A3 50%, #C9A96E 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0A1628 0%, #1A2F4E 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(10, 22, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-gold': '0 8px 32px rgba(201, 169, 110, 0.2), inset 0 1px 0 rgba(255,255,255,0.25)',
        luxury: '0 24px 64px rgba(10, 22, 40, 0.16)',
        'luxury-sm': '0 8px 24px rgba(10, 22, 40, 0.10)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'luxury-in': 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
      },
    },
  },
  plugins: [],
}

export default config

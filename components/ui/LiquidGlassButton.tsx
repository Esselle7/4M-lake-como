'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface LiquidGlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'light' | 'dark' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  fullWidth?: boolean
}

export default function LiquidGlassButton({
  children,
  variant = 'light',
  size = 'md',
  icon,
  fullWidth = false,
  className,
  ...props
}: LiquidGlassButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm gap-2',
    md: 'px-7 py-3.5 text-sm gap-2.5',
    lg: 'px-9 py-4 text-base gap-3',
  }

  const variantClasses = {
    light: 'glass-btn text-white',
    dark: 'glass-btn glass-btn-dark text-white',
    gold: 'bg-gold text-navy border border-gold-dark/30 hover:bg-gold-dark transition-colors duration-300',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={clsx(
        'relative overflow-hidden rounded-full inline-flex items-center justify-center',
        'font-body font-500 tracking-wide cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500, letterSpacing: '0.04em' }}
      {...props}
    >
      {/* Shimmer sweep */}
      {variant !== 'gold' && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)',
            backgroundSize: '250% 100%',
          }}
          initial={{ backgroundPosition: '150% center' }}
          whileHover={{ backgroundPosition: '-50% center' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}

      {/* Inner glow ring on hover */}
      {variant !== 'gold' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(201, 169, 110, 0.4)' }}
        />
      )}

      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

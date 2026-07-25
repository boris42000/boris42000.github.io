import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'ghost' | 'outline' | 'light'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition ' +
  'duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  // Gold fill — the one loud element on the page, reserved for the primary action.
  primary:
    'bg-accent text-ink shadow-[var(--shadow-gold)] hover:bg-accent-hi hover:-translate-y-0.5',
  // For use on dark backgrounds.
  ghost: 'text-white ring-1 ring-white/25 hover:bg-white/10 hover:ring-white/40',
  // For use on light backgrounds.
  outline: 'text-ink ring-1 ring-ink/15 hover:bg-surface hover:ring-ink/25',
  light: 'bg-white text-ink hover:bg-brand-50 shadow-[var(--shadow-soft)]',
}

const sizes: Record<Size, string> = {
  // 44px min — the smallest reliable touch target.
  md: 'min-h-11 px-5 text-[0.9rem]',
  lg: 'min-h-[3.25rem] px-7 text-[0.95rem]',
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </a>
  )
}

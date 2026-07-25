import { useEffect, useRef } from 'react'
import { Mail, Phone, X } from 'lucide-react'
import { company, nav } from '../../content/site'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { cn } from '../../lib/cn'
import { LogoLockup } from '../ui/Logo'

export function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean
  onClose: () => void
  active: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useLockBodyScroll(open)

  // Esc to close, and keep Tab inside the panel while it's open.
  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      // `inert` rather than `aria-hidden`: aria-hidden on a container that still
      // holds focusable links is an a11y violation, since keyboard users can tab
      // into content screen readers are told doesn't exist. `inert` removes it
      // from both the a11y tree and the tab order.
      inert={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'grain absolute inset-0 flex flex-col bg-[linear-gradient(168deg,#0f2e4a_0%,#0b1b2b_100%)]',
          'transition-transform duration-400 ease-[var(--ease-out-soft)]',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="shell flex h-20 shrink-0 items-center justify-between">
          <LogoLockup tone="light" />
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Zavrieť menu"
            className="grid size-11 place-items-center rounded-full text-white ring-1 ring-white/25 transition hover:bg-white/10"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Mobilná navigácia"
          className="shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-6"
        >
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
              style={{ transitionDelay: open ? `${120 + i * 45}ms` : '0ms' }}
              className={cn(
                'font-display text-[1.75rem] font-semibold tracking-tight transition-all duration-500 ease-[var(--ease-out-soft)]',
                // 56px rows — comfortable thumb targets.
                'flex min-h-14 items-center border-b border-white/8',
                active === item.href.slice(1) ? 'text-accent' : 'text-white',
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div
          className="shell shrink-0 space-y-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4"
          style={{ transitionDelay: '380ms' }}
        >
          <a
            href={company.phoneHref}
            className="flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-accent px-6 font-semibold text-ink transition hover:bg-accent-hi"
          >
            <Phone size={18} aria-hidden="true" />
            {company.phone}
          </a>
          <a
            href={company.emailHref}
            className="flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-6 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10"
          >
            <Mail size={18} aria-hidden="true" />
            {company.email}
          </a>
        </div>
      </div>
    </div>
  )
}

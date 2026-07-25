import { useEffect, useRef, useState } from 'react'
import { Menu, Phone } from 'lucide-react'
import { company, nav } from '../../content/site'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { cn } from '../../lib/cn'
import { LogoLockup } from '../ui/Logo'
import { ButtonLink } from '../ui/Button'
import { MobileMenu } from './MobileMenu'

const SECTION_IDS = nav.map((n) => n.href.slice(1))

export function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const active = useScrollSpy(SECTION_IDS)

  // A 1px sentinel at the top of the page drives the condensed state — no scroll listener.
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setCondensed(!entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} className="absolute left-0 top-20 h-px w-px" aria-hidden="true" />

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-[var(--ease-out-soft)]',
          condensed
            ? 'bg-paper/85 shadow-[0_1px_0_rgb(11_27_43/0.07),0_8px_28px_-16px_rgb(11_27_43/0.35)] backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div className="shell">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-400',
              condensed ? 'h-16' : 'h-20 sm:h-24',
            )}
          >
            <a
              href="#domov"
              className="shrink-0 rounded-lg"
              aria-label={`${company.brand} — domov`}
            >
              <LogoLockup tone={condensed ? 'dark' : 'light'} />
            </a>

            {/* Desktop nav */}
            <nav aria-label="Hlavná navigácia" className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[0.875rem] font-semibold transition-colors',
                      condensed
                        ? isActive
                          ? 'text-primary'
                          : 'text-slate hover:text-primary'
                        : isActive
                          ? 'text-white'
                          : 'text-white/70 hover:text-white',
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-[var(--ease-out-soft)]',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Wrapper, not `hidden` on the button itself — `hidden` and the
                  button's own `inline-flex` are both unprefixed display
                  utilities, so which wins depends on stylesheet order. */}
              <span className="hidden sm:block">
                <ButtonLink
                  href={company.phoneHref}
                  variant={condensed ? 'outline' : 'ghost'}
                >
                  <Phone size={16} aria-hidden="true" />
                  {company.phone}
                </ButtonLink>
              </span>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Otvoriť menu"
                aria-expanded={menuOpen}
                className={cn(
                  'grid size-11 place-items-center rounded-full transition lg:hidden',
                  condensed
                    ? 'text-ink ring-1 ring-ink/12 hover:bg-surface'
                    : 'text-white ring-1 ring-white/25 hover:bg-white/10',
                )}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </>
  )
}

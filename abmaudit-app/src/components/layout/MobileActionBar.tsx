import { useEffect, useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { company } from '../../content/site'
import { cn } from '../../lib/cn'

/**
 * Fixed call/write bar for phones.
 *
 * A local firm's phone number should never be more than one thumb-reach away.
 * Appears once the hero has scrolled past and hides again over the contact
 * section, so it never sits on top of the contact form's own buttons.
 */
export function MobileActionBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('domov')
    const contact = document.getElementById('kontakt')
    if (!hero) return

    let heroGone = false
    let atContact = false
    const sync = () => setVisible(heroGone && !atContact)

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) heroGone = !entry.isIntersecting
          if (entry.target === contact) atContact = entry.isIntersecting
        }
        sync()
      },
      { threshold: 0 },
    )

    io.observe(hero)
    if (contact) io.observe(contact)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 transition-transform duration-400 ease-[var(--ease-out-soft)] lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="border-t border-line bg-paper/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_28px_-16px_rgb(11_27_43/0.35)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-md gap-2.5">
          <a
            href={company.phoneHref}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[0.9rem] font-semibold text-ink transition active:scale-[0.98]"
          >
            <Phone size={17} aria-hidden="true" />
            Zavolať
          </a>
          <a
            href="#kontakt"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-[0.9rem] font-semibold text-ink ring-1 ring-ink/15 transition active:scale-[0.98]"
          >
            <Mail size={17} aria-hidden="true" />
            Napísať
          </a>
        </div>
      </div>
    </div>
  )
}

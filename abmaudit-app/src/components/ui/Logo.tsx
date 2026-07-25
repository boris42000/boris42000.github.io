import { cn } from '../../lib/cn'

/**
 * ABM AUDIT monogram, hand-traced from the original 2755×2532 PNG.
 *
 * Thin-stroke geometric letterforms drawn as columns with semicircular caps —
 * the A's arch and low crossbar, the B's two bowls, the M's two arches whose
 * right leg turns into the long baseline that "audit" sits under.
 *
 * Uses `currentColor`, so one component serves the dark nav, the white footer
 * and the low-opacity hero watermark with a single text-colour utility.
 */
export function Logo({
  className,
  withWordmark = true,
  title = 'ABM AUDIT s.r.o.',
}: {
  className?: string
  /** Set false for the tight monogram-only lockup (favicons, watermarks). */
  withWordmark?: boolean
  title?: string
}) {
  return (
    <svg
      viewBox={withWordmark ? '0 0 2010 1850' : '0 0 1480 1850'}
      // No default sizing utility here: it would collide with the caller's own
      // h-* class and Tailwind resolves that by stylesheet order, not by the
      // order the classes are written in.
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={48}
      strokeLinecap="butt"
      strokeLinejoin="round"
    >
      {/* A — arch, two legs, crossbar running off to the left */}
      <path d="M120 1815 V148 A117.5 117.5 0 0 1 355 148 V1815" />
      <path d="M8 1295 H355" />

      {/* B — stem and two bowls */}
      <path d="M530 1815 V660 H670 A110 110 0 0 1 780 770 V1130 A110 110 0 0 1 670 1240 H530" />
      <path d="M530 1240 H690 A110 110 0 0 1 800 1350 V1705 A110 110 0 0 1 690 1815 H530" />

      {/* M — two arches; the right leg becomes the baseline */}
      <path d="M985 1815 V690 A115 115 0 0 1 1215 690 V1815" />
      <path
        d={
          withWordmark
            ? 'M1215 690 A115 115 0 0 1 1445 690 V1555 H1990'
            : 'M1215 690 A115 115 0 0 1 1445 690 V1815'
        }
      />

      {withWordmark && (
        <g strokeWidth={40}>
          {/* a */}
          <path d="M1270 1757 A58 58 0 1 0 1386 1757 A58 58 0 1 0 1270 1757" />
          <path d="M1386 1699 V1815" />
          {/* u */}
          <path d="M1446 1699 V1757 A58 58 0 0 0 1562 1757 V1699" />
          <path d="M1562 1757 V1815" />
          {/* d */}
          <path d="M1622 1757 A58 58 0 1 0 1738 1757 A58 58 0 1 0 1622 1757" />
          <path d="M1738 1615 V1815" />
          {/* i */}
          <path d="M1798 1699 V1815" />
          <circle cx="1798" cy="1622" r="21" fill="currentColor" stroke="none" />
          {/* t */}
          <path d="M1890 1620 V1815" />
          <path d="M1848 1699 H1952" />
        </g>
      )}
    </svg>
  )
}

/** Mark + typeset wordmark. The type is live text, so it stays crisp at any DPI. */
export function LogoLockup({
  className,
  tone = 'dark',
}: {
  className?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Logo
        withWordmark={false}
        className={cn(
          'h-8 w-auto shrink-0 sm:h-9',
          // Without this the mark inherits body colour and disappears on dark.
          tone === 'dark' ? 'text-ink' : 'text-white',
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[1.25rem] font-bold tracking-[-0.03em]',
            tone === 'dark' ? 'text-ink' : 'text-white',
          )}
        >
          ABM
        </span>
        <span
          className={cn(
            'text-[0.6rem] font-semibold uppercase tracking-[0.28em]',
            tone === 'dark' ? 'text-accent' : 'text-accent-hi',
          )}
        >
          audit
        </span>
      </span>
    </span>
  )
}

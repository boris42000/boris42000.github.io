import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Reveal } from './Reveal'

type Tone = 'paper' | 'surface' | 'deep'

const tones: Record<Tone, string> = {
  paper: 'bg-paper',
  surface: 'bg-surface',
  deep: 'bg-ink text-white grain',
}

/**
 * Section wrapper. Alternating light/dark tones give the page the depth a dark
 * mode would, without doubling the design and QA surface.
 */
export function Section({
  id,
  tone = 'paper',
  className,
  children,
}: {
  id?: string
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn('section-y relative scroll-mt-24', tones[tone], className)}>
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  titleBefore,
  highlight,
  titleAfter,
  lead,
  tone = 'dark',
  align = 'left',
  className,
}: {
  eyebrow?: string
  titleBefore: string
  highlight?: string
  titleAfter?: string
  lead?: string
  /** `dark` = dark type on a light background. */
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className={cn('t-eyebrow mb-4', tone === 'dark' ? 'text-primary' : 'text-accent')}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={60}>
        <h2 className={cn('t-h2', tone === 'light' && 'text-white')}>
          {titleBefore}{' '}
          {highlight && (
            <span className={tone === 'light' ? 'text-gradient-gold' : 'text-primary'}>
              {highlight}
            </span>
          )}
          {titleAfter}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={120}>
          <p
            className={cn(
              't-lead mt-6 max-w-2xl',
              tone === 'light' ? 'text-brand-lo' : 'text-muted',
              align === 'center' && 'mx-auto',
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  )
}

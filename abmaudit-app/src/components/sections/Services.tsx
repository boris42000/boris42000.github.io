import { useState } from 'react'
import { ArrowRight, BookOpenText, Check, Scale, ShieldCheck, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { services, type Service } from '../../content/site'
import { Section, SectionHeading } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { cn } from '../../lib/cn'

const ICONS: Record<Service['icon'], LucideIcon> = {
  audit: ShieldCheck,
  ledger: BookOpenText,
  payroll: Users,
  advisory: Scale,
}

/** Thin-line corner motif, echoing the logo's column geometry. */
function CornerMotif({ seed }: { seed: number }) {
  const bars = [0, 1, 2, 3, 4].map((i) => ({
    x: i * 34,
    h: 40 + ((seed * 37 + i * 53) % 100),
  }))
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="pointer-events-none absolute -right-4 -top-4 h-32 w-36 text-primary opacity-[0.07] transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-[0.13]"
    >
      {bars.map((b) => (
        <path
          key={b.x}
          d={`M${b.x + 6} 160 V${160 - b.h + 13} A13 13 0 0 1 ${b.x + 32} ${160 - b.h + 13} V160`}
        />
      ))}
    </svg>
  )
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [open, setOpen] = useState(false)
  const Icon = ICONS[service.icon]
  // The first card is the differentiator — the audit licence is the moat.
  const featured = index === 0
  const panelId = `sluzba-${service.id}-detail`

  // Bento: featured fills the left column across two rows, cards 2–3 stack on the
  // right, card 4 runs full width beneath.
  const span =
    index === 0
      ? 'lg:col-span-7 lg:row-span-2'
      : index === 3
        ? 'lg:col-span-12'
        : 'lg:col-span-5'

  return (
    <Reveal delay={index * 60} className={span}>
      <article
        id={`sluzba-${service.id}`}
        className={cn(
          'group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-card bg-paper p-6 ring-1 ring-line',
          'shadow-[var(--shadow-soft)] transition-all duration-400 ease-[var(--ease-out-soft)]',
          'hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-8',
        )}
      >
        {/* Gradient border sheen — opacity only, so it costs nothing to animate. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-card opacity-0 ring-1 ring-accent/50 transition-opacity duration-400 group-hover:opacity-100"
        />
        <CornerMotif seed={index + 1} />

        <span
          className={cn(
            'relative grid shrink-0 place-items-center rounded-2xl bg-brand-50 text-primary ring-1 ring-accent/25',
            featured ? 'size-14' : 'size-12',
          )}
        >
          <Icon size={featured ? 26 : 22} strokeWidth={1.6} aria-hidden="true" />
        </span>

        <h3
          className={cn(
            'relative mt-5 font-display font-semibold tracking-[-0.02em]',
            featured ? 'text-[clamp(1.6rem,3.4vw,2.1rem)] leading-tight' : 't-h3',
          )}
        >
          {service.title}
        </h3>
        <p className="relative mt-3 max-w-prose leading-relaxed text-muted">{service.summary}</p>

        <ul className="relative mt-5 grid gap-2.5">
          {service.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-slate">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              {p}
            </li>
          ))}
        </ul>

        {/* 0fr → 1fr expansion: animates to intrinsic height, no JS measurement. */}
        <div
          className={cn(
            'relative grid transition-[grid-template-rows] duration-[380ms] ease-[var(--ease-out-soft)]',
            open ? 'mt-5 grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div id={panelId} className="overflow-hidden" inert={!open}>
            <p className="border-t border-line pt-5 text-sm leading-[1.75] text-slate">
              {service.body}
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-brand"
          >
            {open ? 'Zobraziť menej' : 'Zistiť viac'}
            <ArrowRight
              size={15}
              aria-hidden="true"
              className={cn('transition-transform duration-300', open ? '-rotate-90' : 'group-hover:translate-x-1')}
            />
          </button>
          <a
            href="#kontakt"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            Mám záujem
          </a>
        </div>
      </article>
    </Reveal>
  )
}

export function Services() {
  return (
    <Section id="sluzby" tone="surface">
      <div className="shell">
        <SectionHeading
          eyebrow="Naše služby"
          titleBefore="Štyri oblasti, jedna"
          highlight="zodpovednosť"
          titleAfter="."
          lead="Účtovníctvo, mzdy, dane aj audit pod jednou strechou — s jednou pridelenou účtovníčkou a daňovým poradcom, ktorý je k dispozícii, keď ho potrebujete."
        />

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-12">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}

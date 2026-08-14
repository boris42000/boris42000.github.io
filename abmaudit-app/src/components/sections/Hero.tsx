import { ArrowRight, Phone, ShieldCheck } from 'lucide-react'
import { company, hero, trustStrip } from '../../content/site'
import { ButtonLink } from '../ui/Button'
import { GradientMesh } from '../ui/GradientMesh'

export function Hero() {
  return (
    <>
      {/* `min-h-svh`, not `vh` — svh is what stops the iOS URL-bar height jump. */}
      <section
        id="domov"
        className="grain relative flex min-h-svh items-center overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32"
      >
        <GradientMesh />

        <div className="shell relative">
          <div className="max-w-3xl">
            <p className="t-eyebrow animate-[fade-up_0.7s_var(--ease-out-soft)_both] text-accent">
              {hero.eyebrow}
            </p>

            <h1 className="t-display mt-6 text-white">
              {hero.titleBefore}{' '}
              <span className="text-gradient-gold">{hero.highlight}</span>
              {hero.titleAfter}
            </h1>

            <p className="t-lead mt-7 max-w-xl text-brand-lo">{hero.lead}</p>

            {/* Glass CTA card. Full-width stacked buttons on a phone. */}
            <div className="glass mt-9 inline-flex w-full max-w-lg flex-col gap-3 rounded-xl2 p-3 shadow-[var(--shadow-lift)] sm:w-auto sm:flex-row sm:items-center">
              <ButtonLink href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
                {hero.primaryCta.label}
                <ArrowRight size={17} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href={company.phoneHref}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Phone size={17} aria-hidden="true" />
                {company.phone}
              </ButtonLink>
            </div>

            {/* Credential chips. Horizontal scroll-snap row on mobile — no wrap,
                no float animation, everything reachable with a thumb. */}
            <ul className="no-scrollbar -mx-5 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {hero.chips.map((chip, i) => (
                <li
                  key={chip.label}
                  className="float-chip glass flex shrink-0 snap-start items-center gap-3 rounded-full py-2.5 pl-3 pr-5"
                  style={{ animationDelay: `${i * 1.6}s` }}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <ShieldCheck size={16} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-lo/80">
                      {chip.label}
                    </span>
                    <span className="font-display text-[0.95rem] font-semibold tabular-nums text-white">
                      {chip.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust strip — licence numbers immediately under the fold. */}
      <div className="relative border-y border-line bg-surface">
        <div className="shell">
          <ul className="no-scrollbar flex snap-x snap-mandatory divide-x divide-line overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible">
            {trustStrip.map((item) => (
              <li
                key={item.label}
                className="min-w-[52%] shrink-0 snap-start px-5 py-5 first:pl-0 last:pr-0 sm:min-w-[38%] md:min-w-0 md:px-6"
              >
                {/* text-slate, not text-muted: at 11.5px bold the muted slate
                    lands on 4.47:1 against the surface — just under AA. */}
                <p className="t-eyebrow text-slate">{item.label}</p>
                <p className="mt-1.5 font-display text-[1.05rem] font-semibold tabular-nums text-primary">
                  {item.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

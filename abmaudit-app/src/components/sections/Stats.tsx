import { stats } from '../../content/site'
import { Counter } from '../ui/Counter'
import { Reveal } from '../ui/Reveal'

export function Stats() {
  return (
    <section className="grain relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_0%,#1c5c93_0%,transparent_60%),radial-gradient(700px_360px_at_85%_100%,#7e5c1f_0%,transparent_62%)] opacity-50"
      />
      <div className="rule-gold absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="rule-gold absolute inset-x-0 bottom-0" aria-hidden="true" />

      <div className="shell relative">
        {/* 2×2 on a phone, 4 across on desktop. The numbers stay oversized either
            way — this is a hero moment on small screens too. */}
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              // flex-col-reverse: <dt> must precede <dd> in the DOM, but the
              // number reads above its label.
              className="relative flex flex-col-reverse px-2 text-center lg:px-6"
            >
              {/* Hairline dividers between columns. */}
              {i % 2 === 1 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-px bg-white/12 lg:hidden"
                />
              )}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 hidden w-px bg-white/12 lg:block"
                />
              )}

              <dt className="mt-3 text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.14em] text-brand-lo/80">
                {stat.label}
              </dt>
              <dd className="text-gradient-gold font-display text-[clamp(2.6rem,10vw,4rem)] font-semibold leading-none tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} delay={i * 90} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

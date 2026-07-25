import { useEffect, useRef, useState } from 'react'
import { testimonials, testimonialsArePlaceholders } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/Section'
import { cn } from '../../lib/cn'

/**
 * Native CSS scroll-snap — no carousel library, no JS on the scroll path.
 * The dots are driven by an IntersectionObserver over the cards.
 */
export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children)

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setCurrent(cards.indexOf(entry.target))
          }
        }
      },
      { root: track, threshold: [0.6] },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  const goTo = (i: number) => {
    const track = trackRef.current
    const card = track?.children[i] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <section
      id="referencie"
      className="grain relative overflow-hidden bg-ink py-20 text-white sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_15%_-10%,#0f2e4a_0%,transparent_60%),radial-gradient(800px_500px_at_90%_110%,#7e5c1f_0%,transparent_62%)] opacity-60"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Referencie"
          titleBefore="Čo na spoluprácu hovoria"
          highlight="klienti"
          titleAfter="."
          tone="light"
        />

        {testimonialsArePlaceholders && (
          <p className="mt-6 max-w-2xl rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-lo">
            <strong className="font-semibold">Poznámka pre správcu webu:</strong> nižšie sú
            zástupné texty. Pred spustením ich nahraďte skutočnými referenciami so súhlasom
            klienta v súbore <code className="font-mono text-xs">src/content/site.ts</code>,
            alebo sekciu odstráňte.
          </p>
        )}

        <ul
          ref={trackRef}
          className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mt-16 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 xl:grid-cols-4"
        >
          {testimonials.map((t, i) => (
            <li
              key={i}
              className="w-[86vw] shrink-0 snap-center sm:w-[62vw] md:w-[46vw] lg:w-auto"
            >
              <Reveal delay={i * 70} className="h-full">
                <figure className="glass relative flex h-full flex-col overflow-hidden rounded-card p-6 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-1 -top-6 select-none font-display text-[7rem] leading-none text-accent/20"
                  >
                    &ldquo;
                  </span>

                  <blockquote className="relative flex-1">
                    <p className="leading-[1.7] text-brand-lo">{t.quote}</p>
                  </blockquote>

                  <figcaption className="relative mt-6 flex items-center gap-3 border-t border-white/12 pt-5">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(96deg,#e8bc63,#f0d9a8)] font-display text-sm font-bold text-ink"
                    >
                      ?
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {t.name}
                      </span>
                      <span className="block truncate text-xs text-brand-lo/70">
                        {t.role} · {t.org}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Dots — mobile only; on desktop all four cards are visible at once. */}
        <div className="mt-6 flex justify-center gap-2 lg:hidden">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Referencia ${i + 1}`}
              aria-current={current === i}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                current === i ? 'w-7 bg-accent' : 'w-2 bg-white/25 hover:bg-white/40',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

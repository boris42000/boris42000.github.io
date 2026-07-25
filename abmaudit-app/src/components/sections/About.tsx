import { BadgeCheck, Check } from 'lucide-react'
import { about, credentials } from '../../content/site'
import { Section, SectionHeading } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { Picture } from '../ui/Picture'

export function About() {
  return (
    <Section id="o-nas" tone="paper">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image. First on mobile, left column on desktop. */}
          <Reveal className="lg:col-span-5">
            <div className="relative">
              {/* Offset gold frame behind the photo. */}
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -left-4 hidden h-full w-full rounded-xl2 border border-accent/35 sm:block"
              />
              <Picture
                name="about"
                alt={about.photoAlt}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="relative aspect-[4/3] w-full rounded-xl2 object-cover shadow-[var(--shadow-lift)]"
                priority
              />

              {/* Sits below the photo rather than on top of it — the image column
                  is narrow enough that an overlapping card hid both subjects. */}
              <div className="relative z-10 mt-5 rounded-card bg-paper p-5 shadow-[var(--shadow-lift)] ring-1 ring-line">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                    <BadgeCheck size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-[1.05rem] font-semibold text-ink">
                      {about.card.name}
                    </p>
                    <p className="text-xs text-muted">{about.card.role}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 border-t border-line pt-4">
                  {about.card.lines.map((line) => (
                    <li key={line} className="text-xs tabular-nums text-slate">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-7 lg:pl-8">
            <SectionHeading
              eyebrow={about.eyebrow}
              titleBefore={about.titleBefore}
              highlight={about.highlight}
              titleAfter={about.titleAfter}
            />

            <div className="mt-7 space-y-5 border-l-2 border-accent/40 pl-6">
              {about.paragraphs.map((p, i) => (
                <Reveal key={p} delay={i * 60}>
                  <p className="max-w-[62ch] leading-[1.72] text-slate">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={180}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {about.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-8 inline-flex items-center gap-3 rounded-full bg-surface px-5 py-2.5 text-xs font-semibold text-primary ring-1 ring-line">
                <span className="tabular-nums">Licencia SKAU {credentials.companyLicence}</span>
                <span className="h-3 w-px bg-line" aria-hidden="true" />
                <span>Od roku 1996</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}

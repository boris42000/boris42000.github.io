import { clients } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'

/**
 * Logo wall. Logos are discovered at build time from `src/assets/clients/` —
 * dropping a file into that folder and rebuilding is the whole workflow, no
 * code edits needed (see the README there). Clients without a logo come from
 * `clients.names` in site.ts and render as text-only cards.
 */
const logoModules = import.meta.glob<string>(
  '../../assets/clients/*.{svg,png,jpg,jpeg,webp,SVG,PNG,JPG,JPEG,WEBP}',
  { eager: true, import: 'default' },
)

const logos = Object.entries(logoModules)
  .sort(([a], [b]) => a.localeCompare(b, 'sk'))
  .map(([path, src]) => {
    const file = path.split('/').pop() ?? path
    const name = file
      .replace(/\.[^.]+$/, '') // extension
      .replace(/^\d+[-_ ]+/, '') // optional `01-` ordering prefix
      .replace(/[-_]+/g, ' ')
      .trim()
    return { src, name }
  })

export function Clients() {
  const isEmpty = logos.length === 0 && clients.names.length === 0

  return (
    <Section id="klienti" tone="surface">
      <div className="shell">
        <SectionHeading
          eyebrow={clients.eyebrow}
          titleBefore={clients.titleBefore}
          highlight={clients.highlight}
          titleAfter={clients.titleAfter}
          lead={clients.lead}
        />

        {isEmpty ? (
          <p className="mt-10 max-w-2xl rounded-xl border border-line bg-paper px-4 py-3 text-sm text-muted">
            <strong className="font-semibold text-slate">Poznámka pre správcu webu:</strong>{' '}
            zatiaľ tu nie sú žiadni klienti. Nahrajte logá do priečinka{' '}
            <code className="font-mono text-xs">src/assets/clients/</code> (návod je v
            README tamtiež), alebo doplňte názvy klientov bez loga v súbore{' '}
            <code className="font-mono text-xs">src/content/site.ts</code>.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:grid-cols-3 lg:grid-cols-4">
            {logos.map((logo, i) => (
              <li key={logo.src}>
                <Reveal delay={(i % 4) * 60} className="h-full">
                  <figure className="flex h-full min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-card border border-line bg-paper p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      className="max-h-14 w-auto max-w-full object-contain grayscale transition duration-300 hover:grayscale-0"
                    />
                    <figcaption className="text-center text-xs font-medium text-muted">
                      {logo.name}
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
            {clients.names.map((name, i) => (
              <li key={name}>
                <Reveal delay={((logos.length + i) % 4) * 60} className="h-full">
                  <div className="flex h-full min-h-[7.5rem] items-center justify-center rounded-card border border-line bg-paper p-6 text-center shadow-[var(--shadow-soft)]">
                    <span className="font-display text-lg font-semibold text-primary">
                      {name}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

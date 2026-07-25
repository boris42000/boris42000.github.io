import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { company, contact } from '../../content/site'
import { ContactForm } from '../forms/ContactForm'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'

const tiles = [
  {
    icon: MapPin,
    label: 'Naša adresa',
    value: `${company.street}, ${company.postalCode} ${company.city}`,
    href: company.mapsUrl,
    external: true,
  },
  {
    icon: Phone,
    label: 'Telefón',
    value: company.phone,
    href: company.phoneHref,
    external: false,
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: company.email,
    href: company.emailHref,
    external: false,
  },
]

/** Stylised map card. A static facade — no third-party tiles, no API key, no cookies. */
function MapCard() {
  return (
    <div className="overflow-hidden rounded-card ring-1 ring-white/12">
      <div className="relative h-44 bg-[#0d2438]">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 180"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Abstract street grid */}
          <g stroke="#2e7dbe" strokeWidth="1" opacity="0.35">
            <path d="M-20 40 H420 M-20 96 H420 M-20 146 H420" />
            <path d="M60 -10 V190 M150 -10 V190 M248 -10 V190 M340 -10 V190" />
          </g>
          <g stroke="#2e7dbe" strokeWidth="3" opacity="0.5">
            <path d="M-20 96 H420" />
            <path d="M248 -10 V190" />
          </g>
          <g fill="#9eccf4" opacity="0.12">
            <rect x="70" y="52" width="66" height="32" rx="3" />
            <rect x="164" y="108" width="70" height="26" rx="3" />
            <rect x="262" y="46" width="60" height="38" rx="3" />
            <rect x="352" y="106" width="54" height="30" rx="3" />
          </g>
          {/* Office pin */}
          <g transform="translate(248 96)">
            <circle r="26" fill="#d4a03c" opacity="0.16" />
            <circle r="14" fill="#d4a03c" opacity="0.28" />
            <circle r="6" fill="#d4a03c" />
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.04] px-5 py-4">
        <p className="text-sm text-brand-lo">
          {company.street}, {company.postalCode} {company.city}
        </p>
        <a
          href={company.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hi"
        >
          Otvoriť v Google Maps
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <Section id="kontakt" tone="surface">
      <div className="shell">
        <SectionHeading
          eyebrow={contact.eyebrow}
          titleBefore={contact.titleBefore}
          highlight={contact.highlight}
          titleAfter={contact.titleAfter}
          lead={contact.lead}
        />

        <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-12">
          {/* On a phone the contact tiles come first — a visitor on a phone wants
              the number, not a form. */}
          {/* min-w-0: grid items default to `min-width: auto`, so the long email
              address sets a floor that pushes the layout past 320px viewports. */}
          <Reveal className="min-w-0 lg:order-2 lg:col-span-5">
            <div className="grain flex h-full flex-col gap-5 rounded-card bg-ink p-6 text-white sm:p-7">
              <ul className="space-y-2">
                {tiles.map((tile) => (
                  <li key={tile.label}>
                    <a
                      href={tile.href}
                      {...(tile.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="flex min-h-14 items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/40 text-accent ring-1 ring-white/10">
                        <tile.icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-lo/70">
                          {tile.label}
                        </span>
                        <span className="block [overflow-wrap:anywhere] text-[0.95rem] font-semibold">
                          {tile.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <MapCard />

              <p className="mt-auto text-xs leading-relaxed text-brand-lo/60">
                {contact.formNote}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80} className="min-w-0 lg:order-1 lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

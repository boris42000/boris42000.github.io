import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { company, credentials, footer, nav, services } from '../../content/site'
import { Logo } from '../ui/Logo'

export function Footer() {
  const year = new Date().getFullYear()

  const legalLine = [
    company.ico && `IČO: ${company.ico}`,
    company.dic && `DIČ: ${company.dic}`,
    company.icDph && `IČ DPH: ${company.icDph}`,
  ].filter(Boolean)

  return (
    <footer className="grain relative bg-ink text-white">
      <div className="rule-gold absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Logo withWordmark={false} className="h-10 w-auto text-white" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-[-0.03em]">ABM</span>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-accent">
                  audit
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-lo/80">
              {footer.blurb}
            </p>
            <dl className="mt-6 space-y-1.5 text-xs text-brand-lo/70">
              <div className="flex gap-2">
                <dt>Licencia SKAU:</dt>
                <dd className="tabular-nums text-white/90">{credentials.companyLicence}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Audítor:</dt>
                <dd className="tabular-nums text-white/90">č. {credentials.auditorLicence}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Daňový poradca:</dt>
                <dd className="tabular-nums text-white/90">
                  ev. č. {credentials.taxAdvisorLicence}
                </dd>
              </div>
            </dl>
          </div>

          {/* Site nav */}
          <nav aria-label="Pätička — stránka">
            <h2 className="t-eyebrow text-accent">{footer.navHeading}</h2>
            <ul className="mt-5 space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex min-h-9 items-center text-sm text-brand-lo/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Pätička — služby">
            <h2 className="t-eyebrow text-accent">Služby</h2>
            <ul className="mt-5 space-y-1">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#sluzba-${s.id}`}
                    className="flex min-h-9 items-center text-sm text-brand-lo/85 transition-colors hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="t-eyebrow text-accent">{footer.contactHeading}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={company.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-brand-lo/85 transition-colors hover:text-white"
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    {company.street}
                    <br />
                    {company.postalCode} {company.city}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.phoneHref}
                  className="flex min-h-9 items-center gap-3 text-brand-lo/85 transition-colors hover:text-white"
                >
                  <Phone size={16} className="shrink-0 text-accent" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={company.emailHref}
                  className="flex min-h-9 items-center gap-3 break-all text-brand-lo/85 transition-colors hover:text-white"
                >
                  <Mail size={16} className="shrink-0 text-accent" aria-hidden="true" />
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-xs text-brand-lo/60">
            <p>
              © {year} {company.legalName} · Všetky práva vyhradené
            </p>
            {legalLine.length > 0 && <p>{legalLine.join(' · ')}</p>}
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full px-5 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/10 sm:self-auto"
          >
            <ArrowUp size={15} aria-hidden="true" />
            Späť hore
          </button>
        </div>
      </div>

      {/* Clears the fixed mobile action bar so the legal line is never covered. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  )
}

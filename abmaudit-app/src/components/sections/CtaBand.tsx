import { ArrowRight, Phone } from 'lucide-react'
import { company } from '../../content/site'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Picture } from '../ui/Picture'

/** Breaks up the long run of text between the FAQ and the contact form. */
export function CtaBand() {
  return (
    <section className="grain relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <Picture
          name="detail"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#0b1b2b_18%,rgba(11,27,43,0.82)_58%,rgba(15,46,74,0.7)_100%)]" />
      </div>

      <div className="shell relative py-16 sm:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Reveal className="max-w-xl">
            <h2 className="t-h2 text-white">
              Potrebujete poradiť? Prvá konzultácia je{' '}
              <span className="gold-underline text-white">nezáväzná</span>.
            </h2>
            <p className="t-lead mt-4 text-brand-lo">
              Povedzte nám, ako máte účtovníctvo nastavené dnes. Navrhneme, čo prevziať a
              v akom poradí — bez výpadku a bez zbytočnej administratívy na vašej strane.
            </p>
          </Reveal>

          <Reveal delay={80} className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href="#kontakt" size="lg">
              Napísať nám
              <ArrowRight size={17} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={company.phoneHref} variant="ghost" size="lg">
              <Phone size={17} aria-hidden="true" />
              {company.phone}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

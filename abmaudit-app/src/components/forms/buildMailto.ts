import { company, contact } from '../../content/site'

export type FormValues = {
  name: string
  email: string
  phone: string
  companyName: string
  service: string
  message: string
}

/**
 * CRLF, not bare \n — Outlook on Windows collapses lone line feeds in a mailto body.
 * encodeURIComponent, never URLSearchParams: the latter encodes spaces as "+",
 * which Apple Mail renders as literal plus signs.
 */
const NL = '\r\n'

export function buildMailto(v: FormValues, to: string = company.email) {
  const subject = `${contact.subjectPrefix} — ${v.service} — ${v.name}`

  const body = [
    `Meno: ${v.name}`,
    `E-mail: ${v.email}`,
    v.phone ? `Telefón: ${v.phone}` : null,
    v.companyName ? `Spoločnosť: ${v.companyName}` : null,
    `Služba: ${v.service}`,
    '',
    'Správa:',
    v.message,
    '',
    '—',
    'Odoslané z formulára na webe abmaudit.sk',
  ]
    .filter((line) => line !== null)
    .join(NL)

  return {
    href: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    subject,
    body,
  }
}

export type Errors = Partial<Record<keyof FormValues, string>>

export function validate(v: FormValues): Errors {
  const errors: Errors = {}
  if (v.name.trim().length < 2) errors.name = 'Zadajte, prosím, vaše meno.'
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.email.trim()))
    errors.email = 'Zadajte platnú e-mailovú adresu.'
  if (v.message.trim().length < 10) errors.message = 'Napíšte nám, prosím, o čo ide.'
  return errors
}

import { useId, useRef, useState } from 'react'
import { AlertCircle, Check, Copy, Phone, Send } from 'lucide-react'
import { company, contact, services } from '../../content/site'
import { buildMailto, validate, type Errors, type FormValues } from './buildMailto'
import { Button, ButtonLink } from '../ui/Button'
import { cn } from '../../lib/cn'

const MAX_MESSAGE = 1200
const SERVICE_OPTIONS = [...services.map((s) => s.title), 'Iné']

const EMPTY: FormValues = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  service: SERVICE_OPTIONS[0],
  message: '',
}

type Status = 'idle' | 'opening' | 'fallback' | 'too-long'

function Field({
  label,
  error,
  children,
  id,
}: {
  label: string
  error?: string
  children: React.ReactNode
  id: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border bg-paper px-4 py-3 text-ink outline-none transition ' +
  'placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/25'

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const composed = useRef<{ subject: string; body: string } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const uid = useId()

  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0]
      document.getElementById(`${uid}-${firstKey}`)?.focus()
      return
    }

    const { href, subject, body } = buildMailto(values)
    composed.current = { subject, body }

    // Practical mailto ceiling is ~2000 chars; Outlook is the tightest.
    if (href.length > 1900) {
      setStatus('too-long')
      return
    }

    // Must stay synchronous inside the user gesture or iOS Safari blocks it.
    window.location.href = href
    setStatus('opening')

    // Handing off to a mail client blurs the document. If we still have focus
    // after a moment, nothing opened — show the fallback.
    const cancel = () => window.clearTimeout(timer.current)
    window.addEventListener('blur', cancel, { once: true })
    timer.current = window.setTimeout(() => setStatus('fallback'), 1600)
  }

  const copyMessage = async () => {
    const c = composed.current
    if (!c) return
    const text = `${c.subject}\n\n${c.body}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  if (status === 'fallback' || status === 'too-long') {
    const c = composed.current
    return (
      <div className="rounded-card bg-paper p-6 shadow-[var(--shadow-lift)] ring-1 ring-line sm:p-8">
        <h3 className="t-h3">
          {status === 'too-long'
            ? 'Správa je príliš dlhá'
            : 'Nepodarilo sa otvoriť e-mailový program?'}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          {status === 'too-long'
            ? 'Skráťte, prosím, správu — alebo si ju skopírujte a pošlite nám ju priamo z vášho e-mailu.'
            : 'Skopírujte si správu a pošlite nám ju priamo, prípadne nám jednoducho zavolajte.'}
        </p>

        {c && (
          <textarea
            readOnly
            value={`${c.subject}\n\n${c.body}`}
            rows={8}
            aria-label="Pripravená správa"
            className="mt-5 w-full rounded-xl border border-line bg-surface p-4 font-mono text-xs leading-relaxed text-slate"
          />
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={copyMessage}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? 'Skopírované' : 'Skopírovať správu'}
          </Button>
          <ButtonLink href={company.emailHref} variant="outline">
            {company.email}
          </ButtonLink>
          <ButtonLink href={company.phoneHref} variant="outline">
            <Phone size={16} aria-hidden="true" />
            {company.phone}
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-brand"
        >
          Späť na formulár
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-card bg-paper p-6 shadow-[var(--shadow-lift)] ring-1 ring-line sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={contact.fields.name} error={errors.name} id={`${uid}-name`}>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onChange={set('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={cn(inputCls, errors.name ? 'border-red-400' : 'border-line')}
          />
        </Field>

        <Field label={contact.fields.email} error={errors.email} id={`${uid}-email`}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={cn(inputCls, errors.email ? 'border-red-400' : 'border-line')}
          />
        </Field>

        <Field label={contact.fields.phone} id={`${uid}-phone`}>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set('phone')}
            className={cn(inputCls, 'border-line')}
          />
        </Field>

        <Field label={contact.fields.company} id={`${uid}-companyName`}>
          <input
            id={`${uid}-companyName`}
            name="companyName"
            type="text"
            autoComplete="organization"
            value={values.companyName}
            onChange={set('companyName')}
            className={cn(inputCls, 'border-line')}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Čo vás zaujíma?" id={`${uid}-service`}>
            <select
              id={`${uid}-service`}
              name="service"
              value={values.service}
              onChange={set('service')}
              className={cn(inputCls, 'border-line')}
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label={contact.fields.message} error={errors.message} id={`${uid}-message`}>
            <textarea
              id={`${uid}-message`}
              name="message"
              required
              rows={5}
              maxLength={MAX_MESSAGE}
              value={values.message}
              onChange={set('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? `${uid}-message-error` : undefined}
              className={cn(
                inputCls,
                'resize-y',
                errors.message ? 'border-red-400' : 'border-line',
              )}
            />
            <p className="mt-1.5 text-right text-xs tabular-nums text-muted">
              {values.message.length} / {MAX_MESSAGE}
            </p>
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Send size={17} aria-hidden="true" />
          {contact.submit}
        </Button>
        <p className="text-xs leading-relaxed text-muted sm:max-w-[16rem]">
          Nič neukladáme na server — správa sa otvorí vo vašom e-mailovom programe.
        </p>
      </div>
    </form>
  )
}

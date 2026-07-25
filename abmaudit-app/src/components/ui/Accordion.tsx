import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Accordion row.
 *
 * Height animates with the `grid-template-rows: 0fr → 1fr` technique: no JS height
 * measurement, no layout thrash, animates to the content's intrinsic height.
 */
export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl bg-paper ring-1 transition-all duration-300',
        open ? 'shadow-[var(--shadow-soft)] ring-line' : 'ring-line/70 hover:ring-line',
      )}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full min-h-14 items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        >
          <span
            className={cn(
              'font-display text-[1.02rem] font-semibold transition-colors sm:text-[1.12rem]',
              open ? 'text-primary' : 'text-ink',
            )}
          >
            {question}
          </span>
          <span
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300',
              open ? 'rotate-45 bg-accent text-ink' : 'bg-surface text-primary',
            )}
          >
            <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'grid transition-[grid-template-rows] duration-[380ms] ease-[var(--ease-out-soft)]',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        {/* `inert` keeps collapsed content out of the tab order — the row is only
            visually clipped, so without it the links inside stay focusable. */}
        <div className="overflow-hidden" inert={!open}>
          <div className="px-5 pb-6 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

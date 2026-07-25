import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const nf = new Intl.NumberFormat('sk-SK')

/**
 * Count-up on first scroll into view. The only continuous rAF work on the page:
 * runs once for 1.6s per counter, then stops.
 *
 * The final value is always present in the DOM as visually-hidden text, so screen
 * readers and crawlers never see "0".
 */
export function Counter({
  value,
  suffix = '',
  duration = 1600,
  delay = 0,
}: {
  value: number
  suffix?: string
  duration?: number
  delay?: number
}) {
  const [ref, inView] = useInView<HTMLSpanElement>()
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setShown(value)
      return
    }

    let raf = 0
    let start = 0
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const tick = (now: number) => {
      if (!start) start = now
      const elapsed = now - start - delay
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(elapsed / duration, 1)
      setShown(Math.round(easeOutExpo(t) * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value, duration, delay])

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {nf.format(shown)}
      </span>
      {suffix && (
        <span aria-hidden="true" className="text-[0.55em] align-super text-accent">
          {suffix}
        </span>
      )}
      <span className="sr-only">
        {nf.format(value)}
        {suffix}
      </span>
    </span>
  )
}

import { useEffect, useRef, useState } from 'react'

/**
 * One IntersectionObserver for the entire page.
 *
 * ~60 reveal targets each creating their own observer is the standard mistake and
 * costs real main-thread time during scroll. Every consumer shares this instance
 * and unobserves itself once it has fired.
 */
type Cb = () => void

let observer: IntersectionObserver | null = null
const callbacks = new WeakMap<Element, Cb>()

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const cb = callbacks.get(entry.target)
        if (cb) {
          cb()
          callbacks.delete(entry.target)
          observer!.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  )
  return observer
}

/** Returns [ref, hasEnteredView]. Fires once and never resets. */
export function useInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Guard for very old browsers: show content rather than hide it forever.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const io = getObserver()
    callbacks.set(el, () => setInView(true))
    io.observe(el)

    return () => {
      callbacks.delete(el)
      io.unobserve(el)
    }
  }, [])

  return [ref, inView] as const
}
